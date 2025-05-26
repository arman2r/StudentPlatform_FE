# Etapa 1: Build del proyecto Angular
FROM node:22.15.0-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./
COPY . .

# Instalar dependencias
RUN npm install

# Compilar la aplicación Angular en modo producción
RUN npm run build:prod

# Etapa 2: Servir la app con Nginx
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa anterior
COPY --from=builder /app/dist/student-platform/browser /usr/share/nginx/html

# Reemplazar configuración por defecto de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
