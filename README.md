# Yokesh Kumar M — Portfolio

Personal cybersecurity portfolio built with React, Tailwind CSS v4, and Framer Motion. Containerised with Docker and load-balanced via Nginx.

## Tech Stack

- **Frontend:** React 19, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Build:** Vite 7
- **Server:** Nginx (static + reverse proxy)
- **Container:** Docker multi-stage build
- **Load Balancing:** Nginx upstream (least_conn, 3 replicas)

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Docker

### Single container
```bash
docker build -t portfolio .
docker run -p 8080:80 portfolio
```

### Load-balanced (3 replicas + LB)
```bash
docker compose up --build -d
```

Access at `http://localhost`. Health checks:
- Load balancer: `GET /lb-health`
- App instances: `GET /health`

## Project Structure

```
├── src/
│   ├── components/      # Navbar, SkyBackground, LoadingScreen, Marquee
│   ├── sections/        # Hero, About, Education, Services, Certifications,
│   │                      Skills, Experience, Projects, Contact
│   ├── context/         # ThemeContext (dark/light)
│   ├── hooks/           # useScrollSpy
│   ├── data/            # portfolioData.js (all content)
│   ├── assets/          # Profile image
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/              # Static assets (logo, CV PDF)
├── Dockerfile           # Multi-stage build
├── docker-compose.yml   # 3 app replicas + load balancer
├── nginx.conf           # App server config
└── nginx-lb.conf        # Load balancer config
```
