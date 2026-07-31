import { GoogleGenAI } from "@google/genai";
import Product from "../models/Product.models.js";
import Order from "../models/Order.models.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are the shopping assistant for an online store named BookStore.
The store's ONLY categories are: programming, fiction, self-help, finance.
Never mention or imply any other category exists.
Always use the search_products tool to check real catalog data before answering
questions about availability, price, stock, or authors — never guess or make up
book titles, prices, or categories. If search_products returns nothing relevant,
say honestly that you couldn't find a matching book.
If a user asks about their order and get_order_status returns "not_logged_in",
tell them politely to log in to check their order status — never make up order details.
If it returns "no_orders_found", tell them honestly you couldn't find any orders.
Be friendly, concise, and only discuss topics related to this bookstore — if
asked something unrelated, politely redirect the conversation back to books
and shopping.`;

const searchProductsTool = {
  name: "search_products",
  description:
    "Search the bookstore's product catalog. Use this whenever the user asks about book availability, price, category, author, or stock. Do not guess — always call this instead of assuming what's in the catalog.",
  parameters: {
    type: "object",
    properties: {
      category: {
        type: "string",
        description:
          "Filter by category. Must be one of: programming, fiction, self-help, finance",
      },
      author: { type: "string", description: "Filter by author name" },
      keyword: {
        type: "string",
        description: "Keyword to search in the book name/description",
      },
      maxPrice: { type: "number", description: "Maximum price filter" },
    },
  },
};

async function searchProducts({ category, author, keyword, maxPrice }) {
  const query = {};
  if (category) query.category = new RegExp(`^${category}$`, "i");
  if (author) query.author = new RegExp(author, "i");
  if (keyword) {
    query.$or = [
      { name: new RegExp(keyword, "i") },
      { description: new RegExp(keyword, "i") },
    ];
  }
  if (maxPrice) query.price = { $lte: maxPrice };

  const results = await Product.find(query).limit(8).lean();
  return results.map((p) => ({
    name: p.name,
    author: p.author,
    category: p.category,
    price: p.price,
    stock: p.stock,
    rating: p.rating,
  }));
}

const getOrderStatusTool = {
  name: "get_order_status",
  description:
    "Look up the logged-in customer's own orders. Use this whenever the user asks where their order is, its status, or order history. If no orderId is given, returns their most recent orders.",
  parameters: {
    type: "object",
    properties: {
      orderId: {
        type: "string",
        description: "Specific order ID, if the user mentioned one",
      },
    },
  },
};

// `user` comes from req.user (JWT-verified) — never from the model's arguments
async function getOrderStatus({ orderId }, user) {
  if (!user) {
    return { error: "not_logged_in" };
  }

  const query = { userId: user._id.toString() };
  if (orderId) query._id = orderId;

  const orders = await Order.find(query).sort({ createdAt: -1 }).limit(5).lean();

  if (!orders.length) {
    return { error: "no_orders_found" };
  }

  return orders.map((o) => ({
    orderId: o._id,
    items: o.items.map((i) => `${i.name} x${i.qty}`),
    total: o.total,
    placedOn: o.createdAt,
  }));
}

export const handleChatMessage = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    const contents = [
      ...history.map((turn) => ({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [{ text: turn.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const config = {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ functionDeclarations: [searchProductsTool, getOrderStatusTool] }],
    };

    let response = await ai.models.generateContent({ model: "gemini-flash-latest", contents, config });

    let functionCall = response.functionCalls?.[0];
    let safetyCounter = 0;

    while (functionCall && safetyCounter < 3) {
      safetyCounter++;

      let result;
      if (functionCall.name === "search_products") {
        result = await searchProducts(functionCall.args);
      } else if (functionCall.name === "get_order_status") {
        result = await getOrderStatus(functionCall.args, req.user);
      } else {
        result = { error: "Unknown tool" };
      }

      contents.push(response.candidates[0].content); // preserves thoughtSignature
      contents.push({
        role: "user",
        parts: [{ functionResponse: { name: functionCall.name, response: { result } } }],
      });

      response = await ai.models.generateContent({ model: "gemini-flash-latest", contents, config });
      functionCall = response.functionCalls?.[0];
    }

    res.json({ reply: response.text });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong with the chat assistant" });
  }
};