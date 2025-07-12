import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const password = process.env.REGISTRATION_PASSWORD;

  if (!password) {
    return res.status(500).json({ message: "Password not set in env." });
  }

  res.status(200).json({ password });
}
