const { default: Order } = require("@/models/Order");
const { default: db } = require("@/utils/db");
const { getSession } = require("next-auth/react");

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("Error: signin required");
  }
  await db.connect();
  const order = Order.findById(req.query.id);
  if (order) {
    if (order.isPaid) {
      return res.status(402).send({ message: "Error: ORder is already paid" });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: res.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    await db.disconnect();
    res.send({ message: "Paid Successfully", order: paidOrder });
  } else {
    await db.disconnect();
    return res.status(402).send({ message: "Error: Order not found" });
  }
};
export default handler;
