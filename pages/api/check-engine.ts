// pages/api/check-engine.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import Customer from "../../models/Customer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { engineNumber } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!engineNumber || typeof engineNumber !== "string") {
    return res.status(400).json({ message: "Engine number is required" });
  }

  try {
    await connectToDatabase();

    const exists = await Customer.findOne({ engineNumber });

    res.status(200).json({ exists: !!exists });
  } catch (error) {
    console.error("Check engine number error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
