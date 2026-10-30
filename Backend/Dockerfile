FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck and Chromium + fonts for Puppeteer PDF generation
RUN apk add --no-cache \
    curl \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy app source
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
