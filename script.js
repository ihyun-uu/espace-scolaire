const USERS = {
  eleve: {
    password: "1234",
    name: "Camille Martin",
    role: "Élève",
    type: "student",
    classe: "3e A"
  },
  prof: {
    password: "1234",
    name: "Mme Dupont",
    role: "Professeure de français",
    type: "teacher"
  },
  cpe: {
    password: "1234",
    name: "M. Bernard",
    role: "CPE collège",
    type: "cpe"
  },
  direction: {
    password: "1234",
    name: "Mme Moreau",
    role: "Direction",
    type: "admin"
  }
};

const NAVS = {
  student: [
    ["home", "🏠", "Accueil"],
    ["schedule", "🗓️", "Emploi du temps"],
    ["courses", "📚", "Cahier de textes"],
    ["homework", "📝", "Devoirs"],
    ["grades", "📊", "Notes"],
    ["attendance", "⏰", "Absences & retards"],
    ["schoolbook", "📒", "Carnet scolaire"],
    ["canteen", "🍽️", "Cantine"],
    ["messages", "💬", "Messagerie"]
  ],
  teacher: [
    ["home", "🏠", "Accueil"],
    ["schedule", "🗓️", "Emploi du temps"],
    ["classes", "👥", "Mes classes"],
    ["attendance", "⏰", "Faire l'appel"],
    ["grades", "📊", "Saisir les notes"],
    ["courses", "📚", "Cahier de textes"],
    ["homework", "📝", "Devoirs"],
    ["messages", "💬", "Messagerie"]
  ],
  cpe: [
    ["home", "🏠", "Accueil"],
    ["students", "👥", "Élèves"],
    ["attendance", "🚨", "Absences"],
    ["lateness", "⏰", "Retards"],
    ["justifications", "📄", "Justifications"],
    ["schoolbook", "📒", "Carnets"],
    ["detentions", "🔨", "Retenues"],
    ["messages", "💬", "Messagerie"]
  ],
  admin: [
    ["home", "🏠", "Accueil"],
    ["students", "👥", "Élèves"],
    ["teachers", "👩‍🏫", "Professeurs"],
    ["classes", "🎒", "Classes"],
    ["schedule", "🗓️", "Emplois du temps"],
    ["grades", "📊", "Notes"],
    ["attendance", "🚨", "Absences"],
    ["schoolbook", "📒", "Carnets"],
    ["announcements", "📢", "Annonces"],
    ["settings", "⚙️", "Paramètres"]
  ]
};

let currentUser = null;
let currentPage = "home";

const $ = (id) => document.getElementById(id);

function todayString() {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date());
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function login(username, password) {
  const user = USERS[username.toLowerCase()];
  if (!user || user.password !== password) return false;
  currentUser = { username, ...user };
  localStorage.setItem("rpSchoolUser", username);
  return true;
}

function logout() {
  currentUser = null;
  localStorage.removeItem("rpSchoolUser");
  $("appView").classList.add("hidden");
  $("loginView").classList.remove("hidden");
  $("loginForm").reset();
}

function renderNav() {
  const nav = $("navMenu");
  nav.innerHTML = "";
  NAVS[currentUser.type].forEach(([id, icon, label]) => {
    const button = document.createElement("button");
    button.dataset.page = id;
    button.innerHTML = `${icon} ${label}`;
    button.addEventListener("click", () => renderPage(id));
    nav.appendChild(button);
  });
}

function updateHeader(title) {
  $("pageTitle").textContent = title;
  $("userName").textContent = currentUser.name;
  $("userRole").textContent = currentUser.role;
  $("avatar").textContent = currentUser.name.charAt(0).toUpperCase();
  $("today").textContent = todayString();
}

function activateNav() {
  document.querySelectorAll("#navMenu button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === currentPage);
  });
}

function renderPage(page) {
  currentPage = page;
  const labels = Object.fromEntries(NAVS[currentUser.type].map(x => [x[0], x[2]]));
  updateHeader(labels[page] || "Accueil");
  activateNav();

  const views = {
    home: renderHome,
    schedule: renderSchedule,
    courses: renderCourses,
    homework: renderHomework,
    grades: renderGrades,
    attendance: renderAttendance,
    schoolbook: renderSchoolbook,
    canteen: renderCanteen,
    messages: renderMessages,
    classes: renderClasses,
    students: renderStudents,
    teachers: renderTeachers,
    lateness: renderLateness,
    justifications: renderJustifications,
    detentions: renderDetentions,
    announcements: renderAnnouncements,
    settings: renderSettings
  };

  $("content").innerHTML = (views[page] || renderHome)();
}

