const mongoose = require("mongoose");

const garageSchema = new mongoose.Schema(
  {
    garageName: {
      type: String,
      required: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    district: {
      type: String,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    vehicleTypes: [
      {
        type: String,
      },
    ],

    services: [
      {
        type: String,
      },
    ],

    photos: [
      {
        type: String,
      },
    ],

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Garage", garageSchema);