# Kanban Board App

## Ziel

- Eine webbasierte Kanban-App mit folgenden Grundfunktionen:
- Boards mit mehreren Spalten: z. B. To Do, In Progress, Done
- Tasks/Karten in den Spalten (mit Titel + Beschreibung)
- Tasks erstellen, löschen, verschieben

---

## Technologien

| Schicht       | Technologie                                                              |
| ------------- | ------------------------------------------------------------------------ |
| **Frontend**  | React (alternativ HTML + Bootstrap)                                      |
| **Backend**   | Node.js + Express                                                        |
| **Datenbank** | MongoDB (NoSQL, flexibel für Tasks)                                      |
| **Container** | Docker + Docker Compose                                                  |
| **Extras**    | Logging mit Winston (optional), Drag & Drop (React DnD), Auth (optional) |

---

## Projektstruktur (nach Sprints)

### Sprint 1: Basisfunktionen (Backend + Datenbank + API)

**Ziele:**

- Express-App aufbauen
- MongoDB anbinden
- REST-API-Endpunkte:
    - `GET /boards` – Alle Boards anzeigen
    - `POST /boards` – Neues Board erstellen
    - `POST /boards/:id/tasks` – Task zum Board hinzufügen
    - `PUT /tasks/:id/move` – Task in andere Spalte verschieben
    - `DELETE /tasks/:id` – Task löschen
- Dockerfile + `docker-compose.yml` für Backend + DB


### Sprint 2: Frontend + Optimierung

**Ziele:**

- React-App mit:
    - Board-Übersicht
    - Drag & Drop mit react-beautiful-dnd oder react-dnd
- API-Anbindung (Axios)
- Verbesserung:
    - Logging
    - Fehlerbehandlung
    - Optional: Benutzerverwaltung (auth-light)
- Präsentationsvorbereitung (README, Slides)

---

## Container-Struktur (docker-compose.yml)

````
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongo
    environment:
      - MONGO_URL=mongodb://mongo:27017/kanban

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:

````
---

## Sprint 1 – Projektstruktur anlegen & Express-Backend starten (lokal)


### 1.1 Projektstruktur anlegen

Ich habe das Projektverzeichnis über PowerShell erstellt. Der Hauptordner heisst `kanban-board`, darin befindet sich der Unterordner `backend`, der den Quellcode für das Node.js-Backend enthält.

![backend Ordner](/Bilder/image_10.png)

---

## 1.2 Node.js-Projekt initialisieren

Im Ordner `backend` habe ich das Node.js-Projekt mit folgendem Befehl initialisiert:

```
npm init -y
```

Dabei wurde die Datei `package.json` automatisch erstellt. Sie enthält die grundlegenden Informationen über das Projekt und seine Abhängigkeiten.

![npm init -y](/Bilder/image_06.png)

---

## 1.3 Benötigte Pakete installieren

Mit dem folgenden Befehl habe ich alle benötigten Node.js-Pakete für das Backend installiert:

```
npm install express mongoose cors dotenv
```

Diese Bibliotheken werden für die folgenden Aufgaben genutzt:
- `express`: Webserver-Framework
- `mongoose`: Verbindung zur MongoDB-Datenbank
- `cors`: Freigabe von Cross-Origin-Requests (für das Frontend)
- `dotenv`: Laden von Umgebungsvariablen aus `.env`

![npm install express mongoose cors dotenv](/Bilder/image_07.png)

---

## 1.4 Backend-Server (`server.js`) erstellen

Ich habe die Datei `server.js` im Ordner `backend` erstellt. Diese Datei enthält den Grundaufbau meines Express-Webservers. Er stellt eine Test-Route zur Verfügung und versucht beim Start eine Verbindung zur MongoDB herzustellen.

### Inhalt von `server.js`:
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB verbinden
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/kanban')
  .then(() => console.log('MongoDB verbunden'))
  .catch(err => console.error('MongoDB Fehler:', err));

// Test-Route
app.get('/', (req, res) => {
  res.send('Kanban Backend läuft');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
```

![server.js](/Bilder/image_11.png)

---

## 1.5 Umgebungsvariablen (`.env`) anlegen

Ich habe im Ordner `backend` eine Datei mit dem Namen `.env` erstellt. Sie enthält die Verbindungsinformationen zur MongoDB:

```
MONGO_URL=mongodb://localhost:27017/kanban
```

Der Server lädt diese Variable automatisch beim Start und verwendet sie für den Datenbankzugriff.

![.env](/Bilder/image_09.png)



## 1.6 Dockerfile für das Backend erstellen


Ich habe im Ordner backend/ ein Dockerfile erstellt, das den Container für das Node.js-Backend definiert. Es basiert auf dem offiziellen Node.js-Image, kopiert alle Projektdateien, installiert Abhängigkeiten und startet den Server.

![alt text](/Bilder/image_12.png)


## 1.7 docker-compose.yml erstellen

Im Hauptverzeichnis des Projekts habe ich eine docker-compose.yml Datei erstellt. Diese definiert zwei Services:

- backend: Node.js-Anwendung, wird aus dem lokalen Dockerfile gebaut
- mongo: Offizieller MongoDB-Container mit Volume zur Datenspeicherung
Das Compose-Setup ermöglicht eine vollständig containerisierte Umgebung für Entwicklung und Test.

![alt text](/Bilder/image_13.png)


## 1.8 Container starten und testen

Ich habe im Hauptverzeichnis des Projekts den Befehl ausgeführt:

`````
docker-compose up --build`
`````
![docker-compose up --build](/Bilder/image_16.png)
![backend-erstellt](/Bilder/image_15.png)
![kanban läuft auf Docker](/Bilder/image_17.png)

Dabei wurden zwei Container gestartet:

- backend: aus meinem eigenen Dockerfile gebaut
- mongo: offizielle MongoDB aus Docker Hub

Nach dem Start wurde die Verbindung zur MongoDB in der Konsole mit „MongoDB verbunden“ bestätigt.
Anschliessend konnte ich die Anwendung über den Browser unter http://localhost:5000 aufrufen und erhielt erfolgreich die Nachricht:

```
Kanban Backend läuft`
```

![MongoDB verbunden](/Bilder/image_19.png)
![localhost:5000](/Bilder/image_18.png)

---
