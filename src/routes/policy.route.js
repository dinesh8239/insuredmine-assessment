const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policy.controller");

router.route("/search")
.get(policyController.searchPolicyByEmail)

router.route("/aggregate")
.get(policyController.aggregatePoliciesByUser)

module.exports = router;
