# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

COPY . .

RUN npm config set strict-ssl false
RUN npm install --legacy-peer-deps
#RUN npm run db:generate
#RUN npx prisma generate
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN node node_modules/prisma/build/index.js generate
#RUN ./node_modules/.bin/prisma generate
RUN npm run build

# Stage 2: Runner
FROM node:20-slim AS runner

RUN echo 'Acquire::https::Verify-Peer "false";' > /etc/apt/apt.conf.d/99no-verify \
    && apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Copy all node_modules (includes prisma CLI) and prisma schema
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/pages ./pages

EXPOSE 9000

CMD ["npm", "run", "start"]
