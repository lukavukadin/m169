## LB2 Dokumentation – Kanban To-Do Liste


### Einführung

In dieser LB2 habe ich mich entschieden, ein **Kanban-basiertes To-Do-Board** als Webanwendung zu entwickeln. Ziel ist es, Aufgaben übersichtlich nach ihrem Bearbeitungsstand zu verwalten – gegliedert in „To Do“, „In Progress“ und „Done“. Die Anwendung läuft vollständig containerisiert mithilfe von **Docker**, **Apache**, **PHP** und **MariaDB**. Benutzer können sich registrieren, einloggen und ihre Aufgaben selbstständig organisieren. Die Anwendung ist skalierbar über **Docker Swarm** und vorbereitet für den produktiven Einsatz in einer Cloud-Umgebung.

---

### Anforderungen an die Kanban-App

- Die Anwendung muss fehlerfrei über den Webbrowser erreichbar sein.
    
- Benutzer müssen sich registrieren und anmelden können.
    
- Aufgaben sind benutzerbezogen und dauerhaft in der Datenbank gespeichert.
    
- Jede Aufgabe enthält: Titel, Beschreibung, Status und Erstellungsdatum.
    
- Aufgaben lassen sich erstellen, bearbeiten, löschen und zwischen Status-Spalten verschieben.
    
- Die Webseite ist mit CSS gestaltet.
    
- Optionaler Export der Aufgaben als CSV oder JSON.


---

### User Story

Als Einzelperson möchte ich meine Aufgaben visuell in einem Kanban-Board verwalten, damit ich jederzeit den Überblick über meine offenen, laufenden und abgeschlossenen Tätigkeiten habe.

---

### Anwendung

Nach dem Start der Anwendung kann sich der Benutzer registrieren oder anmelden. Anschließend gelangt man auf das **Kanban-Board**, das in drei Spalten aufgebaut ist:

- **To Do** – Aufgaben, die noch nicht begonnen wurden
    
- **In Progress** – Aufgaben, an denen aktuell gearbeitet wird
    
- **Done** – Erledigte Aufgaben
    

Jede Aufgabe kann:

- erstellt werden,
    
- bearbeitet werden (Titel, Beschreibung, Status),
    
- gelöscht werden,
    
- zwischen den Spalten verschoben werden.
    

---

### Projektstruktur

```
.
├── apache-php
│   ├── Dockerfile
│   └── html
│       ├── index.php
│       ├── register.php
│       ├── login.php
│       ├── board.php
│       ├── create_task.php
│       ├── edit_task.php
│       ├── move_task.php
│       ├── logout.php
│       └── style.css
├── mariadb
│   ├── Dockerfile
│   └── init.sql
├── docker-compose.yaml
```

---

### Docker Compose

Die Anwendung besteht aus zwei Containern:

- **apache-php**: Webserver mit PHP
    
- **mariadb**: Datenbank für Benutzer und Aufgaben


#### docker-compose.yaml (Ausschnitt)

````
services:
  web:
    build: ./apache-php
    ports:
      - "8080:80"
    networks:
      - kanban-network
    depends_on:
      - db

  db:
    image: mariadb
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: kanban
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - kanban-network

volumes:
  db_data:

networks:
  kanban-network:
````

---
### Datenbank

Die Datenbank enthält zwei Tabellen:

 **`users`**

- id (INT, Primary Key)
    
- username (VARCHAR)
    
- password (VARCHAR, gehashed)
    

**`tasks`**

- id (INT, Primary Key)
    
- user_id (INT, Foreign Key)
    
- title (VARCHAR)
    
- description (TEXT)
    
- status (ENUM: 'todo', 'in_progress', 'done')
    
- created_at (DATETIME)
    

---

### Sicherheit

- Passwörter werden mit `password_hash(..., PASSWORD_DEFAULT)` sicher gespeichert.
    
- Benutzeraktionen sind nur im eingeloggten Zustand möglich.
    
- SQL-Befehle werden mit Prepared Statements abgesichert.
    

---

### Zugriff / Verfügbarkeit

Die Anwendung ist im Browser unter `http://localhost:8080` erreichbar. Bei einem produktiven Einsatz wäre auch eine Domain oder ein Cloud-Hosting möglich (z. B. AWS mit Elastic IP). Der Taskmanager ist dadurch auch öffentlich verfügbar.

---

### Docker Registry (optional)

Die erstellten Images können in eine Docker Registry (z. B. Docker Hub) gepusht werden:

- `youruser/kanban-web:latest`
    
- `youruser/kanban-db:latest`


Diese Images können dann per `docker pull` wiederverwendet werden.

---

### Ressourcen

- Docker + Docker Compose
    
- Apache Webserver + PHP
    
- MariaDB Datenbank
    
- CSS für Layout
    
- SQL für Datenbankstruktur
    
- PHP Sessions und Authentifizierung
    
- Cloud-init (optional für Deployment)