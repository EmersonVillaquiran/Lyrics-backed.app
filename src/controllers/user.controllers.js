const catchError = require("../utils/catchError");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const EmailCode = require("../models/EmailCode");
const Song = require("../models/Song");

const getAll = catchError(async (req, res) => {
  const results = await User.findAll({ include: [Song] });
  const loggedUser = req.user;
  return res.json({ results, loggedUser });
});

const create = catchError(async (req, res) => {
  const { firstName, lastName, email, password, frontBaseUrl } = req.body;
  console.log("frontBaseUrl recibido:", frontBaseUrl);
  const encriptedPassword = await bcrypt.hash(password, 10);
  const result = await User.create({
    firstName,
    lastName,
    email,
    password: encriptedPassword,
  });
  const code = require("crypto").randomBytes(64).toString("hex");
  const link = `${frontBaseUrl}/${code}`;

  await EmailCode.create({
    code: code,
    userId: result.id,
  });
  await sendEmail({
    to: email,
    subject: "Verificate email for user",
    html: `
    <h1>Hola ${firstName} ${lastName}</h1>
    <p>Cuenta creada!</p>
    <p>Para verificar tu email, haz click en el siguiente enlace:</p>
    <a href="${link}">${link}</a>
    `,
  });
  return res.status(201).json(result);
});

const verifyCode = catchError(async (req, res) => {
  const { code } = req.params;
  const emailCode = await EmailCode.findOne({ where: { code } });

  if (!emailCode) return res.status(401).json({ message: "Invalid code" });

  const user = await User.findByPk(emailCode.userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.isVerified = true; // Cambiar el estado a verificado
  await user.save(); // Guardar en la base de datos

  await emailCode.destroy(); // Eliminar el código de verificación

  return res.json({ message: "User verified", user });
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id, { include: [Song] });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, image } = req.body;
  const result = await User.update(
    { firstName, lastName, email, image },
    { where: { id }, returning: true }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user === null)
    return res.status(401).json({ message: "Invalid credentials" });
  if (!user.isVerified) {
    return res
      .status(401)
      .json({ message: "Please verify your email before logging in" });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (isValid === false) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return res.json({ user, token });
});

const getMe = catchError(async (req, res) => {
  const loggedUser = req.user;
  return res.json(loggedUser);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
  getMe,
  verifyCode,
};
