// pages/api/admin/unread-notification-count.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  try {
    const count = await Notification.countDocuments({ read: false });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Error counting notifications" });
  }
}
