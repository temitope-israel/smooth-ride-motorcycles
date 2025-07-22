import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const { method } = req;

  if (method === "GET") {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        Notification.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Notification.countDocuments(),
      ]);

      const formatted = notifications.map((n: any) => ({
        _id: n._id?.toString(),
        message: n.message,
        read: n.read,
        createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : null,

      }));

      res.status(200).json({ notifications: formatted, total });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  }

  // DELETE individual or all
  else if (method === "DELETE") {
    try {
      const { id, deleteAll } = req.query;

      if (deleteAll === "true") {
        await Notification.deleteMany({});
        return res.status(200).json({ message: "All notifications deleted" });
      }

      if (!id) {
        return res.status(400).json({ message: "Notification ID required" });
      }

      await Notification.findByIdAndDelete(id);
      return res.status(200).json({ message: "Notification deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete notification" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
