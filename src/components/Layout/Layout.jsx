
import React, { useState } from "react";
import "src/index.css"; // Assurez-vous que ce fichier CSS est importé

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">Starchive</div>
        <nav>
          <a href="#" className="active">Dashboard</a>
          <a href="#">Utilisateurs</a>
          <a href="#">Statistiques</a>
          <a href="#">Logs d'activité</a>
        </nav>
        <div className="sidebar-footer">© 2025 Starchive</div>
      </aside>

      {/* Main content */}
      <main className="main">
        <header className="header">
          <h1>Panneau d'administration</h1>
          <div className="actions">
            <button onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? "➡️" : "⬅️"}
            </button>
            <button>🔔</button>
            <button>⚙️</button>
          </div>
        </header>

        <section className="card fade-in">
          <h2>Bienvenue 👋</h2>
          <p>Voici votre tableau de bord administrateur.</p>
        </section>
      </main>
    </div>
  );
}