function renderHome() {
  const firstName = currentUser.name.split(" ")[0];
  if (currentUser.type === "student") {
    return `
      <div class="hero">
        <p class="eyebrow">BIENVENUE</p>
        <h3>Bonjour ${escapeHtml(firstName)} ✦</h3>
        <p>Retrouve ici les informations de ta scolarité pour aujourd'hui.</p>
      </div>
      <div class="grid">
        <div class="card"><h4>📈 Moyenne générale</h4><div class="stat">14,8</div><div class="small">Dernière mise à jour</div></div>
        <div class="card"><h4>🚨 Absences</h4><div class="stat">1</div><div class="small">dont 1 justifiée</div></div>
        <div class="card"><h4>⏰ Retards</h4><div class="stat">2</div><div class="small">ce trimestre</div></div>
        <div class="card"><h4>📝 Devoirs</h4><div class="stat">3</div><div class="small">à venir</div></div>
      </div>
      <h3 class="section-title">📌 À retenir</h3>
      <div class="notice">Le conseil de classe est prévu vendredi à 17h30.</div>
    `;
  }

  if (currentUser.type === "teacher") {
    return `
      <div class="hero">
        <p class="eyebrow">ESPACE PROFESSEUR</p>
        <h3>Bonjour ${escapeHtml(firstName)} ✦</h3>
        <p>Voici votre tableau de bord pour la journée.</p>
      </div>
      <div class="grid">
        <div class="card"><h4>🗓️ Cours aujourd'hui</h4><div class="stat">4</div></div>
        <div class="card"><h4>📝 Copies à corriger</h4><div class="stat">18</div></div>
        <div class="card"><h4>⏰ Appels à faire</h4><div class="stat">2</div></div>
        <div class="card"><h4>💬 Messages</h4><div class="stat">5</div></div>
      </div>
      <h3 class="section-title">📌 Prochain cours</h3>
      <div class="notice">10h00 — Français — 3e A — Salle 102</div>
    `;
  }

  if (currentUser.type === "cpe") {
    return `
      <div class="hero">
        <p class="eyebrow">VIE SCOLAIRE</p>
        <h3>Bonjour ${escapeHtml(firstName)} ✦</h3>
        <p>Tableau de suivi de la vie scolaire.</p>
      </div>
      <div class="grid">
        <div class="card"><h4>🚨 Absences à traiter</h4><div class="stat">6</div></div>
        <div class="card"><h4>⏰ Retards</h4><div class="stat">4</div></div>
        <div class="card"><h4>📄 Justifications</h4><div class="stat">3</div></div>
        <div class="card"><h4>🔨 Retenues</h4><div class="stat">2</div></div>
      </div>
      <h3 class="section-title">⚠️ Dernières demandes</h3>
      ${renderRequests()}
    `;
  }

  return `
    <div class="hero">
      <p class="eyebrow">ADMINISTRATION</p>
      <h3>Bonjour ${escapeHtml(firstName)} ✦</h3>
      <p>Vue générale de l'établissement.</p>
    </div>
    <div class="grid">
      <div class="card"><h4>🎒 Élèves</h4><div class="stat">624</div></div>
      <div class="card"><h4>👩‍🏫 Professeurs</h4><div class="stat">58</div></div>
      <div class="card"><h4>🏫 Classes</h4><div class="stat">21</div></div>
      <div class="card"><h4>🚨 Absences</h4><div class="stat">12</div></div>
    </div>
    <h3 class="section-title">📢 Dernière annonce</h3>
    <div class="notice">Réunion pédagogique mercredi à 16h00.</div>
  `;
}

function renderSchedule() {
  return `
    <h3 class="section-title">Aujourd'hui</h3>
    <div class="schedule">
      ${[
        ["08:00", "Mathématiques", "Salle 101"],
        ["09:00", "Français", "Salle 102"],
        ["10:00", "Récréation", "Cour"],
        ["10:15", "Histoire-Géographie", "Salle 103"],
        ["11:15", "Anglais", "Salle 104"],
        ["13:30", "SVT", "Salle 205"]
      ].map(x => `<div class="lesson"><div class="lesson-time">${x[0]}</div><div><strong>${x[1]}</strong><span>${x[2]}</span></div><span class="badge">${currentUser.type === "student" ? "3e A" : "Cours"}</span></div>`).join("")}
    </div>
  `;
}

function renderCourses() {
  return `
    <h3 class="section-title">📚 Dernières séances</h3>
    <div class="table-wrap"><table><thead><tr><th>Date</th><th>Matière</th><th>Séance</th></tr></thead><tbody>
      <tr><td>06/10</td><td>Français</td><td>Lecture et analyse d'un texte</td></tr>
      <tr><td>05/10</td><td>Mathématiques</td><td>Proportionnalité</td></tr>
      <tr><td>03/10</td><td>Histoire</td><td>La République française</td></tr>
    </tbody></table></div>
  `;
}

