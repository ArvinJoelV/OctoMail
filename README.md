# 🚀 OctoMail - AI Powered Email Intelligence Platform

An AI-powered email productivity platform that transforms a cluttered inbox into actionable insights using Large Language Models, Semantic Search, Vector Embeddings, and Retrieval-Augmented Generation (RAG).

## ✨ Features

### 📧 Gmail Integration

* Google OAuth 2.0 Authentication
* Gmail API Integration
* Secure inbox access
* Incremental email synchronization using Gmail History API
* Automatic token refresh support

### 🤖 AI Email Processing

Each email is automatically analyzed and enriched with:

* AI-generated Summary
* Priority Classification (High / Medium / Low)
* Category Classification
* Task Extraction
* Deadline Detection
* Vector Embedding Generation

Supported Categories:

* Placement
* Academic
* Coding
* Finance
* Shopping
* Newsletter
* Social
* Other

---

### 🔍 Semantic Email Search

Search emails using natural language instead of exact keywords.

Examples:

```text
internship opportunities
machine learning emails
interview related emails
amazon assessments
```

Powered by:

* Gemini Embeddings
* MongoDB Atlas Vector Search

---

### 🔗 Similar Emails

Discover semantically related emails.

Examples:

* Similar internship opportunities
* Related recruiter conversations
* Similar project discussions

---

### 🧠 AI Copilot (RAG)

Ask questions about your inbox.

Examples:

```text
What internship opportunities did I receive?

Which emails require action?

What deadlines are approaching?

Summarize important emails this week.
```

Features:

* Retrieval Augmented Generation (RAG)
* Semantic Retrieval
* Context-Aware Responses
* Conversation History
* Source Attribution

---

### 📩 Single Email AI Assistant

Ask questions about a specific email.

Examples:

```text
Summarize this email

What action is required?

What deadlines are mentioned?

Draft a reply
```

---

### 📰 Daily Digest

Automatically generated AI digest containing:

* Important Emails
* Upcoming Deadlines
* Action Items
* High Priority Messages

---

### 🔔 Smart Notifications

Receive notifications for:

* High Priority Emails
* New Tasks
* Upcoming Deadlines
* Important Updates

---

### 📊 Analytics Dashboard

Inbox intelligence and productivity analytics.

Includes:

* Email Categories Distribution
* Email Activity Trends
* Top Senders
* Priority Distribution
* Upcoming Deadlines
* Task Dashboard
* Productivity Insights

---

## 🏗️ System Architecture

```text
User
 ↓
Google OAuth
 ↓
Gmail API
 ↓
Email Sync Service
 ↓
BullMQ Queue
 ↓
AI Processing Pipeline
 ↓
MongoDB Atlas
 ↓
Frontend Dashboard
```

### AI Processing Pipeline

```text
Email
 ↓
Summarization
 ↓
Priority Classification
 ↓
Task Extraction
 ↓
Deadline Detection
 ↓
Embedding Generation
 ↓
Storage
```

### Copilot Pipeline

```text
User Question
 ↓
Embedding Generation
 ↓
Vector Search
 ↓
Relevant Email Retrieval
 ↓
LLM Reasoning
 ↓
Answer Generation
```

---

## 🛠️ Tech Stack

### Frontend

* React
* React Router
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Atlas Vector Search

### Authentication

* Passport.js
* Google OAuth 2.0

### AI & LLM

* Google Gemini
* Groq

### Background Processing

* BullMQ
* Redis

### APIs

* Gmail API

---

## 📂 Project Structure

```text
OctoMail
│
├── frontend
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── services
│   ├── context
│   └── mock
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── middleware
│   ├── models
│   ├── queues
│   └── workers
│
└── README.md
```

---

## 🗄️ Database Models

### Email

Stores:

* Gmail Metadata
* Summary
* Priority
* Category
* Tasks
* Deadlines
* Embeddings

### Digest

Stores AI-generated daily digests.

### Notification

Stores intelligent user notifications.

### ChatMessage

Stores Copilot conversation history.

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/Harikaran14/OctoMail.git
cd OctoMail
```

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
MONGO_URI=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

SESSION_SECRET=

GEMINI_API_KEY=
GROQ_API_KEY=

REDIS_URL=
```

---

## 📸 Screenshots

### Dashboard

*Add screenshot here*

### Semantic Search

*Add screenshot here*

### AI Copilot

*Add screenshot here*

### Analytics

*Add screenshot here*

---

## 🌟 Key Highlights

✅ Gmail OAuth Integration

✅ Incremental Gmail Sync

✅ BullMQ Background Workers

✅ AI Email Processing

✅ Semantic Search

✅ Similar Email Discovery

✅ AI Copilot (RAG)

✅ Daily Digest

✅ Smart Notifications

✅ Analytics Dashboard

---

## 🔮 Future Improvements

* Smart Reply Generation
* Calendar Integration
* Meeting Extraction
* Workflow Automation Agents
* Multi-Mail Provider Support
* Personalized Productivity Recommendations

---

## 👨‍💻 Author

**Harikaran C**

B.Tech Information Technology

SSN College of Engineering

GitHub: https://github.com/Harikaran14

