// pages/api/admin/delete-dealer/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Dealer from "@/models/Dealer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectToDatabase();
    const result = await Dealer.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All dealers deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all dealers:", error);
    res.status(500).json({ message: "Server error" });
  }
}