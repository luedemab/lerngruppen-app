/**
 * Reine Fachlogik der Lerngruppen-App.
 * Bewusst ohne UI-Abhängigkeiten, damit sie sich schnell und stabil testen lässt (Vitest, CI).
 */

/** Liefert true, wenn die Gruppe ihre maximale Größe erreicht hat. */
export function isFull(group) {
  return group.members.length >= group.maxSize;
}

/**
 * User Story 1: "Als Studentin möchte ich eine Lerngruppe für einen Kurs erstellen,
 * um nicht allein zu lernen."
 * Gibt ein neues Array zurück (Immutability), die Gründerin ist automatisch erstes Mitglied.
 */
export function createGroup(groups, { course, title, slot, maxSize }, creator) {
  if (!course?.trim()) throw new Error("Bitte einen Kurs angeben.");
  if (!title?.trim()) throw new Error("Bitte einen Titel für die Gruppe angeben.");
  if (!slot?.trim()) throw new Error("Bitte ein Zeitfenster angeben (z. B. \u201EDi 16\u201318 Uhr\u201C).");
  if (!Number.isInteger(maxSize) || maxSize < 2) {
    throw new Error("Die maximale Gruppengröße muss mindestens 2 sein.");
  }
  const nextId = groups.reduce((max, g) => Math.max(max, g.id), 0) + 1;
  return [
    ...groups,
    {
      id: nextId,
      course: course.trim(),
      title: title.trim(),
      slot: slot.trim(),
      maxSize,
      members: [creator],
    },
  ];
}

/**
 * User Story 4: "Als Student möchte ich einer Gruppe beitreten, um direkt mitzulernen."
 * Kapazitätsgrenze und Doppel-Beitritt werden hier zentral geprüft.
 */
export function joinGroup(groups, groupId, user) {
  const group = groups.find((g) => g.id === groupId);
  if (!group) throw new Error("Diese Gruppe existiert nicht (mehr).");
  if (group.members.includes(user)) throw new Error("Du bist bereits Mitglied dieser Gruppe.");
  if (isFull(group)) throw new Error("Diese Gruppe ist bereits voll.");
  return groups.map((g) =>
    g.id === groupId ? { ...g, members: [...g.members, user] } : g
  );
}
