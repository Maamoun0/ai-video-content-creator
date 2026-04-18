# Use official Node.js image
FROM node:20-slim

# Install system dependencies (FFmpeg + Python/Whisper requirements)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install OpenAI Whisper
RUN pip3 install -U openai-whisper

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build || echo "Skip build if using ts-node"

# Expose port
EXPOSE 8080

# Environment variables (to be set in Cloud Run)
ENV PORT=8080
ENV NODE_ENV=production

# Start the application
CMD [ "node", "dist/index.js" ]
