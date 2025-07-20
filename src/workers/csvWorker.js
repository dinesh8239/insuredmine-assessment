const { workerData, parentPort } = require("worker_threads");
const xlsx = require("xlsx");
const connectDB = require("../config/db");
const { parseExcelDate } = require("../utils/convertExcelDate");

const normalizeHeaders = (row) => {
  const normalized = {};
  for (const key in row) {
    normalized[key.trim().toLowerCase()] = row[key];
  }
  return normalized;
};

(async () => {
  try {
    await connectDB();

    //Only NOW require models
    const Agent = require("../models/Agent");
    const User = require("../models/User");
    const Account = require("../models/Account");
    const LOB = require("../models/LOB");
    const Carrier = require("../models/Carrier");
    const Policy = require("../models/Policy");

    console.log("Models registered:", {
      LOB: typeof LOB === "function",
    });

    const workbook = xlsx.readFile(workerData.filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    if (!rawData.length) throw new Error("Sheet has no data");

    for (const originalRow of rawData) {
      const row = normalizeHeaders(originalRow);
      const dob = parseExcelDate(row["dob"]);
      const startDate = parseExcelDate(row["policy_start_date"]);
      const endDate = parseExcelDate(row["policy_end_date"]);

      if (!dob || !startDate || !endDate) {
        console.warn("Skipping row due to invalid date fields:", {
          dob: row["dob"],
          startDate: row["policy_start_date"],
          endDate: row["policy_end_date"],
        });
        continue;
      }

      const agent = await Agent.findOneAndUpdate(
        { name: row["agent"] },
        { name: row["agent"] },
        { upsert: true, new: true }
      );

      const user = await User.findOneAndUpdate(
        { email: row["email"] },
        {
          firstName: row["firstname"],
          dob,
          address: row["address"],
          phone: row["phone"],
          state: row["state"],
          zipCode: row["zip"],
          email: row["email"],
          gender: row["gender"],
          userType: row["usertype"],
        },
        { upsert: true, new: true }
      );

      const account = await Account.findOneAndUpdate(
        { accountName: row["account_name"] },
        { accountName: row["account_name"] },
        { upsert: true, new: true }
      );

      const lob = await LOB.findOneAndUpdate(
        { categoryName: row["category_name"] },
        { categoryName: row["category_name"] },
        { upsert: true, new: true }
      );

      const carrier = await Carrier.findOneAndUpdate(
        { companyName: row["company_name"] },
        { companyName: row["company_name"] },
        { upsert: true, new: true }
      );

      await Policy.create({
        policyNumber: row["policy_number"],
        startDate,
        endDate,
        userId: user._id,
        categoryId: lob._id,
        carrierId: carrier._id,
        accountId: account._id,
        agentId: agent._id,
      });
    }

    parentPort.postMessage("Data import successful");
  } catch (err) {
    console.error("Worker error:", err);
    parentPort.postMessage("Data import failed");
  }
})();
