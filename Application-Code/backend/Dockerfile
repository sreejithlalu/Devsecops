FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV PORT=5000
EXPOSE 5000
CMD ["npm", "start"]

