# Contribution Guide

Thank you for contributing to the Public Complaint Management Platform.

This project is developed as a **monorepo** containing separate frontend and backend applications. Development follows a **feature-based and sequential development approach**.

Contributors should build features in the defined order because later features may depend on functionality implemented earlier.

The goal is to keep development organized, reduce merge conflicts, avoid duplicated work, and make it easier to integrate contributions from multiple developers.

---

# 1. Project Architecture

The project follows a monorepo structure:

```text
project-root/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.js
│   ├── index.html
│   └── package.json
│
├── .gitignore
├── README.md
├── CONTRIBUTIONS.md
└── package.json
```

The exact folder structure may evolve as the project grows, but contributors should follow the existing architecture rather than introducing a completely different structure.

---

# 2. Development Philosophy

The project follows three main principles:

```text
Feature-Based
     +
Sequential Development
     +
Modular Architecture
```

Each feature should be developed as an independent unit.

However, features should be implemented according to their dependencies.

For example:

```text
Authentication
      ↓
User Management
      ↓
Complaint Creation
      ↓
Public Complaint Feed
      ↓
Voting
      ↓
Comments
      ↓
Staff Management
      ↓
Complaint Assignment
      ↓
Status Tracking
      ↓
Resolution History
      ↓
Notifications
```

Contributors should not start a feature before its required dependencies are available.

---

# 3. Feature Development Roadmap

The following features should be developed in this order.

## Phase 1: Project Setup

This is the foundation of the application.

### Tasks

* Configure monorepo
* Configure frontend using Vite and JavaScript
* Configure backend
* Configure database connection
* Configure environment variables
* Configure CORS
* Establish frontend-backend communication
* Establish basic project conventions

This phase must be completed before application features are developed.

---

# Phase 2: Authentication

Authentication should be implemented before complaint functionality because complaints need to be associated with users.

### Features

* User registration
* User login
* Logout
* Password hashing
* Authentication middleware
* JWT/session handling
* Protected routes
* User roles

Initial roles:

```text
User
Staff
Admin
```

### Dependencies

None.

### Required Before

Complaint creation, voting, comments, and staff functionality.

---

# Phase 3: User Management

After authentication is working, implement basic user management.

### Features

* User profile
* View user information
* Update profile
* User role handling
* Account-related functionality

### Dependencies

Authentication.

---

# Phase 4: Complaint Creation

This is the first major application feature.

Users should be able to raise a complaint.

### Features

* Create complaint
* Complaint title
* Category
* Description
* Priority
* Location
* Optional attachments
* Complaint creation date
* Complaint owner

Basic complaint structure:

```text
Complaint
├── User
├── Title
├── Category
├── Description
├── Priority
├── Location
├── Attachments
├── Status
└── Timestamps
```

Initial status:

```text
Pending
```

### Dependencies

Authentication and User Management.

---

# Phase 5: Public Complaint Feed

Once complaints can be created, they should become publicly discoverable.

### Features

* Display public complaints
* Complaint cards
* Complaint details page
* Recent complaints
* Search
* Category filtering
* Priority filtering
* Status filtering
* Sorting

Possible sorting options:

```text
Latest
Most Supported
Most Discussed
```

### Dependencies

Complaint Creation.

---

# Phase 6: Community Voting

After public complaints can be viewed, implement community voting.

### Features

* Upvote complaint
* Remove vote
* Display vote count
* Prevent duplicate votes
* Most-supported complaints
* Trending complaints

Database relationship:

```text
User
  ↓
Vote
  ↓
Complaint
```

A user should only be able to vote once on a specific complaint.

### Dependencies

Authentication and Public Complaint Feed.

---

# Phase 7: Comments and Discussion

After voting is implemented, introduce community discussion.

### Features

* Add comment
* View comments
* Delete own comment
* Edit own comment
* Comment timestamps
* Comment count

Future improvements may include:

* Comment reporting
* Comment moderation
* Replies

### Dependencies

Authentication and Complaint Details.

---

# Phase 8: Staff Dashboard

Once citizens can submit and discuss complaints, staff functionality can be introduced.

### Features

* Staff authentication
* Staff dashboard
* View complaints
* Filter complaints
* Search complaints
* View complaint details
* View community votes
* View comments

### Dependencies

Authentication, Complaint Management, Voting, and Comments.

---

# Phase 9: Complaint Assignment

Staff should be able to assign complaints to specific staff members.

### Features

* Assign complaint
* Reassign complaint
* View assigned complaints
* Staff workload
* Assignment information

Example:

```text
Complaint
    ↓
Assigned to
    ↓
Staff Member
```

### Dependencies

Staff Dashboard and Complaint Management.

---

# Phase 10: Complaint Status Management

After assignment functionality is complete, staff can manage the complaint lifecycle.

### Status Flow

