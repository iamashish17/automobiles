# Automobiles

Automobiles is a full-stack web application for managing automotive services. It includes a responsive customer website, authentication, service booking, customer testimonials, a parts catalog, and an admin dashboard for managing bookings, services, parts, users, reviews, and contact messages.

## Tech Stack

- React + Vite
- Tailwind CSS
- Express
- MongoDB + Mongoose
- JWT Authentication
- Clerk Authentication

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

## Build

```bash
cd client
npm run build
```
