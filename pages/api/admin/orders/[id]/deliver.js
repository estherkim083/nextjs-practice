import Order from "@/models/Order";
import db from "@/utils/db";

const { getSession } = require("next-auth/react");

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("SignIn required");
  }
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = await order.save();
    await db.disconnect();
    res.send({
      message: "order was delivered successfully",
      order: deliveredOrder,
    });
  } else {
    await db.disconnect();
    res.status(400).send({ message: "order not found" });
  }
};

export default handler;
