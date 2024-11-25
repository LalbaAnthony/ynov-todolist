# 📜 - Ylist

## Technos

- Node.js
- Angular
- Tailwind

## Quick Start

0. CONFIG

Create a `.env` file in the project directory. Use the `.env.example` file as a template.

1. BACKEND

```bash
cd back/ && npm i && npm run dev
```

1. FRONTEND

```bash
cd front/ && npm i && ng serve
```

## Development

Seed test data:

```bash
cd back/ && node seed.js
```

## Deployment

```bash
# Build and run the frontend
docker build -t vuejs-frontend -f front/Dockerfile .
docker run -p 8080:8080 vuejs-frontend

# Build and run the backend
docker build -t nodejs-backend -f back/Dockerfile .
docker run -p 3000:3000 nodejs-backend
```
