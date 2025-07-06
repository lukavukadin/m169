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

#### Was ich gemacht habe:

In diesem Schritt habe ich meinen bisherigen Code in App.jsx aufgeräumt und sinnvoll ausgelagert.
Ich habe eine neue Komponente erstellt:

- `TaskList.jsx` – Diese Komponente zeigt eine Liste aller Tasks an.

Ursprünglich war auch eine `TaskItem.jsx` geplant, aber ich habe mich entschieden, die Darstellung jedes einzelnen Tasks direkt in `TaskList.jsx` zu integrieren. Das war für meine aktuelle Projektgröße einfacher und übersichtlicher.

#### 1. Schritt - Neue Datei TaskList.jsx erstellt
Im Ordner src/ habe ich eine neue Datei TaskList.jsx angelegt.

![alt text](/Bilder/image_66.png)

#### 2. Schritt - Code für TaskList.jsx geschrieben

In dieser Komponente hole ich die Tasks per fetch() aus dem Backend und gebe sie direkt mit einer map()-Funktion als <li>-Elemente aus.

````
// src/TaskList.jsx
import { useEffect, useState } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  return (
    <div>
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

export default TaskList;`

````
![alt text](/Bilder/image_63.png)

#### 3. Schritt - App.jsx angepasst

In meiner Hauptkomponente App.jsx habe ich TaskList importiert und eingebunden:

````
import TaskList from "./TaskList";

function App() {
  return (
    <div>
      <h1>Kanban Board</h1>
      <p>Willkommen im Frontend meines Kanban-Projekts!</p>
      <TaskList />
    </div>
  );
}

export default App;

````

![alt text](/Bilder/image_65.png)

#### Warum habe ich das gemacht?

Ich habe den Code in eine eigene Komponente ausgelagert, damit:

- mein Code übersichtlicher wird
- ich leichter neue Funktionen (z. B. löschen, bearbeiten) einbauen kann
- ich bessere Wiederverwendbarkeit habe

Obwohl sich im Browser fast nichts verändert hat, ist der Code jetzt viel sauberer und strukturierter.
Das hilft mir später beim Erweitern des Projekts.

----

#### 3.5 - Task erstellen (POST) über das Frontend

#### Was ich gemacht habe:

In diesem Schritt habe ich eine neue Komponente erstellt, mit der ich direkt im Frontend neue Tasks erstellen kann. Diese werden über einen HTTP POST Request an das Backend gesendet und anschliessend in der Liste angezeigt – ohne die Seite zu aktualisieren.

#### 1. Schritt - Neue Datei TaskForm.jsx erstellt

Ich habe im Ordner src/components/ die Datei TaskForm.jsx angelegt.

![alt text](/Bilder/image_73.png)

#### 2. Schritt - TaskForm.jsx geschrieben

In dieser Komponente habe ich ein Formular programmiert, das title, description und status an das Backend sendet. Nach dem Absenden wird der neue Task automatisch zur Liste hinzugefügt.

````
import { useState } from "react";

function TaskForm({ setTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { title, description, status };

    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const savedTask = await res.json();
    setTasks((prevTasks) => [...prevTasks, savedTask]);

    // Felder leeren
    setTitle("");
    setDescription("");
    setStatus("todo");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Neuen Task erstellen</h2>
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit">Erstellen</button>
    </form>
  );
}

export default TaskForm;
````

![alt text](/Bilder/image_74.png)

#### 3. Schritt - App.jsx angepasst

Ich habe die neue Komponente importiert und direkt über die Task-Liste eingefügt. Zusätzlich habe ich setTasks als Prop übergeben, damit das Formular neue Tasks hinzufügen kann.

````
import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

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
      <TaskForm setTasks={setTasks} />
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;

````
![alt text](/Bilder/image_75.png)

#### 4. Schritt - Task im Browser erstellt

Ich habe nun einen neuen Task direkt im Frontend eingetragen – nach dem Klick auf „Erstellen“ erscheint der neue Task sofort in der Liste, ohne dass ich die Seite neu laden muss.

![](/Bilder/image_71.png)

#### Warum hat es vorher nicht funktioniert?

Zuerst habe ich der neuen Task zwar erfolgreich an das Backend gesendet, aber die React-Komponente hat sich nicht neu gerendert, weil der tasks-State nicht aktualisiert wurde.

#### Warum funktioniert es jetzt?

Durch den Aufruf `setTasks((prevTasks) => [...prevTasks, savedTask])` wird der neue Task direkt zum aktuellen Zustand (`State`) hinzugefügt → und React zeigt die Änderung sofort im UI an.

Ich habe also verstanden:

- wie man ein Formular in React verarbeitet
- wie man per `fetch` einen Task sendet
- wie man den `State` aktualisiert, ohne neu zu laden

----

### 3.6 - Task löschen (DELETE)

#### Was ich gemacht habe:

In diesem Schritt habe ich mein Kanban-Board erweitert, sodass ich Tasks direkt aus dem Frontend löschen kann. Dafür habe ich eine neue Komponente namens TaskItem.jsx erstellt. Diese zeigt jeweils einen Task mit einem "Löschen"-Button an.

Sobald ich auf den Button klicke, wird der Task aus dem Backend gelöscht – und die Liste aktualisiert sich automatisch, ohne dass ich die Seite neu laden muss.

#### 1. Schritt - Neue Datei TaskItem.jsx erstellt

Ich habe die Datei TaskItem.jsx im components-Ordner erstellt. Diese Komponente erhält den Task sowie die setTasks-Funktion, um nach dem Löschen die Ansicht zu aktualisieren.

````
function TaskItem({ task, setTasks }) {
  const deleteTask = () => {
    fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setTasks((prevTasks) => prevTasks.filter((t) => t._id !== task._id));
        }
      })
      .catch((err) => console.error("Fehler beim Löschen:", err));
  };

  return (
    <li>
      <strong>{task.title}</strong>: {task.description} [{task.status}]
      <button onClick={deleteTask}>Löschen</button>
    </li>
  );
}

export default TaskItem;
````

![alt text](/Bilder/image_74.png)

#### 2. Schritt - TaskList.jsx angepasst

In TaskList.jsx habe ich den Import ergänzt und beim Rendern der Liste die neue Komponente verwendet – und setTasks mitgegeben:

````
import TaskItem from "./TaskItem";

...

{tasks.map((task) => (
  <TaskItem key={task._id} task={task} setTasks={setTasks} />
))}

````
![alt text](/Bilder/image_80.png)


#### 3. Schritt - App.jsx bleibt wie vorher

Da App.jsx schon setTasks an TaskList übergibt, musste ich nichts daran ändern.

![alt text](/Bilder/image_82.png)

#### Ergebnis

Ich konnte erfolgreich einen Task löschen und musste die Seite nicht reloaden

![alt text](/Bilder/image_78.png)

![alt text](/Bilder/image_79.png)

----

### 3.7 - Tasks im Frontend bearbeiten (PUT-Anfrage)

#### Ziel
Ich wollte ermöglichen, dass man im Frontend **bestehende Tasks bearbeiten** kann – also **Titel**, **Beschreibung** und **Status** ändern.  
Diese Änderungen sollen per `PUT`-Request an das Backend gesendet und direkt in der Datenbank gespeichert werden.

---

#### Umsetzung im Frontend

Ich habe in der Datei `TaskItem.jsx` eine Bearbeitungsfunktion eingebaut, sodass beim Klick auf „Bearbeiten“ ein Formular erscheint. Nach Änderungen kann man auf „Speichern“ klicken und der neue Task wird ans Backend gesendet.

#### Neue oder geänderte Funktion:

````
```jsx
function handleSave() {
  fetch(`http://localhost:5000/api/tasks/${task._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editedTask),
  })
    .then((res) => res.json())
    .then((updatedTask) => {
      onUpdate(updatedTask);
      setIsEditing(false);
    });
}
````
![alt text](/Bilder/image_94.png)

#### Warum dieser Code

- `editedTask` enthält alle bearbeiteten Felder (title, description, status)
- Der Request wird an die API geschickt
- Nach Erfolg wird die Parent-Komponente (`TaskList`) mit den neuen Daten aktualisiert

![alt text](/Bilder/image_93.png)

#### Problem: Änderungen an Titel & Beschreibung wurden nicht übernommen

**Beim Testen habe ich festgestellt:**

- Status wurde aktualisiert
- Titel & Beschreibung blieben gleich

8929847982374

**Fehlersymptom:**

- Ich änderte den Titel, klickte auf „Speichern“
- Nach dem Reload war nur der Status geändert, der Titel war wieder alt

**Fehlerursache:**

- Backend-Route /api/tasks/:id (PUT)
- Ich habe im Backend die Datei routes/tasks.js überprüft und folgendes festgestellt:

````
// Ursprünglicher Code (Fehler!)
Task.findByIdAndUpdate(
  req.params.id,
  { status: req.body.status },
  { new: true }
);
````
Hier wird nur das Feld status gespeichert – alle anderen Felder (title, description) werden ignoriert, auch wenn sie mitgeschickt wurden.

![alt text](/Bilder/image_90.png)

#### Lösung: Backend-Route anpassen

Ich habe den Code wie folgt geändert:

````
// Neuer Code – alle Felder werden übernommen!
Task.findByIdAndUpdate(
  req.params.id,
  {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status
  },
  { new: true }
);
````

![alt text](/Bilder/image_91.png)


#### Ergebnis nach Fix:

- Ich kann jetzt Titel, Beschreibung und Status eines Tasks im Frontend ändern
- Nach dem Speichern wird die Taskliste automatisch aktualisiert

<video controls src="../mp4/2025-07-06_20h00_40.mp4" title="Title"></video>