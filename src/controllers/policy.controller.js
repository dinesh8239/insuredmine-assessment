const Policy = require("../models/Policy");
const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const LOB = require("../models/LOB");
const Carrier = require("../models/Carrier");
const Account = require("../models/Account");
const Agent = require("../models/Agent");

//Search Policy by Email
exports.searchPolicyByEmail = asyncHandler(async (req, res) => {
  try {
    const email = req.query.email?.trim().toLowerCase();

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(400, "User not found");
    }

    const policies = await Policy.find({ userId: user._id })
      .populate("categoryId", "categoryName")
      .populate("carrierId", "companyName")
      .populate("accountId", "accountName")
      .populate("agentId", "name")
      .populate("userId", "firstName email")
      .lean();

    if (policies.length === 0) {
      throw new ApiError(400, [], "No policies found for this user");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, policies, "Policies fetched successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching policies"
    );
  }
});


//Aggregate Policy by User
exports.aggregatePoliciesByUser = asyncHandler(async (req, res) => {
  try {
    const aggregation = await Policy.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user._id",
          name: { $first: "$user.firstName" },
          email: { $first: "$user.email" },
          totalPolicies: { $sum: 1 },
        },
      },
      { $sort: { totalPolicies: -1 } },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          aggregation,
          "Policies aggregated by user successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message ||
        "Something went wrong while aggregating policies by user"
    );
  }
});

