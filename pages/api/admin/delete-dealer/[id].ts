// pages/api/admin/delete-dealer/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Dealer from "@/models/Dealer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id } = req.query;

    const deletedDealer = await Dealer.findByIdAndDelete(id);

    if (!deletedDealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Dealer deleted successfully" });
  } catch (error) {
    console.error("Error deleting dealer:", error);
    res.status(500).json({ message: "Server error" });
  }
}
