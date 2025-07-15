// pages/api/admin/add-dealer.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Dealer from "@/models/Dealer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectToDatabase();

  try {
    const {
      status,
      exOrMulti,
      hondaExclusiveOutlet,
      pic,
      dlrName,
      region,
      state,
      town,
      address,
      phone1,
      phone2,
      ownerOrContactPerson,
    } = req.body;

    // Basic validation
    if (
      !status ||
      !exOrMulti ||
      !hondaExclusiveOutlet ||
      !pic ||
      !dlrName ||
      !region ||
      !state ||
      !town ||
      !address ||
      !phone1 ||
      !ownerOrContactPerson
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required except Phone 2.",
      });
    }

    if (!/^\d{11}$/.test(phone1)) {
      return res.status(400).json({
        success: false,
        message: "Phone 1 must be exactly 11 digits.",
      });
    }

    if (phone2 && !/^\d{11}$/.test(phone2)) {
      return res.status(400).json({
        success: false,
        message: "Phone 2 must be exactly 11 digits.",
      });
    }

    // ✅ Normalize fields to uppercase before checking and saving
    const normalizedDlrName = dlrName.trim().toUpperCase();
    const normalizedState = state.trim().toUpperCase();
    const normalizedTown = town.trim().toUpperCase();

    // ✅ Check for existing dealer
    const existingDealer = await Dealer.findOne({
      dlrName: normalizedDlrName,
      state: normalizedState,
      town: normalizedTown,
    });

    if (existingDealer) {
      return res
        .status(409)
        .json({ success: false, message: "Dealer already exists" });
    }

    // ✅ Create new dealer using normalized values
    await Dealer.create({
      status: status.trim(),
      exOrMulti: exOrMulti.trim(),
      hondaExclusiveOutlet: hondaExclusiveOutlet.trim(),
      pic: pic.trim().toUpperCase(),
      dlrName: normalizedDlrName,
      region: region.trim().toUpperCase(),
      state: normalizedState,
      town: normalizedTown,
      address: address.trim(),
      phone1: phone1.trim(),
      phone2: phone2 ? phone2.trim() : undefined,
      ownerOrContactPerson: ownerOrContactPerson.trim().toUpperCase(),
    });

    return res
      .status(201)
      .json({ success: true, message: "Dealer added successfully" });
  } catch (error: any) {
    console.error("Dealer creation failed:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// pages/api/admin/add-dealer.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import { connectToDatabase } from "@/lib/mongodb";
// import Dealer from "@/models/Dealer";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   await connectToDatabase();

//   try {
//     const {
//       status,
//       exOrMulti,
//       hondaExclusiveOutlet,
//       pic,
//       dlrName,
//       region,
//       state,
//       town,
//       address,
//       phone1,
//       phone2,
//       ownerOrContactPerson, // 👈 received from frontend
//     } = req.body;

//     // Basic validation
//     if (
//       !status ||
//       !exOrMulti ||
//       !hondaExclusiveOutlet ||
//       !pic ||
//       !dlrName ||
//       !region ||
//       !state ||
//       !town ||
//       !address ||
//       !phone1 ||
//       !ownerOrContactPerson // 👈 changed to ownerOrContactPerson
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required except Phone 2.",
//       });
//     }

//     if (!/^\d{11}$/.test(phone1)) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone 1 must be exactly 11 digits.",
//       });
//     }

//     if (phone2 && !/^\d{11}$/.test(phone2)) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone 2 must be exactly 11 digits.",
//       });
//     }

//     // ✅ Create new dealer using ownerContact as owner
//     await Dealer.create({
//       status: status.trim(), // ✅ status is optional, so we can remove it if not needed
//       exOrMulti: exOrMulti.trim(),
//       hondaExclusiveOutlet: hondaExclusiveOutlet.trim(),
//       pic: pic.trim(),
//       dlrName: dlrName.trim(),
//       region: region.trim(),
//       state: state.trim(),
//       town: town.trim(),
//       address: address.trim(),
//       phone1: phone1.trim(),
//       phone2: phone2 ? phone2.trim() : undefined,
//       ownerOrContactPerson: ownerOrContactPerson.trim(),
//     });

//     return res
//       .status(201)
//       .json({ success: true, message: "Dealer added successfully" });
//   } catch (error: any) {
//     console.error("Dealer creation failed:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// }
