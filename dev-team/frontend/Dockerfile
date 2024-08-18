# Build Stage
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .  
# Copy the entire project directory
RUN npm run build

# Serve Stage
FROM node:18 AS serve

WORKDIR /app
COPY --from=build /app/build /app/build
RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "443"]
EXPOSE 443