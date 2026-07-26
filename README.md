# Backend - Bookmark API

## Stack
- Express + TypeScript
- Prisma + SQLite
- Auth0 JWT

## Run
npm install
npx prisma migrate dev
npm run dev
# http://localhost:3000

## Env
Create .env:
DATABASE_URL="file:./dev.db"
AUTH0_DOMAIN=...
AUTH0_AUDIENCE=...

## Endpoints
- GET /collections
- POST /collections
- DELETE /collections/:id
- GET /bookmarks?collectionId=&search=
- POST /bookmarks
- DELETE /bookmarks/:id