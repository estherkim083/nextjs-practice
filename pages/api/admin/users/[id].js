import User from "@/models/User";
import db from "@/utils/db";

const { getSession } = require("next-auth/react");

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("SignIn required");
  }
  await db.connect();
  if (req.method === "DELETE") {
    const deleteUser = await User.findById(req.query.id);
    if (deleteUser) {
      if (deleteUser.isAdmin === true) {
        return res.status(401).send({ message: "Cannot delete Admin" });
      }
    }
    const user = await User.findByIdAndRemove(req.query.id);
    if (user) {
      await db.disconnect();
      res.send({
        message: "User deleted successfully",
      });
    } else {
      await db.disconnect();
      return res.status(404).send({ message: "User not found" });
    }
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

export default handler;
