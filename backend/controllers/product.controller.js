import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(400).json({ message: "Admin resources access denied" });
    } else {
      const { name, price } = req.body;

      if (!name || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const isProductExist = await Product.findOne({ name });
      if (isProductExist)
        return res.status(400).json({ message: "Product already exists" });

      const newProduct = new Product({ name, price });

      await newProduct.save();

      return res.status(201).json({ message: "Product created successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(400).json({ message: "Admin resources access denied" });
    } else {
      const { name, price } = req.body;

      if (!name || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }

      await Product.findOneAndUpdate(
        { _id: req.params.productId },
        { name, price }
      );

      return res.status(200).json({ message: "Product updated successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(400).json({ message: "Admin resources access denied" });
    } else {
      await Product.findByIdAndDelete(req.params.productId);
      return res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
