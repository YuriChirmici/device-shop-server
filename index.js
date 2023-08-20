require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const router = require("./routes");
const sequelize = require("./database/db");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload());
app.use("/api", router);

const start = async () => {
	try {
		// await sequelize.authenticate();
		// await sequelize.sync();
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
	} catch (err) {
		console.log(err);
	}
}

start();