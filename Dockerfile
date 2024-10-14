FROM ghcr.io/puppeteer/puppeteer:23.1.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install  # Replace npm ci with npm install
COPY . .
CMD [ "node", "index.js" ]
