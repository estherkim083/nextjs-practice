import User from "@/models/User";
import db from "@/utils/db";
const { getSession } = require("next-auth/react");

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: "signIn required" });
  }
  const { user } = session;
  console.log(user);
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 3
  ) {
    res.status(422).json({ message: "Validation error" });
    return;
  }
  await db.connect();
  const toUpdateUser = await User.findById(user._id);
  toUpdateUser.name = name;
  toUpdateUser.email = email;
  if (password) {
    toUpdateUser.password = password;
    //toUpdateUser.password = bcryptjs.hashSync(password);
  }
  await toUpdateUser.save();
  await db.disconnect();
  res.send({ message: "User updated" });
}
export default handler;
