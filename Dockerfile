FROM ghcr.io/puppeteer/puppeteer:23.1.1

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set working directory
WORKDIR /usr/src/app

# Copy package files and update npm
COPY package*.json ./

# Update npm to latest version to support lockfileVersion 3
RUN npm install -g npm@latest

# Install dependencies using npm ci
RUN npm ci

# Copy the rest of the application files
COPY . .

# Command to run the app
CMD [ "node", "index.js" ]
