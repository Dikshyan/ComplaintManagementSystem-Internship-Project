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

  const currentUser = {
    id: user._id || user.id,
    username,
    fullName,
    name: fullName,
    email: user.email || '',
    role: user.role || 'user',
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
    // requestJson already shows a toast on error
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

// ---------------------- Demo complaint helpers (localStorage) ----------------------
const INITIAL_PROBLEMS_KEY = 'complaints';
const INITIAL_USER_KEY = 'has_initialized_session';

function ensureDemoData() {
  if (!localStorage.getItem(INITIAL_PROBLEMS_KEY)) {
    localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(INITIAL_USER_KEY)) {
    // don't force a currentUser; keep a minimal guest so UI can function
    localStorage.setItem('currentUser', JSON.stringify({ username: 'Guest', fullName: 'Guest User', upvotedIssues: [] }));
    localStorage.setItem(INITIAL_USER_KEY, 'true');
  }
}
ensureDemoData();

export function getIssues() {
  const data = localStorage.getItem(INITIAL_PROBLEMS_KEY);
  return JSON.parse(data) || [];
}

export function getIssueById(id) {
  const issues = getIssues();
  return issues.find(issue => issue.id === id);
}

export function upvoteIssue(id) {
  const issues = getIssues();
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { upvotedIssues: [] };
  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) return null;
  const isUpvoted = (currentUser.upvotedIssues || []).includes(id);
  if (isUpvoted) {
    issues[idx].upvotes = Math.max(0, (issues[idx].upvotes || 1) - 1);
    currentUser.upvotedIssues = currentUser.upvotedIssues.filter(x => x !== id);
    toast.info('Removed your vote');
  } else {
    issues[idx].upvotes = (issues[idx].upvotes || 0) + 1;
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

export function addComment(issueId, text) {
  if (!text || !text.trim()) return null;
  const issues = getIssues();
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { fullName: 'Guest' };
  const idx = issues.findIndex(i => i.id === issueId);
  if (idx === -1) return null;
  const newComment = { id: `c_${Date.now()}`, user: currentUser.fullName || currentUser.name, text, date: new Date().toISOString().split('T')[0] };
  issues[idx].comments = [...(issues[idx].comments || []), newComment];
  localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(issues));
  toast.success('Comment added');
  return newComment;
}

export async function submitIssue(title, description, category, location, priority, attachments = []) {
    const token = localStorage.getItem("authToken");

    if (!token) {
        toast.error("Please log in to submit a complaint.");
        throw new Error("Authentication required");
    }

    const data = await requestJson("/complaint", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            title,
            description,
            category,
            location,
            priority,
            attachments
        })
    });

    toast.success("Complaint submitted successfully");

    return data.complaint;
}

export function getStats() {
  const issues = getIssues();
  const total = issues.length;
  const resolved = issues.filter(i => i.status === 'RESOLVED').length;
  const progress = issues.filter(i => i.status === 'IN_PROGRESS').length;
  const active = total - resolved;
  const totalVotes = issues.reduce((acc, i) => acc + (i.upvotes || 0), 0);
  return { total, resolved, progress, active, totalVotes };
}

export function updateIssueStatus(issueId, newStatus) {
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
    toast.success(`Status updated to ${newStatus}`);
    return issues[idx];
  }
  return null;
}

