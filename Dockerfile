FROM ghcr.io/puppeteer/puppeteer:23.1.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Copy files and set permissions
COPY package*.json ./
RUN chown -R pptruser:pptruser /usr/src/app

USER pptruser  # Switch to non-root user

RUN npm install  # Install dependencies
RUN npm install axios

COPY . .
CMD [ "node", "index.js" ]
