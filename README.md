# Brennholz-App

Dieses Projekt stellt eine Next.js-Anwendung für die Verwaltung von Brennholzbestellungen bereit. Es umfasst:

- Benutzer- und Rollenverwaltung mit Registrierung, Login und Rechteprüfung
- Verwaltung von Artikeln, Lagerbeständen und Bestellungen über Prisma
- API-Routen zur Pflege von Artikeln, Anlage neuer Bestellungen sowie Abruf von Historien
- Dashboard mit Lagerüberblick, Bestelllisten und Top-Besteller*innen
- Bestellformular mit Validierung gegen verfügbare Lagerbestände
- Tests (Vitest) für Authentifizierung, Bestandsprüfung und Preisberechnung

## Erste Schritte

1. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

2. Prisma-Migrationen ausführen und den Client generieren:

   ```bash
   npx prisma migrate dev
   ```

3. Entwicklungsserver starten:

   ```bash
   npm run dev
   ```

Die Anwendung ist anschließend unter http://localhost:3000 erreichbar.

## Tests

```bash
npm test
```

## Linting

```bash
npm run lint -- --no-cache
```

## Umgebungsvariablen

Kopieren Sie `.env.example` zu `.env` und passen Sie die Werte an. Für lokale Entwicklung ist SQLite als Datenbank vorgesehen.
