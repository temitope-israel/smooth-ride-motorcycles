// pages/api/get-dealers.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Dealer from "@/models/Dealer"; // ⬅ Make sure this is the right model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectToDatabase();

    // Get all dealer names only
    const dealers = await Dealer.find({}, { dlrName: 1, _id: 0 }).lean();
    const names = dealers.map((d) => d.dlrName);

    return res.status(200).json({ dealers: names });
  } catch (error) {
    console.error("Failed to fetch dealers:", error);
    return res.status(500).json({ message: "Server error" });
  }
}