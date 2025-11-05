# SlotSwapper (skeleton)

This archive contains a minimal, runnable skeleton for the SlotSwapper assignment:
- backend: Node.js + Express + Prisma (Postgres)
- frontend: React + Vite + Tailwind (basic pages)

Instructions:
1. Start a Postgres DB (or use docker-compose).
2. Edit backend/.env.example -> .env and set DATABASE_URL and JWT_SECRET
3. Install backend deps: cd backend && npm install
4. Generate Prisma client & run migrations: npx prisma generate && npx prisma migrate dev --name init
5. Start backend: npm run dev
6. Install frontend deps: cd ../frontend && npm install
7. Start frontend: npm run dev

The backend exposes API under /api (default port 4000).
