// backend/routes/auth.js
// CommonJS module to match your app.js `require()` usage.
// Provides POST /signup and POST /login using Prisma, bcrypt and JWT.
// Make sure you have these packages installed: @prisma/client, bcrypt, jsonwebtoken

const express = require('express');
const router = express.Router();

// Try to require Prisma client (if present). If not present, throw helpful error at runtime.
let prisma;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (e) {
  // prisma might not be installed in some environments; keep prisma undefined and give clear message if used.
  prisma = null;
}

// Helpers
const ensurePrisma = () => {
  if (!prisma) {
    const err = new Error('Prisma client is not available. Install @prisma/client and set DATABASE_URL.');
    err.status = 500;
    throw err;
  }
};

const bcrypt = (() => {
  try { return require('bcrypt'); } catch (e) { return null; }
})();

const jwt = (() => {
  try { return require('jsonwebtoken'); } catch (e) { return null; }
})();

const createToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  if (!jwt) throw new Error('jsonwebtoken not installed');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// POST /signup
router.post('/signup', async (req, res, next) => {
  try {
    ensurePrisma();

    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    // check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    if (!bcrypt) {
      return res.status(500).json({ message: 'bcrypt not installed on server' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed
      },
      select: { id: true, name: true, email: true }
    });

    // create token
    if (!jwt) {
      // return user without token if jsonwebtoken missing
      return res.status(201).json({ user, message: 'User created but JWT not available (jsonwebtoken not installed).' });
    }

    const token = createToken({ id: user.id, email: user.email });
    return res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
});

// POST /login
router.post('/login', async (req, res, next) => {
  try {
    ensurePrisma();

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    if (!bcrypt) return res.status(500).json({ message: 'bcrypt not installed on server' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    if (!jwt) return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email } });

    const token = createToken({ id: user.id, email: user.email });
    return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
