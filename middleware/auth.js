const jwt = require("jsonwebtoken");

module.exports = (roles = ["USER"]) => (req, res, next) => {
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		const token = (req.headers.authorization || "").split(" ")[1];
		if (!token) {
			throw new Error("No token");
		}

		const decoded = jwt.verify(token, process.env.SECRET_KEY)
		if (!hasPermission(decoded.role, roles)) {
			return res.status(401).json({ message: "No permission" });
		}

		req.user = decoded;
		next();
	} catch (err) {
		console.log(err);
		res.status(401).json({ message: "Not authenticated" })
	}
}

const hasPermission = (role, requiredRoles) => {
	if (role === "ADMIN") {
		return true;
	}

	return requiredRoles.includes(role);
}