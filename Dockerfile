FROM node:20-alpine AS builder
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
COPY package*.json ./
# don't install dev dependencies for the docker image
RUN npm install --omit=dev

FROM node:20-alpine AS app
LABEL org.opencontainers.image.source https://github.com/c3pobot/webrender
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      font-terminus font-inconsolata font-dejavu font-noto font-noto-cjk font-awesome font-noto-extra \
      font-vollkorn font-misc-cyrillic font-mutt-misc font-screen-cyrillic font-winitzki-cyrillic font-cronyx-cyrillic \
      font-noto-thai font-noto-tibetan font-ipa font-sony-misc font-jis-misc \
      font-isas-misc \
      git
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
RUN mkdir -p /app/cache; mkdir -p /app/node_modules && chown -R node:node /app
RUN mkdir -p /app/public/asset; mkdir -p /app/public/css; mkdir -p /app/public/portrait; mkdir -p /app/public/thumbnail && chmod 777 -R /app/public
WORKDIR /app

COPY --from=builder node_modules node_modules/
COPY . .

RUN apk update && \
  # wrap process in --init in order to handle kernel signals
  # https://github.com/krallin/tini#using-tini
  apk add --no-cache tini && \
  rm -rf /var/cache/apk/*

USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "index.js" ]
