// /pages/api/admin/list.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
   const admins = await Admin.find({}, "fullName email createdAt"); // ✅ must include fullName


    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
}
