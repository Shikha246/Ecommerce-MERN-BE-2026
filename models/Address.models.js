import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: String,
  name: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  phone: String
});

export default mongoose.model("Address", addressSchema);