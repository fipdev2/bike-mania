# Stage 1: Build the React application
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# --- ADICIONE ESSA LINHA PARA DEBUGAR ---
RUN ls -laR
# ----------------------------------------

RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:1.21.0-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]