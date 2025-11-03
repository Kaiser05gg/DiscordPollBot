FROM node:20-bookworm-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY requirements.txt .
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip \
  && pip install --no-cache-dir --break-system-packages -r requirements.txt \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm run build
RUN npm prune --omit=dev

EXPOSE 3000

CMD ["node", "dist/index.js"]
