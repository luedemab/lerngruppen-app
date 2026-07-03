import { describe, it, expect } from "vitest";
import { createGroup, joinGroup, isFull } from "./groups.js";

const base = [
  { id: 1, course: "Mathematik 2", title: "Crashkurs", slot: "Di 16\u201318 Uhr", maxSize: 3, members: ["Ay\u015Fe", "Ben"] },
  { id: 2, course: "Statistik", title: "Altklausuren", slot: "Do 18\u201320 Uhr", maxSize: 2, members: ["Chris", "Dana"] },
];

describe("createGroup (User Story 1: Lerngruppe erstellen)", () => {
  it("legt eine neue Gruppe an und macht die Gründerin zum ersten Mitglied", () => {
    const result = createGroup(base, { course: "Programmierung 1", title: "Java üben", slot: "Mi 14\u201316 Uhr", maxSize: 5 }, "Eli");
    expect(result).toHaveLength(3);
    const g = result[2];
    expect(g.id).toBe(3);
    expect(g.course).toBe("Programmierung 1");
    expect(g.members).toEqual(["Eli"]);
  });

  it("verändert das ursprüngliche Array nicht (Immutability)", () => {
    createGroup(base, { course: "X", title: "Y", slot: "Z", maxSize: 2 }, "Eli");
    expect(base).toHaveLength(2);
  });

  it("lehnt fehlenden Kurs ab", () => {
    expect(() => createGroup(base, { course: "  ", title: "Y", slot: "Z", maxSize: 2 }, "Eli")).toThrow(/Kurs/);
  });

  it("lehnt Gruppengröße unter 2 ab", () => {
    expect(() => createGroup(base, { course: "X", title: "Y", slot: "Z", maxSize: 1 }, "Eli")).toThrow(/mindestens 2/);
  });
});

describe("joinGroup (User Story 4: Gruppe beitreten)", () => {
  it("fügt ein neues Mitglied hinzu", () => {
    const result = joinGroup(base, 1, "Eli");
    expect(result[0].members).toEqual(["Ay\u015Fe", "Ben", "Eli"]);
  });

  it("lehnt Beitritt zu einer vollen Gruppe ab", () => {
    expect(() => joinGroup(base, 2, "Eli")).toThrow(/voll/);
  });

  it("lehnt doppelten Beitritt ab", () => {
    expect(() => joinGroup(base, 1, "Ben")).toThrow(/bereits Mitglied/);
  });
});

describe("isFull", () => {
  it("erkennt volle und offene Gruppen", () => {
    expect(isFull(base[1])).toBe(true);
    expect(isFull(base[0])).toBe(false);
  });
});
