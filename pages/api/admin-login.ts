// pages/api/admin-login.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  await connectToDatabase();

  try {
    // Check for Super Admin (from .env)
    if (email === process.env.SUPER_ADMIN_EMAIL) {
      const isPasswordValid = password === process.env.SUPER_ADMIN_PASSWORD;
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid password" });
      }
      return res.status(200).json({ success: true, role: "superadmin" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    return res.status(200).json({ success: true, role: "admin" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// // pages/api/admin-login.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import bcrypt from "bcryptjs";
// import { connectToDatabase } from "@/lib/mongodb";
// import Admin from "@/models/Admin";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   await connectToDatabase();

//   try {
//     // ✅ Check super admin first (env takes priority)
//     if (email === process.env.SUPER_ADMIN_EMAIL) {
//       const isPasswordValid = password === process.env.SUPER_ADMIN_PASSWORD;
//       if (!isPasswordValid) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Invalid password" });
//       }
//       return res.status(200).json({ success: true, role: "superadmin" });
//     }

//     // ✅ Check regular admin from DB
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Admin not found" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid password" });
//     }

//     return res.status(200).json({ success: true, role: "admin" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// }
