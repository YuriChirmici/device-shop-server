const { Type } = require("../database/models");
const ApiError = require("../error/ApiError");

class TypeController {
	async create(req, res, next) {
		try {
			const { name } = req.body;
			const type = await Type.create({ name });
			res.json(type);
		} catch (err) {
			next(err);
		}
	}

	async getAll(req, res) {
		try {
			const types = await Type.findAll();
			res.json(types);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new TypeController();