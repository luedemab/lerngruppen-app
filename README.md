# Lerngruppen App 

Semesterprojekt im Modul **„Agile Teamwork & Business Skills"** (B.Sc. Medieninformatik / Mobile Medien):
Eine App, mit der Studierende sich selbst in Lerngruppen organisieren.

## Product Backlog

| # | User Story | Status |
|---|-----------|--------|
| 1 | Als Studentin möchte ich eine **Lerngruppe für einen Kurs erstellen**, um nicht allein zu lernen. | ✅ Sprint 1 |
| 2 | Als Student möchte ich **Gruppen nach Kurs filtern**, um schnell eine passende zu finden. | 🔄 Sprint 2 |
| 3 | Als Studentin möchte ich **nach Zeitfenster filtern**, um Gruppen zu finden, die in meinen Stundenplan passen. | 📋 Backlog |
| 4 | Als Student möchte ich **einer Gruppe beitreten**, um direkt mitzulernen. | ✅ Sprint 1 |

Die Stories liegen als GitHub-Issues im [Backlog](../../issues), der Sprint läuft im [Projects-Board](../../projects).

## Arbeitsweise (Scrum)

- **Ein Backlog-Item = ein Branch**: `feature/<issue-nr>-<kurzname>`, z. B. `feature/2-kursfilter`
- **Pull Request + Review**: mindestens ein Teammitglied reviewt, bevor gemerged wird
- **Definition of Done**: Akzeptanzkriterien erfüllt + CI grün (Tests & Build) + manuell geprüft
- `main` ist **immer lauffähig**

## Entwicklung

```bash
npm install     # Abhängigkeiten installieren
npm run dev     # Entwicklungsserver starten (http://localhost:5173)
npm test        # Tests ausführen (Vitest)
npm run build   # Produktions-Build
```

## Demo erneut zeigen

Nach einem Probelauf **mit** Merge ist die Demo "verbraucht" (Issue #2 geschlossen, PR gemergt).
Ausgangszustand wiederherstellen:

```bash
bash reset-demo.sh --dry-run   # zeigt nur an, was passieren würde
bash reset-demo.sh             # setzt main + feature/2-kursfilter zurück
```

Danach in GitHub noch von Hand: Issue #2 **Reopen**, Board-Karte auf **In Progress**, neuen PR
(`feature/2-kursfilter` → `main`, Beschreibung `Closes #2`) erstellen.

> Tipp: Für Generalproben besser gar nicht mergen — dann ist kein Reset nötig.

## Tech-Stack

React + Vite · Vitest · GitHub Actions (CI)
