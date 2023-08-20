const { Brand } = require("../database/models");
const ApiError = require("../error/ApiError");

class BrandController {
	async create(req, res, next) {
		try {
			const { name } = req.body;
			const brand = await Brand.create({ name });
			res.json(brand);
		} catch (err) {
			next(err);
		}
	}

	async getAll(req, res) {
		try {
			const brands = await Brand.findAll();
			res.json(brands);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new BrandController();