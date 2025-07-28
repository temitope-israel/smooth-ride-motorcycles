import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import Customer from "../../models/Customer";
import Notification from "@/models/Notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    engineNumber,
    buyerName,
    title,
    phone,
    state,
    dealer,
    purchaseDate,
    usage,
    endUser,
    endUserPhone, // ✅ Included
    model,
    color,
    variant,
    rimType,
    startType,
  } = req.body;

  if (
    !engineNumber ||
    !buyerName ||
    !title ||
    !phone ||
    !state ||
    !dealer ||
    !purchaseDate ||
    !usage ||
    !model ||
    !color ||
    (!rimType && model === "Ace") ||
    (!startType && model === "Ace")
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled." });
  }

  // ✅ Normalize fields to uppercase before checking and saving
  // const normalizedModel = model.trim().toUpperCase();
  const normalizedModel = model.trim().toUpperCase();
  const normalizedVariant = variant.trim().toUpperCase();
  const normalizedColor = color.trim().toUpperCase();
  const normalizedRimType = rimType.trim().toUpperCase();
  const normalizedStartType = startType.toUpperCase();

  try {
    await connectToDatabase();

    const exists = await Customer.findOne({ engineNumber });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Engine number already registered." });
    }

    const newCustomer = await Customer.create({
      engineNumber: engineNumber.trim().toUpperCase(),
      buyerName: buyerName.trim().toUpperCase(), // ✅ Converted to uppercase
      title: title.trim().toUpperCase(), // ✅ Converted to uppercase
      phone: phone.trim().toUpperCase(), // ✅ Converted to uppercase
      state: state.trim().toUpperCase(), // ✅ Converted to uppercase
      dealer: dealer.trim().toUpperCase(), // ✅ Converted to uppercase
      purchaseDate,
      usage: usage.trim().toUpperCase(), // ✅ Converted to uppercase
      endUser: endUser ? endUser.trim().toUpperCase() : "", // ✅ Converted to uppercase
      endUserPhone: endUserPhone ? endUserPhone.trim().toUpperCase() : "", // ✅ Converted to uppercase
      model: normalizedModel,
      color: normalizedColor,
      variant: normalizedVariant,
      rimType: normalizedRimType,
      startType: normalizedStartType,
    });

    res.status(201).json({
      message: "Registration successful",
      customer: newCustomer,
    });

    // After saving the customer:
    await Notification.create({
      message: `New customer registered by ${dealer || "a dealer"}`,
      createdAt: new Date(),
      read: false,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
