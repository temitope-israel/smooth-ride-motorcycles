import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import Customer from "../../models/Customer";
import Notification from "@/models/Notification";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    return res.status(400).json({ message: "All required fields must be filled." });
  }

  try {
    await connectToDatabase();

    const exists = await Customer.findOne({ engineNumber });
    if (exists) {
      return res.status(400).json({ message: "Engine number already registered." });
    }

    const newCustomer = await Customer.create({
      engineNumber,
      buyerName,
      title,
      phone,
      state,
      dealer,
      purchaseDate,
      usage,
      endUser,
      endUserPhone, // ✅ Saved in DB
      model,
      color,
      variant,
      rimType,
      startType,
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
