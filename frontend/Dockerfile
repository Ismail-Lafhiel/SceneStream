FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_APP_BACKEND_URL
ENV VITE_APP_BACKEND_URL=${VITE_APP_BACKEND_URL}

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]