FROM node:20-bookworm-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.11-slim AS pydeps
WORKDIR /usr/src/app
COPY src/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y fonts-noto-cjk && rm -rf /var/lib/apt/lists/*

FROM node:20-bookworm-slim
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=pydeps /usr/local/bin/python3 /usr/local/bin/python3
COPY --from=pydeps /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=pydeps /usr/local/lib/libpython3.11.so.1.0 /usr/local/lib/libpython3.11.so.1.0
COPY --from=pydeps /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu

ENV LD_LIBRARY_PATH="/usr/local/lib:/usr/local/lib/python3.11:/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH}"
ENV PYTHONPATH="/usr/local/lib/python3.11/site-packages"

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/analytics ./analytics

EXPOSE 3000
CMD ["node", "dist/index.js"]
