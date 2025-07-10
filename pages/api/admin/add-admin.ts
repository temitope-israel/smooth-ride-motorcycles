import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "Full name and email are required" });
    }

    await connectToDatabase();

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with this email already exists" });
    }

    // ✅ Generate random password
    const generatedPassword = uuidv4().slice(0, 6); // stronger 10-char password

    // ✅ Don't hash manually — let the schema hook do it
    const newAdmin = new Admin({
      fullName,
      email,
      password: generatedPassword,
    });

    await newAdmin.save(); // ⛳ Triggers pre-save hook to hash password

    return res.status(201).json({
      message: "Admin created successfully",
      admin: newAdmin,
      generatedPassword, // ⚠️ return only once
    });
  } catch (error: any) {
    console.error("Add Admin error:", error);
    return res.status(500).json({ message: error.message || "Something went wrong" });
  }
}


// // pages/api/admin/add.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";
// import { connectToDatabase } from "@/lib/mongodb";; // your DB connection
// import Admin from "@/models/Admin"; // your Admin model

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   console.log("Received body:", req.body); // 👈🏽 Add this here

//   try {
//     const { fullName, email } = req.body;
//     console.log("Look here: ", req.body)

//     if (!fullName || !email) {
//       return res.status(400).json({ message: "Full name and email are required" });
//     }

//     await connectToDatabase();

//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(409).json({ message: "Admin with this email already exists" });
//     }

//     const generatedPassword = uuidv4().slice(0, 8); // generate random 8-character password
//     const hashedPassword = await bcrypt.hash(generatedPassword, 10);
//     const newAdmin = await Admin.create({
//         fullName,
//         email,
//         password: hashedPassword,
//     });
//     console.log("I got here:", req.body)

//     console.log("Saving admin:", newAdmin);

//     // await newAdmin.save();

//     return res.status(201).json({
//       message: "Admin created successfully",
//       admin: newAdmin,
//       generatedPassword, // ⚠️ Return only once to show to the user
//     });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message || "Something went wrong" });
//   }
// }
