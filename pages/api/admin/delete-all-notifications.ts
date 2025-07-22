// // pages/api/admin/delete-all-notifications.ts

// import { NextApiRequest, NextApiResponse } from "next";
// import {connectToDatabase} from "@/lib/mongodb";
// import Notification from "@/models/Notification";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "DELETE") return res.status(405).end();

//   try {
//     await connectToDatabase();
//     await Notification.deleteMany({});
//     res.status(200).json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete notifications" });
//   }
// }

import {connectToDatabase} from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    try {
      await connectToDatabase();
      await Notification.deleteMany({});
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete all notifications" });
    }
  }
  return res.status(405).end();
}


