// /public/js/admin.js
import { db, serverTimestamp } from "./firebaseConfig.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/** ---------- DOM Handles (adjust IDs only if your HTML differs) ---------- */
const requestsTableBody = document.getElementById("requestsTableBody");
const emptyState = document.getElementById("emptyState");

const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const dateFilterFrom = document.getElementById("dateFrom") || document.getElementById("dateFilter"); // support either
const dateFilterTo = document.getElementById("dateTo"); // optional
const searchInput = document.getElementById("searchInput");

const totalRequestsCount = document.getElementById("totalRequestsCount") || document.getElementById("totalRequests");
const pendingRequestsCount = document.getElementById("pendingRequestsCount") || document.getElementById("pendingRequests");
const scheduledRequestsCount = document.getElementById("scheduledRequestsCount") || document.getElementById("scheduledRequests");
const completedRequestsCount = document.getElementById("completedRequestsCount");

const exportDataBtn = document.getElementById("exportDataBtn");
const loadingSpinner = document.getElementById("loadingSpinner");

/** ------------------------ App State ------------------------ */
let all = [];       // all requests from Firestore
let filtered = [];  // after filters
let unsub = null;   // Firestore unsubscribe
let currentId = null;

/** -------------- Start only after admin is verified -------------- */
window.addEventListener("admin:ready", () => {
  attachUI();
  subscribe();
});

/** ---------------- Firestore: live feed ---------------- */
function subscribe() {
  if (unsub) unsub();
  showLoading(true);
  const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
  unsub = onSnapshot(
    q,
    (snap) => {
      all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      showLoading(false);
      renderStats(all);
      applyFilters(); // and render
    },
    (err) => {
      console.error(err);
      showLoading(false);
      alert("Failed to load data.");
    }
  );
}

/** ---------------------- UI handlers ---------------------- */
function attachUI() {
  statusFilter?.addEventListener("change", applyFilters);
  priorityFilter?.addEventListener("change", applyFilters);
  dateFilterFrom?.addEventListener("change", applyFilters);
  dateFilterTo?.addEventListener("change", applyFilters);
  searchInput?.addEventListener("input", debounce(applyFilters, 200));
  exportDataBtn?.addEventListener("click", () => exportCSV(filtered));

  // Table actions via delegation
  requestsTableBody?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    if (!id) return;

    if (action === "open") openRequest(id);
    if (action === "delete") deleteRequest(id);
    if (action === "set-status") {
      const newStatus = btn.getAttribute("data-status");
      if (newStatus) updateRequest(id, { status: newStatus });
    }
  });
}

/** ------------------ Filters + render table ------------------ */
function applyFilters() {
  const q = (searchInput?.value || "").toLowerCase().trim();
  const status = statusFilter?.value || "";
  const priority = priorityFilter?.value || "";
  const from = dateFilterFrom?.value || "";
  const to = dateFilterTo?.value || "";

  filtered = all.filter((r) => {
    // status/priority
    if (status && (r.status || "new") !== status) return false;
    if (priority && (r.priority || "") !== priority) return false;

    // text search (name/email/phone)
    const name = [r.firstName, r.lastName].filter(Boolean).join(" ").toLowerCase();
    const email = (r.email || "").toLowerCase();
    const phone = (r.phone || "").toLowerCase();
    const hay = `${name} ${email} ${phone}`;
    if (q && !hay.includes(q)) return false;

    // date (createdAt)
    const created = tsToDate(r.createdAt);
    if (from) {
      const ymd = created ? created.toISOString().slice(0, 10) : "";
      if (!ymd || ymd < from) return false;
    }
    if (to) {
      const ymd = created ? created.toISOString().slice(0, 10) : "";
      if (!ymd || ymd > to) return false;
    }
    return true;
  });

  renderTable(filtered);
}

