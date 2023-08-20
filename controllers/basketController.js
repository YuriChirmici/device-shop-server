const { Basket, BasketDevice, Device, Type, Brand, DeviceInfo } = require("../database/models");
const deviceController = require("./deviceController");

class BasketController {
	async addDevice(req, res, next) {
		try {
			const userId = req.user.id;
			const { deviceId } = req.params;
			const userBasket = await Basket.findOne({ where: { userId } });

			const existedItem = await BasketDevice.findOne({ where: { basketId: userBasket.id, deviceId } });
			if (existedItem) {
				existedItem.count++;
				await existedItem.save();
			} else {
				await BasketDevice.create({ basketId: userBasket.id, deviceId });
			}

			const device = await deviceController.getDeviceById(deviceId);
	
			res.json(device);
		} catch (err) {
			next(err);
		}
	}

	async get(req, res, next) {
		try {
			const userId = req.user.id;
			const basket = await Basket.findOne({
				where: { userId }
			});

			if (!basket) {
				return res.json([]);
			}
			const basketDevices = await BasketDevice.findAll({
				where: { basketId: basket.id },
				include: [
					{ model: Device, include: [{ model: DeviceInfo, as: "info" }, Brand, Type] }
				],
				raw: true,
				nest: true
			});

			const devices = basketDevices.map(({ count, device }) => ({...device, count }));

			res.json(devices);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new BasketController();