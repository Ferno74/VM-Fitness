# 🏋️ VM Fitness

> A full-stack, production-ready gym management web application built for **VM Fitness**, Village Rajol, District Kangra, Himachal Pradesh.

**Live Demo:** [htts:/vmfitness.in](https://vmfitness.in)  
**GitHub:** [https://github.com/Ferno74/VM-Fitness](https://github.com/Ferno74/VM-Fitness)

---

## ✨ Overview

VM Fitness is a premium, cinematic gym web application that combines real-world gym management with cutting-edge technology. Members can browse membership plans, subscribe via Razorpay, consult an AI personal trainer powered by Google Gemini, and scan physical QR codes on gym equipment to access tutorial videos — all from a single, beautiful web platform.


---

## 🚀 Features

### 👤 Member Experience
- **Cinematic Homepage** — Scrollytelling hero with Framer Motion animations
- **Authentication** — JWT-based login & registration with secure bcrypt password hashing
- **Membership Plans** — Three pricing tiers with full Razorpay payment gateway integration
- **Member Dashboard** — Live subscription status, expiry date, and quick-access widgets
- **AI Trainer** — Real-time chat with Google Gemini 3.6 Flash for personalized workout & nutrition advice
- **Smart Equipment Directory** — Browse all gym machines with muscle group info and YouTube tutorials
- **QR Code Scanning** — Scan physical QR tags on gym machines to instantly access tutorials

### 🛡️ Admin Control Room
- **Fleet Management** — View and manage all registered gym equipment
- **Register New Machines** — Add equipment with category, target muscles, and YouTube link
- **QR Code Generator** — Generate and download printable PNG QR tags for each machine
- **Role-Based Access** — Admin-only routes protected on both frontend and backend

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** + **Vite** | UI framework and lightning-fast build tool |
| **Tailwind CSS v4** | Utility-first styling with custom design tokens |
| **Framer Motion** | Scroll-driven animations and page transitions |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client with JWT interceptor |
| **Lucide React** | Icon library |
| **React Hot Toast** | Non-intrusive notification system |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** + **Express** | REST API server |
| **MongoDB** + **Mongoose** | Database and ODM |
| **JWT** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Razorpay SDK** | Payment order creation and HMAC signature verification |
| **Google Generative AI SDK** | Gemini 3.6 Flash integration for AI trainer |
| **QRCode** | Server-side QR code generation |
| **PM2** | Process management for production |
| **Nginx** | Reverse proxy and static file serving |

### Infrastructure
- **AWS EC2** — `t3.micro` Ubuntu 26.04 LTS
- **MongoDB Atlas** — Cloud database cluster
- **Nginx** — Reverse proxy routing `/api` → Node.js, `/` → React build

---

## 🏗️ Architecture

```
User Browser
     │
     ▼
  Nginx :80
     │
     ├── /api/*  ──────►  Node.js :3000 (PM2)  ──►  MongoDB Atlas
     │
     └── /*  ──────────►  React Production Build (dist/)
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 20+
- MongoDB (local) or MongoDB Atlas URI
- Razorpay test account
- Google Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/Ferno74/VM-Fitness.git
cd VM-Fitness
```

### 2. Set up the backend
```bash
cd backend
cp .env.example .env
# Fill in your real values in .env
npm install
npm run dev
```

### 3. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:3000`

---

## 🔐 Environment Variables

Create `backend/.env` using `backend/.env.example` as a template:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_strong_random_secret
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 📁 Project Structure

```
VM-Fitness/
├── backend/
│   ├── middleware/       # JWT auth, admin guard
│   ├── models/           # Mongoose schemas (User, Payment, Equipment, AIRequest)
│   ├── routes/           # Express routes (auth, payment, equipment, ai, contact)
│   ├── .env.example      # Environment variable template
│   └── server.js         # Express app entry point
│
└── frontend/
    └── src/
        ├── api/          # Axios instance with JWT interceptor
        ├── context/      # AuthContext (global user state)
        ├── pages/        # Home, Login, Register, Plans, Dashboard,
        │                 # AITrainer, EquipmentDirectory, EquipmentDetail,
        │                 # AdminPortal
        └── App.jsx       # Routes + Navbar
```

---

## 🚀 Production Deployment (AWS EC2)

1. SSH into your server: `ssh -i key.pem ubuntu@YOUR_IP`
2. Clone the repo and create `.env` manually on the server
3. Install backend deps: `npm install --omit=dev`
4. Build frontend: `cd frontend && npm run build`
5. Start backend: `pm2 start server.js --name vmfitness`
6. Configure Nginx as reverse proxy
7. Run Certbot for free HTTPS: `sudo certbot --nginx -d yourdomain.com`

---

## 🗺️ Roadmap

- [ ] Add HTTPS with Certbot SSL certificate
- [ ] Custom domain (`vmfitness.in`)
- [ ] Restrict AI Trainer to paid members only
- [ ] Contact Us page wired to Nodemailer
- [ ] Session tracking and workout logging
- [ ] Admin analytics dashboard (revenue, signups)
- [ ] PWA (Progressive Web App) for mobile install

---

## 👨‍💻 Developer

**Divyansh** — [@Ferno74](https://github.com/Ferno74)  
Built with ❤️ for VM Fitness, Rajol, Kangra, Himachal Pradesh 176208

---

## 📄 License

This project is private and proprietary. All rights reserved.
