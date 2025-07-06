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
:
    - Board-Übers
- React-App miticht
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
docker-compose up --build
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
Kanban Backend läuft
```

![MongoDB verbunden](/Bilder/image_19.png)
![localhost:5000](/Bilder/image_18.png)

---

## Sprint 2 – Mongoose Task-Modell erstellen

### 2.1 Datenmodell (Task.js) erstellen

Im Backend habe ich im Verzeichnis models/ eine Datei Task.js erstellt. Dort wird mithilfe von Mongoose ein Schema definiert, das die Struktur eines Tasks beschreibt:

- `title`: Titel der Aufgabe (Pflichtfeld)
- `description`: Beschreibung (optional)
- `status`: aktuelle Spalte im Kanban-Board (todo, inprogress, done)
- `createdAt`: Erstellungsdatum

Dieses Schema wird zur Erstellung, Speicherung und Abfrage der Aufgaben in der MongoDB verwendet.

![models/Task.js](/Bilder/image_20.png)

### 2.2 REST API für Task-Management erstellen

Ich habe im Verzeichnis `routes/` die Datei `tasks.js` erstellt. Sie enthält die CRUD-Endpunkte zur Verwaltung der Kanban-Aufgaben:

- `GET /api/tasks`: Alle Tasks abrufen
- `POST /api/tasks`: Neuen Task erstellen
- `DELETE /api/tasks/:id`: Task löschen
- `PUT /api/tasks/:id/move`: Task in eine andere Spalte verschieben

Die API verwendet das vorher definierte Mongoose-Modell `Task`. In der Datei `server.js` habe ich die Routen mit folgendem Befehl eingebunden:

```js
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);
```

![routes/task.js](/Bilder/image_21.png)
![anpassung-server.js](/Bilder/image_22.png)

Nach der Erweiterung des Backends um das Datenmodell und die API-Routen habe ich die laufende Docker-Umgebung mit Strg + C gestoppt und anschliessend mit docker-compose up --build neu gestartet. Damit wurde das Backend neu gebaut und die Änderungen aktiv.

#### Fehler beim Start

Beim ersten Versuch trat folgender Fehler auf:

```
Error: Cannot find module '../models/Task'
Require stack:
- /app/routes/tasks.js
- /app/server.js
```

---

#### Analyse & Ursache

Die Datei `task.js` war zwar vorhanden, aber:

- Import in `tasks.js` war: `require('../models/Task')`
- Tatsächlicher Dateiname: `task.js` (klein)

![alt text](/Bilder/image_24.png)

---

#### Lösung

Der Import wurde angepasst:

```diff
- const Task = require('../models/Task');
+ const Task = require('../models/task');
```

Anschliessend wurde der Container neu gestartet und es hat funktioniert:

```bash
docker-compose up --build
```

![](/Bilder/image_25.png)
![](/Bilder/image_26.png)


---

### 2.2: Task-Endpunkte testen mit Thunder Client

####  Ziel
Die in Sprint 2.1 implementierten API-Endpunkte sollen mit **Thunder Client** getestet werden, um sicherzustellen, dass sie korrekt funktionieren.

---

#### Thunder Client installieren

Thunder Client ist ein REST-Client, der direkt als Erweiterung in **Visual Studio Code** genutzt werden kann.

**Installation:**
- VS Code öffnen
- In der Seitenleiste auf "Extensions" (Erweiterungen) klicken
- Nach `Thunder Client` suchen und installieren

![ThunderClient](/Bilder/image_28.png)

---

#### GET – Alle Tasks abrufen

**Anfrage:**
GET http://localhost:5000/api/tasks

Ergebnis:
- Die Anfrage wird mit `Status 200 OK` beantwortet
- Wenn noch keine Tasks vorhanden sind, ist das Ergebnis: `[]`

![GET](/Bilder/image_30.png)

---

#### POST – Neuen Task erstellen

**Anfrage:**
POST http://localhost:5000/api/tasks

````
**Body (JSON):**
```json
{
  "title": "Thunder Client testen",
  "description": "Testen der REST-API mit Thunder Client.",
  "status": "todo"
}
````

