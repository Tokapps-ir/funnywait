#!/usr/bin/env bash
# landing-dev.sh — start both frontend (port 3000) and Strapi backend (port 1337)
pkill node
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/landing"
BACKEND_DIR="$SCRIPT_DIR/landing_backend"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

# Function to check if .env file exists in directory
check_env_file() {
  local dir="$1"
  local project_name="$2"
  if [[ ! -f "$dir/.env" ]]; then
    echo -e "${YELLOW}Warning: .env file not found in $project_name directory ($dir)${RESET}"
    echo -e "${YELLOW}Make sure to create one based on .env.example${RESET}"
    sleep 2
  fi
}

cleanup() {
  echo -e "\n${YELLOW}Shutting down...${RESET}"
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
  wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
  echo -e "${YELLOW}Done.${RESET}"
  exit 0
}

trap cleanup SIGINT SIGTERM

echo -e "${CYAN}=== FunnyWait Dev Environment ===${RESET}"
echo -e "  Frontend  → ${GREEN}http://localhost:3000${RESET}"
echo -e "  Backend   → ${GREEN}http://localhost:1337${RESET}"
echo -e "  Admin     → ${GREEN}http://localhost:1337/admin${RESET}"
echo ""
echo -e "${YELLOW}Checking environment files...${RESET}"

# Check for .env files in both directories
check_env_file "$FRONTEND_DIR" "Frontend"
check_env_file "$BACKEND_DIR" "Backend"

echo -e "${GREEN}Starting services...${RESET}"

# Start Strapi backend
echo -e "${YELLOW}Starting Strapi backend...${RESET}"
(
  cd "$BACKEND_DIR"
  export $(grep -v '^#' .env | xargs)  # Load backend .env variables
  npm i
  npm rebuild
  npm run develop

) &
BACKEND_PID=$!

# Give Strapi a moment to boot before starting frontend
sleep 3

# Start Vite frontend
echo -e "${YELLOW}Starting Vite frontend...${RESET}"
(
  cd "$FRONTEND_DIR"
  export $(grep -v '^#' .env | xargs)  # Load frontend .env variables
  npm i
  npm rebuild
  npm run dev
) &
FRONTEND_PID=$!

echo -e "${GREEN}Both services running. Press Ctrl+C to stop.${RESET}"

# Wait for both
wait "$BACKEND_PID" "$FRONTEND_PID"
