MUSH Backend for unimportant.art

Minimal single-user MUSH server built with Node.js and WebSocket.

World features:
- 6 interconnected rooms
- Examinable objects in each room
- Basic commands: look, go, examine, say, inventory, help

Local Development:

npm install
npm start

Server runs on PORT 3000 (or env variable PORT). Visit http://localhost:3000 and ensure the client (quest.html) is served alongside the server.

Deployment Options:

Option A: Replit
1. Create new Replit project, import this folder
2. Replit detects Node.js, sets up automatically
3. Click Run; Replit provides public URL
4. Update client (quest.html) WebSocket URL if needed

Option B: Render (Free Tier)
1. Push code to GitHub
2. Create new Web Service on render.com
3. Link GitHub repo, set runtime Node
4. Deploy; Render provides public URL

Option C: Railway (Free Tier)
1. Push code to GitHub
2. Create new project on railway.app, link repo
3. Deploy; Railway auto-detects and runs npm start
4. Provides public domain

Static Site Integration:

Copy quest.html to the static site root (unimportant-art/).
Update quest.html WebSocket URL to point to your MUSH server:
  - Local: ws://localhost:3000
  - Remote: wss://your-mush-server-url

Or use environment variables to switch between local/production.

Expanding to Multi-User:

Current code supports multiple concurrent connections. To add:
- Room state persistence (file or database)
- Player-to-player communication (broadcast to room)
- Account system
- Object persistence
- Simple scripting for NPCs

Server works as-is for single concurrent user. Each connection gets one Player instance.
