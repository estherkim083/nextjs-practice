import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import db from "@/utils/db";

const { getSession } = require("next-auth/react");

const getHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};

const putHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await product.save();
    await db.disconnect();

    return res.send({ message: "Product updated successfully" });
  } else {
    return res.status(404).send({ message: "Product not found" });
  }
};
const deleteHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findByIdAndRemove(req.query.id);
  if (product) {
    // await product.remove();
    await db.disconnect();
    res.send({ message: "Product deleted successfully" });
  } else {
    await db.disconnect();
    return res.status(404).send({ message: "Product not found" });
  }
};

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("SignIn required");
  }
  const { user } = session;
  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method == "PUT") {
    return putHandler(req, res);
  } else if (req.method == "DELETE") {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

export default handler;
