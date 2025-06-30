#!/bin/bash

# Build script for Sharp Ireland Docker image
# Usage: ./build-docker.sh

set -e  # Exit on any error

# Configuration
IMAGE_NAME="ceotind/sharpireland"
TAG="latest"
FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"

echo "🚀 Building Sharp Ireland Docker image..."
echo "Image: ${FULL_IMAGE_NAME}"
echo "----------------------------------------"

# Validate Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running or not accessible"
    exit 1
fi

# Build with retry logic
build_with_retry() {
    local attempt=1
    local max_attempts=3
    
    while [ $attempt -le $max_attempts ]; do
        echo "📦 Attempt $attempt: Building Docker image..."
        
        if docker build -t "${FULL_IMAGE_NAME}" .; then
            echo "✅ Docker image built successfully: ${FULL_IMAGE_NAME}"
            return 0
        else
            echo "⚠️  Build attempt $attempt failed"
            ((attempt++))
            if [ $attempt -le $max_attempts ]; then
                echo "🔄 Retrying in 10 seconds..."
                sleep 10
            fi
        fi
    done
    
    echo "❌ Docker build failed after $max_attempts attempts"
    exit 1
}

# Build the Docker image with retries
build_with_retry

# Test the image locally
echo "🧪 Testing image locally..."
CONTAINER_ID=$(docker run -d -p 3001:3000 --name sharpireland-test -v /home/dilshad/configs/.env.local:/app/.env.local:ro "${FULL_IMAGE_NAME}")

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 10

# Test health endpoint
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed - application is responding"
else
    echo "⚠️  Health check failed - application may not be responding correctly"
    echo "📝 Displaying container logs:"
    docker logs "${CONTAINER_ID}"
    echo "🔍 Inspecting environment variables:"
    docker exec "${CONTAINER_ID}" printenv
    exit 1
fi

# Cleanup test container
docker stop "${CONTAINER_ID}" > /dev/null 2>&1
docker rm "${CONTAINER_ID}" > /dev/null 2>&1

# Push to Docker Hub
echo "📤 Pushing to Docker Hub..."
docker push "${FULL_IMAGE_NAME}"

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed ${FULL_IMAGE_NAME} to Docker Hub"
    echo ""
    echo "🎉 Build and push completed successfully!"
    echo ""
    echo "To run on remote server:"
    echo "docker run -d -p 3000:3000 -v /home/dilshad/configs/.env.local:/app/.env.local:ro --name sharpireland ${FULL_IMAGE_NAME}"
else
    echo "❌ Failed to push to Docker Hub"
    exit 1
fi

# Alternative build method using BuildKit
echo ""
echo "💡 Alternative: For faster builds, use BuildKit directly:"
echo "DOCKER_BUILDKIT=1 docker build -t ${FULL_IMAGE_NAME} ."