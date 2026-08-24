// Simple localStorage-backed database for Complaints and User Sessions

const INITIAL_PROBLEMS = [
  {
    id: "ISS-001",
    title: "Streetlights broken for three weeks in Indiranagar Sector 4",
    description: "All streetlights along 12th Main Road in Indiranagar are non-functional, creating a serious hazard for commuters and pedestrians at night. Safety concern for women and elderly residents. We have reported this to BBMP municipal office twice but no action has been taken yet.",
    category: "Electricity",
    location: "Indiranagar, Bangalore",
    priority: "High",
    status: "OPEN",
    upvotes: 245,
    reporterName: "Rajesh Kumar",
    dateReported: "2026-08-04",
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    comments: [
      { id: "c1", user: "Sneha Rao", text: "It's extremely dark near the corner grocery shop. Two people fell down last night. Hope this is resolved soon!", date: "2026-08-05" },
      { id: "c2", user: "Vikram Shah", text: "Upvoted! BBMP needs to check the underground cabling here. It happens every monsoon.", date: "2026-08-06" }
    ],
    resolutionHistory: [
      { status: "OPEN", description: "Issue submitted by Rajesh Kumar and flagged as High priority.", date: "2026-08-04" }
    ]
  },
  {
    id: "ISS-002",
    title: "Massive pothole near Silk Board flyover causing gridlock",
    description: "A huge pothole has formed right at the entry ramp of the Silk Board flyover heading towards HSR Layout. It is forcing vehicles to brake suddenly, creating a chain reaction of traffic jams stretching back 2 kilometers. Needs urgent hot-mix asphalt filling.",
    category: "Roads & Traffic",
    location: "Silk Board, Bangalore",
    priority: "High",
    status: "IN_PROGRESS",
    upvotes: 389,
    reporterName: "Arjun Mehta",
    dateReported: "2026-08-10",
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
    comments: [
      { id: "c3", user: "Divya N", text: "Commuting through here is a nightmare. Took me 45 mins just to cross this point.", date: "2026-08-11" },
      { id: "c4", user: "Rohan Das", text: "BBMP workers were spotted taking measurements yesterday. Hope it gets patched up tonight.", date: "2026-08-12" }
    ],
    resolutionHistory: [
      { status: "OPEN", description: "Complaint registered.", date: "2026-08-10" },
      { status: "IN_PROGRESS", description: "BBMP Maintenance Wing dispatched to inspect the site and schedule asphalt repairs.", date: "2026-08-12" }
    ]
  },
  {
    id: "ISS-003",
    title: "Garbage collection missed for 5 days in Koramangala 3rd Block",
    description: "The municipal garbage truck has not visited 8th Cross in Koramangala 3rd block for the last five days. Large piles of wet waste have accumulated outside houses, producing a strong foul smell and attracting stray animals. Health hazard for children living nearby.",
    category: "Sanitation",
    location: "Koramangala, Bangalore",
    priority: "Medium",
    status: "OPEN",
    upvotes: 128,
    reporterName: "Priya Sharma",
    dateReported: "2026-08-18",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
    comments: [
      { id: "c5", user: "Anil K", text: "The main bin at the corner is overflowing onto the main street.", date: "2026-08-19" }
    ],
    resolutionHistory: [
      { status: "OPEN", description: "Issue submitted. Assigned to Sanitation Supervisor.", date: "2026-08-18" }
    ]
  },
  {
    id: "ISS-004",
    title: "Municipal drinking water supply pipe leak on Sector 7 main road",
    description: "Fresh water is gushing out of a cracked joint on the main supply pipe near Sector 7 park. Thousands of liters of clean drinking water are being wasted daily while water pressure in neighboring households has dropped to almost zero.",
    category: "Water Supply",
    location: "HSR Layout, Bangalore",
    priority: "High",
    status: "RESOLVED",
    upvotes: 198,
    reporterName: "Manish Nair",
    dateReported: "2026-08-12",
    image: "https://images.unsplash.com/photo-1542013936693-8848e574047a?auto=format&fit=crop&w=800&q=80",
    comments: [
      { id: "c6", user: "Suresh P", text: "Glad they fixed this! Water wastage was painful to watch.", date: "2026-08-13" },
      { id: "c7", user: "Rita Sen", text: "Pipe repaired and full water pressure restored today. Great work!", date: "2026-08-15" }
    ],
    resolutionHistory: [
      { status: "OPEN", description: "Leakage reported.", date: "2026-08-12" },
      { status: "IN_PROGRESS", description: "Water Supply Board team arrived and dug up the section to replace the cracked valve.", date: "2026-08-13" },
      { status: "RESOLVED", description: "Repair completed. Joint welded and pressure-tested. Leakage stopped.", date: "2026-08-15" }
    ]
  },
  {
    id: "ISS-005",
    title: "Stray dog menace near primary school playground",
    description: "A pack of 8-10 aggressive stray dogs has taken shelter inside the municipal park next to St. Mary's School. Children are terrified to use the playground, and there have been reports of dogs chasing cyclists and school buses. Requesting animal welfare team intervention for vaccination and sterilisation.",
    category: "Public Safety",
    location: "Jayanagar, Bangalore",
    priority: "Low",
    status: "OPEN",
    upvotes: 94,
    reporterName: "Sunita Deshmukh",
    dateReported: "2026-08-20",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    comments: [
      { id: "c8", user: "John Doe", text: "Crucial issue. Kids shouldn't have to walk in fear.", date: "2026-08-21" }
    ],
    resolutionHistory: [
      { status: "OPEN", description: "Issue flagged. Alert forwarded to Animal Welfare Wing.", date: "2026-08-20" }
    ]
  }
];

