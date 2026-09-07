# Nexquira – AI-Powered Research Assistant

<div align="center">

![Java](https://img.shields.io/badge/Java-22-orange?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Google-Gemini-blue?style=for-the-badge)
![Chrome Extension](https://img.shields.io/badge/Chrome-Manifest%20V3-yellow?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

### Intelligent Research Companion for Modern Knowledge Workers

**Summarize. Capture. Organize. Research Smarter.**

</div>

---

## Overview

Nexquira is an AI-powered Chrome Extension designed to streamline online research workflows.

It enables users to instantly summarize selected content from any webpage, generate concise insights using Google's Gemini API, and persist research notes directly inside the browser — tied to a secure user account rather than just local browser storage.

By minimizing context switching and reducing information overload, Nexquira significantly enhances productivity for students, researchers, developers, and knowledge workers.

---

## Problem Statement

Modern users consume enormous amounts of information online.

However:

- Important insights get buried inside lengthy articles.
- Switching between tabs for note-taking disrupts focus.
- Organizing research findings becomes tedious.
- Revisiting valuable information is difficult.
- Notes tied only to a browser are lost across devices.

Nexquira addresses these challenges by integrating AI-assisted research directly into the browsing experience, with account-based persistence so research follows the user, not the device.

---

## Features

### AI Research Assistance
- Instant webpage text summarization
- Context-aware content extraction
- AI-generated research insights

### Research Notes
- Persistent, database-backed note storage (H2)
- Notes tied to a user account, not just a browser
- Quick access to saved insights
- Automatic citation generation for saved notes

### Authentication & Security
- OAuth2 / JWT-based authentication (Spring Security)
- Account-linked research notes
- Environment-based, secure credential configuration

### Browser Integration
- Chrome Side Panel support
- One-click summarization
- Minimal and distraction-free workflow

### Engineering Features
- Spring Boot REST backend
- Gemini API integration
- H2 database persistence layer
- Modular and extensible architecture

---

# System Architecture

```text
┌────────────────────────────┐
│     Chrome Extension       │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│   Spring Security (OAuth2/  │
│         JWT Auth)           │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│      Spring Boot API       │
└─────────────┬──────────────┘
              │
       ┌──────┴───────┐
       ▼              ▼
┌─────────────┐  ┌────────────────┐
│ H2 Database │  │  Prompt Builder │
│ (Notes +    │  └────────┬───────┘
│  Citations) │           │
└─────────────┘           ▼
              ┌────────────────────────────┐
              │     Google Gemini API      │
              └─────────────┬──────────────┘
                            │
                            ▼
              ┌────────────────────────────┐
              │    Response Processing     │
              └────────────────────────────┘
```

---

## Application Workflow

```text
User authenticates (OAuth2 / JWT)
            ↓
User selects webpage text
            ↓
Chrome Extension captures selection
            ↓
Selected content sent to backend (authenticated request)
            ↓
Prompt generated dynamically
            ↓
Gemini API processes request
            ↓
Summary returned to extension
            ↓
User saves research insights + citation to H2 database
```

---

# ⚡ Technology Stack

| Technology | Purpose |
|------------|----------|
| Java | Backend Development |
| Spring Boot | REST API |
| Spring Security | OAuth2 / JWT Authentication |
| H2 Database | Persistent Note & Citation Storage |
| WebClient | HTTP Communication |
| Google Gemini API | AI Summarization |
| HTML/CSS | UI Development |
| JavaScript | Extension Logic |
| Chrome Storage API | Local Session State |
| Manifest V3 | Browser Extension Platform |

---

## Project Structure

```text
Nexquira
│
├── backend
│   ├── controller
│   ├── service
│   ├── dto
│   ├── model
│   ├── security      (OAuth2 / JWT configuration)
│   ├── repository     (H2 persistence)
│   └── configuration
│
├── extension
│   ├── manifest.json
│   ├── background.js
│   ├── sidepanel.html
│   ├── sidepanel.css
│   ├── sidepanel.js
│   └── assets
│
└── README.md
```

---

## Technical Challenges Solved

### Browser ↔ Backend Communication
Implemented communication between a Chrome Extension and Spring Boot backend using REST APIs.

### Authentication & Authorization
Implemented OAuth2 / JWT-based authentication with Spring Security, tying every research note to a specific user account instead of local browser storage.

### AI Response Parsing
Designed custom extraction logic for nested Gemini API responses.

### Prompt Engineering
Built dynamic prompts for different research operations.

### Persistent Storage & Citations
Implemented durable note persistence and automatic citation generation using an H2 database, replacing purely local, browser-bound storage.

### Secure Configuration
Secured API credentials and auth secrets using environment variables.

---

## Engineering Highlights

- Layered Architecture
- Dependency Injection
- RESTful API Design
- OAuth2 / JWT Authentication (Spring Security)
- Database-Backed Persistence (H2)
- AI Integration
- Prompt Engineering
- Browser Extension Development
- Modular Design Principles
- Separation of Concerns

---

## Project Metrics

| Metric | Value |
|---------|--------|
| Architecture | Client → Auth → API → LLM → DB |
| Backend Response Time | ~1–2 sec |
| AI Provider | Google Gemini |
| Authentication | OAuth2 / JWT (Spring Security) |
| Database | H2 |
| Extension Platform | Manifest V3 |

---

#  Getting Started

## Backend Setup

### application.properties

```properties
spring.application.name=SR

gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=

gemini.api.key=${GEMINI_KEY}
```

### Environment Variable

```env
GEMINI_KEY=YOUR_GEMINI_API_KEY
```

### Run Backend

```bash
mvn clean install
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

## Chrome Extension Setup

1. Open:

```text
chrome://extensions
```

2. Enable **Developer Mode**

3. Click **Load Unpacked**

4. Select:

```text
extension/
```

---

## Example Request

```json
{
  "content":"Data Structures are important for software engineering.",
  "operation":"summarize"
}
```

---

## Example Response

```text
• DSA forms the foundation of software systems.

• Widely used in databases, AI systems and search engines.

• Strong DSA knowledge improves problem-solving abilities.
```

---

# 🔮 Future Roadmap

### Version 1.1
- Loading indicators
- Copy summary button
- Improved error handling

### Version 1.2
- Key takeaways extraction
- Explain selected text
- Action items generation

### Version 2.0
- Research history
- Cloud synchronization
- PDF export
- Multi-LLM support
- Semantic Search
- Vector Database Integration

---

## Skills Demonstrated

- Java Backend Development
- Spring Boot Ecosystem
- REST API Design
- Authentication & Authorization (OAuth2 / JWT)
- Database Design & Persistence
- Browser Extension Development
- AI API Integrations
- Prompt Engineering
- State Management
- System Design Principles
- Full Stack Engineering

---

## Why Nexquira?

Unlike traditional summarization tools, Nexquira integrates directly into the browsing workflow, enabling users to:

✔ Research Faster  
✔ Reduce Information Overload  
✔ Capture Insights Efficiently  
✔ Minimize Context Switching  
✔ Improve Knowledge Retention  
✔ Access Research From Any Device (Account-Linked)

---


<div align="center">

<h3>Designed to simplify research, enhance productivity, and accelerate knowledge discovery.</h3>

<strong>Nexquira — Research Smarter.</strong>

</div>
