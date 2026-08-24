Act as a senior product designer and frontend architect. Design and build a high-fidelity web application for a public community complaint and issue-reporting platform. The platform allows users to report real-world problems, browse complaints submitted by others, upvote issues they consider important, track their status, and view resolutions.

Tech Stack: Use Vite + React + JavaScript. Use React Router for client-side routing and create reusable React components. Do not use TypeScript.

Layout & Structure: Use a responsive, editorial-style web layout rather than a traditional admin dashboard. Include these sections in order:

Navigation Bar — Logo/brand, Browse Issues, Submit Complaint, About, and Login/Profile.
Hero Section — Large bold headline explaining the platform's purpose, supporting text, primary “Report a Problem” CTA, and a visual representation of community complaints.
Trending Issues — Display highly voted complaints as large interactive cards with vote count, category, location, status, and short description.
All Problems — A searchable and filterable complaint feed with category, priority, location, status, sorting, and community vote count.
Problem Detail View — Show the complete complaint, images/attachments, location, category, priority, current status, vote button, number of supporters, comments, and resolution history.
How It Works — Explain the flow: Report → Community Votes → Issue Gets Attention → Resolution.
Community Statistics — Show meaningful statistics such as problems reported, problems resolved, active issues, and total community votes.
Final CTA — Encourage users to report an issue or support an existing complaint.
Footer — Navigation links, platform information, contact/support, and legal links.

Routing: Implement the application using React Router with separate routes for:

/ — Home
/problems — All Problems
/problems/:id — Problem Details
/submit — Submit Complaint
/login — Login
/register — Registration
/profile — User Profile

Style & Vibe: Take inspiration from Razorpay's “Fix My Itch” campaign website, combining experimental editorial web design, playful neo-brutalism, interactive storytelling, and modern Indian startup branding. The design should feel highly intentional and art-directed rather than like a generic CRUD dashboard.

Use oversized expressive typography, unconventional layouts, large visual sections, strong geometric shapes, bold cards, subtle animations, asymmetric grids, and interactive UI elements. Use visual storytelling to make the complaint-reporting experience engaging.

Avoid making the entire interface look like a traditional SaaS dashboard.

Visual Language:

Bold oversized headings
Strong typographic hierarchy
Large editorial sections
Flat surfaces with occasional hard shadows
Rounded and geometric UI elements used intentionally
High-contrast buttons and CTAs
Large complaint cards
Playful visual elements and illustrations
Subtle hover, scroll, and interaction animations
Clean whitespace between major sections
Occasional oversized numbers and labels
Mix serif/display typography with clean sans-serif body text where appropriate

Color Palette: Use a warm, energetic palette inspired by Razorpay's “Fix My Itch” campaign website. The interface should feel playful, editorial, youthful, and distinctly Indian rather than corporate SaaS.

Primary: #111111
Background: #F5F1E8
Coral/Orange Accent: #FF5A36
Yellow Accent: #FFD400
Lime Accent: #B8E986
Lavender Accent: #B9A7FF
White: #FFFFFF
Secondary Text: #5F5F5F

Use black and warm cream as the foundational colors, while coral, yellow, lime, and lavender are used strategically for complaint cards, categories, statistics, CTAs, illustrations, and interactive elements. Avoid making every section colorful; maintain strong visual rhythm by alternating neutral and vibrant sections

Typography: Use a strong 3-tier hierarchy:

Display: oversized, expressive headings for hero and section titles
Heading: bold typography for cards and subsections
Body: highly readable text for descriptions, metadata, and supporting information

Use a modern web-safe or Google Font combination suitable for an editorial/startup website. Ensure typography remains responsive across desktop, tablet, and mobile.

Complaint Card Design: Make complaints feel like important community posts rather than database records. Each card should contain:

Issue title
Short description
Category
Location
Priority indicator
Current status
Community vote count
Upvote button
Reporter information
Date reported

Use realistic content such as:

“Street lights have been out for three weeks”
“Garbage collection missed our neighborhood again”
“Large pothole causing traffic near the main intersection”
“Public drinking-water tap has stopped working”

Interaction Design: Make voting a prominent interaction. Users should immediately understand that they can support an existing complaint instead of submitting duplicates. Include animated vote states, hover interactions, filtering, sorting, search, and smooth page transitions.

Responsive Design: The application must work seamlessly on desktop, tablet, and mobile. On mobile, convert complex grids into single-column layouts and maintain a minimum 44px touch target for interactive controls.

Accessibility: Use semantic HTML, accessible buttons, proper labels, keyboard navigation, sufficient contrast, and meaningful ARIA attributes where necessary.

Frontend Architecture: Build the application with reusable React components such as:

Navbar
Hero
ProblemCard
ProblemGrid
VoteButton
CategoryFilter
SearchBar
StatusBadge
ProblemDetails
CommentSection
ResolutionTimeline
CommunityStats
Footer

Organize the project cleanly using a scalable Vite + React + JavaScript structure. Use React Router for navigation and route-based pages. Keep components reusable and avoid putting the entire application inside a single component.

Data: Initially use realistic mock data stored locally in JavaScript. Structure the data so it can later be replaced with REST API calls without redesigning the components.

Animation: Use subtle, purposeful animations for page transitions, card hover states, voting interactions, filtering, and scroll-based visual effects. Avoid excessive animations that negatively affect usability.

Constraints:

Use Vite
Use React
Use JavaScript, NOT TypeScript
Use React Router
Create reusable components
Use realistic content instead of placeholder text
Do not create a generic dashboard template
Do not overuse gradients, glassmorphism, or excessive rounded cards
Maintain the experimental editorial character throughout the application
Ensure responsive behavior across desktop, tablet, and mobile
Ensure all interactive elements have at least 44px touch targets
Keep the code clean, modular, and production-oriented
The final result should feel like a real public-facing startup product, not a college-project CRUD application.