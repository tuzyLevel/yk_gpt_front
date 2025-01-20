# --- Build Stage ---
FROM node:22-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Copy .env.local if it exists, rename to .env
RUN if [ -f .env.build ]; then cp .env.build .env; fi
# 빌드 시 환경변수 사용 권장

# Build the application
RUN npm run build

# --- Production Stage ---
FROM node:22-alpine AS production

WORKDIR /app

# Copy package.json for only prod dependencies
COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]