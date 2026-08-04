# Automobiles

Automobiles is a full-stack web app for New Purnagiri Automobiles. It includes a responsive customer website, authentication, service booking, customer testimonials, parts catalog, and an admin dashboard for managing bookings, services, parts, users, reviews, and contact messages.

## Tech Stack

- React + Vite
- Tailwind CSS
- Express
- MongoDB + Mongoose
- JWT authentication
- Clerk authentication support

## Project Structure

```text
client/   React frontend
server/   Express API
```

## Setup

Install dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

Create environment files from the examples:

```bash
client/.env.example -> client/.env.local
server/.env.example -> server/.env
```

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

## Checks

```bash
cd client
npm run build
npm run lint
```
