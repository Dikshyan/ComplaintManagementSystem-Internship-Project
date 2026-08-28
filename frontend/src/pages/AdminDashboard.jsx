import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  AlertCircle,
  Clock,
  CheckCircle,
  ThumbsUp,
  Home as HomeIcon,
  Search,
  Filter,
  Shield,
  Bell,
  Check,
  UserCheck
} from "lucide-react";
import {
  getCurrentUser,
  getStats,
  getIssues,
  fetchComplaintsApi,
  updateIssueStatus,
  fetchUsersApi,
  logout
} from "../services/client";
import { ShieldAlert } from "lucide-react";

export function AdminDashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.username?.toLowerCase().includes('admin'));

  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "issues" | "users" | "settings"
  
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    progress: 0,
    active: 0,
    totalVotes: 0,
  });

  const [issues, setIssues] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for Browse Issues tab inside Admin Panel
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Settings toggles state
  const [settings, setSettings] = useState({
    autoNotifyBbmp: true,
    autoEscalate: true,
    publicCommentsAllowed: true,
    emailAlerts: false
  });

  const loadData = async () => {
    setLoading(true);
    const complaints = await fetchComplaintsApi();
    setIssues(complaints);
    setStats(await getStats());
    
    const users = await fetchUsersApi();
    setUsersList(users);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, []);

  if (!isAdmin) {
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
            The Civic Control Center is restricted to authorized administrators only. Please sign in with an administrative account to view or manage community complaints.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/login" className="brutal-btn primary">
              Sign In as Admin
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Filtered issues for the "Browse Issues" view inside Admin Panel
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = searchTerm === "" || 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.id && issue.id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || issue.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

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
                  fontSize: "0.7rem",
                  marginTop: "0.4rem",
                  color: "var(--yellow)",
                  opacity: 0.9,
                }}
              >
                ADMIN CONTROL CENTER
              </div>
            </div>
          </Link>
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
            className={`admin-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className={`admin-nav-item ${activeTab === "issues" ? "active" : ""}`}
            onClick={() => setActiveTab("issues")}
          >
            <FileText size={18} />
            Browse Issues
          </button>

          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={18} />
            Users
          </button>

          <button
            className={`admin-nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={18} />
            Settings
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
              backgroundColor: "var(--yellow)",
              border: "2px solid var(--primary-color)",
              padding: "0.5rem 1rem",
              fontWeight: "800",
              marginBottom: "1rem",
            }}
          >
            CIVIC CONTROL CENTER • {activeTab.toUpperCase()}
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: "0.95",
              margin: 0,
              textTransform: "uppercase"
            }}
          >
            {activeTab === "dashboard" && "OVERVIEW DASHBOARD"}
            {activeTab === "issues" && "BROWSE ALL ISSUES"}
            {activeTab === "users" && "REGISTERED CITIZENS & USERS"}
            {activeTab === "settings" && "SYSTEM CONTROL SETTINGS"}
          </h1>

          <p
            style={{
              marginTop: "1rem",
              maxWidth: "650px",
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
            }}
          >
            {activeTab === "dashboard" && "Monitor community complaints, track resolution metrics, and update issue statuses across wards."}
            {activeTab === "issues" && "Filter and manage all submitted civic complaints, update status flags, and monitor resolution timelines."}
            {activeTab === "users" && "Manage registered active citizens, municipal staff accounts, and administrator permissions."}
            {activeTab === "settings" && "Configure ward notification routing, automated status updates, and civic integration settings."}
          </p>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div>
            {/* Statistics Row */}
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1.25rem",
                marginBottom: "3rem",
              }}
            >
              <div className="brutal-card yellow" style={{ padding: "1.5rem" }}>
                <FileText size={28} />
                <div style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)", marginTop: "0.5rem" }}>
                  {stats.total}
                </div>
                <div style={{ fontWeight: "800" }}>TOTAL COMPLAINTS</div>
              </div>

              <div className="brutal-card lime" style={{ padding: "1.5rem" }}>
                <AlertCircle size={28} />
                <div style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)", marginTop: "0.5rem" }}>
                  {stats.active}
                </div>
                <div style={{ fontWeight: "800" }}>ACTIVE ISSUES</div>
              </div>

              <div className="brutal-card lavender" style={{ padding: "1.5rem" }}>
                <Clock size={28} />
                <div style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)", marginTop: "0.5rem" }}>
                  {stats.progress}
                </div>
                <div style={{ fontWeight: "800" }}>IN PROGRESS</div>
              </div>

              <div className="brutal-card coral" style={{ padding: "1.5rem", color: "var(--white)" }}>
                <CheckCircle size={28} />
                <div style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)", marginTop: "0.5rem", color: "var(--white)" }}>
                  {stats.resolved}
                </div>
                <div style={{ fontWeight: "800" }}>RESOLVED</div>
              </div>

              <div className="brutal-card" style={{ padding: "1.5rem" }}>
                <ThumbsUp size={28} />
                <div style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)", marginTop: "0.5rem" }}>
                  {stats.totalVotes}
                </div>
                <div style={{ fontWeight: "800" }}>COMMUNITY VOTES</div>
              </div>
            </section>

            {/* Quick Actions Callout */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem" }}>
              <button className="brutal-btn primary" onClick={() => setActiveTab("issues")}>
                <FileText size={18} /> Manage All {issues.length} Complaints
              </button>
              <button className="brutal-btn lavender" onClick={() => setActiveTab("users")}>
                <Users size={18} /> View {usersList.length} Users
              </button>
            </div>

            {/* Recent Complaints */}
            <section>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ margin: 0 }}>RECENT COMPLAINTS</h2>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: "700" }}>
                  {issues.length} REPORTS LISTED
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {issues.slice(0, 5).map((issue) => (
                  <div
                    key={issue.id}
                    className="brutal-card"
                    style={{
                      padding: "1.5rem",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "1.5rem",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem" }}>
                        <Link to={`/problems/${issue.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {issue.title}
                        </Link>
                      </h3>
                      <p style={{ marginBottom: "0.75rem", color: "var(--text-secondary)" }}>
                        {issue.location} • {issue.category}
                      </p>
                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", fontSize: "0.8rem", fontWeight: "800" }}>
                        <span className="badge priority-medium">PRIORITY: {issue.priority}</span>
                        <span className="badge status-open">STATUS: {issue.status}</span>
                        <span style={{ fontFamily: "var(--font-mono)" }}>▲ {issue.upvotes} Votes</span>
                      </div>
                    </div>

                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.6rem" }}>
                      <div>{issue.reporterName}</div>
                      <div style={{ color: "var(--text-secondary)" }}>{issue.dateReported}</div>
                      <select
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                        style={{
                          border: "2px solid var(--primary-color)",
                          padding: "0.4rem",
                          fontWeight: "800",
                          backgroundColor: "var(--white)",
                          cursor: "pointer",
                          minHeight: "40px",
                        }}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: BROWSE ISSUES (FULL ADMIN PANEL LIST) */}
        {activeTab === "issues" && (
          <div>
            {/* Search & Filter Bar */}
            <div className="brutal-card" style={{ padding: "1.5rem", marginBottom: "2rem", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
              <div style={{ position: "relative" }}>
                <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                <input
                  type="text"
                  className="brutal-input"
                  placeholder="Filter by title, location, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>

              <select className="brutal-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Public Safety">Public Safety</option>
                <option value="Roads & Traffic">Roads & Traffic</option>
              </select>

              <select className="brutal-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="OPEN">OPEN / Pending</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>

            {/* Complaints Count Banner */}
            <div style={{ marginBottom: "1.5rem", fontWeight: "bold", fontFamily: "var(--font-mono)" }}>
              SHOWING <span style={{ color: "var(--coral)" }}>{filteredIssues.length}</span> OF {issues.length} COMPLAINTS
            </div>

            {/* Issues List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="brutal-card" style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                      <span className="badge" style={{ backgroundColor: "var(--yellow)" }}>{issue.category}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: "bold" }}>{issue.id}</span>
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
                      <span>📍 {issue.location}</span>
                      <span>👤 {issue.reporterName}</span>
                      <span>📅 {issue.dateReported}</span>
                      <span style={{ color: "var(--coral)", fontWeight: "bold" }}>▲ {issue.upvotes} Upvotes</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                    <div style={{ fontWeight: "800", fontSize: "0.85rem", textTransform: "uppercase" }}>
                      Update Status:
                    </div>
                    <select
                      className="brutal-select"
                      value={issue.status}
                      onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                      style={{ padding: "0.5rem 1rem", width: "160px" }}
                    >
                      <option value="OPEN">🔴 OPEN</option>
                      <option value="IN_PROGRESS">🟡 IN PROGRESS</option>
                      <option value="RESOLVED">🟢 RESOLVED</option>
                    </select>

                    <Link to={`/problems/${issue.id}`} className="brutal-btn small yellow" style={{ textDecoration: "none" }}>
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2>REGISTERED CITIZENS & STAFF ({usersList.length})</h2>
              <div className="badge status-resolved" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                <Shield size={14} style={{ display: "inline", marginRight: "0.3rem" }} />
                ROLE AUTHENTICATION ACTIVE
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {usersList.map((usr) => (
                <div key={usr.id} className="brutal-card" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: usr.role === "admin" ? "var(--coral)" : usr.role === "staff" ? "var(--yellow)" : "var(--lavender)",
                      border: "2px solid var(--primary-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "800",
                      fontSize: "1.2rem",
                      color: usr.role === "admin" ? "var(--white)" : "var(--primary-color)"
                    }}>
                      {(usr.name.charAt(0) || "U").toUpperCase()}
                    </div>

                    <span className="badge" style={{
                      backgroundColor: usr.role === "admin" ? "var(--coral)" : usr.role === "staff" ? "var(--yellow)" : "var(--lime)",
                      color: usr.role === "admin" ? "var(--white)" : "var(--primary-color)",
                      fontWeight: "bold"
                    }}>
                      {usr.role.toUpperCase()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>{usr.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>{usr.email}</p>
                  
                  <div style={{ borderTop: "2px solid var(--primary-color)", paddingTop: "0.75rem", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                    <span>Registered: {usr.createdAt}</span>
                    <span style={{ color: "var(--lime)", fontWeight: "bold" }}>● Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
            <div className="brutal-card" style={{ padding: "2.5rem" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", borderBottom: "2px solid var(--primary-color)", paddingBottom: "0.5rem" }}>
                MUNICIPAL ROUTING SETTINGS
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Setting item 1 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "800", fontSize: "1.05rem" }}>Automated BBMP Ward Dispatch</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Auto-route high priority complaints directly to BBMP zonal officers.</div>
                  </div>
                  <button
                    className={`brutal-btn small ${settings.autoNotifyBbmp ? "primary" : "white"}`}
                    onClick={() => setSettings({ ...settings, autoNotifyBbmp: !settings.autoNotifyBbmp })}
                  >
                    {settings.autoNotifyBbmp ? "ENABLED" : "DISABLED"}
                  </button>
                </div>

                {/* Setting item 2 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "800", fontSize: "1.05rem" }}>Auto-Escalate Hotspots (50+ Upvotes)</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Automatically bump issue priority to High when upvotes cross 50 votes.</div>
                  </div>
                  <button
                    className={`brutal-btn small ${settings.autoEscalate ? "yellow" : "white"}`}
                    onClick={() => setSettings({ ...settings, autoEscalate: !settings.autoEscalate })}
                  >
                    {settings.autoEscalate ? "ENABLED" : "DISABLED"}
                  </button>
                </div>

                {/* Setting item 3 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "800", fontSize: "1.05rem" }}>Public Discussion Board</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Allow registered citizens to post comments on public grievances.</div>
                  </div>
                  <button
                    className={`brutal-btn small ${settings.publicCommentsAllowed ? "lime" : "white"}`}
                    onClick={() => setSettings({ ...settings, publicCommentsAllowed: !settings.publicCommentsAllowed })}
                  >
                    {settings.publicCommentsAllowed ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
              </div>
            </div>

            {/* System Status info */}
            <div className="brutal-card yellow" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <Bell size={32} />
              <div>
                <h4 style={{ margin: 0, textTransform: "uppercase" }}>System API Health</h4>
                <p style={{ margin: "0.25rem 0 0 0", color: "var(--primary-color)", fontWeight: "600" }}>
                  Connected to Mongo DB Cluster (`http://localhost:8080/api/complaint`). Real-time synchronization active.
                </p>
              </div>
            </div>
          </div>
        )}
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
