# ====== 1️⃣ Node.js ビルドステージ ======
FROM node:20-bookworm-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ====== 2️⃣ Python 依存ステージ ======
FROM python:3.11-slim AS pydeps

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


FROM node:20-bookworm-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

COPY --from=pydeps /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=pydeps /usr/local/bin/python3 /usr/local/bin/python3
COPY --from=pydeps /usr/local/bin/pip /usr/local/bin/pip

RUN ln -sf /usr/local/bin/python3 /usr/bin/python3

ENV PYTHONPATH="/usr/local/lib/python3.11/site-packages"

EXPOSE 3000
ENV PATH="/usr/local/bin:$PATH"
ENV PYTHONPATH="/usr/local/lib/python3.11/site-packages"
CMD ["node", "dist/index.js"]
