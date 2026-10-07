# 🗳️ VotePOP — Squad Decision Engine

> **No more 50-message group chat debates.** A high-contrast, Neo-Brutalist real-time voting and decision app tailored for pickleball sessions, cricket matches, turf slots, dinner runs, and friend hangouts.

![VotePOP](https://img.shields.io/badge/Aesthetic-Neo--Brutalist-FFE600?style=for-the-badge&logoColor=black)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Upstash Redis](https://img.shields.io/badge/Database-Upstash_Redis-00E5FF?style=for-the-badge&logo=redis)

---

## ✨ Features

- **🎨 Neo-Brutalist Pop Aesthetic**: High-contrast pitch-black outlines (`border-[2.5px] border-black`), offset hard drop-shadows, white theme, floating Memphis geometric shapes, and vibrant solid pop colors (Electric Lime, Canary Yellow, Hot Coral, Cyber Cyan, Bubblegum Pink).
- **🚫 Zero OS Emojis (Cross-Platform Consistency)**: Built entirely with crisp, custom vector SVGs so avatars and icons look identical across iOS, Android, and Desktop browsers.
- **👤 Squad ID & Custom Avatars**:
  - Simple registration and login with unique username handles.
  - Choose between custom initials or round sport & pop SVG icons (*Cricket Bat, Cricket Ball, Football, Pickleball, Tennis, Fire, Bolt, Crown*) with custom color badges.
- **📋 Generalized Polls with Organizer Notes**:
  - Custom freeform categories (Cricket, Pickleball, Turf, Food, Movies, etc. — no restrictive presets).
  - Organizer notes & rules (fees, racket/gear requirements, venue details, time).
  - Dynamic option rows with vibrant color tags.
- **💡 Custom Options by Voters**: Friends can type their own suggestions and immediately cast a vote for them.
- **📱 Instant QR Code & Link Sharing**: Pure TypeScript zero-dependency QR code generator creates a high-contrast SVG QR card for in-person phone scanning, plus 1-tap link copying and native Web Share integration.
- **⚡ Haptic Micro-Interactions & Confetti**: Tactile button presses, vibration feedback on mobile (`navigator.vibrate`), and celebratory confetti particle explosions.
- **👑 Live Results & Official Verdict**: Live progress bars and voter attribution chips showing who voted for what, plus an exclusive creator control to lock the poll and declare the official decision.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/RahilMaiyani/VotePOP.git
cd VotePOP
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
UPSTASH_REDIS_REST_URL="your-upstash-redis-rest-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-rest-token"
```
*(If Redis is not configured, VotePOP gracefully falls back to memory/local storage).*

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `3001`) with your browser.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + Vanilla Neo-Brutalist CSS tokens
- **Persistence**: Upstash Redis (REST)
- **QR Engine**: Built-in Pure TypeScript SVG QR Generator
- **Icons**: Custom High-Contrast SVG Vector System
- **Effects**: Custom Canvas Pop Confetti & Web Vibration API

---

## 📄 License
MIT © [Rahil Maiyani](https://github.com/RahilMaiyani)