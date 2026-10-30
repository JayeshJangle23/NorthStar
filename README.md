# 🛒 Northstar – MERN Stack E-Commerce Application

<p align="center">
  A full-stack e-commerce web application built using the MERN stack.
</p>

<p align="center">
  <a href="https://north-star-tawny-theta.vercel.app/"><strong>🌐 Live Demo</strong></a>
</p>

---

## 🚀 Live Application

**Frontend:** https://north-star-tawny-theta.vercel.app/

**Backend:** Add your deployed backend URL here.

---

## 📌 About the Project

Northstar is a full-stack e-commerce application developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The application provides an online shopping experience where users can browse products, manage their shopping cart, place orders, and manage their accounts.

It also includes administrative functionality for managing products and orders.

The project focuses on implementing real-world full-stack development concepts, REST APIs, authentication, database management, and responsive UI design.

## ✨ Features

### 👤 User Features
- User registration and login.
- Secure authentication.
- Browse available products.
- View individual product details.
- Search and filter products.
- Add products to shopping cart.
- Update product quantities.
- Remove products from cart.
- Place orders.
- View order history.
- Manage user profile.

### 🛠️ Admin Features
- Admin dashboard.
- Add new products.
- Update existing products.
- Delete products.
- View customer orders.
- Manage order statuses.
- Role-based access control.

### ⚡ General Features
- Responsive user interface.
- RESTful API integration.
- MongoDB database.
- Protected routes.
- Centralized API communication.
- Dynamic product listing.

## 🧑‍💻 Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend |
| JavaScript | Application logic |
| HTML5 | Structure |
| CSS3 | Styling |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | Database modeling |
| JWT | Authentication |
| Axios | API requests |
| React Router | Navigation |
| Vercel | Frontend deployment |

## 📂 Project Structure

```text
Northstar/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
└── server/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    ├── server.js
    └── package.json
```

*Adjust this structure to match your actual repository.*

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd Northstar
```

### 3. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any other environment variables required by your backend.

Start the backend:

```bash
npm run dev
```

### 4. Setup Frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## 🔐 Environment Variables

### Backend

| Variable | Description |
|---|---|
| PORT | Backend server port |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | JWT signing secret |

### Frontend

| Variable | Description |
|---|---|
| VITE_API_URL | Backend API base URL |

Never commit your `.env` files or expose private credentials.

## 🌐 Deployment

The frontend is deployed using **Vercel**.

**Live Website:**  
https://north-star-tawny-theta.vercel.app/

The backend can be deployed using platforms such as Render, Railway, or another Node.js hosting provider.

Update the frontend API environment variable with your deployed backend URL.

## 🔮 Future Improvements

- Payment gateway integration.
- Wishlist functionality.
- Product reviews and ratings.
- Advanced product filtering.
- Redis caching.
- Product image upload and optimization.
- Email notifications.
- Order tracking.
- Performance optimization.
- Automated testing.
- Docker-based deployment.

## 🎯 Project Objective

The objective of Northstar is to develop a practical full-stack e-commerce application while learning and implementing:

- Full-stack web development.
- REST API development.
- Authentication and authorization.
- Database design and management.
- Frontend and backend integration.
- Deployment and production workflows.

## 👨‍💻 Developer

**Jayesh Jangle**

- GitHub: [JayeshJangle23](https://github.com/JayeshJangle23)
- LinkedIn: [Jayesh Jangle](https://www.linkedin.com/in/jayesh-jangle/)
- Portfolio: [Personal Portfolio](https://jayeshjangle.vercel.app/)

---

<p align="center">
  ⭐ If you find this project useful, consider giving it a star!
</p>
