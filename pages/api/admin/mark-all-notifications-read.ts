// import { NextApiRequest, NextApiResponse } from "next";
// import { connectToDatabase } from "@/lib/mongodb";
// import Notification from "@/models/Notification";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   await connectToDatabase();

//   if (req.method === "PATCH") {
//     try {
//       await Notification.updateMany({ read: false }, { $set: { read: true } });
//       res.status(200).json({ message: "Notifications marked as read" });
//     } catch (err) {
//       res.status(500).json({ message: "Failed to mark as read" });
//     }
//   } else {
//     res.status(405).end();
//   }
// }

// /pages/api/admin/mark-notifications-read.ts

// pages/api/admin/mark-all-notifications-read.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method === "PATCH") {
    try {
      await Notification.updateMany({ read: false }, { read: true });
      res.status(200).json({ message: "Marked all as read" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update notifications" });
    }
  } else {
    res.status(405).end();
  }
}
