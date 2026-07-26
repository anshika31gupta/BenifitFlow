const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');

async function signup({ name, email, password }) {
  const normalizedEmail = email ? email.toLowerCase().trim() : '';
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, passwordHash },
  });

  const token = signToken({ sub: user.id });
  return { token, user: sanitize(user) };
}

async function login({ email, password }) {
  const normalizedEmail = email ? email.toLowerCase().trim() : '';
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized('Invalid email or password');

  const token = signToken({ sub: user.id });
  return { token, user: sanitize(user) };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { cards: true },
  });
  if (!user) throw ApiError.notFound('User not found');
  return sanitize(user);
}

function sanitize(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

module.exports = { signup, login, getProfile };
