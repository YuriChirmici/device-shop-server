const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const { User, Basket } = require("../database/models");

class UserController {
	async registration(req, res,next) {
		try {
			const { email, password, role } = req.body;
			if (!email || !password) {
				return next(ApiError.badRequest("Empty email or password"));
			}
			const candidate = await User.findOne({ where: { email }});
			if (candidate) {
				return next(ApiError.badRequest("User with the entered email already exists"));
			}

			const user = await User.create({
				email,
				password: await bcrypt.hash(password, 5),
				role
			});

			await Basket.create({ userId: user.id });

			const token = userController.generateJWT(user);
			res.json({ token });
		} catch (err) {
			next(err);
		}
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email } });
			if (!user) {
				return next(ApiError.internal("User not found"));
			}
	
			const compared = await bcrypt.compare(password, user.password);
			if (!compared) {
				return next(ApiError.internal("Wrong password"));
			}
			
			const token = userController.generateJWT(user);
			res.json({ token });
		} catch (err) {
			next(err);
		}
	}

	async check(req, res, next) {
		try {
			const token = userController.generateJWT(req.user);
			res.json({ token });
		} catch (err) {
			next(err);
		}
	}

	generateJWT = ({ id, email, role }) => {
		const token = jwt.sign(
			{ id, email, role },
			process.env.SECRET_KEY,
			{ expiresIn: "24h" }
		);
		
		return token;
	}
}
const userController = new UserController();
module.exports = userController;