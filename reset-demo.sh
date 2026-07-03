#!/usr/bin/env bash
#
# reset-demo.sh — setzt die Live-Demo in den Ausgangszustand zurück
# ("PR offen, Issue #2 in Arbeit"), nachdem in einem Probelauf gemergt wurde.
#
# Was das Skript macht:
#   1. main auf den Sprint-1-Stand zurücksetzen (VOR dem Kursfilter-Merge)
#   2. den Branch feature/2-kursfilter lokal + remote neu aufbauen
#
# Was das Skript NICHT kann (das machen Sie danach von Hand in GitHub):
#   - Issue #2 wieder öffnen ("Reopen issue") und die Board-Karte auf "In Progress" ziehen
#   - einen neuen Pull Request erstellen (feature/2-kursfilter -> main, mit "Closes #2")
#
# Aufruf im Projektordner:   bash reset-demo.sh
# Nur anzeigen, nichts tun:  bash reset-demo.sh --dry-run

set -euo pipefail

DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

# --- Hilfsfunktionen -------------------------------------------------------
say()  { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
ok()   { printf "  \033[0;32m✓ %s\033[0m\n" "$1"; }
warn() { printf "  \033[0;33m! %s\033[0m\n" "$1"; }
run()  {
  if [ "$DRY_RUN" -eq 1 ]; then
    printf "  \033[0;90m[dry-run] %s\033[0m\n" "$*"
  else
    eval "$@"
  fi
}

# --- Sicherheitschecks -----------------------------------------------------
if [ ! -d .git ]; then
  echo "Fehler: Bitte im Projektordner (lerngruppen-app) ausführen." >&2
  exit 1
fi

if [ "$DRY_RUN" -eq 0 ] && ! git remote get-url origin >/dev/null 2>&1; then
  echo "Fehler: Kein Remote 'origin' gefunden. Erst das Repo zu GitHub pushen." >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Fehler: Es gibt uncommittete Änderungen. Bitte erst committen oder verwerfen:" >&2
  git status --short >&2
  exit 1
fi

# --- Die beiden Zielcommits anhand ihrer Commit-Message finden -------------
# Über die Commit-Message statt über feste Hashes — so bleibt das Skript
# auch dann korrekt, wenn Sie selbst Commits ergänzt haben.
git fetch --all --quiet || true

SPRINT1=$(git log --all --grep="User Stories 1 und 4" --format="%H" | head -1)
FILTER=$(git log --all --grep="Lerngruppen nach Kurs filtern" --format="%H" | head -1)

if [ -z "$SPRINT1" ] || [ -z "$FILTER" ]; then
  echo "Fehler: Die Ziel-Commits wurden nicht gefunden." >&2
  echo "Wurden die Commit-Messages verändert? Prüfen Sie 'git log --oneline --all'" >&2
  echo "und setzen Sie SPRINT1 / FILTER oben im Skript notfalls von Hand auf die" >&2
  echo "richtigen Commit-Hashes (Sprint-1-Stand bzw. Kursfilter-Commit)." >&2
  exit 1
fi

say "Gefundene Commits"
ok  "Sprint-1-Stand (Ziel für main): $(git log -1 --format='%h %s' "$SPRINT1")"
ok  "Kursfilter-Story (Ziel für Branch): $(git log -1 --format='%h %s' "$FILTER")"

if [ "$DRY_RUN" -eq 0 ]; then
  printf "\nDies überschreibt main und feature/2-kursfilter auf GitHub (force-push). Fortfahren? [j/N] "
  read -r ANSWER
  case "$ANSWER" in
    j|J|y|Y) ;;
    *) echo "Abgebrochen."; exit 0 ;;
  esac
fi

# --- 1. main zurücksetzen --------------------------------------------------
say "1/2  main auf den Sprint-1-Stand zurücksetzen"
run "git checkout main"
run "git reset --hard $SPRINT1"
run "git push --force origin main"
ok  "main zeigt wieder auf den Stand vor dem Kursfilter-Merge"

# --- 2. Feature-Branch neu aufbauen ---------------------------------------
say "2/2  feature/2-kursfilter neu erstellen"
run "git branch -D feature/2-kursfilter 2>/dev/null || true"
run "git push origin --delete feature/2-kursfilter 2>/dev/null || true"
run "git checkout -b feature/2-kursfilter $FILTER"
run "git push -u origin feature/2-kursfilter"
run "git checkout main"
ok  "feature/2-kursfilter steht wieder bereit"

# --- Manuelle Restschritte -------------------------------------------------
cat <<'DONE'

────────────────────────────────────────────────────────────
  Fast fertig. Diese zwei Schritte noch von Hand in GitHub:

    1. Issue #2 öffnen  →  Button "Reopen issue"
       Danach die Karte im Project-Board auf "In Progress" ziehen.

    2. Neuen Pull Request erstellen:
       feature/2-kursfilter  →  main
       In die Beschreibung:  Closes #2

  (Der alte, gemergte PR bleibt als "merged" bestehen — das stört nicht.)
────────────────────────────────────────────────────────────

  Tipp: Für Generalproben besser GAR NICHT mergen — dann ist kein
  Reset nötig und der Demo-Zustand bleibt garantiert erhalten.

DONE
