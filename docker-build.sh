#!/bin/bash

# Modern Docker buildx build script for Sharp Ireland

set -e

IMAGE_NAME="ceotind/sharpireland:latest"

echo "Building Docker image with buildx: ${IMAGE_NAME}"

# Use modern Docker buildx
docker buildx build --no-cache --load -t "${IMAGE_NAME}" .

echo "Build complete!"
echo "To run: docker run -p 3000:3000 ${IMAGE_NAME}"