const DEFAULT_USER = {
  username: "AaravMehta",
  fullName: "Aarav Mehta",
  email: "aarav.mehta@community.in",
  avatar: "AM",
  bio: "Resident of Bangalore active in local civic engagement. Believe in better infrastructure for a better city.",
  joinedDate: "2025-03-15",
  upvotedIssues: ["ISS-001", "ISS-004"]
};

// Initialize localStorage
if (!localStorage.getItem("complaints")) {
  localStorage.setItem("complaints", JSON.stringify(INITIAL_PROBLEMS));
}
if (!localStorage.getItem("currentUser")) {
  localStorage.setItem("currentUser", JSON.stringify(DEFAULT_USER));
}

// Get issues
export function getIssues() {
  const data = localStorage.getItem("complaints");
  return JSON.parse(data) || [];
}

// Get issue by ID
export function getIssueById(id) {
  const issues = getIssues();
  return issues.find(issue => issue.id === id);
}

// Toggle upvote
export function upvoteIssue(id) {
  const issues = getIssues();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || DEFAULT_USER;
  
  const issueIndex = issues.findIndex(issue => issue.id === id);
  if (issueIndex === -1) return null;
  
  const isUpvoted = currentUser.upvotedIssues.includes(id);
  
  if (isUpvoted) {
    // Remove upvote
    issues[issueIndex].upvotes = Math.max(0, issues[issueIndex].upvotes - 1);
    currentUser.upvotedIssues = currentUser.upvotedIssues.filter(item => item !== id);
  } else {
    // Add upvote
    issues[issueIndex].upvotes += 1;
    currentUser.upvotedIssues.push(id);
  }
  
  localStorage.setItem("complaints", JSON.stringify(issues));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
  return {
    issue: issues[issueIndex],
    isUpvoted: !isUpvoted
  };
}

// Check if current user upvoted an issue
export function hasUpvoted(id) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return false;
  return currentUser.upvotedIssues.includes(id);
}

// Add comment to issue
export function addComment(issueId, text) {
  if (!text.trim()) return null;
  const issues = getIssues();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || DEFAULT_USER;
  
  const issueIndex = issues.findIndex(issue => issue.id === issueId);
  if (issueIndex === -1) return null;
  
  const newComment = {
    id: `c_${Date.now()}`,
    user: currentUser.fullName,
    text: text,
    date: new Date().toISOString().split('T')[0]
  };
  
  issues[issueIndex].comments.push(newComment);
  localStorage.setItem("complaints", JSON.stringify(issues));
  
  return newComment;
}

// Submit new issue
export function submitIssue(title, description, category, location, priority) {
  const issues = getIssues();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || DEFAULT_USER;
  
  const newId = `ISS-0${issues.length + 1}`;
  const newIssue = {
    id: newId,
    title,
    description,
    category,
    location,
    priority,
    status: "OPEN",
    upvotes: 1, // Self-upvote on submission
    reporterName: currentUser.fullName,
    dateReported: new Date().toISOString().split('T')[0],
    image: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80",
    comments: [],
    resolutionHistory: [
      { 
        status: "OPEN", 
        description: `Issue submitted by ${currentUser.fullName} and registered under ${category}.`, 
        date: new Date().toISOString().split('T')[0] 
      }
    ]
  };
  
  issues.unshift(newIssue); // Put newest first
  localStorage.setItem("complaints", JSON.stringify(issues));
  
  // Add to upvoted list
  currentUser.upvotedIssues.push(newId);
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
  return newIssue;
}

// Get Community Statistics
export function getStats() {
  const issues = getIssues();
  const total = issues.length;
  const resolved = issues.filter(issue => issue.status === "RESOLVED").length;
  const progress = issues.filter(issue => issue.status === "IN_PROGRESS").length;
  const active = total - resolved;
  const totalVotes = issues.reduce((acc, issue) => acc + issue.upvotes, 0);
  
  return {
    total,
    resolved,
    progress,
    active,
    totalVotes
  };
}

// Auth mock
export function login(username, password) {
  // Simple success login mock
  const user = {
    ...DEFAULT_USER,
    username: username || "User",
    fullName: username ? username.replace(/([A-Z])/g, ' $1').trim() : "Resident Guest"
  };
  localStorage.setItem("currentUser", JSON.stringify(user));
  return user;
}

export function register(username, email, password) {
  const user = {
    username: username || "NewUser",
    fullName: username || "New Citizen",
    email: email || "citizen@community.in",
    avatar: username ? username.substring(0, 2).toUpperCase() : "NC",
    bio: "Proud community member actively helping build a better place to live.",
    joinedDate: new Date().toISOString().split('T')[0],
    upvotedIssues: []
  };
  localStorage.setItem("currentUser", JSON.stringify(user));
  return user;
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser")) || DEFAULT_USER;
}

export function logout() {
  localStorage.removeItem("currentUser");
}

// Update complaint status - Admin
export function updateIssueStatus(issueId, newStatus, description = "") {
  const issues = getIssues();

  const issueIndex = issues.findIndex(issue => issue.id === issueId);

  if (issueIndex === -1) return null;

  const today = new Date().toISOString().split('T')[0];

  issues[issueIndex].status = newStatus;

  issues[issueIndex].resolutionHistory.push({
    status: newStatus,
    description:
      description ||
      `Complaint status updated to ${newStatus}.`,
    date: today
  });

  localStorage.setItem("complaints", JSON.stringify(issues));

  return issues[issueIndex];
}