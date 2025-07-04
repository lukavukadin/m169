# Basis-Image von Node.js
FROM node:18

# Arbeitsverzeichnis im Container
WORKDIR /app

# package.json & package-lock.json kopieren und Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# Restliche Dateien kopieren
COPY . .

# Port freigeben
EXPOSE 5000

# Startbefehl
CMD ["node", "server.js"]