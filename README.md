# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# 📚 SocialBooks

SocialBooks is a full-stack social media application designed for book lovers. Users can create accounts, share book-related posts, follow other users, comment, like posts, receive notifications, and customize their profiles.

## 🚀 Live Demo

Frontend:
https://social-books.vercel.app

Backend API:
https://socialbooks-ildm.onrender.com

---

# ✨ Features

- User Registration & Login (JWT Authentication)
- User Profiles
- Follow / Unfollow Users
- Create, Edit and Delete Posts
- Like Posts
- Comment System
- Notifications
- Search Users
- Search Posts
- Privacy Settings
- Notification Settings
- Theme Selection
- Language Selection (English / Turkish)
- Profile Photo Upload
- Responsive Design

---

# 🛠 Technologies

## Frontend

- React
- Vite
- React Router
- Axios
- TailwindCSS
- DaisyUI
- React Hot Toast
- Lucide React
- i18next

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Upstash Redis (Rate Limiting)
- bcrypt

---

# 📂 Project Structure

```
SocialBooks
│
├── Backend
│   ├── src
│   ├── uploads
│   └── package.json
│
└── Frontend
    └── frontend
        ├── src
        ├── public
        └── package.json
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/silanbaskan9820/SocialBooks.git
```

Go to the project

```bash
cd SocialBooks
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend/frontend
npm install
npm run dev
```

---

# 🔑 Environment Variables

Backend requires a `.env` file.

```env
MONGO_URI=

JWT_SECRET=

UPSTASH_REDIS_REST_URL=

UPSTASH_REDIS_REST_TOKEN=
```

---

# 🌍 Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

---

# 📌 Future Improvements

- Real-time chat
- Real-time notifications
- Email verification
- Password reset
- Image optimization
- Admin panel
- Book recommendation system

---

# 👩‍💻 Author

Şilan Başkan

GitHub

https://github.com/silanbaskan9820