```text
Pending
   ↓
Assigned
   ↓
In Progress
   ↓
Resolved
   ↓
Closed
```

### Features

* Update complaint status
* Add status notes
* Display current status
* Restrict status changes to authorized users
* Display status timeline

### Dependencies

Complaint Assignment.

---

# Phase 11: Resolution History

The platform should maintain a transparent history of complaint changes.

Example:

```text
Complaint Created
      ↓
Assigned to Staff
      ↓
Status changed to In Progress
      ↓
Resolution Added
      ↓
Marked as Resolved
      ↓
Complaint Closed
```

Each history record should contain:

```text
Changed By
Old Status
New Status
Note
Date
```

### Dependencies

Status Management and Staff Management.

---

# Phase 12: Location and Map

Once complaints are working correctly, location-based functionality can be introduced.

### Features

* Store complaint coordinates
* Display complaints on a map
* Nearby complaints
* Location-based filtering
* Complaint map
* Future heatmap support

### Dependencies

Complaint Creation and Public Complaint Feed.

---

# Phase 13: Notifications

Notifications should be implemented after the basic complaint workflow is stable.

### Possible notifications

* Complaint submitted
* Complaint assigned
* Status changed
* Complaint resolved
* Comment received
* Complaint receives significant community support

### Dependencies

Authentication, Complaint Management, Staff Management, and Status Management.

---

# Phase 14: Admin and Moderation

Admin functionality should be implemented after the core platform is stable.

### Features

* Manage users
* Manage staff
* Manage categories
* Moderate complaints
* Moderate comments
* Review reported content
* Manage platform settings

### Dependencies

Authentication, User Management, Complaint Management, and Staff Management.

---

# Phase 15: Analytics and Public Statistics

The final stage can introduce advanced analytics.

### Possible features

* Total complaints
* Resolved complaints
* Pending complaints
* Complaints by category
* Complaints by location
* Average resolution time
* Most supported complaints
* Staff performance statistics
* Community participation statistics

---

# 4. Feature Dependency Rule

Contributors must follow the dependency order.

For example:

```text
Do not build:

Voting
   ↓
before

Complaint Creation
   ↓
and

Authentication
```

Similarly:

```text
Resolution History
   ↓
requires

Status Management
   ↓
requires

Complaint Assignment
   ↓
requires

Staff Management
```

If a feature requires another feature that has not been completed, mention the dependency in the issue before beginning development.

---

# 5. Feature-Based Development

A feature should contain everything required to implement that functionality.

For example:

```text
frontend/
└── src/
    └── features/
        ├── authentication/
        ├── complaints/
        ├── voting/
        ├── comments/
        └── staff/
```

Backend functionality should remain organized using the existing backend architecture:

```text
backend/
├── controllers/
├── models/
├── routes/
├── middleware/
└── services/
```

A single feature may therefore require changes in both applications.

For example:

```text
Complaint Voting
│
├── frontend/
│   └── src/
│       ├── features/
│       │   └── voting/
│       └── services/
│
└── backend/
    ├── controllers/
    ├── models/
    └── routes/
```

This is expected.

---

# 6. One Issue = One Feature

Every contribution should focus on one feature or one clearly defined fix.

Good:

```text
feature/complaint-voting
```

Bad:

```text
feature/voting-and-login-and-homepage-and-comments
```

Do not combine unrelated features into one pull request.

---

# 7. Branch Naming

Use descriptive branch names.

### Features

```text
feature/authentication
feature/complaint-creation
feature/public-complaints
feature/complaint-voting
feature/comments
feature/staff-dashboard
feature/complaint-assignment
feature/status-management
feature/resolution-history
```

### Bug Fixes

```text
fix/login-validation
fix/duplicate-votes
fix/complaint-status
fix/comment-delete
```

### Documentation

```text
docs/readme
docs/contribution-guide
```

---

# 8. Frontend Guidelines

The frontend uses Vite with JavaScript.

Use ES modules:

```javascript
import something from "./something.js";
```

and:

```javascript
export default something;
```

Keep reusable UI inside:

```text
frontend/src/components/
```

Keep feature-specific functionality inside:

```text
frontend/src/features/
```

Keep API communication inside:

```text
frontend/src/services/
```

Avoid putting large amounts of application logic inside `main.js`.

---

# 9. Backend Guidelines

Backend functionality should be separated into appropriate modules.

Use:

```text
controllers/
models/
routes/
middleware/
services/
```

Controllers should handle request/response logic.

Models should define database structures.

Routes should define API endpoints.

Middleware should handle reusable request processing such as authentication and authorization.

Services should contain reusable business logic where appropriate.

---

# 10. API Guidelines

Use consistent REST-style endpoints.

Example:

```text
POST   /api/complaints
GET    /api/complaints
GET    /api/complaints/:id
PATCH  /api/complaints/:id
DELETE /api/complaints/:id
```

