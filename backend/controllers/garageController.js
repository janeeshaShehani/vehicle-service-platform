const Garage = require("../models/Garage");

const createGarage = async (req, res) => {
  try {
    const garage = await Garage.create(req.body);

    res.status(201).json({
      success: true,
      data: garage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getGarages = async (req, res) => {
  try {
    const { vehicleType, service, district } = req.query;

    let filter = {};

    if (vehicleType) {
      filter.vehicleTypes = vehicleType;
    }

    if (service) {
      filter.services = service;
    }

    if (district) {
      filter.district = district;
    }

    const garages = await Garage.find(filter);

    res.status(200).json({
      success: true,
      count: garages.length,
      data: garages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createGarage,
  getGarages,
};