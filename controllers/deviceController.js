const path = require("path");
const uuid = require("uuid").v4;
const { Device, DeviceInfo, Brand, Type } = require("../database/models");

class DeviceController {
	async create(req, res, next) {
		try {
			const { name, price, brandId, typeId } = req.body;
			let { info } = req.body;
			const img = req.files?.img;

			let filename;
			if (img) {
				filename = uuid() + ".jpg";
				await img.mv(path.resolve(__dirname, "../static", filename));
			}

			let device = await Device.create({ name, price, brandId, typeId, img: filename });
			device = await deviceController.getDeviceById(device.id);

			if (info) {
				info = (typeof info === "string") ? JSON.parse(info) : info;
				await deviceController._createDeviceInfo(info, device.id);
			}

			res.json(device);
		} catch (err) {
			next(err);
		}
	}

	async getAll(req, res) {
		const filter = req.query.filter || {};
		let { limit = 8, page = 1 } = req.query;
		let offset = (page - 1) * limit;

		limit = limit < 1 ? 1 : limit;
		offset = offset < 0 ? 0 : offset;

		const query = {};
		["brandId", "typeId"].forEach((key) => {
			const value = filter[key];
			if (value) {
				query[key] = value;
			}
		})

		const devices = await Device.findAndCountAll({
			where: query,
			limit,
			offset,
			include: [{ model: DeviceInfo, as: "info" }, Brand, Type]
		})
		res.json(devices);
	}

	async getById(req, res, next) {
		try {
			const { id } = req.params;
			const device = await deviceController.getDeviceById(id);
			res.json(device);
		} catch (err) {
			next(err);
		}
	}

	async getDeviceById(id) {
		const device = await Device.findOne({
			where: { id },
			include: [{ model: DeviceInfo, as: "info" }, Brand, Type]
		});

		return device;
	}

	async _createDeviceInfo(info = [], deviceId) {
		if (!info.length) {
			return;
		}

		const promises = [];
		info.forEach((i) => {
			promises.push(DeviceInfo.create({
				title: i.title,
				description: i.description,
				deviceId
			}))
		})

		await Promise.all(promises);
	}
}


const deviceController = new DeviceController();

module.exports = deviceController;