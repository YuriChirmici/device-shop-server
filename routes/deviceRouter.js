const { Router } = require("express");
const deviceController = require("../controllers/deviceController");
const authMiddleware = require("../middleware/auth");

const router = Router();

router.post("/", authMiddleware(["ADMIN"]), deviceController.create);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getById);

module.exports = router;