# TypoVelocity — Competitive Typing Speed Test Platform

TypoVelocity is a high-performance, premium web application designed to test, track, and improve typing speed and accuracy. It features a gorgeous glassmorphic interface, dynamic animations, precise character-by-character typing highlighting, XP/Level progression systems, and persistent typing history scores synced with a secure PostgreSQL database.

---

## 🚀 Key Features

- **High-Fidelity Typing Engine**: Live character-by-character validation with visual highlighting (emerald for correct keys, red with underline for errors).
- **Smooth Dynamic Caret**: An elegant vertical caret indicator marking your current place, complete with smooth breathing animations.
- **Accurate Real-Time Metrics**: Live calculation of Speed (Net/Raw Words Per Minute), Accuracy percentage, elapsed time, and total typos.
- **Duration Configurations**: Customizable typing sessions (15s, 30s, and 60s) to tailor your speed drill intensity.
- **Gamified Leveling System**: Earn Experience Points (XP) on every successful test based on speed and accuracy. Accumulate XP to automatically level up!
- **Sleek Performance History**: Beautiful, structured performance table compiling your last 10 speed tests (duration, net WPM, accuracy, errors, and dates).
- **Secure Authentication**: Express cookie-based JWT sessions with automated redirection checks to avoid layout shifts.
- **Fully Responsive Design**: Tailored layout supporting seamless, high-performance interactions on desktop, tablet, and mobile screens.

---

## 🛠️ Technology Stack

### Frontend (React Client)
- **Core**: React 19, Vite, ES Modules
- **State Management**: Zustand (Auth Store & Score Store)
- **Styling**: Tailwind CSS v4, Glassmorphism, CSS Custom Properties
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios (Global `withCredentials` enabled for secure sessions)

### Backend (Node Server)
- **Core**: Express v5, CommonJS
- **Database ORM**: Prisma v7
- **Database Driver Adapter**: `@prisma/adapter-pg` & `pg` (PostgreSQL client pool)
- **Session Security**: JSON Web Token (JWT) in HTTP-only, secure, `sameSite` cookies
- **Middleware**: CORS (with credentials & custom allowed origins), Helmet (security headers), Compression, Cookie Parser
- **Real-Time Gateway**: Socket.IO (ready for multiplayer lobbies)

---

## 📂 Project Structure

```
├── client/                     # React Single Page Application (SPA)
│   ├── src/
│   │   ├── components/         # Premium UI Components (TypingDisplay, StatsPanel, ResultModal, HistoryPanel)
│   │   ├── hooks/              # Custom React Hooks (useTypingTest typing engine)
│   │   ├── pages/              # Routing Pages (Home, Login, Register)
│   │   ├── store/              # Zustand Stores (useAuthStore, useScoreStore)
│   │   ├── App.jsx             # Main routing and auth initialization
│   │   ├── index.css           # Global style declarations & Tailwind v4 theme
│   │   └── main.jsx            # React root mount
│   ├── postcss.config.js       # PostCSS config with @tailwindcss/postcss
│   └── package.json            # Frontend script configuration
│
├── server/                     # Express REST API & WebSockets Gateway
│   ├── prisma/
│   │   └── schema.prisma       # Prisma database models (User, TypingResult, Race, Achievements)
│   ├── src/
│   │   ├── controllers/        # Express Route Handlers (auth, score controllers)
│   │   ├── middleware/         # Security & Protect Route validation
│   │   ├── routes/             # API Router definitions
│   │   ├── sockets/            # WebSockets Event Handlers
│   │   └── utils/              # Helper utilities (generateToken, shared prisma client)
│   ├── index.js                # HTTP Server & Socket.IO initialization
│   └── package.json            # Server script configuration
```

---

## ⚙️ How to Run Locally

### 1. Database Setup
Make sure you have a local PostgreSQL database running, or spin up the provided `docker-compose.yml` service:
```bash
docker-compose up -d
```

Configure your `DATABASE_URL` in `server/.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/typing_speed?schema=public"
```

### 2. Run the Express Backend
Navigate to the server directory, install dependencies, and start the development server:
```bash
cd server
npm install
npx prisma db push       # Sync database schema models
npm run dev              # Starts Express API on port 5000
```

### 3. Run the React Client
Navigate to the client directory, install dependencies, and start the Vite dev server:
```bash
cd ../client
npm install
npm run dev              # Starts React SPA on port 5173
```
Open `http://localhost:5173` in your browser to experience TypoVelocity!

---

## 🔒 Security Practices
- **Cookies**: Session JWTs are placed inside `httpOnly: true` cookies to block XSS vector attacks.
- **CORS Policies**: Explicit origin and allowed credential rules to ensure other websites cannot perform CSRF requests.
- **Database Safety**: Raw password credentials are hashed via `bcrypt` with a work salt factor of 10 prior to DB writes.

---

## 🧪 Running QA End-to-End Tests

We have integrated a comprehensive end-to-end testing suite using **Playwright** to assert the functionality of the core typing engine and authentication flows (login, registration, error alerts, levels, WPM calculation, and logout).

### Prerequisite
Ensure client and server dependencies are installed.

### Run Tests in Headless Mode
To run all tests inside headless Chromium:
```bash
cd client
npm run test:e2e
```

### Run Tests with Interactive UI
To open the interactive Playwright Test runner UI:
```bash
cd client
npm run test:e2e:ui
```

