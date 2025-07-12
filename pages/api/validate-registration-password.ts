// pages/api/validate-registration-password.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { password } = req.body;
  const correct = process.env.REGISTRATION_PASSWORD;

  if (password === correct) return res.status(200).json({ valid: true });
  return res.status(401).json({ valid: false });
}
