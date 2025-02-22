#!/bin/bash

# Setup environments
echo "Setting up environments..."

# Backend setup
echo "Setting up backend environment..."
cd backend || exit 1

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv || { echo "Failed to create virtual environment"; exit 1; }
fi

# Ensure we're using the venv python
source venv/bin/activate || { echo "Failed to activate virtual environment"; exit 1; }
which python3 || { echo "Failed to locate python in venv"; exit 1; }

if [ -f "requirements.txt" ]; then
    echo "Installing backend requirements..."
    ./venv/bin/pip install -r requirements.txt || { echo "Failed to install requirements"; exit 1; }
fi

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    echo "Creating .env from example..."
    cp .env.example .env || { echo "Failed to create .env file"; exit 1; }
fi

cd .. || exit 1

# Frontend setup
echo "Setting up frontend environment..."
cd frontend || exit 1
if [ -f "package.json" ]; then
    echo "Installing frontend dependencies..."
    npm install || { echo "Failed to install frontend dependencies"; exit 1; }
fi
cd .. || exit 1

# Start services in the background
echo "Starting Weaviate..."
docker-compose up -d

echo "Starting backend server..."
cd backend || exit 1
source venv/bin/activate
./venv/bin/python -m uvicorn app.main:app --reload &
BACKEND_PID=$!

echo "Starting frontend dev server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Handle cleanup on script termination
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    docker-compose down
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait
