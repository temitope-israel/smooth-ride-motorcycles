// pages/api/admin/update-dealer.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Dealer from "@/models/Dealer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id, updatedData } = req.body;

  if (!id || !updatedData) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedDealer = await Dealer.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    res.status(200).json({ message: "Dealer updated successfully", dealer: updatedDealer });
  } catch (error: any) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
}