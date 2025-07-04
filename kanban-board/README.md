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

### Sprint 1 – Projektstruktur anlegen & Express-Backend starten (lokal)




