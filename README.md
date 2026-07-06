# TraceBack — Lost & Found Platform

A full-stack Lost & Found web application where users can report lost items, register found belongings, upload images, and search the community directory.

![Tech Stack](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?style=flat&logo=postgresql&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat)

## Features

- **Authentication** — Sign up, login, and logout via Clerk with automatic PostgreSQL user sync
- **Item posts** — Create Lost or Found posts with images, location, date, and contact info
- **Image uploads** — Cloudinary-hosted images (URLs stored in database only)
- **Search & filters** — Search by title, category, or location; filter by status/category; sort newest/oldest
- **Pagination** — Browse items 10 per page
- **Dashboard** — View, edit, and delete your own posts
- **Authorization** — Only post owners can edit or delete their items
- **Profile** — View account info and posting statistics

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS 4      |
| Routing    | React Router 7                      |
| Backend    | Express.js, Node.js (ES Modules)    |
| Database   | PostgreSQL, Prisma ORM              |
| Auth       | Clerk                               |
| Images     | Cloudinary                          |
| Validation | Zod                                 |
| HTTP       | Axios                               |

## Project Structure

```
lost_and_found/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # User & Item models
│   │   └── migrations/         # Database migrations
│   └── src/
│       ├── app.js              # Express entry point
│       ├── config/             # DB & Cloudinary config
│       ├── controllers/        # Route handlers
│       ├── middleware/         # Auth, validation
│       └── routes/             # API routes
└── frontend/
    └── src/
        ├── api/                # Axios instance
        ├── components/         # Reusable UI components
        ├── constants/          # Shared constants
        ├── context/            # Auth/profile context
        ├── hooks/              # Custom hooks (useApi)
        ├── layouts/            # Page layouts
        ├── pages/              # Route pages
        └── services/           # API service functions
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://www.postgresql.org/) database
- [Clerk](https://clerk.com/) account (free tier works)
- [Cloudinary](https://cloudinary.com/) account (free tier works)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/GarvYadav40/lost_and_found.git
cd lost_and_found
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/lost_and_found?schema=public
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Run database migrations:

```bash
npm run db:migrate
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Fill in:

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### 4. Clerk configuration

In your [Clerk Dashboard](https://dashboard.clerk.com/):

1. Create a new application
2. Copy the **Publishable Key** and **Secret Key** into both `.env` files
3. Under **Paths**, set:
   - Sign-in URL: `/login`
   - Sign-up URL: `/signup`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

### 5. Cloudinary configuration

In your [Cloudinary Dashboard](https://cloudinary.com/console):

1. Copy **Cloud Name**, **API Key**, and **API Secret** into `backend/.env`
2. No upload preset is required — the app uses direct stream uploads

## API Endpoints

| Method | Endpoint              | Auth     | Description                    |
|--------|-----------------------|----------|--------------------------------|
| GET    | `/api/items`          | Optional | List items (search/filter)   |
| GET    | `/api/items/:id`      | None     | Get single item                |
| POST   | `/api/items`          | Required | Create item                    |
| PUT    | `/api/items/:id`      | Required | Update item (owner only)       |
| DELETE | `/api/items/:id`      | Required | Delete item (owner only)       |
| GET    | `/api/users/me`       | Required | Current user profile + stats   |
| GET    | `/api/dashboard/items`| Required | Current user's items           |
| POST   | `/api/upload`         | Required | Upload image to Cloudinary     |

### Query parameters for `GET /api/items`

| Param      | Values                          | Description              |
|------------|---------------------------------|--------------------------|
| `search`   | string                          | Search title/category/location |
| `status`   | `Lost`, `Found`                 | Filter by status         |
| `category` | string                          | Filter by category       |
| `sort`     | `newest`, `oldest`              | Sort order               |
| `page`     | number                          | Page number (10/page)    |

## Available Scripts

### Backend

| Command              | Description                |
|----------------------|----------------------------|
| `npm run dev`        | Start dev server (nodemon) |
| `npm start`          | Start production server    |
| `npm run db:migrate` | Run Prisma migrations      |
| `npm run db:studio`  | Open Prisma Studio         |
| `npm run db:generate`| Generate Prisma client     |

### Frontend

| Command           | Description              |
|-------------------|--------------------------|
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |

## Environment Variables

### Backend (`backend/.env`)

| Variable                 | Required | Description                    |
|--------------------------|----------|--------------------------------|
| `PORT`                   | No       | Server port (default: 5000)    |
| `DATABASE_URL`           | Yes      | PostgreSQL connection string   |
| `CLERK_PUBLISHABLE_KEY`  | Yes      | Clerk publishable key          |
| `CLERK_SECRET_KEY`       | Yes      | Clerk secret key               |
| `CLOUDINARY_CLOUD_NAME`  | Yes      | Cloudinary cloud name          |
| `CLOUDINARY_API_KEY`     | Yes      | Cloudinary API key             |
| `CLOUDINARY_API_SECRET`  | Yes      | Cloudinary API secret          |
| `CLIENT_URL`             | No       | Frontend URL for CORS          |

### Frontend (`frontend/.env`)

| Variable                      | Required | Description              |
|-------------------------------|----------|--------------------------|
| `VITE_API_URL`                | No       | Backend API URL          |
| `VITE_CLERK_PUBLISHABLE_KEY`  | Yes      | Clerk publishable key    |

## License

MIT
