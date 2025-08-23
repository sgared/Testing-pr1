// Sample data (in a real app, this would come from your backend)
      let ticketsData = [
        {
          id: "MC-2025-001",
          firstName: "John",
          lastName: "Smith",
          phone: "(501) 555-0123",
          email: "john.smith@email.com",
          city: "Little Rock",
          zipCode: "72201",
          preferredHub: "alexa",
          services: ["lighting", "security"],
          goals:
            "Looking to automate my home lighting and add basic security cameras for peace of mind.",
          status: "new",
          priority: "medium",
          submitted: "2025-01-15T10:30:00",
          lastContact: null,
        },
        {
          id: "MC-2025-002",
          firstName: "Sarah",
          lastName: "Johnson",
          phone: "(501) 555-0456",
          email: "sarah.j@email.com",
          city: "Conway",
          zipCode: "72032",
          preferredHub: "google",
          services: ["lighting", "locks", "wifi"],
          goals:
            "Want complete smart home setup for elderly parents including emergency features.",
          status: "contacted",
          priority: "high",
          submitted: "2025-01-14T14:15:00",
          lastContact: "2025-01-15T09:00:00",
        },
        {
          id: "MC-2025-003",
          firstName: "Michael",
          lastName: "Davis",
          phone: "(501) 555-0789",
          email: "mike.davis@email.com",
          city: "North Little Rock",
          zipCode: "72114",
          preferredHub: "apple",
          services: ["security", "safety"],
          goals:
            "Need security cameras and smart smoke detectors for new home.",
          status: "scheduled",
          priority: "medium",
          submitted: "2025-01-13T16:45:00",
          lastContact: "2025-01-14T11:30:00",
        },
        {
          id: "MC-2025-004",
          firstName: "Emily",
          lastName: "Wilson",
          phone: "(501) 555-0321",
          email: "emily.wilson@email.com",
          city: "Benton",
          zipCode: "72015",
          preferredHub: "unsure",
          services: ["lighting", "elder"],
          goals:
            "Smart lighting and panic button system for grandmother living alone.",
          status: "completed",
          priority: "high",
          submitted: "2025-01-10T11:20:00",
          lastContact: "2025-01-12T15:00:00",
        },
        {
          id: "MC-2025-005",
          firstName: "Robert",
          lastName: "Brown",
          phone: "(501) 555-0654",
          email: "rob.brown@email.com",
          city: "Jacksonville",
          zipCode: "72076",
          preferredHub: "alexa",
          services: ["wifi", "lighting"],
          goals:
            "Upgrade home Wi-Fi and add smart lighting to main living areas.",
          status: "new",
          priority: "low",
          submitted: "2025-01-16T09:15:00",
          lastContact: null,
        },
      ];

      let filteredTickets = [...ticketsData];

      // Initialize the page
      document.addEventListener("DOMContentLoaded", function () {
        renderTicketsTable();
        updateStats();
      });

      // Render tickets table
      function renderTicketsTable() {
        const tbody = document.getElementById("ticketsTableBody");
        tbody.innerHTML = "";

        filteredTickets.forEach((ticket) => {
          const row = document.createElement("tr");
          row.innerHTML = `
          <td><strong>${ticket.id}</strong></td>
          <td>
            <div class="customer-info">
              <div class="customer-name">${ticket.firstName} ${
            ticket.lastName
          }</div>
              <div class="customer-details">${ticket.phone}<br>${
            ticket.email
          }</div>
            </div>
          </td>
          <td>
            <div class="services-list">
              ${ticket.services
                .map(
                  (service) =>
                    `<span class="service-tag">${formatService(service)}</span>`
                )
                .join("")}
            </div>
          </td>
          <td>${formatHub(ticket.preferredHub)}</td>
          <td><span class="status-badge status-${ticket.status}">${formatStatus(
            ticket.status
          )}</span></td>
          <td><span class="status-badge priority-${ticket.priority}">${
            ticket.priority
          }</span></td>
          <td>${formatDate(ticket.submitted)}</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn btn-view" onclick="viewTicket('${
                ticket.id
              }')">👁️ View</button>
              <button class="action-btn btn-edit" onclick="editTicket('${
                ticket.id
              }')">✏️ Edit</button>
              <button class="action-btn btn-delete" onclick="deleteTicket('${
                ticket.id
              }')">🗑️ Delete</button>
            </div>
          </td>
        `;
          tbody.appendChild(row);
        });
      }

      // Filter tickets
      function filterTickets() {
        const statusFilter = document.getElementById("statusFilter").value;
        const priorityFilter = document.getElementById("priorityFilter").value;
        const dateFrom = document.getElementById("dateFrom").value;
        const dateTo = document.getElementById("dateTo").value;
        const searchInput = document
          .getElementById("searchInput")
          .value.toLowerCase();

        filteredTickets = ticketsData.filter((ticket) => {
          const matchesStatus = !statusFilter || ticket.status === statusFilter;
          const matchesPriority =
            !priorityFilter || ticket.priority === priorityFilter;
          const matchesSearch =
            !searchInput ||
            ticket.firstName.toLowerCase().includes(searchInput) ||
            ticket.lastName.toLowerCase().includes(searchInput) ||
            ticket.email.toLowerCase().includes(searchInput);

          const ticketDate = new Date(ticket.submitted)
            .toISOString()
            .split("T")[0];
          const matchesDateFrom = !dateFrom || ticketDate >= dateFrom;
          const matchesDateTo = !dateTo || ticketDate <= dateTo;

          return (
            matchesStatus &&
            matchesPriority &&
            matchesSearch &&
            matchesDateFrom &&
            matchesDateTo
          );
        });

        renderTicketsTable();
      }

      // View ticket details
      function viewTicket(ticketId) {
        const ticket = ticketsData.find((t) => t.id === ticketId);
        if (!ticket) return;

        const modalBody = document.getElementById("modalBody");
        modalBody.innerHTML = `
        <div class="detail-group">
          <div class="detail-label">Customer Information</div>
          <div class="detail-value">
            <strong>${ticket.firstName} ${ticket.lastName}</strong><br>
            📞 ${ticket.phone}<br>
            ✉️ ${ticket.email}<br>
            📍 ${ticket.city}, AR ${ticket.zipCode}
          </div>
        </div>

        <div class="detail-group">
          <div class="detail-label">Smart Home Preferences</div>
          <div class="detail-value">
            <strong>Hub:</strong> ${formatHub(ticket.preferredHub)}<br>
            <strong>Services:</strong> ${ticket.services
              .map(formatService)
              .join(", ")}
          </div>
        </div>

        <div class="detail-group">
          <div class="detail-label">Customer Goals</div>
          <div class="detail-value">${ticket.goals}</div>
        </div>

        <div class="detail-group">
          <div class="detail-label">Status & Priority</div>
          <div class="detail-value">
            <span class="status-badge status-${ticket.status}">${formatStatus(
          ticket.status
        )}</span>
            <span class="status-badge priority-${ticket.priority}">${
          ticket.priority
        }</span>
          </div>
        </div>

        <div class="detail-group">
          <div class="detail-label">Timeline</div>
          <div class="detail-value">
            <strong>Submitted:</strong> ${formatDate(ticket.submitted)}<br>
            ${
              ticket.lastContact
                ? `<strong>Last Contact:</strong> ${formatDate(
                    ticket.lastContact
                  )}`
                : "<em>No contact yet</em>"
            }
          </div>
        </div>

        <div class="detail-group">
          <div class="detail-label">Actions</div>
          <div class="detail-value">
            <div class="action-buttons">
              <button class="action-btn btn-edit" onclick="updateTicketStatus('${
                ticket.id
              }', 'contacted')">Mark as Contacted</button>
              <button class="action-btn btn-edit" onclick="updateTicketStatus('${
                ticket.id
              }', 'scheduled')">Mark as Scheduled</button>
              <button class="action-btn btn-view" onclick="updateTicketStatus('${
                ticket.id
              }', 'completed')">Mark as Completed</button>
            </div>
          </div>
        </div>
      `;

        document.getElementById("ticketModal").classList.add("active");
      }

      // Edit ticket
      function editTicket(ticketId) {
        // In a real app, this would open an edit form
        alert(
          `Edit functionality for ticket ${ticketId} would be implemented here`
        );
      }

      // Delete ticket
      function deleteTicket(ticketId) {
        if (
          confirm("Are you sure you want to delete this consultation request?")
        ) {
          deleteTicketFromFirestore(ticketId);
        }
      }

      // Update ticket status
      function updateTicketStatus(ticketId, newStatus) {
        updateTicketInFirestore(ticketId, {
          status: newStatus,
          lastContact: new Date().toISOString(),
        });
        closeModal();
      }

      // Close modal
      function closeModal() {
        document.getElementById("ticketModal").classList.remove("active");
      }

      // Export data
      function exportData() {
        const csvContent = generateCSV(filteredTickets);
        downloadCSV(csvContent, "consultation-requests.csv");
      }

      // Generate CSV
      function generateCSV(data) {
        const headers = [
          "ID",
          "First Name",
          "Last Name",
          "Phone",
          "Email",
          "City",
          "ZIP",
          "Hub",
          "Services",
          "Status",
          "Priority",
          "Submitted",
          "Goals",
        ];
        const csvRows = [headers.join(",")];

        data.forEach((ticket) => {
          const row = [
            ticket.id,
            ticket.firstName,
            ticket.lastName,
            ticket.phone,
            ticket.email,
            ticket.city,
            ticket.zipCode,
            ticket.preferredHub,
            ticket.services.join(";"),
            ticket.status,
            ticket.priority,
            ticket.submitted,
            `"${ticket.goals.replace(/"/g, '""')}"`,
          ];
          csvRows.push(row.join(","));
        });

        return csvRows.join("\n");
      }

      // Download CSV
      function downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      // Update stats
      function updateStats() {
        document.getElementById("totalRequests").textContent =
          ticketsData.length;
        document.getElementById("pendingRequests").textContent =
          ticketsData.filter((t) => t.status === "new").length;
        document.getElementById("scheduledRequests").textContent =
          ticketsData.filter((t) => t.status === "scheduled").length;
      }

      // Format functions
      function formatService(service) {
        const serviceMap = {
          lighting: "Smart Lighting",
          security: "Security",
          locks: "Smart Locks",
          wifi: "Mesh Wi-Fi",
          safety: "Safety",
          elder: "Elder Care",
        };
        return serviceMap[service] || service;
      }

      function formatHub(hub) {
        const hubMap = {
          alexa: "Amazon Alexa",
          google: "Google Home",
          apple: "Apple HomeKit",
          unsure: "Not Sure",
        };
        return hubMap[hub] || hub;
      }

      function formatStatus(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
      }

      function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // Logout function
      function logout() {
        if (confirm("Are you sure you want to logout?")) {
          // Clear session and redirect
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = "login.html"; // You'll need to create this
        }
      }

      // Close modal when clicking outside
      document
        .getElementById("ticketModal")
        .addEventListener("click", function (e) {
          if (e.target === this) {
            closeModal();
          }
        });

      // ===== FIRESTORE INTEGRATION =====

      // Firebase configuration (replace with your config)
      const firebaseConfig = {
        apiKey: "your-api-key",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "your-app-id",
      };

      // Initialize Firebase
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
      import {
        getFirestore,
        collection,
        getDocs,
        doc,
        updateDoc,
        deleteDoc,
        addDoc,
        onSnapshot,
        query,
        orderBy,
        where,
      } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
      import {
        getAuth,
        signInWithEmailAndPassword,
        onAuthStateChanged,
        signOut,
      } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const auth = getAuth(app);

      // Authentication check
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          // User is not authenticated, redirect to login
          window.location.href = "login.html";
        } else {
          // User is authenticated, load data
          loadTicketsFromFirestore();
        }
      });

      // Load tickets from Firestore
      async function loadTicketsFromFirestore() {
        try {
          const q = query(
            collection(db, "consultations"),
            orderBy("submitted", "desc")
          );

          // Real-time listener
          onSnapshot(q, (querySnapshot) => {
            ticketsData = [];
            querySnapshot.forEach((doc) => {
              ticketsData.push({
                id: doc.id,
                ...doc.data(),
              });
            });

            filteredTickets = [...ticketsData];
            renderTicketsTable();
            updateStats();
          });
        } catch (error) {
          console.error("Error loading tickets:", error);
          showNotification("Error loading data from server", "error");
        }
      }

      // Update ticket in Firestore
      async function updateTicketInFirestore(ticketId, updates) {
        try {
          const ticketRef = doc(db, "consultations", ticketId);
          await updateDoc(ticketRef, {
            ...updates,
            updatedAt: new Date().toISOString(),
          });

          showNotification("Ticket updated successfully", "success");
        } catch (error) {
          console.error("Error updating ticket:", error);
          showNotification("Error updating ticket", "error");
        }
      }

      // Delete ticket from Firestore
      async function deleteTicketFromFirestore(ticketId) {
        try {
          await deleteDoc(doc(db, "consultations", ticketId));
          showNotification("Ticket deleted successfully", "success");
        } catch (error) {
          console.error("Error deleting ticket:", error);
          showNotification("Error deleting ticket", "error");
        }
      }

      // Add new ticket to Firestore (for form submissions)
      async function addTicketToFirestore(ticketData) {
        try {
          const docRef = await addDoc(collection(db, "consultations"), {
            ...ticketData,
            status: "new",
            priority: "medium",
            submitted: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          console.log("Document written with ID: ", docRef.id);
          return docRef.id;
        } catch (error) {
          console.error("Error adding ticket:", error);
          throw error;
        }
      }

      // Logout with Firebase Auth
      async function logout() {
        if (confirm("Are you sure you want to logout?")) {
          try {
            await signOut(auth);
            window.location.href = "login.html";
          } catch (error) {
            console.error("Error signing out:", error);
            showNotification("Error signing out", "error");
          }
        }
      }

      // Show notification
      function showNotification(message, type = "info") {
        // Create notification element
        const notification = document.createElement("div");
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transition: all 0.3s ease;
        max-width: 400px;
      `;

        // Set color based on type
        switch (type) {
          case "success":
            notification.style.background = "#22c55e";
            break;
          case "error":
            notification.style.background = "#ef4444";
            break;
          case "warning":
            notification.style.background = "#f59e0b";
            break;
          default:
            notification.style.background = "#3b82f6";
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
          notification.style.opacity = "0";
          notification.style.transform = "translateX(100%)";
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 5000);
      }

      // Advanced filtering with Firestore queries
      async function filterTicketsAdvanced() {
        const statusFilter = document.getElementById("statusFilter").value;
        const priorityFilter = document.getElementById("priorityFilter").value;

        try {
          let q = collection(db, "consultations");

          if (statusFilter) {
            q = query(q, where("status", "==", statusFilter));
          }

          if (priorityFilter) {
            q = query(q, where("priority", "==", priorityFilter));
          }

          q = query(q, orderBy("submitted", "desc"));

          const querySnapshot = await getDocs(q);
          ticketsData = [];
          querySnapshot.forEach((doc) => {
            ticketsData.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          filteredTickets = [...ticketsData];
          renderTicketsTable();
        } catch (error) {
          console.error("Error filtering tickets:", error);
          // Fallback to client-side filtering
          filterTickets();
        }
      }

      // Export to Firestore backup
      async function exportToFirestoreBackup() {
        try {
          const backupData = {
            exportDate: new Date().toISOString(),
            totalRecords: ticketsData.length,
            data: ticketsData,
          };

          await addDoc(collection(db, "backups"), backupData);
          showNotification("Data exported to backup successfully", "success");
        } catch (error) {
          console.error("Error creating backup:", error);
          showNotification("Error creating backup", "error");
        }
      }

      // Load sample data (for initial setup)
      async function loadSampleData() {
        const sampleTickets = [
          {
            firstName: "John",
            lastName: "Smith",
            phone: "(501) 555-0123",
            email: "john.smith@email.com",
            city: "Little Rock",
            zipCode: "72201",
            preferredHub: "alexa",
            services: ["lighting", "security"],
            goals:
              "Looking to automate my home lighting and add basic security cameras for peace of mind.",
            status: "new",
            priority: "medium",
          },
          // Add more sample data as needed
        ];

        for (const ticket of sampleTickets) {
          try {
            await addTicketToFirestore(ticket);
          } catch (error) {
            console.error("Error adding sample ticket:", error);
          }
        }

        showNotification("Sample data loaded", "success");
      }
// /public/js/main.admin.js

// Simple section switching
const sections = {
  overview: document.getElementById("overview-section"),
  requests: document.getElementById("requests-section"),
  customers: document.getElementById("customer-section"),
};
function showSection(name) {
  Object.values(sections).forEach((el) => el.classList.remove("active"));
  sections[name]?.classList.add("active");
  // Highlight nav button
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  document.querySelector(`.nav-btn[data-section="${name}"]`)?.classList.add("active");
}
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => showSection(btn.dataset.section));
});

// Overview cards → Requests with filter
document.querySelectorAll(".stat-card.clickable").forEach((card) => {
  card.addEventListener("click", () => {
    const filter = card.getAttribute("data-filter") || "";
    const title = card.querySelector(".stat-title")?.textContent?.trim() || "Requests";
    const statusFilter = document.getElementById("statusFilter");
    // "all" means clear the filter
    statusFilter.value = filter === "all" ? "" : filter;
    document.getElementById("requestsSectionTitle").textContent = title;
    showSection("requests");
    // Trigger a change so JS can refilter
    statusFilter.dispatchEvent(new Event("change"));
  });
});

// Back buttons
document.getElementById("backToOverviewBtn")?.addEventListener("click", () => {
  showSection("overview");
});
document.getElementById("backFromCustomerBtn")?.addEventListener("click", () => {
  showSection("overview");
});

// Default section on load
showSection("overview");

      // Initialize with sample data if needed (remove in production)
      // Uncomment the line below to load sample data on first run
      // loadSampleData();