function renderTable(rows) {
  if (!requestsTableBody) return;
  requestsTableBody.innerHTML = "";
  if (!rows.length) {
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (emptyState) emptyState.style.display = "none";

  for (const r of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${fmtDateTime(r.createdAt)}</td>
      <td>${esc(([r.firstName, r.lastName].filter(Boolean).join(" ")) || "—")}</td>
      <td>
        <div>${esc(r.email || "—")}</div>
        <div>${esc(r.phone || "")}</div>
      </td>
      <td>${(r.services || []).map(s => `<span class="tag">${esc(s)}</span>`).join(" ") || "—"}</td>
      <td><span class="badge badge-${(r.status || "new").replace(/_/g,"-")}">${esc(r.status || "new")}</span></td>
      <td><span class="badge priority-${esc(r.priority || "low")}">${esc(r.priority || "low")}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn small" data-action="open" data-id="${r.id}">Open</button>
          <button class="btn small danger" data-action="delete" data-id="${r.id}">Delete</button>
        </div>
      </td>
    `;
    requestsTableBody.appendChild(tr);
  }
}

/** --------------------- Stats (overview) --------------------- */
function renderStats(items) {
  if (totalRequestsCount) totalRequestsCount.textContent = items.length.toString();
  if (pendingRequestsCount) pendingRequestsCount.textContent = items.filter(x => (x.status || "new") === "new").length;
  if (scheduledRequestsCount) scheduledRequestsCount.textContent = items.filter(x => x.status === "scheduled").length;
  if (completedRequestsCount) completedRequestsCount.textContent = items.filter(x => x.status === "completed").length;
}

/** ---------------------- Open / Update / Delete ---------------------- */
async function openRequest(id) {
  currentId = id;
  // Example: if you have a modal, fetch a fresh doc and fill it here
  const snap = await getDoc(doc(db, "submissions", id));
  if (!snap.exists()) return alert("Record not found.");
  const r = { id: snap.id, ...snap.data() };
  // TODO: populate your modal fields by IDs (customerName, etc.)
  alert(`Open: ${[r.firstName, r.lastName].filter(Boolean).join(" ") || r.email || r.id}`);
}

async function updateRequest(id, partial) {
  try {
    await updateDoc(doc(db, "submissions", id), {
      ...partial,
      updatedAt: serverTimestamp(),
    });
    // Optional audit trail
    await addDoc(collection(db, "submissions", id, "history"), {
      what: "update",
      diff: partial,
      when: serverTimestamp(),
    });
  } catch (e) {
    console.error(e);
    alert("Failed to update.");
  }
}

async function deleteRequest(id) {
  if (!confirm("Delete this request? This cannot be undone.")) return;
  try {
    await deleteDoc(doc(db, "submissions", id));
  } catch (e) {
    console.error(e);
    alert("Failed to delete.");
  }
}

/** -------------------------- Export CSV -------------------------- */
function exportCSV(rows) {
  const headers = ["id","createdAt","firstName","lastName","email","phone","services","preferredHub","status","priority","adminNotes"];
  const out = [headers.join(",")];
  rows.forEach(r => {
    const vals = [
      r.id,
      tsToDate(r.createdAt)?.toISOString() || "",
      r.firstName || "",
      r.lastName || "",
      r.email || "",
      r.phone || "",
      (r.services || []).join("|"),
      r.preferredHub || "",
      r.status || "new",
      r.priority || "low",
      (r.adminNotes || "").replace(/\n/g," ").replace(/"/g,'""'),
    ].map(csv);
    out.push(vals.join(","));
  });
  const blob = new Blob([out.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: `submissions_${new Date().toISOString().slice(0,10)}.csv` });
  document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
}

/** ----------------------------- Utils ----------------------------- */
function tsToDate(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();
  try { return new Date(ts); } catch { return null; }
}
function fmtDateTime(ts) {
  const d = tsToDate(ts);
  if (!d) return "—";
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}
function esc(s) {
  return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function csv(s) {
  const v = String(s ?? "");
  return /[",\n]/.test(v) ? `"${v.replace(/"/g,'""')}"` : v;
}
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

// (Optional) expose some helpers globally ONLY if your HTML uses onclick="..."
// window.viewRequest = openRequest;
// window.deleteRequest = deleteRequest;
// window.exportData = () => exportCSV(filtered);
