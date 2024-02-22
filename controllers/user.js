import bcrypt from "bcrypt";
import User from "../schema/user.js";
import jwt from "jsonwebtoken";

const secret = process.env.JWTSECRETT;
export const userCheck = async (req, res) => {
  res.status(200).json({ msg: "TRUE" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists !== null) {
      return res.status(400).json({ msg: "email already exists!" });
    }

    const newPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: newPassword });

    await user.save();

    const token = await jwt.sign({ id: user?._id }, "secret", {
      expiresIn: "365d",
    });
    console.log(token);

    res.status(201).json({ msg: "user created", data: user, token });
  } catch (error) {
    res.status(400).json({ msg: "some error encountered!", error });
    console.log(error);
    return;
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.find({ email });
    console.log(user);
    if (user?.length === 0) {
      res.status(300).json({ msg: "Your email is not registered" });
      return;
    }
    console.log(user[0]?.password, password);
    const valid = await bcrypt.compare(password, user[0]?.password);

    if (!valid) {
      return res.status(400).json({ msg: "Invalid Credintials !!!!" });
    }
    const token = await jwt.sign({ id: user[0]?._id }, "secret", {
      expiresIn: "365d",
    });

    res.status(200).json({ msg: "success", data: user[0], token });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const isUserAuthenticated = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(400).json({ msg: "invalid token" });
  try {
    const { id } = await jwt.decode(token, "secret");
    console.log(id);
    if (!id) return res.status(404).json({ ms: "invalid Token" });

    const user = await User.findById(id);
    return res.status(200).json({ msg: "user authenticated", data: user });
  } catch (error) {
    return res.status(400).json({ msg: `${error}` });
  }
};
