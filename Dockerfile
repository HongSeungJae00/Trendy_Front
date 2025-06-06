# Dockerfile for Trendy_Front
FROM node:22 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:22
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]