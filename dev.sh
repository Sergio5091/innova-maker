#!/bin/bash
# Script de démarrage INOVA Makers — lance frontend + backend en parallèle

echo "🚀 Démarrage INOVA Makers..."
echo ""

# Lance le backend dans un nouveau terminal Git Bash
cd "$(dirname "$0")/backend" && npm run dev &
BACKEND_PID=$!

# Lance le frontend dans un nouveau terminal Git Bash
cd "$(dirname "$0")/frontend" && npm run dev &
FRONTEND_PID=$!

echo "✅ Backend  → http://localhost:8000"
echo "✅ Frontend → http://localhost:3000"
echo ""
echo "Appuie sur Ctrl+C pour tout arrêter"

# Attend et arrête les deux si on quitte
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '⛔ Serveurs arrêtés'; exit 0" SIGINT SIGTERM

wait
