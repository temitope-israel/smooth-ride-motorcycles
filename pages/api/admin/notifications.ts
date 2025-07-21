import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Customer from "@/models/Customer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  try {
    const recentCustomers = await Customer.find({})
      .sort({ createdAt: -1 })
      .limit(20);

    const notifications = recentCustomers.map((cust) => ({
      message: `${cust.dealer} just registered a customer.`,
      timestamp: cust.createdAt,
    }));

    res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to load notifications" });
  }
}