function renderHomework() {
  return `
    <h3 class="section-title">📝 Devoirs à venir</h3>
    <div class="table-wrap"><table><thead><tr><th>Matière</th><th>Devoir</th><th>Pour le</th><th>Statut</th></tr></thead><tbody>
      <tr><td>Maths</td><td>Exercices 12 à 18</td><td>08/10</td><td><span class="badge warning">À faire</span></td></tr>
      <tr><td>Français</td><td>Lecture du chapitre 4</td><td>09/10</td><td><span class="badge warning">À faire</span></td></tr>
      <tr><td>Anglais</td><td>Vocabulaire</td><td>10/10</td><td><span class="badge success">Fait</span></td></tr>
    </tbody></table></div>
  `;
}

function renderGrades() {
  return `
    <div class="grid">
      <div class="card"><h4>Moyenne générale</h4><div class="stat">14,8 / 20</div></div>
      <div class="card"><h4>Rang</h4><div class="stat">8e</div><div class="small">sur 29 élèves</div></div>
    </div>
    <h3 class="section-title">📊 Notes</h3>
    <div class="table-wrap"><table><thead><tr><th>Matière</th><th>Note</th><th>Coefficient</th><th>Moyenne</th></tr></thead><tbody>
      <tr><td>Mathématiques</td><td>16/20</td><td>2</td><td>14,2</td></tr>
      <tr><td>Français</td><td>14/20</td><td>1</td><td>13,8</td></tr>
      <tr><td>Anglais</td><td>15/20</td><td>1</td><td>14,9</td></tr>
      <tr><td>Histoire-Géo</td><td>13/20</td><td>1</td><td>14,1</td></tr>
      <tr><td>SVT</td><td>17/20</td><td>1</td><td>15,3</td></tr>
    </tbody></table></div>
  `;
}

function renderAttendance() {
  return `
    <div class="grid">
      <div class="card"><h4>🚨 Absences</h4><div class="stat">1</div></div>
      <div class="card"><h4>⏰ Retards</h4><div class="stat">2</div></div>
    </div>
    <h3 class="section-title">Historique</h3>
    <div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Motif</th><th>État</th></tr></thead><tbody>
      <tr><td>02/10</td><td>Absence</td><td>Rendez-vous</td><td><span class="badge success">Justifiée</span></td></tr>
      <tr><td>29/09</td><td>Retard</td><td>Transport</td><td><span class="badge success">Justifié</span></td></tr>
      <tr><td>18/09</td><td>Retard</td><td>—</td><td><span class="badge danger">Non justifié</span></td></tr>
    </tbody></table></div>
  `;
}

function renderSchoolbook() {
  return `
    <h3 class="section-title">📒 Carnet scolaire</h3>
    <div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Observation</th></tr></thead><tbody>
      <tr><td>04/10</td><td><span class="badge success">Observation</span></td><td>Participation sérieuse en classe.</td></tr>
      <tr><td>25/09</td><td><span class="badge warning">Avertissement</span></td><td>Oubli de matériel.</td></tr>
    </tbody></table></div>
  `;
}

function renderCanteen() {
  return `
    <div class="grid">
      <div class="card"><h4>🍽️ Carte cantine</h4><div class="stat">Active</div></div>
      <div class="card"><h4>📅 Cette semaine</h4><div class="stat">4 / 5</div><div class="small">repas prévus</div></div>
    </div>
    <h3 class="section-title">Réservations</h3>
    <div class="table-wrap"><table><thead><tr><th>Date</th><th>Service</th><th>État</th></tr></thead><tbody>
      <tr><td>Lundi</td><td>12h15</td><td><span class="badge success">Réservé</span></td></tr>
      <tr><td>Mardi</td><td>12h15</td><td><span class="badge success">Réservé</span></td></tr>
      <tr><td>Jeudi</td><td>12h15</td><td><span class="badge">Prévu</span></td></tr>
    </tbody></table></div>
  `;
}

function renderMessages() {
  return `
    <h3 class="section-title">💬 Messagerie</h3>
    <div class="table-wrap"><table><thead><tr><th>Expéditeur</th><th>Objet</th><th>Date</th><th>État</th></tr></thead><tbody>
      <tr><td>Vie scolaire</td><td>Information importante</td><td>Aujourd'hui</td><td><span class="badge warning">Non lu</span></td></tr>
      <tr><td>Professeure de français</td><td>Devoir à rendre</td><td>Hier</td><td><span class="badge success">Lu</span></td></tr>
    </tbody></table></div>
  `;
}

