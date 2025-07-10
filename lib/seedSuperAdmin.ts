// lib/seedSuperAdmin.ts
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import { connectToDatabase } from "./mongodb";

export const seedSuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) return;

  await connectToDatabase();
  const existing = await Admin.findOne({ email });

  if (!existing) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({
      fullName: "Super Admin",
      email,
      password: hashedPassword,
      role: "superadmin",
    });
    console.log("✅ Super admin seeded");
  } else {
    console.log("ℹ️ Super admin already exists");
  }
};
