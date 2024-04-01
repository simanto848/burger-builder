import Address from "../models/Address.js";

export const createAddress = async (req, res) => {
  try {
    const {
      phoneNumber,
      state,
      city,
      country,
      street,
      postalCode,
      houseNumber,
    } = req.body;

    if (req.user.role !== "user" && req.user.role !== "admin") {
      return res.status(400).json({ message: "Access denied!" });
    }

    const newAddress = new Address({
      userId: req.user.id,
      phoneNumber,
      state,
      city,
      country,
      street,
      postalCode,
      houseNumber,
    });

    const existingAddresses = await Address.find({ userId: req.user.id });

    if (existingAddresses.length === 0) {
      newAddress.default = true;
    }

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getDefaultAddress = async (req, res) => {
  try {
    if (req.user.role !== "user" && req.user.role !== "admin") {
      return res.status(400).json({ message: "Access denied!" });
    }

    const defaultAddress = await Address.findOne({ userId: req.user.id });
    if (!defaultAddress) {
      return res.status(404).json({ message: "Default address not found" });
    }
    res.json(defaultAddress);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllAddresses = async (req, res) => {
  try {
    if (req.user.role !== "user" && req.user.role !== "admin") {
      return res.status(400).json({ message: "Access denied!" });
    }
    const addresses = await Address.find({ userId: req.user.id });
    res.json(addresses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "phoneNumber",
    "state",
    "city",
    "country",
    "street",
    "postalCode",
    "houseNumber",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ message: "Invalid updates!" });
  }

  try {
    if (req.user.role !== "user" && req.user.role !== "admin") {
      return res.status(400).json({ message: "Access denied!" });
    }

    const address = await Address.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    updates.forEach((update) => (address[update] = req.body[update]));
    await address.save();

    res.json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    if (req.user.role !== "user" && req.user.role !== "admin") {
      return res.status(400).json({ message: "Access denied!" });
    }

    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ message: "Address deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