function renderClasses() {
  return `
    <h3 class="section-title">🎒 Classes</h3>
    <div class="grid">
      ${["6e A","6e B","5e A","5e B","4e A","4e B","3e A","3e B","2nde A","2nde B","1ère A","Tle A"].map(c => `<div class="card"><h4>${c}</h4><div class="small">Établissement RP</div></div>`).join("")}
    </div>
  `;
}

function renderStudents() {
  const names = ["Camille Martin","Léa Bernard","Noah Petit","Emma Morel","Hugo Garcia","Inès Robert"];
  return `
    <h3 class="section-title">👥 Élèves</h3>
    <div class="table-wrap"><table><thead><tr><th>Élève</th><th>Classe</th><th>Absences</th><th>Retards</th><th></th></tr></thead><tbody>
      ${names.map((n,i) => `<tr><td>${n}</td><td>${["3e A","3e A","3e B","4e A","4e B","5e A"][i]}</td><td>${i % 3}</td><td>${i % 2}</td><td><button class="action">Ouvrir</button></td></tr>`).join("")}
    </tbody></table></div>
  `;
}

function renderTeachers() {
  return `
    <h3 class="section-title">👩‍🏫 Professeurs</h3>
    <div class="table-wrap"><table><thead><tr><th>Nom</th><th>Matière</th><th>Niveau</th></tr></thead><tbody>
      <tr><td>Mme Dupont</td><td>Français</td><td>Collège</td></tr>
      <tr><td>M. Martin</td><td>Mathématiques</td><td>Collège & Lycée</td></tr>
      <tr><td>Mme Leroy</td><td>Anglais</td><td>Collège & Lycée</td></tr>
    </tbody></table></div>
  `;
}

function renderLateness() {
  return `
    <h3 class="section-title">⏰ Retards à traiter</h3>
    ${renderRequests("retard")}
  `;
}

function renderJustifications() {
  return `
    <h3 class="section-title">📄 Justifications en attente</h3>
    ${renderRequests("justification")}
  `;
}

function renderDetentions() {
  return `
    <h3 class="section-title">🔨 Retenues</h3>
    <div class="table-wrap"><table><thead><tr><th>Élève</th><th>Date</th><th>Motif</th><th>État</th></tr></thead><tbody>
      <tr><td>Noah Petit</td><td>08/10 — 16h</td><td>Retards répétés</td><td><span class="badge warning">Prévue</span></td></tr>
      <tr><td>Emma Morel</td><td>09/10 — 17h</td><td>Devoir non rendu</td><td><span class="badge success">Confirmée</span></td></tr>
    </tbody></table></div>
  `;
}

function renderAnnouncements() {
  return `
    <h3 class="section-title">📢 Annonces</h3>
    <div class="notice"><strong>Réunion pédagogique</strong><br>Mercredi à 16h00 — salle de réunion.</div>
    <br>
    <div class="notice"><strong>Conseils de classe</strong><br>Les conseils débuteront vendredi.</div>
  `;
}

function renderSettings() {
  return `
    <h3 class="section-title">⚙️ Paramètres</h3>
    <div class="card">
      <h4>Compte</h4>
      <p class="small">Utilisateur : ${escapeHtml(currentUser.username)}</p>
      <p class="small">Rôle : ${escapeHtml(currentUser.role)}</p>
      <p class="small">Cette V1 utilise des comptes de démonstration locaux.</p>
    </div>
  `;
}

function renderRequests() {
  const rows = [
    ["Camille Martin","3e A","Retard","Aujourd'hui"],
    ["Noah Petit","3e B","Absence","Aujourd'hui"],
    ["Léa Bernard","3e A","Retard","Hier"]
  ];
  return `<div class="table-wrap"><table><thead><tr><th>Élève</th><th>Classe</th><th>Demande</th><th>Date</th><th></th></tr></thead><tbody>
    ${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td><button class="action" onclick="alert('V1 : cette action sera reliée à la base de données dans la prochaine version.')">Traiter</button></td></tr>`).join("")}
  </tbody></table></div>`;
}

function showApp() {
  $("loginView").classList.add("hidden");
  $("appView").classList.remove("hidden");
  renderNav();
  renderPage("home");
}

$("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const id = $("loginId").value.trim();
  const password = $("loginPassword").value;
  $("loginError").textContent = "";

  if (login(id, password)) {
    showApp();
  } else {
    $("loginError").textContent = "Identifiant ou mot de passe incorrect.";
  }
});

$("logoutBtn").addEventListener("click", logout);

const savedUser = localStorage.getItem("rpSchoolUser");
if (savedUser && USERS[savedUser]) {
  currentUser = { username: savedUser, ...USERS[savedUser] };
  showApp();
}
