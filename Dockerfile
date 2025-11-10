FROM python:3.11-slim AS pydeps
WORKDIR /usr/src/app

COPY src/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt \
  && apt-get update \
  && apt-get install -y fonts-noto-cjk \
  && rm -rf /var/lib/apt/lists/*

  FROM node:20-bookworm-slim AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=pydeps /usr/local /usr/local
COPY --from=pydeps /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu

ENV LD_LIBRARY_PATH="/usr/local/lib:/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH}"
ENV PYTHONPATH="/usr/local/lib/python3.11/site-packages"

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/analytics ./src/analytics

EXPOSE 3000

CMD ["node", "dist/index.js"]