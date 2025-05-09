# Dev Collab

Dev Collab is a full-stack **pair programming and coding collaboration platform** designed for real-time mock technical interviews, learning, and team collaboration.

It offers ready-to-use problems, collaborative sessions, live chat, synced timers, code execution, note-taking, and more — all backed by a robust REST API backend.

---

## Features

### Ready-to-Use Problem Sets
- Select from a curated list of coding problems across different difficulty levels.
- Practice with others or solo.

### Create Custom Problem
- Define your own problem statement, inputs, and expected outputs.
- Share with collaborators instantly.

### Create & Join Collaborative Sessions
- Create custom sessions and invite others to join.
- All participants experience **real-time sync** (code, chat, timer, and notes).

### Real-Time Sync (via WebSockets)
- Code editor, language selection, chat, and timers are synced live across all users in a session.

### Chat Feature
- In-session live messaging with all participants.
- Perfect for interviews, walkthroughs, or pair programming.

### Choose Language
- Select from multiple programming languages (e.g., Python, JavaScriptfor code execution.
- Backed by the [Judge0 API](https://judge0.com/) for sandboxed code evaluation.

### Timer
- A synchronized session timer visible to all users.
- Useful for timed practice and interviews.

### Save & Run Code
- Run code directly in the editor with real-time output.
- Save session progress including code, language, and timestamp.

### Notes
- Collaborative note-taking pad.

---

## Tech Stack

### Frontend
- React (with Tailwind CSS)
- Socket.IO for real-time updates

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- RESTful APIs for session, problem, and user management
- Judge0 (API or self-hosted) for code execution

---

## Installation

### 1. Clone the Repo
```bash
git clone https://github.com/Mhamxed/devcollab
```

### 2. Install Dependencies
```bash
cd dev-collab
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Setup Environment Variables
```bash
PORT=8000
MONGO_URI=mongodb://localhost:27017/dev-collab
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_api_key_here
```

## Usage

### Start Backend:
```bash
cd backend
npm run dev
```

### Start Frontend:
```bash
cd frontend
npm run dev
```

## API Overview

## Contributing
1. Fork the project

2. Create your feature branch (git checkout -b feat/amazing-feature)

3. Commit your changes (git commit -m 'Add amazing feature')

4. Push to the branch (git push origin feat/amazing-feature)

5. Open a Pull Request

## License
MIT © 2025 Mhamxed

