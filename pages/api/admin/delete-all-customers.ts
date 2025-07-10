import type { NextApiRequest, NextApiResponse } from "next";
import {connectToDatabase} from "@/lib/mongodb";
import Customer from "@/models/Customer"; // Adjust the import if your model file is named differently

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();
    const result = await Customer.deleteMany({});
    res.status(200).json({ message: "All customers deleted", result });
  } catch (error) {
    console.error("Error deleting all customers:", error);
    res.status(500).json({ message: "Failed to delete all customers" });
  }
}