Ergebnis: Task wurde erfolgreich erstellt und in der Datenbank gespeichert. Die Antwort enthält die erzeugte Task-ID.

![POST](/Bilder/image_32.png)


#### PUT – Task bearbeiten (Fehler)

Fehlerhafte Anfrage:

````
PUT http://localhost:5000/api/tasks/<id>
````

**Antwort:**

````
404 Not Found
Cannot PUT /api/tasks/<id>
````

![Fehlermeldung PUT](/Bilder/image_36.png)


**Ursache:**
Die Route war ursprünglich falsch definiert:

router.put('/:id/move', ...)

![tasks.js Fehler](/Bilder/image_38.png)

#### Fehlerbehebung

Die Route wurde im Code geändert zu:

````
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status
      },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
````

![Fehlermeldung behoben](/Bilder/image_40.png)

#### PUT – Task bearbeiten funktioniert

**Anfrage:**

````
PUT http://localhost:5000/api/tasks/<gültige-ID>
````

**Body:**

````
{
  "title": "Thunder Client testen",
  "description": "Testen der REST-API mit Thunder Client.",
  "status": "todo"
}
````

Ergebnis: Task wird erfolgreich aktualisiert.

![PUT hat Funktioniert](/Bilder/image_39.png)


#### DELETE-Request testen

Ich möchte einen bestehenden Task aus der MongoDB-Datenbank löschen – mithilfe eines **DELETE-Requests** im Thunder Client Plugin von Visual Studio Code.

Als erstes habe ich im Thunder Client einen **GET-Request** durchgeführt, um alle Tasks zu sehen:
   ```
   GET http://localhost:5000/api/tasks
   ```
3. Aus der Antwort habe ich mir die `_id ` eines vorhandenen Tasks gemerkt.

![](/Bilder/image_45.png)

---

**Anfrage:**

   ```
   DELETE http://localhost:5000/api/tasks
   ```

   Ergebnis: Task wurde gelöscht.

```json
{
  "message": "Task gelöscht"
}
```

![alt text](/Bilder/image_46.png)


**Prüfen**

Danach habe ich zur Kontrolle nochmals einen GET-Request abgesetzt – und der gelöschte Task war nicht mehr vorhanden.

![alt text](/Bilder/image_47.png)

---

## Sprint 3 – Frontend starten

### 3.1 Frontend-Projekt mit Vite & React erstellen

Für das Frontend meines Kanban-Projekts habe ich ein neues Projekt mit Vite erstellt. Ich verwende React als Framework, um die Benutzeroberfläche dynamisch und modern zu gestalten.


#### 1. Schritt - Projekt erstellen

Ich habe im Hauptordner des Projekts folgenden Befehl ausgeführt:

````
npm create vite@latest frontend -- --template react
````

Damit wurde im Ordner frontend/ ein neues React-Projekt erzeugt.

![vite-react](/Bilder/image_49.png)

#### 2. Schritt - Abhängigkeiten installieren

Danach bin ich in den frontend/-Ordner gewechselt und habe alle benötigten Pakete installiert:

````
cd frontend
npm install
````

![npminstall](/Bilder/image_50.png)


#### 3. Schritt - Projekt starten

Mit folgendem Befehl habe ich das React-Projekt gestartet:

````
npm run dev
````
![alt text](/Bilder/image_51.png)

Danach war das Projekt unter http://localhost:5173 im Browser erreichbar.
Ich habe die Startseite von Vite + React gesehen.

![alt text](/Bilder/image_52.png)

Das Frontend läuft erfolgreich im Entwicklungsmodus. Ich bin jetzt bereit, mit der Umsetzung der Benutzeroberfläche für das Kanban-Board zu starten.

---

### 3.2 - Projektstruktur aufräumen und vorbereiten

#### 1. Schritt: Unnötige Dateien löschen

