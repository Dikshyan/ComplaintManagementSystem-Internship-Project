# The Civic Voice — Making Local Voices Count

A public-oriented complaint management platform that allows citizens to report community issues and enables others to support those complaints through voting and discussion. Authorities or staff can review, assign, track, and resolve complaints while maintaining a transparent history of status updates.

## Overview

The platform is designed to improve communication between citizens and authorities by making public complaints visible and community-driven.

Users can raise complaints related to issues such as roads, garbage management, water supply, street lights, traffic, public health, transportation, and other public services.

Other users can view complaints, vote to show their support, and participate in discussions. Staff can manage complaints from submission to resolution.

## Key Features

### Public Users

* User registration and authentication
* Raise public complaints
* Select complaint category
* Add title and detailed description
* Set complaint priority
* Add location information
* Upload optional attachments
* View publicly submitted complaints
* Vote on complaints
* Comment and discuss complaints
* Track complaint status
* View complaint resolution history
* Search and filter complaints

### Complaint Management

Each complaint contains:

* Complaint title
* Category
* Description
* Priority
* Location
* Attachments
* Current status
* Vote count
* Comment count
* Complaint creator
* Assigned staff member
* Creation date
* Last updated date

### Staff and Authority Dashboard

Staff members can:

* View submitted complaints
* Filter complaints by category, priority, and status
* Assign complaints to staff members
* Update complaint status
* Add resolution notes
* View complaint history
* Manage reported issues
* Mark complaints as resolved or closed

## Complaint Status

A complaint can move through the following stages:

```text
Pending
   |
   v
Assigned
   |
   v
In Progress
   |
   v
Resolved
   |
   v
Closed
```

Every status change can be recorded in the complaint's resolution history.

## Community Voting

Users can vote on complaints that they support.

Each user can vote only once on a particular complaint. The voting system helps identify issues that affect a larger portion of the community.

Community votes represent public support and should not automatically determine the official priority of a complaint. Priority can instead be determined based on the severity and impact of the issue.

## Homepage

The homepage provides a public dashboard containing:

* Complaint search
* Raise Complaint button
* Platform statistics
* Trending complaints
* Recent complaints
* Complaint categories
* Interactive complaint map
* Community activity
* How It Works section
* Call to action for reporting issues

## Main Application Flow

```text
User
 |
 |-- Register / Login
 |
 v
Homepage
 |
 |-- Explore Complaints
 |-- Search Complaints
 |-- View Categories
 |-- View Map
 |
 v
Raise Complaint
 |
 |-- Category
 |-- Title
 |-- Description
 |-- Priority
 |-- Location
 |-- Attachments
 |
 v
Public Complaint
 |
 |-- Community Voting
 |-- Comments
 |-- Status Tracking
 |
 v
Authority Review
 |
 |-- Assign Staff
 |-- Update Status
 |-- Add Resolution Notes
 |
 v
Resolution
 |
 v
Closed Complaint
```

## Core Data Models

### User

```text
User
├── id
├── name
├── email
├── password
└── role
```

### Complaint

```text
Complaint
├── id
├── userId
├── title
├── category
├── description
├── priority
├── location
├── attachments
├── status
├── assignedTo
├── voteCount
├── createdAt
└── updatedAt
```

### Vote

```text
Vote
├── id
├── userId
├── complaintId
└── createdAt
```

### Comment

```text
Comment
├── id
├── userId
├── complaintId
├── text
└── createdAt
```

### Complaint History

```text
ComplaintHistory
├── id
├── complaintId
├── changedBy
├── oldStatus
├── newStatus
├── note
└── createdAt
```

## Suggested Categories

* Roads and Infrastructure
* Street Lights
* Waste Management
* Water Supply
* Traffic
* Public Health
* Environment
* Public Transportation
* Government Services
* Other

## Project Goals

The main goals of the platform are:

1. Make reporting public issues simple and accessible.
2. Allow communities to collectively support important complaints.
3. Help authorities prioritize and manage reported issues.
4. Provide transparency through complaint status and resolution history.
5. Create a centralized platform for tracking community problems.

## Future Improvements

* Location-based complaint discovery
* Interactive complaint heatmaps
* Email and notification system
* Authority verification
* Complaint severity scoring
* Duplicate complaint detection
* Image-based issue classification
* Analytics dashboard
* Mobile application
* AI-assisted complaint categorization
* Public authority performance statistics

## License

This project is developed for educational and project development purposes.
