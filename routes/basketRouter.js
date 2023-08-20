const { Router } = require("express");
const basketController = require("../controllers/basketController");
const authMiddleware = require("../middleware/auth");

const router = Router();

router.get("/", authMiddleware(), basketController.get);
router.post("/addById/:deviceId", authMiddleware(), basketController.addDevice);

module.exports = router;