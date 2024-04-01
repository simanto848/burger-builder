import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    state: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    houseNumber: { type: String, required: true },
    default: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Address = mongoose.model("address", addressSchema);

export default Address;
