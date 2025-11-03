FROM node:20-bookworm-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY requirements.txt .
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip \
  && pip install --no-cache-dir -r requirements.txt \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]