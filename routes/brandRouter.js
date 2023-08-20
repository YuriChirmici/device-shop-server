const { Router } = require("express");
const brandController = require("../controllers/brandController");
const authMiddleware = require("../middleware/auth");

const router = Router();

router.post("/", authMiddleware(["ADMIN"]), brandController.create);
router.get("/", brandController.getAll);

module.exports = router;