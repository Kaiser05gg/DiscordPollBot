FROM node:20-bullseye
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY requirements.txt .
RUN apt-get update && apt-get install -y python3 python3-pip \
    && pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 3000
RUN npm run build
CMD ["node", "dist/index.js"]
