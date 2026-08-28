import { toast } from 'react-toastify';

const API_BASE_URL = ('http://localhost:8080/api').replace(/\/$/, '');

async function requestJson(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : {};
  if (!response.ok) {
    const msg = data.message || 'Request failed';
    try { toast.error(msg); } catch (e) { /* noop */ }
    throw new Error(msg);
  }
  return data;
}

function persistUser(user, fallbackName) {
  const fullName = user.name || fallbackName || 'User';
  const username = (user.username && user.username) || fullName.replace(/\s+/g, '') || 'user';
  const joinedDate = user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  const role = user.role || (username.toLowerCase().includes('admin') || (user.email && user.email.toLowerCase().includes('admin')) ? 'admin' : 'user');

  const currentUser = {
    id: user._id || user.id,
    username,
    fullName,
    name: fullName,
    email: user.email || '',
    role,
    avatar: (fullName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U').toUpperCase(),
    bio: user.bio || '',
    joinedDate,
    upvotedIssues: user.upvotedIssues || []
  };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  return currentUser;
}

function readLocal(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

// ---------------------- Auth ----------------------
export async function login(usernameOrEmail, password) {
  try {
    const payload = { email: usernameOrEmail, username: usernameOrEmail, password };
    const data = await requestJson('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
    localStorage.setItem('authToken', data.token);
    const user = persistUser(data.user, usernameOrEmail);
    toast.success('Signed in successfully');
    return user;
  } catch (err) {
    throw err;
  }
}

export async function register(username, email, password) {
  try {
    const payload = { name: username, email, password };
    const data = await requestJson('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    localStorage.setItem('authToken', data.token);
    const user = persistUser(data.user, username);
    toast.success('Account created');
    return user;
  } catch (err) {
    throw err;
  }
}

export async function fetchCurrentUser() {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const resp = await fetch(`${API_BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (!resp.ok) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return null;
    }
    const data = await resp.json();
    const user = persistUser(data.user);
    return user;
  } catch (err) {
    toast.error('Failed to refresh session');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    return null;
  }
}

export function getCurrentUser() {
  return readLocal('currentUser', null);
}

export function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('authToken');
}

// ---------------------- Complaints (API + LocalStorage Fallback) ----------------------
const INITIAL_PROBLEMS_KEY = 'complaints';
const INITIAL_USER_KEY = 'has_initialized_session';

function ensureDemoData() {
  if (!localStorage.getItem(INITIAL_PROBLEMS_KEY)) {
    localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(INITIAL_USER_KEY)) {
    localStorage.setItem('currentUser', JSON.stringify({ username: 'Guest', fullName: 'Guest User', upvotedIssues: [] }));
    localStorage.setItem(INITIAL_USER_KEY, 'true');
  }
}
ensureDemoData();

export function getIssues() {
  const data = localStorage.getItem(INITIAL_PROBLEMS_KEY);
  return JSON.parse(data) || [];
}

export async function fetchComplaintsApi() {
  try {
    const data = await requestJson('/complaint');
    const backendComplaints = (data.complaints || []).map(c => ({
      id: c._id,
      _id: c._id,
      title: c.title,
      description: c.description,
      category: c.category,
      location: c.location,
      priority: c.priority,
      status: c.status,
      upvotes: c.voteCount || 0,
      reporterName: c.userId?.name || c.userId?.username || 'Citizen',
      dateReported: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      comments: c.comments || [],
      resolutionHistory: c.resolutionHistory || [
        { status: c.status, description: `Report registered under ${c.category}.`, date: new Date().toISOString().split('T')[0] }
      ]
    }));

    localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(backendComplaints));
    return backendComplaints;
  } catch (err) {
    return getIssues();
  }
}

export function getIssueById(id) {
  const issues = getIssues();
  return issues.find(issue => issue.id === id || issue._id === id);
}

export async function upvoteIssue(id) {
  const issues = getIssues();
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { upvotedIssues: [] };
  const idx = issues.findIndex(i => i.id === id || i._id === id);
  if (idx === -1) return null;
  const isUpvoted = (currentUser.upvotedIssues || []).includes(id);
  const direction = isUpvoted ? 'down' : 'up';

  // Call backend if MongoDB ObjectId format
  if (id && id.length === 24) {
    try {
      const data = await requestJson(`/complaint/${id}/vote`, {
        method: 'PATCH',
        body: JSON.stringify({ direction })
      });
      issues[idx].upvotes = data.voteCount;
    } catch (err) {
      // Fall back to local toggle on failure
      issues[idx].upvotes = isUpvoted
        ? Math.max(0, (issues[idx].upvotes || 1) - 1)
        : (issues[idx].upvotes || 0) + 1;
    }
  } else {
    issues[idx].upvotes = isUpvoted
      ? Math.max(0, (issues[idx].upvotes || 1) - 1)
      : (issues[idx].upvotes || 0) + 1;
  }

  if (isUpvoted) {
    currentUser.upvotedIssues = currentUser.upvotedIssues.filter(x => x !== id);
    toast.info('Removed your vote');
  } else {
    currentUser.upvotedIssues = [...(currentUser.upvotedIssues || []), id];
    toast.success('Thanks — your vote was recorded');
  }
  localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(issues));
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  return { issue: issues[idx], isUpvoted: !isUpvoted };
}

export function hasUpvoted(id) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { upvotedIssues: [] };
  return (currentUser.upvotedIssues || []).includes(id);
}

export async function addComment(issueId, text) {
  if (!text || !text.trim()) return null;
  const token = localStorage.getItem('authToken');

  // Call backend if authenticated and MongoDB ObjectId
  if (token && issueId && issueId.length === 24) {
    try {
      const data = await requestJson(`/complaint/${issueId}/comments`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text })
      });
      // Update localStorage cache
      const issues = getIssues();
      const idx = issues.findIndex(i => i.id === issueId || i._id === issueId);
      if (idx !== -1) {
        issues[idx].comments = [...(issues[idx].comments || []), data.comment];
        localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(issues));
      }
      toast.success('Comment added');
      return data.comment;
    } catch (err) {
      return null;
    }
  }

  // Guest fallback: localStorage only
  const issues = getIssues();
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { fullName: 'Guest' };
  const idx = issues.findIndex(i => i.id === issueId || i._id === issueId);
  if (idx === -1) return null;
  const newComment = { id: `c_${Date.now()}`, user: currentUser.fullName || currentUser.name, text, date: new Date().toISOString().split('T')[0] };
  issues[idx].comments = [...(issues[idx].comments || []), newComment];
  localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(issues));
  toast.success('Comment added');
  return newComment;
}

export async function submitIssue(title, description, category, location, priority, attachments = []) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Create locally if guest
    const issues = getIssues();
    const newIssue = {
      id: `ISS-${Date.now().toString().slice(-4)}`,
      title,
      description,
      category,
      location,
      priority,
      status: 'Pending',
      upvotes: 1,
      reporterName: 'Guest Citizen',
      dateReported: new Date().toISOString().split('T')[0],
      comments: [],
      resolutionHistory: [
        { status: 'Pending', description: `Registered under ${category}.`, date: new Date().toISOString().split('T')[0] }
      ]
    };
    issues.unshift(newIssue);
    localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(issues));
    toast.success('Complaint submitted');
    return newIssue;
  }

  const data = await requestJson('/complaint', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, description, category, location, priority, attachments })
  });

  toast.success('Complaint submitted successfully');
  await fetchComplaintsApi();
  return data.complaint;
}

export async function getStats(providedIssues = null) {
  if (providedIssues && Array.isArray(providedIssues)) {
    const total = providedIssues.length;
    const resolved = providedIssues.filter(i => (i.status || '').toLowerCase() === 'resolved').length;
    const progress = providedIssues.filter(i => {
      const s = (i.status || '').toLowerCase();
      return s === 'in progress' || s === 'under review' || s === 'pending';
    }).length;
    const active = total - resolved;
    const totalVotes = providedIssues.reduce((acc, i) => acc + (i.upvotes || i.voteCount || 0), 0);
    return { total, resolved, progress, active, totalVotes };
  }

  try {
    const data = await requestJson('/complaint/stats');
    if (data && data.stats) {
      return data.stats;
    }
  } catch (err) {
    // ignore
  }

  // Fallback: derive directly from live fetched complaints
  try {
    const liveIssues = await fetchComplaintsApi();
    const total = liveIssues.length;
    const resolved = liveIssues.filter(i => (i.status || '').toLowerCase() === 'resolved').length;
    const progress = liveIssues.filter(i => {
      const s = (i.status || '').toLowerCase();
      return s === 'in progress' || s === 'under review' || s === 'pending';
    }).length;
    const active = total - resolved;
    const totalVotes = liveIssues.reduce((acc, i) => acc + (i.upvotes || i.voteCount || 0), 0);
    return { total, resolved, progress, active, totalVotes };
  } catch (e) {
    return { total: 0, resolved: 0, progress: 0, active: 0, totalVotes: 0 };
  }
}

export async function updateIssueStatus(issueId, newStatus) {
  // Send update to backend API first if MongoDB ObjectId format
  if (issueId && issueId.length === 24) {
    try {
      await requestJson(`/complaint/${issueId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      // Backend failed — don't update local state
      return getIssues();
    }
  }

  // Only update localStorage AFTER backend succeeds
  const issues = getIssues();
  const idx = issues.findIndex(i => i.id === issueId || i._id === issueId);
  if (idx !== -1) {
    issues[idx].status = newStatus;
    if (!issues[idx].resolutionHistory) {
      issues[idx].resolutionHistory = [];
    }
    issues[idx].resolutionHistory.push({
      status: newStatus,
      description: `Status updated to ${newStatus} by Admin.`,
      date: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(issues));
  }

  toast.success(`Status updated to ${newStatus}`);
  return getIssues();
}

export async function fetchUsersApi() {
  const token = localStorage.getItem('authToken');
  try {
    const data = await requestJson('/users', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return (data.users || []).map(u => ({
      id: u._id || u.id,
      name: u.name || u.username || 'Citizen User',
      email: u.email || 'N/A',
      role: u.role || 'user',
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '2026-08-01'
    }));
  } catch (err) {
    console.error("Fetch users API error:", err);
    return [];
  }
}

