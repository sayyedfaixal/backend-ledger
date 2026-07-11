# Backend Ledger

Backend Ledger is a backend-first personal finance platform built with Node.js, Express, and MongoDB. It focuses on building secure, scalable backend services while exploring production-ready engineering practices.

---

## Features

- User authentication
- Secure credential management
- Session and token-based authorization
- Account onboarding
- Modular backend architecture
- RESTful API design

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer

---

## Project Structure

```text
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
└── app.js

server.js
```

---

## Getting Started

Clone the repository

```bash
git clone https://github.com/<your-username>/backend-ledger.git
```

Install dependencies

```bash
npm install
```

Configure your environment

```env
PORT=

MONGODB_URI=

JWT_SECRET=

EMAIL_USER=

CLIENT_ID=

CLIENT_SECRET=

REFRESH_TOKEN=
```

Start the development server

```bash
npm start
```

---

## Roadmap

The project is actively being expanded with features such as:

- Account management
- Transaction management
- Budget planning
- Financial insights
- Role-based authorization
- API documentation
- Background jobs
- Caching
- Containerization
- Testing

---

## Learning Goals

This project serves as a playground for exploring backend engineering concepts including:

- API design
- Authentication and authorization
- Database modelling
- Service-oriented architecture
- Error handling
- Validation
- Scalability
- Performance optimization

---

## Acknowledgements

This project was initially inspired by the backend series by Hitesh Choudhary (Chai aur Code). The codebase has been extended independently with additional features and architectural improvements as part of my learning journey.
