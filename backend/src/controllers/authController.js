const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/userService');

const signup = asyncHandler(async (req, res) => {
  const result = await userService.signup(req.body);
  res.status(201).json({ success: true, data: result });
});

const login = asyncHandler(async (req, res) => {
  const result = await userService.login(req.body);
  res.status(200).json({ success: true, data: result });
});

const profile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  res.status(200).json({ success: true, data: user });
});

module.exports = { signup, login, profile };
