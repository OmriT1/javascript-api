FROM ghcr.io/puppeteer/puppeteer:23.1.1

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Use npm ci to install dependencies from package-lock.json without needing to install npm again
RUN npm ci

# Copy the rest of the application files
COPY . .

# Command to run the app
CMD [ "node", "index.js" ]
