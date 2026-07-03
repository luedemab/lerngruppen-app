import { useState } from "react";
import { seedGroups } from "./data/seed.js";
import { createGroup, joinGroup, isFull, filterByCourse, listCourses } from "./lib/groups.js";
import "./styles.css";

const CURRENT_USER = "Du";

export default function App() {
  const [groups, setGroups] = useState(seedGroups);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ course: "", title: "", slot: "", maxSize: 4 });
  const [courseFilter, setCourseFilter] = useState("");

  const visibleGroups = filterByCourse(groups, courseFilter);

  function flash(text, kind = "ok") {
    setMessage({ text, kind });
    window.clearTimeout(flash.t);
    flash.t = window.setTimeout(() => setMessage(null), 3500);
  }

  function handleCreate() {
    try {
      setGroups(createGroup(groups, { ...form, maxSize: Number(form.maxSize) }, CURRENT_USER));
      setForm({ course: "", title: "", slot: "", maxSize: 4 });
      flash("Lerngruppe erstellt — du bist das erste Mitglied.");
    } catch (err) {
      flash(err.message, "error");
    }
  }

  function handleJoin(id) {
    try {
      setGroups(joinGroup(groups, id, CURRENT_USER));
      flash("Du bist der Gruppe beigetreten.");
    } catch (err) {
      flash(err.message, "error");
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Lerngruppen <span className="at">@</span> HdM</h1>
        <p className="tagline">Finde deine Lerngruppe — oder gründe die erste.</p>
      </header>

      {message && <div className={`flash flash-${message.kind}`}>{message.text}</div>}

      <section className="panel">
        <h2>Neue Lerngruppe erstellen</h2>
        <div className="form-grid">
          <label>
            Kurs
            <input value={form.course} placeholder="z. B. Mathematik 2"
              onChange={(e) => setForm({ ...form, course: e.target.value })} />
          </label>
          <label>
            Titel
            <input value={form.title} placeholder="z. B. Klausur-Crashkurs"
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Zeitfenster
            <input value={form.slot} placeholder="z. B. Di 16–18 Uhr"
              onChange={(e) => setForm({ ...form, slot: e.target.value })} />
          </label>
          <label>
            Max. Größe
            <input type="number" min="2" max="12" value={form.maxSize}
              onChange={(e) => setForm({ ...form, maxSize: e.target.value })} />
          </label>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>Gruppe erstellen</button>
      </section>

      <section>
        <div className="list-header">
          <h2>Offene Lerngruppen</h2>
          <label className="filter">
            Nach Kurs filtern
            <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="">Alle Kurse</option>
              {listCourses(groups).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <span className="count">{visibleGroups.length} von {groups.length} Gruppen</span>
        </div>

        {visibleGroups.length === 0 && (
          <div className="empty">
            Keine Lerngruppen für diesen Kurs gefunden.<br />
            Gründe oben die erste — andere suchen bestimmt auch schon.
          </div>
        )}

        <ul className="group-list">
          {visibleGroups.map((g) => {
            const member = g.members.includes(CURRENT_USER);
            const full = isFull(g);
            return (
              <li key={g.id} className="card">
                <div className="card-main">
                  <span className="badge">{g.course}</span>
                  <h3>{g.title}</h3>
                  <p className="meta">{g.slot} · {g.members.length}/{g.maxSize} Plätze belegt</p>
                  <p className="members">{g.members.join(", ")}</p>
                </div>
                <button
                  className="btn"
                  disabled={member || full}
                  onClick={() => handleJoin(g.id)}
                >
                  {member ? "Mitglied \u2713" : full ? "Voll" : "Beitreten"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="app-footer">
        Semesterprojekt · Modul „Agile Teamwork & Business Skills" · Sprint 2
      </footer>
    </main>
  );
}
