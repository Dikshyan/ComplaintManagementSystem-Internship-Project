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
  createStaffAccountApi,
  deleteUserApi,
  assignComplaintApi,
  logout
} from "../services/client";
import { ShieldAlert, Plus, X as XIcon, Eye, EyeOff, Trash2 } from "lucide-react";

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

  // Staff creation modal state
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffDepartment, setStaffDepartment] = useState("Infrastructure & Public Works");
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [staffModalError, setStaffModalError] = useState("");
  // Staff workload inspection modal state
  const [selectedStaffDetail, setSelectedStaffDetail] = useState(null);

  // Filters for Browse Issues tab inside Admin Panel
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Filters for Users tab inside Admin Panel
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [userSearchTerm, setUserSearchTerm] = useState("");

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

  // Filtered users for Users tab
  const filteredUsersList = usersList.filter((usr) => {
    const matchesRole = userRoleFilter === "All" || usr.role === userRoleFilter;
    const matchesSearch =
      userSearchTerm === "" ||
      usr.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      usr.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const staffUsers = usersList.filter((u) => u.role === "staff");

  const handleAssignStaff = async (issueId, staffId) => {
    if (!staffId) return;
    const selectedStaff = usersList.find((u) => u.id === staffId || u._id === staffId);
    const dept = selectedStaff?.department || "";
    await assignComplaintApi(issueId, staffId, dept);
    const updatedIssues = await fetchComplaintsApi();
    setIssues(updatedIssues);
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setStaffModalError("");
    if (!staffName.trim() || !staffEmail.trim() || !staffPassword.trim()) {
      setStaffModalError("Please fill in all required fields.");
      return;
    }
    if (staffPassword.length < 6) {
      setStaffModalError("Password must be at least 6 characters long.");
      return;
    }
    setCreatingStaff(true);
    try {
      await createStaffAccountApi({ name: staffName.trim(), email: staffEmail.trim(), password: staffPassword, department: staffDepartment });
      setStaffName("");
      setStaffEmail("");
      setStaffPassword("");
      setStaffDepartment("Infrastructure & Public Works");
      setStaffModalError("");
      setShowStaffModal(false);
      const updated = await fetchUsersApi();
      setUsersList(updated);
    } catch (err) {
      setStaffModalError(err.message || "Failed to create staff account.");
    } finally {
      setCreatingStaff(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteUserApi(userId);
      const updated = await fetchUsersApi();
      setUsersList(updated);
    } catch (err) {
      /* handled by client */
    }
  };

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
                        className="brutal-select"
                        value={issue.assignedTo?.id || issue.assignedTo?._id || ""}
                        onChange={(e) => handleAssignStaff(issue.id, e.target.value)}
                        style={{ padding: "0.35rem 0.6rem", fontSize: "0.8rem", width: "160px" }}
                      >
                        <option value="">-- Assign Staff --</option>
                        {staffUsers.map((st) => (
                          <option key={st.id || st._id} value={st.id || st._id}>
                            👤 {st.name}
                          </option>
                        ))}
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
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                      <span className="badge" style={{ backgroundColor: "var(--yellow)" }}>{issue.category}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: "bold" }}>{issue.id}</span>
                      {issue.assignedTo && (
                        <span className="badge" style={{ backgroundColor: "var(--lavender)", color: "var(--primary-color)", fontWeight: "bold" }}>
                          👤 ASSIGNED: {issue.assignedTo.name} {issue.assignedDepartment ? `(${issue.assignedDepartment})` : ''}
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
                      <span>📍 {issue.location}</span>
                      <span>👤 {issue.reporterName}</span>
                      <span>📅 {issue.dateReported}</span>
                      <span style={{ color: "var(--coral)", fontWeight: "bold" }}>▲ {issue.upvotes} Upvotes</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
                      <div style={{ fontWeight: "800", fontSize: "0.75rem", textTransform: "uppercase" }}>
                        Assign to Staff:
                      </div>
                      <select
                        className="brutal-select"
                        value={issue.assignedTo?.id || issue.assignedTo?._id || ""}
                        onChange={(e) => handleAssignStaff(issue.id, e.target.value)}
                        style={{ padding: "0.35rem 0.6rem", fontSize: "0.8rem", width: "170px" }}
                      >
                        <option value="">-- Assign Staff --</option>
                        {staffUsers.map((st) => (
                          <option key={st.id || st._id} value={st.id || st._id}>
                            👤 {st.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ fontSize: "0.8rem", fontWeight: "bold", fontFamily: "var(--font-mono)", backgroundColor: "var(--bg-color)", padding: "0.35rem 0.6rem", border: "2px solid var(--primary-color)" }}>
                      STATUS: {issue.status}
                    </div>

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 style={{ margin: 0 }}>REGISTERED CITIZENS & STAFF ({usersList.length})</h2>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                  Manage account roles and provision municipal staff logins.
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <button
                  className="brutal-btn primary"
                  onClick={() => setShowStaffModal(true)}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Plus size={18} />
                  <span>Create Staff Account</span>
                </button>
              </div>
            </div>

            {/* Create Staff Modal */}
            {showStaffModal && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  zIndex: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5rem"
                }}
              >
                <div
                  className="brutal-card yellow"
                  style={{
                    maxWidth: "500px",
                    width: "100%",
                    padding: "2.5rem",
                    position: "relative",
                    backgroundColor: "var(--white)"
                  }}
                >
                  <button
                    onClick={() => setShowStaffModal(false)}
                    style={{
                      position: "absolute",
                      right: "1.5rem",
                      top: "1.5rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    <XIcon size={24} />
                  </button>

                  <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                    PROVISION STAFF LOGIN
                  </h2>
                  {staffModalError && (
                    <div className="brutal-card coral" style={{ color: "var(--white)", padding: "0.75rem", marginBottom: "1rem", fontSize: "0.85rem", fontWeight: "bold" }}>
                      ⚠️ {staffModalError}
                    </div>
                  )}

                  <form onSubmit={handleCreateStaff} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: "800", fontSize: "0.85rem", marginBottom: "0.4rem", textTransform: "uppercase" }}>
                        Staff Full Name
                      </label>
                      <input
                        type="text"
                        className="brutal-input"
                        placeholder="e.g. Officer Rajesh Verma"
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: "800", fontSize: "0.85rem", marginBottom: "0.4rem", textTransform: "uppercase" }}>
                        Official Email Address
                      </label>
                      <input
                        type="email"
                        className="brutal-input"
                        placeholder="e.g. rajesh.v@bbmp.gov.in"
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: "800", fontSize: "0.85rem", marginBottom: "0.4rem", textTransform: "uppercase" }}>
                        Assigned Municipal Department
                      </label>
                      <select
                        className="brutal-select"
                        value={staffDepartment}
                        onChange={(e) => setStaffDepartment(e.target.value)}
                        style={{ width: "100%", padding: "0.75rem" }}
                      >
                        <option value="Infrastructure & Public Works">Infrastructure & Public Works</option>
                        <option value="Sanitation & Waste Management">Sanitation & Waste Management</option>
                        <option value="Water Supply & Drainage">Water Supply & Drainage</option>
                        <option value="Electrical & Street Lighting">Electrical & Street Lighting</option>
                        <option value="Public Safety & Health">Public Safety & Health</option>
                        <option value="Roads, Traffic & Transit">Roads, Traffic & Transit</option>
                        <option value="General Municipal Services">General Municipal Services</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: "800", fontSize: "0.85rem", marginBottom: "0.4rem", textTransform: "uppercase" }}>
                        Account Password
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showStaffPassword ? "text" : "password"}
                          className="brutal-input"
                          placeholder="••••••••"
                          value={staffPassword}
                          onChange={(e) => setStaffPassword(e.target.value)}
                          required
                          minLength={6}
                          style={{ paddingRight: "2.5rem" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowStaffPassword(!showStaffPassword)}
                          style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--text-secondary)",
                            display: "flex",
                            alignItems: "center"
                          }}
                          title={showStaffPassword ? "Hide password" : "Show password"}
                        >
                          {showStaffPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                      <button
                        type="submit"
                        className="brutal-btn primary"
                        disabled={creatingStaff}
                        style={{ flex: 1 }}
                      >
                        {creatingStaff ? "CREATING..." : "CREATE STAFF LOGIN"}
                      </button>
                      <button
                        type="button"
                        className="brutal-btn white"
                        onClick={() => setShowStaffModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* User Search & Role Category Filter Bar */}
            <div className="brutal-card" style={{ padding: "1.25rem", marginBottom: "2rem", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
              <div style={{ position: "relative" }}>
                <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                <input
                  type="text"
                  className="brutal-input"
                  placeholder="Filter users by name or email address..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>

              <select className="brutal-select" value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)}>
                <option value="All">All User Roles ({usersList.length})</option>
                <option value="user">Citizens (Users) ({usersList.filter(u => u.role === 'user').length})</option>
                <option value="staff">Municipal Staff ({usersList.filter(u => u.role === 'staff').length})</option>
                <option value="admin">Administrators ({usersList.filter(u => u.role === 'admin').length})</option>
              </select>
            </div>

            {/* Users Count Banner */}
            <div style={{ marginBottom: "1.5rem", fontWeight: "bold", fontFamily: "var(--font-mono)" }}>
              SHOWING <span style={{ color: "var(--coral)" }}>{filteredUsersList.length}</span> OF {usersList.length} REGISTERED ACCOUNTS
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {filteredUsersList.map((usr) => {
                const staffTasks = issues.filter(
                  (i) =>
                    i.assignedTo?.id === usr.id ||
                    i.assignedTo?._id === usr.id ||
                    (i.assignedTo?.email && i.assignedTo.email.toLowerCase() === usr.email.toLowerCase()) ||
                    (usr.department && i.assignedDepartment === usr.department)
                );

                return (
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
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{usr.email}</p>

                    {usr.department && (
                      <div style={{ marginBottom: "0.75rem" }}>
                        <span className="badge" style={{ backgroundColor: "var(--yellow)", fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}>
                          🏢 {usr.department}
                        </span>
                      </div>
                    )}

                    {usr.role === "staff" && (
                      <div style={{ marginBottom: "0.75rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontWeight: "700" }}>
                          Assigned Tasks: <span style={{ color: "var(--coral)", fontWeight: "800" }}>{staffTasks.length}</span>
                        </span>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => setSelectedStaffDetail({ staff: usr, tasks: staffTasks })}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--coral)",
                            fontWeight: "800",
                            textDecoration: "underline",
                            cursor: "pointer",
                            padding: 0,
                            fontSize: "0.85rem"
                          }}
                        >
                          View All
                        </button>
                      </div>
                    )}
                    
                    <div style={{ borderTop: "2px solid var(--primary-color)", paddingTop: "0.75rem", fontSize: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span>Registered: {usr.createdAt}</span>
                      </div>
                      
                      <button
                        className="brutal-btn small coral"
                        onClick={() => handleDeleteUser(usr.id, usr.name)}
                        style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem" }}
                        title="Remove user account"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Staff Workload Detail Modal */}
            {selectedStaffDetail && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  zIndex: 1000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5rem"
                }}
              >
                <div
                  className="brutal-card white"
                  style={{
                    maxWidth: "700px",
                    width: "100%",
                    maxHeight: "85vh",
                    display: "flex",
                    flexDirection: "column",
                    padding: "2rem",
                    position: "relative",
                    backgroundColor: "var(--white)"
                  }}
                >
                  <button
                    onClick={() => setSelectedStaffDetail(null)}
                    style={{
                      position: "absolute",
                      right: "1.5rem",
                      top: "1.5rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    <XIcon size={24} />
                  </button>

                  <div style={{ marginBottom: "1.25rem", borderBottom: "3px solid var(--primary-color)", paddingBottom: "1rem" }}>
                    <span className="badge" style={{ backgroundColor: "var(--yellow)", marginBottom: "0.4rem" }}>
                      STAFF WORKLOAD REPORT
                    </span>
                    <h2 style={{ fontSize: "1.8rem", margin: 0, textTransform: "uppercase" }}>
                      {selectedStaffDetail.staff.name}
                    </h2>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                      {selectedStaffDetail.staff.email} • 🏢 {selectedStaffDetail.staff.department || "General Municipal Services"}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div className="brutal-card yellow" style={{ padding: "0.75rem", textAlign: "center" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "800" }}>{selectedStaffDetail.tasks.length}</div>
                      <div style={{ fontSize: "0.75rem", fontWeight: "bold" }}>TOTAL ASSIGNED</div>
                    </div>
                    <div className="brutal-card lavender" style={{ padding: "0.75rem", textAlign: "center" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "800" }}>
                        {selectedStaffDetail.tasks.filter(t => t.status === "IN_PROGRESS" || t.status === "In Progress" || t.status === "ASSIGNED").length}
                      </div>
                      <div style={{ fontSize: "0.75rem", fontWeight: "bold" }}>ACTIVE / IN PROGRESS</div>
                    </div>
                    <div className="brutal-card lime" style={{ padding: "0.75rem", textAlign: "center" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "800" }}>
                        {selectedStaffDetail.tasks.filter(t => t.status === "RESOLVED" || t.status === "Resolved").length}
                      </div>
                      <div style={{ fontSize: "0.75rem", fontWeight: "bold" }}>RESOLVED</div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem", textTransform: "uppercase" }}>
                    ASSIGNED COMPLAINTS LIST ({selectedStaffDetail.tasks.length})
                  </h3>

                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", paddingRight: "0.5rem" }}>
                    {selectedStaffDetail.tasks.length === 0 ? (
                      <div className="brutal-card yellow" style={{ padding: "2rem", textAlign: "center" }}>
                        No grievances currently assigned to this staff officer.
                      </div>
                    ) : (
                      selectedStaffDetail.tasks.map((task) => (
                        <div key={task.id} className="brutal-card" style={{ padding: "1rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                            <span className="badge" style={{ backgroundColor: "var(--yellow)", fontSize: "0.75rem" }}>{task.category}</span>
                            <span className="badge" style={{ backgroundColor: task.status === "RESOLVED" || task.status === "Resolved" ? "var(--lime)" : task.status === "IN_PROGRESS" || task.status === "In Progress" ? "var(--lavender)" : "var(--coral)", color: task.status === "RESOLVED" || task.status === "Resolved" ? "var(--primary-color)" : "var(--white)", fontSize: "0.75rem" }}>
                              {task.status}
                            </span>
                          </div>
                          <h4 style={{ margin: "0.4rem 0", fontSize: "1.05rem" }}>{task.title}</h4>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", gap: "0.75rem" }}>
                            <span>📍 {task.location}</span>
                            <span>📅 {task.dateReported}</span>
                          </div>
                          <div style={{ marginTop: "0.75rem", textAlign: "right" }}>
                            <Link to={`/problems/${task.id}`} className="brutal-btn small yellow" onClick={() => setSelectedStaffDetail(null)} style={{ textDecoration: "none" }}>
                              View Problem Details →
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS - COMING SOON */}
        {activeTab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh", textAlign: "center", padding: "1rem 0" }}>
            <div
              className="brutal-card yellow hover-rotate"
              style={{
                maxWidth: "620px",
                width: "100%",
                padding: "3.5rem 2.5rem",
                backgroundColor: "var(--white)"
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  backgroundColor: "var(--yellow)",
                  color: "var(--primary-color)",
                  border: "3px solid var(--primary-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontWeight: "800",
                  boxShadow: "4px 4px 0 var(--primary-color)"
                }}
              >
                <Settings size={40} />
              </div>

              <span
                className="badge"
                style={{
                  backgroundColor: "var(--coral)",
                  color: "var(--white)",
                  fontSize: "0.85rem",
                  padding: "0.4rem 1rem",
                  marginBottom: "1.25rem",
                  display: "inline-block"
                }}
              >
                🚀 UNDER DEVELOPMENT
              </span>

              <h2
                style={{
                  fontSize: "2.4rem",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.5px"
                }}
              >
                SETTINGS COMING SOON
              </h2>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: "1.6"
                }}
              >
                We are building advanced municipal routing controls, automated BBMP ward dispatch algorithms, and customizable department notifications. This section will be unlocked in an upcoming platform release!
              </p>
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
