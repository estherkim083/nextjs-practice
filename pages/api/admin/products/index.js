import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import db from "@/utils/db";

const { getSession } = require("next-auth/react");

const getHandler = async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
};
const postHandler = async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "" + Math.random(),
    image: "",
    price: 0,
    category: "",
    brand: "",
    countInStock: 0,
    description: "",
    rating: 0,
    numReviews: 0,
  });
  const product = await newProduct.save();

  await db.disconnect();
  res.send({ message: "Product created successfully", product });
};

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("Admin SignIn required");
  }
  const { user } = session;
  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "POST") {
    return postHandler(req, res, user);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

export default handler;
