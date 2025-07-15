// pages/api/admin/view-dealers.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Dealer from "@/models/Dealer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { page = "1", limit = "10", search = "" } = req.query;

    const currentPage = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    const query = search
      ? {
          $or: [
            { dlrName: { $regex: search, $options: "i" } },
            { town: { $regex: search, $options: "i" } },
            { state: { $regex: search, $options: "i" } },
            { region: { $regex: search, $options: "i" } },
            { ownerOrContactPerson: { $regex: search, $options: "i" } },
            { pic: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Dealer.countDocuments(query);

    const dealers = await Dealer.find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({ dealers, total });
  } catch (error: any) {
    console.error("Fetch dealers error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// // pages/api/admin/view-dealers.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import { connectToDatabase } from "@/lib/mongodb";
// import Dealer from "@/models/Dealer";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectToDatabase();

//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const { page = "1", limit = "10", search = "" } = req.query;

//   const currentPage = parseInt(page as string);
//   const pageSize = parseInt(limit as string);

//   try {
//     const query = search
//       ? {
//           $or: [
//             { dlrName: { $regex: search, $options: "i" } },
//             { town: { $regex: search, $options: "i" } },
//             { state: { $regex: search, $options: "i" } },
//             { region: { $regex: search, $options: "i" } },
//             { ownerOrContactPerson: { $regex: search, $options: "i" } },
//           ],
//         }
//       : {};

//     const total = await Dealer.countDocuments(query);
//     const dealers = await Dealer.find(query)
//       .sort({ createdAt: -1 })
//       .skip((currentPage - 1) * pageSize)
//       .limit(pageSize);

//     res.status(200).json({ dealers, total });
//   } catch (error: any) {
//     console.error("Fetch dealers error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// }
