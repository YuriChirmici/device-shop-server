const { Router } = require("express");
const typeController = require("../controllers/typeController");
const authMiddleware = require("../middleware/auth");

const router = Router();

router.post("/", authMiddleware(["ADMIN"]), typeController.create);
router.get("/", typeController.getAll);


module.exports = router;