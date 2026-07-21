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

It enables users to instantly summarize selected content from any webpage, generate concise insights using Google's Gemini API, and persist research notes directly inside the browser.

By minimizing context switching and reducing information overload, Nexquira significantly enhances productivity for students, researchers, developers, and knowledge workers.

---

## Problem Statement

Modern users consume enormous amounts of information online.

However:

- Important insights get buried inside lengthy articles.
- Switching between tabs for note-taking disrupts focus.
- Organizing research findings becomes tedious.
- Revisiting valuable information is difficult.

Nexquira addresses these challenges by integrating AI-assisted research directly into the browsing experience.

---

## Features

### AI Research Assistance
- Instant webpage text summarization
- Context-aware content extraction
- AI-generated research insights

### Research Notes
- Persistent note storage
- Local browser synchronization
- Quick access to saved insights

### Browser Integration
- Chrome Side Panel support
- One-click summarization
- Minimal and distraction-free workflow

### Engineering Features
- Spring Boot REST backend
- Gemini API integration
- Environment-based configuration
- Modular and extensible architecture

---

# 📸 Screenshots

### Extension Interface

<p align="center">
  <img src="https://github.com/user-attachments/assets/650dab91-45dc-4633-a0b7-a9c779157925"
       width="900"
       alt="Nexquira Interface"/>
</p>

### AI Generated Summary

<p align="center">
  <img src="https://github.com/user-attachments/assets/d656275c-180d-4bc7-aaa6-36edcc3979e0"
       width="900"
       alt="AI Generated Summary"/>
</p>

### Research Notes

<p align="center">
  <img src="https://github.com/user-attachments/assets/82e7628b-bece-4230-85fb-95b33524db42"
       width="400"
       alt="Research Notes"/>
</p>

---
#  System Architecture

```text
┌────────────────────────────┐
│     Chrome Extension       │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│      Spring Boot API       │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│      Prompt Builder        │
└─────────────┬──────────────┘
              │
              ▼
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
User selects webpage text
            ↓
Chrome Extension captures selection
            ↓
Selected content sent to backend
            ↓
Prompt generated dynamically
            ↓
Gemini API processes request
            ↓
Summary returned to extension
            ↓
User saves research insights
```

---

# ⚡ Technology Stack

| Technology | Purpose |
|------------|----------|
| Java | Backend Development |
| Spring Boot | REST API |
| WebClient | HTTP Communication |
| Google Gemini API | AI Summarization |
| HTML/CSS | UI Development |
| JavaScript | Extension Logic |
| Chrome Storage API | Persistent Notes |
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

### AI Response Parsing
Designed custom extraction logic for nested Gemini API responses.

### Prompt Engineering
Built dynamic prompts for different research operations.

### State Persistence
Implemented local note persistence using Chrome Storage APIs.

### Secure Configuration
Secured API credentials using environment variables.

---

## Engineering Highlights

- Layered Architecture
- Dependency Injection
- RESTful API Design
- AI Integration
- Prompt Engineering
- Browser Extension Development
- Modular Design Principles
- Separation of Concerns

---

## Project Metrics

| Metric | Value |
|---------|--------|
| Architecture | Client → API → LLM |
| Backend Response Time | ~1–2 sec |
| AI Provider | Google Gemini |
| Extension Platform | Manifest V3 |
| Storage | Chrome Local Storage |

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
- Citation generation
- Multi-LLM support
- Semantic Search
- Authentication System
- Vector Database Integration

---

## Skills Demonstrated

- Java Backend Development
- Spring Boot Ecosystem
- REST API Design
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

---


<div align="center">

<h3>Designed to simplify research, enhance productivity, and accelerate knowledge discovery.</h3>

<strong>Nexquira — Research Smarter.</strong>

</div>
