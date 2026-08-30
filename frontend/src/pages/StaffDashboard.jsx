import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  Home as HomeIcon,
  Search,
  ShieldAlert,
  FileText,
  Building,
  UserCheck
} from "lucide-react";
import { getCurrentUser, logout } from "../services/authapi";
import { getStats, fetchComplaintsApi } from "../services/complaintApi";
import { updateIssueStatus } from "../services/staffApi";

export function StaffDashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isStaffOrAdmin =
    currentUser &&
    (currentUser.role === "staff" ||
      currentUser.role === "admin" ||
      currentUser.username?.toLowerCase().includes("staff") ||
      currentUser.username?.toLowerCase().includes("admin"));

  const [activeTab, setActiveTab] = useState("queue"); // "queue" | "resolved"
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    const complaints = await fetchComplaintsApi();
    setIssues(complaints);
    setLoading(false);
  };

  useEffect(() => {
    if (isStaffOrAdmin) {
      loadData();
    }
  }, []);

  if (!isStaffOrAdmin) {
    return (
      <div
        style={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }}
      >
        <div
          className="brutal-card coral hover-rotate"
          style={{
            maxWidth: "520px",
            width: "100%",
            padding: "3rem",
            textAlign: "center",
            backgroundColor: "var(--white)"
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "var(--coral)",
              color: "var(--white)",
              border: "3px solid var(--primary-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontWeight: "800"
            }}
          >
            <ShieldAlert size={36} />
          </div>

          <h2
            style={{
              fontSize: "2rem",
              marginBottom: "1rem",
              textTransform: "uppercase",
              fontFamily: "var(--font-display)"
            }}
          >
            YOU DON'T HAVE ACCESS TO THIS
          </h2>

          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              marginBottom: "2rem",
              lineHeight: "1.5"
            }}
          >
            The Staff Portal is restricted to authorized municipal field officers and staff. Please sign in with staff credentials to access your dispatch queue.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/login" className="brutal-btn primary">
              Sign In
            </Link>
            <Link to="/" className="brutal-btn yellow">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (issueId, newStatus) => {
    await updateIssueStatus(issueId, newStatus);
    await loadData();
  };

  const handleAcceptTask = async (issueId) => {
    await updateIssueStatus(issueId, "Under Review");
    await loadData();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const currentUserId = currentUser?._id || currentUser?.id;
  const currentUserEmail = currentUser?.email?.toLowerCase();
  const currentUserName = (currentUser?.name || currentUser?.fullName || "").toLowerCase();
  const currentUserDept = currentUser?.department;
  const isAdmin = currentUser?.role === "admin";

  const isAssignedToMe = (issue) => {
    if (isAdmin) return true; // Admins view all tasks

    if (!issue.assignedTo && !issue.assignedDepartment) return false;

    const currentIdStr = String(currentUserId || "");

    if (issue.assignedTo) {
      const assignedIdStr = typeof issue.assignedTo === "string"
        ? issue.assignedTo
        : String(issue.assignedTo._id || issue.assignedTo.id || "");

      if (assignedIdStr && currentIdStr && assignedIdStr === currentIdStr) {
        return true;
      }

      if (typeof issue.assignedTo === "object" && issue.assignedTo !== null) {
        const assignedEmail = (issue.assignedTo.email || "").toLowerCase();
        const assignedName = (issue.assignedTo.name || "").toLowerCase();

        if (assignedEmail && currentUserEmail && assignedEmail === currentUserEmail) {
          return true;
        }

        if (assignedName && currentUserName && assignedName === currentUserName) {
          return true;
        }
      }
    }

    if (currentUserDept && issue.assignedDepartment && issue.assignedDepartment.trim().toLowerCase() === currentUserDept.trim().toLowerCase()) {
      return true;
    }

    return false;
  };

  const myStaffIssues = issues.filter(isAssignedToMe);

  const activeIssues = myStaffIssues.filter((i) => {
    const s = (i.status || "").toLowerCase();
    return s === "assigned" || s === "open" || s === "pending" || s === "in_progress" || s === "in progress" || s === "under review";
  });
  const resolvedIssues = myStaffIssues.filter((i) => {
    const s = (i.status || "").toLowerCase();
    return s === "resolved";
  });

  const displayedList = (activeTab === "queue" ? activeIssues : resolvedIssues).filter(
    (issue) =>
      searchTerm === "" ||
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.id && issue.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-color)",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          minHeight: "100vh",
          backgroundColor: "var(--primary-color)",
          color: "var(--white)",
          padding: "2rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          flexShrink: 0
        }}
      >
        {/* Brand */}
        <div>
          <Link to="/" style={{ color: "var(--white)", textDecoration: "none" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.4rem",
                fontWeight: "800",
                borderBottom: "2px solid var(--white)",
                paddingBottom: "1.5rem",
              }}
            >
              THE CIVIC VOICE
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  marginTop: "0.4rem",
                  color: "var(--lime)",
                  fontWeight: "bold"
                }}
              >
                STAFF DISPATCH PORTAL
              </div>
            </div>
          </Link>
        </div>

        {/* Staff User Profile Tag */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "2px solid var(--white)",
          padding: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            backgroundColor: "var(--lime)",
            color: "var(--primary-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "1rem"
          }}>
            {(currentUser?.fullName?.charAt(0) || "S").toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "0.85rem", textTransform: "uppercase" }}>
              {currentUser?.fullName || "Staff Officer"}
            </div>
            <div style={{ fontSize: "0.7rem", opacity: 0.8 }}>Field Inspector</div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <button
            className={`admin-nav-item ${activeTab === "queue" ? "active" : ""}`}
            onClick={() => setActiveTab("queue")}
          >
            <ClipboardList size={18} />
            My Dispatch Queue ({activeIssues.length})
          </button>

          <button
            className={`admin-nav-item ${activeTab === "resolved" ? "active" : ""}`}
            onClick={() => setActiveTab("resolved")}
          >
            <CheckCircle size={18} />
            Resolved Complaints ({resolvedIssues.length})
          </button>

          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.2)", margin: "0.5rem 0" }}></div>

          <button className="admin-nav-item" onClick={() => navigate("/")}>
            <HomeIcon size={18} />
            Public Website
          </button>
        </nav>

        {/* Logout */}
        <div style={{ marginTop: "auto" }}>
          <button className="admin-nav-item" onClick={handleLogout} style={{ borderColor: "var(--coral)" }}>
            <LogOut size={18} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main
        style={{
          flex: 1,
          padding: "3rem",
          maxWidth: "1400px",
          overflowX: "hidden"
        }}
      >
        {/* Header Title Section */}
        <div style={{ marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "var(--lime)",
              border: "2px solid var(--primary-color)",
              padding: "0.5rem 1rem",
              fontWeight: "800",
              marginBottom: "1rem",
            }}
          >
            MUNICIPAL FIELD DISPATCH • WARD OPERATIONS
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: "0.95",
              margin: 0,
              textTransform: "uppercase"
            }}
          >
            {activeTab === "queue" ? "ACTIVE WORK QUEUE" : "RESOLVED GRIEVANCES"}
          </h1>

          <p
            style={{
              marginTop: "1rem",
              maxWidth: "650px",
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
            }}
          >
            Inspect reported infrastructure problems, update field resolution statuses, and mark grievances resolved for public tracking.
          </p>
        </div>

        {/* Stats Row */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem",
            marginBottom: "3rem",
          }}
        >
          <div className="brutal-card yellow" style={{ padding: "1.5rem" }}>
            <ClipboardList size={28} />
            <div style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)", marginTop: "0.5rem" }}>
              {activeIssues.length}
            </div>
            <div style={{ fontWeight: "800" }}>DISPATCH QUEUE</div>
          </div>

          <div className="brutal-card lavender" style={{ padding: "1.5rem" }}>
            <Clock size={28} />
            <div style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)", marginTop: "0.5rem" }}>
              {issues.filter(i => i.status === "IN_PROGRESS" || i.status === "In Progress").length}
            </div>
            <div style={{ fontWeight: "800" }}>IN PROGRESS</div>
          </div>

          <div className="brutal-card lime" style={{ padding: "1.5rem" }}>
            <CheckCircle size={28} />
            <div style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)", marginTop: "0.5rem" }}>
              {resolvedIssues.length}
            </div>
            <div style={{ fontWeight: "800" }}>RESOLVED BY STAFF</div>
          </div>
        </section>

        {/* Search Bar */}
        <div className="brutal-card" style={{ padding: "1.25rem", marginBottom: "2rem", display: "flex", gap: "1rem" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input
              type="text"
              className="brutal-input"
              placeholder="Search queue by grievance title, ward, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>
        </div>

        {/* Complaints List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {displayedList.length === 0 ? (
            <div className="brutal-card yellow" style={{ padding: "3rem", textAlign: "center" }}>
              <h3>NO COMPLAINTS FOUND IN THIS QUEUE</h3>
              <p style={{ color: "var(--text-secondary)" }}>All clear! No pending grievances require staff dispatch right now.</p>
            </div>
          ) : (
            displayedList.map((issue) => (
              <div
                key={issue.id}
                className="brutal-card"
                style={{
                  padding: "1.5rem",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "1.5rem",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span className="badge" style={{ backgroundColor: "var(--yellow)" }}>{issue.category}</span>
                    <span className={`badge ${issue.status === 'RESOLVED' || issue.status === 'Resolved' ? 'status-resolved' : 'status-open'}`}>
                      STATUS: {issue.status}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: "bold" }}>{issue.id}</span>
                    {issue.assignedTo && (
                      <span className="badge" style={{ backgroundColor: "var(--lavender)", color: "var(--primary-color)", fontWeight: "bold" }}>
                        ASSIGNED TO: {issue.assignedTo.name}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", textTransform: "none" }}>
                    <Link to={`/problems/${issue.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {issue.title}
                    </Link>
                  </h3>

                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                    {issue.description}
                  </p>

                  <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                    <span>{issue.location}</span>
                    <span>Reported by: {issue.reporterName}</span>
                    <span>Date: {issue.dateReported}</span>
                    <span style={{ color: "var(--coral)", fontWeight: "bold" }}>▲ {issue.upvotes} Upvotes</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                  {(
                    (issue.status || "").toLowerCase() === "assigned" ||
                    (issue.status || "").toLowerCase() === "pending" ||
                    (issue.status || "").toLowerCase() === "open" ||
                    (issue.status || "").toLowerCase() === "under review"
                  ) && (
                    <button
                      className="brutal-btn lime"
                      onClick={() => handleAcceptTask(issue.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontWeight: "800",
                        fontSize: "0.85rem"
                      }}
                    >
                      <UserCheck size={18} />
                      <span>ACCEPT TASK</span>
                    </button>
                  )}

                  <div style={{ fontWeight: "800", fontSize: "0.75rem", textTransform: "uppercase" }}>
                    Update Status:
                  </div>
                  <select
                    className="brutal-select"
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    style={{ padding: "0.4rem 0.8rem", width: "170px", fontSize: "0.85rem" }}
                  >
                    {(issue.status === "Pending" || issue.status === "Assigned") && (
                      <option value={issue.status} disabled>
                        {issue.status === "Pending" ? "Pending" : "Assigned"}
                      </option>
                    )}
                    <option value="Under Review">Under Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <Link to={`/problems/${issue.id}`} className="brutal-btn small yellow" style={{ textDecoration: "none" }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Dashboard styles */}
      <style>{`
        .admin-nav-item {
          width: 100%;
          min-height: 48px;
          border: 2px solid var(--white);
          background: transparent;
          color: var(--white);
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .admin-nav-item:hover, .admin-nav-item.active {
          background: var(--white);
          color: var(--primary-color);
          transform: translate(3px, -3px);
          box-shadow: 4px 4px 0 var(--coral);
        }

        @media (max-width: 768px) {
          aside {
            width: 200px !important;
          }

          main {
            padding: 2rem 1.25rem !important;
          }
        }

        @media (max-width: 600px) {
          aside {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
