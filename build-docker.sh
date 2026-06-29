#!/bin/bash

set -e

# Configuration
REGISTRY="docker.io"
ACCOUNT="amintado"
PLATFORM="linux/amd64"

BACKEND_IMAGE="funnywait-back"
FRONTEND_IMAGE="funnywait-front"
VERSION="0.0.8"
echo "=== Docker Build and Push Script ==="
echo "Account: $ACCOUNT"
echo "Platform: $PLATFORM"
echo ""

# Build backend
echo "[1/4] Building backend image..."
docker buildx build \
  --platform $PLATFORM \
  --tag $REGISTRY/$ACCOUNT/$BACKEND_IMAGE:$VERSION \
  --file ./landing_backend/Dockerfile \
  --no-cache \
  --push \
  ./landing_backend

echo "[2/4] Backend image pushed: $REGISTRY/$ACCOUNT/$BACKEND_IMAGE:$VERSION"
echo ""

# Build frontend
echo "[3/4] Building frontend image..."
docker buildx build \
  --platform $PLATFORM \
  --tag $REGISTRY/$ACCOUNT/$FRONTEND_IMAGE:$VERSION \
  --file ./landing/Dockerfile \
  --no-cache \
  --push \
  ./landing

echo "[4/4] Frontend image pushed: $REGISTRY/$ACCOUNT/$FRONTEND_IMAGE:$VERSION"
echo ""

echo "=== Build and Push Complete ==="
echo "Backend: $REGISTRY/$ACCOUNT/$BACKEND_IMAGE:$VERSION"
echo "Frontend: $REGISTRY/$ACCOUNT/$FRONTEND_IMAGE:$VERSION"
echo ""
echo "Verify with:"
echo "  docker pull $REGISTRY/$ACCOUNT/$BACKEND_IMAGE:$VERSION"
echo "  docker pull $REGISTRY/$ACCOUNT/$FRONTEND_IMAGE:$VERSION"
