import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";

// Password generator
function generatePassword() {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  return Array.from(
    { length: 6 },
    () => charset[Math.floor(Math.random() * charset.length)]
  ).join("");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const newPassword = generatePassword();

    // ✅ No need to hash manually — Mongoose schema will do it
    admin.password = newPassword;
    await admin.save(); // This triggers the pre-save hook in the schema

    res.status(200).json({ generatedPassword: newPassword });
  } catch (err) {
    console.error("Password regeneration error:", err);
    res.status(500).json({ message: "Failed to regenerate password" });
  }
}

// import { NextApiRequest, NextApiResponse } from "next";
// import {connectToDatabase} from "@/lib/mongodb";
// import Admin from "@/models/Admin";
// import bcrypt from "bcryptjs";

// function generatePassword() {
//   const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
//   return Array.from({ length: 10 }, () => charset[Math.floor(Math.random() * charset.length)]).join("");
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectToDatabase();
//   if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

//   const { id } = req.body;
//   try {
//     const admin = await Admin.findById(id);
//     if (!admin) return res.status(404).json({ message: "Admin not found" });

//     const newPassword = generatePassword();
//     const hashed = await bcrypt.hash(newPassword, 10);
//     admin.password = hashed;
//     await admin.save();

//     res.status(200).json({ generatedPassword: newPassword });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to regenerate password" });
//   }
// }