Nachdem ich das Vite + React Projekt erfolgreich erstellt und im Browser getestet habe, wollte ich die Projektstruktur etwas aufräumen. Ich habe deshalb unnötige Dateien und Ordner gelöscht, die ich im späteren Verlauf nicht brauche.

- ssets/
- App.css
- vite.svg

Ich wollte ein sauberes Setup haben, um mit meiner eigenen Struktur zu starten.

![alt text](image_55.png)

#### 2. Schritt: App.jsx anpassen

Danach habe ich die Datei `App.jsx` überarbeitet und folgenden Code eingefügt, um mein Projekt zu starten:

````
function App() {
  return (
    <div>
      <h1>Kanban Board</h1>
      <p>Willkommen im Frontend meines Kanban-Projekts!</p>
    </div>
  );
}

export default App;

````
![alt text](/Bilder/image_54.png)

Anschliessend habe ich wie gewohnt den Befehl ausgeführt:

````
npm run dev
````
Doch plötzlich kam eine Fehlermeldung in der Konsole sowie im Browser:

#### 3. Schritt: Fehler beim Start

Fehlermeldung:

````
[vite] Internal server error: Failed to resolve import "./index.css" from "src/main.jsx". Does the file exist?
````

![alt text](/Bilder/image_59.png)


#### 4. Schritt: Fehler beheben

Ich habe das Problem gelöst, indem ich im src-Ordner eine neue Datei index.css erstellt habe mit folgendem Inhalt:

```
body {
  margin: 0;
}
```
Nach dem Speichern und erneutem Ausführen von npm run dev hat alles funktioniert.

#### 5. Schritt: Warum der Fehler aufgetreten ist:

Der Fehler kam, weil in der Datei main.jsx ein Import vorhanden war:

````
import './index.css';
````

Da ich beim Aufräumen die Datei `index.css` gelöscht hatte, konnte Vite den Import nicht auflösen und ist mit einem Fehler abgebrochen.

Mit dem Erstellen der neuen `index.css` und einem kleinen Inhalt `(body { margin: 0; })` wurde das Problem behoben – die Datei war wieder da, und Vite konnte normal starten.

#### 6. Schritt: Ergebnis

Meine Seite wurde wie gewünscht angezeigt:

Kanban Board
Willkommen im Frontend meines Kanban-Projekts!

![alt text](/Bilder/image_58.png)

---

### 3.3 - Verbindung zum Backend testen (API-Aufruf aus React)

#### Ziel:

Ich möchte, dass mein React-Frontend die Daten vom Backend anzeigt – also Tasks, die ich über Thunder Client oder direkt in der Datenbank gespeichert habe.

#### 1. Schritt - Umsetzung:

Ich habe die Datei App.jsx bearbeitet und folgenden Code eingefügt:

````
import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Fehler beim Laden der Tasks:", err));
  }, []);

  return (
    <div>
      <h1>Kanban Board</h1>
      <p>Willkommen im Frontend meines Kanban-Projekts!</p>

      <h2>Tasks:</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong>: {task.description} [{task.status}]
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
````
![alt text](/Bilder/image_62.png)

#### 2. Schritt - Erklärung, was passiert:

| Funktion             | Bedeutung                                                         |
| -------------------- | ----------------------------------------------------------------- |
| `useEffect(...)`     | Wird beim Start der Seite ausgeführt (API wird einmal aufgerufen) |
| `fetch("...")`       | Holt die Task-Daten vom Backend (GET-Request)                     |
| `setTasks(data)`     | Speichert die empfangenen Daten im State `tasks`                  |
| `map(...)` in `<ul>` | Zeigt alle Tasks als Liste im Frontend an                         |


✅ Ergebnis:

- Ich sehe im Browser jetzt meine gespeicherten Tasks aus der MongoDB.
- Es funktioniert, solange Backend + Datenbank korrekt laufen.

![alt text](/Bilder/image_61.png)

---

### 3.4 – Layout strukturieren und Komponenten erstellen

