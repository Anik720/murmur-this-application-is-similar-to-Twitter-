# Murmur Web Application

This project is a simple Twitter-like web application called **Murmur**, built using **NestJS**, **React**, and **MySQL**. It allows users to post, like, delete, and view murmurs (posts), follow other users, and see timelines.

---

## 📌 Tech Stack

- **Frontend:** React (TypeScript, Vite, TanStack Query)  
- **Backend:** NestJS (TypeScript, REST API)  
- **Database:** MySQL 8.x (Dockerized)

---

## ✅ Implemented Features

### Timeline
- Paginated list of Murmurs (10 per page)
- Display Murmur text and LIKE count
- LIKE / UNLIKE button functionality with instant feedback

### Murmur Detail
- Detailed view of a single Murmur
- Murmur text and LIKE count

### Own User Detail
- Display user info: name, follow count, followed count
- List of own murmurs
- Delete button for own murmurs

### Other User Detail
- View public profile of other users
- Display user info and list of their murmurs

---

## 📡 REST API Endpoints

### Murmurs
- `[GET] /api/murmurs?page=1` — Get paginated murmurs  
- `[GET] /api/murmurs/:id` — Get murmur detail  
- `[POST] /api/me/murmurs` — Post a new murmur  
- `[DELETE] /api/me/murmurs/:id` — Delete own murmur  
- `[POST] /api/murmurs/:id/like` — Like a murmur  
- `[POST] /api/murmurs/:id/unlike` — Unlike a murmur

### Users
- `[GET] /api/users/:id` — Get user profile   
- `[POST] /api/users/:id/follow` — Follow a user  
- `[POST] /api/users/:id/unfollow` — Unfollow a user  
- `[GET] /api/me` — Get logged-in user profile  

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js v20.x.x  
- npm and yarn  
- Docker + Docker Compose

---

### 1. Clone the Repository

```bash
git clone https://github.com/Anik720/murmur-this-application-is-similar-to-Twitter-.git

### 2. Start the Database
cd db
docker compose build
docker compose up -d

### 3. Start the Backend
cd server
npm install
npm run start:dev


### 4. Start the Frontend
cd ../src
yarn install
yarn dev


### 5. Verify the App
Visit http://localhost:3000 — If the HTML renders properly, your app is ready!