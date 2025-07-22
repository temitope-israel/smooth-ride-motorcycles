import {connectToDatabase} from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      await connectToDatabase();
      const { id } = req.query;
      await Notification.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete notification" });
    }
  }
  return res.status(405).end();
}
