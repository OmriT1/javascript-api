FROM ghcr.io/puppeteer/puppeteer:23.1.1

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Change ownership of the working directory to the current user
RUN chown -R pptruser:pptruser /usr/src/app

# Switch to non-root user (pptruser is default user in puppeteer image)
USER pptruser

# Install npm locally (within the project), avoiding global installation
RUN npm install npm@latest

# Use npm ci to install dependencies from package-lock.json
RUN npm ci

# Copy the rest of the application files
COPY . .

# Ensure the app files also have the right ownership
RUN chown -R pptruser:pptruser /usr/src/app

# Command to run the app
CMD [ "node", "index.js" ]