Voting:

```text
POST   /api/complaints/:id/vote
DELETE /api/complaints/:id/vote
```

Comments:

```text
GET    /api/complaints/:id/comments
POST   /api/complaints/:id/comments
DELETE /api/comments/:id
```

Keep API naming consistent with the existing project.

---

# 11. Database Changes

If a feature requires a database change:

1. Explain why the change is required.
2. Modify the appropriate model.
3. Check existing relationships.
4. Ensure existing functionality is not broken.
5. Test the database operations.
6. Document any required configuration changes.

Do not modify unrelated models without a clear reason.

---

# 12. UI Guidelines

The platform is public-facing, so the interface should prioritize:

* Clear navigation
* Accessibility
* Responsive design
* Consistent spacing
* Consistent typography
* Clear status indicators
* Easy complaint discovery
* Simple complaint submission
* Consistent components

Before creating a new component, check whether an existing component can be reused.

---

# 13. Testing

Every feature must be tested before submitting a pull request.

Test:

* Normal functionality
* Invalid input
* Unauthorized access
* Duplicate actions
* Missing data
* API errors
* Database errors
* Responsive behavior

For example, voting should be tested as:

```text
Login
  ↓
Open Complaint
  ↓
Vote
  ↓
Vote Count Increases
  ↓
Refresh Page
  ↓
Vote Remains
  ↓
Attempt Second Vote
  ↓
Duplicate Vote Prevented
```

---

# 14. Commit Guidelines

Use descriptive commit messages.

Examples:

```text
feat: add complaint creation
feat: add public complaint feed
feat: add complaint voting
feat: add staff dashboard
fix: prevent duplicate votes
fix: handle missing complaint
refactor: improve complaint controller
docs: update contribution guide
```

Avoid:

```text
update
changes
final
new code
fixed
```

---

# 15. Pull Requests

A pull request should clearly describe:

```text
Feature:
What was implemented?

Reason:
Why is the feature required?

Changes:
What was changed?

Testing:
How was it tested?

Dependencies:
Does it depend on another feature?
```

Example:

```text
Feature:
Community Complaint Voting

Changes:
- Added Vote model
- Added vote controller
- Added vote routes
- Added duplicate vote prevention
- Added voting UI
- Added vote count to complaint cards

Testing:
- Tested authenticated voting
- Tested duplicate voting
- Tested vote removal
- Tested page refresh
```

---

# 16. Do Not Break Existing Features

Before submitting a contribution, verify that existing features continue to work.

Avoid unnecessary changes to:

* Authentication
* Existing API endpoints
* Database models
* Shared components
* Global styles
* Environment configuration

If an existing module must be changed, explain the reason in the pull request.

---

# 17. Security

Never commit:

* Passwords
* API keys
* JWT secrets
* Database credentials
* Private tokens
* Real environment variables

Never commit the real `.env` file.

Use:

```text
.env
.env.example
```

The `.env` file should remain ignored by Git.

---

# 18. Contribution Checklist

Before creating a pull request:

* [ ] The feature follows the development roadmap.
* [ ] Required dependencies are already implemented.
* [ ] The feature has a clearly defined scope.
* [ ] A dedicated branch has been created.
* [ ] Frontend changes are organized correctly.
* [ ] Backend changes are organized correctly.
* [ ] API endpoints follow project conventions.
* [ ] Authentication and authorization are handled correctly.
* [ ] Input validation is implemented.
* [ ] Error handling is implemented.
* [ ] Existing features have been tested.
* [ ] New functionality has been tested.
* [ ] No sensitive information has been committed.
* [ ] Commit messages are descriptive.
* [ ] Documentation has been updated where necessary.
* [ ] Pull request contains a clear description.

---

# 19. Important Rule for Contributors

Do not skip ahead in the feature roadmap without discussing it with the project maintainers.

The recommended development order is:

```text
1.  Project Setup
        ↓
2.  Authentication
        ↓
3.  User Management
        ↓
4.  Complaint Creation
        ↓
5.  Public Complaint Feed
        ↓
6.  Community Voting
        ↓
7.  Comments
        ↓
8.  Staff Dashboard
        ↓
9.  Complaint Assignment
        ↓
10. Status Management
        ↓
11. Resolution History
        ↓
12. Location and Map
        ↓
13. Notifications
        ↓
14. Admin and Moderation
        ↓
15. Analytics
```

A feature may be moved earlier if it is required as a dependency, but this should be discussed before implementation.

---

# 20. General Principle

Build the application **feature by feature and in dependency order**.

Every contribution should be:

```text
Focused
Modular
Testable
Reusable
Documented
Easy to Review
Compatible with Existing Features
```

The objective is to allow multiple contributors to work on the project while keeping the monorepo stable, maintainable, and easy to integrate.
