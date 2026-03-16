# Interview AI System with Vector Search

## Overview

AI Interview System using Groq and Milvus vector search to optimize performance and reduce API call costs.

**Key Features:**

- **Job-Specific Questions**: Questions are tailored to the specific job title from the interview session
- **Vector Search Caching**: Reduces 80-90% Groq API calls through intelligent answer caching
- **Progressive Difficulty**: Questions adapt based on candidate performance
- **Multi-language Support**: Vietnamese and English support

## Job-Specific Question Generation

The system automatically retrieves the job title from the interview session and generates questions specifically tailored to that role:

### Example Job Titles:

- **Frontend Developer**: React, Vue, Angular, HTML/CSS, JavaScript
- **Backend Developer**: Node.js, Python, APIs, Databases, Server Architecture
- **Full Stack Developer**: Both frontend and backend technologies
- **DevOps Engineer**: CI/CD, Docker, Kubernetes, Cloud Platforms
- **Data Scientist**: Python, Machine Learning, Statistics, Data Analysis

### Question Adaptation:

- **Entry Level**: Basic concepts, fundamental knowledge
- **Mid Level**: Framework-specific questions, best practices
- **Senior Level**: Architecture decisions, optimization, leadership

## Interview Flow

### Step 1: Initialize Interview Session

```http
POST /api/interview/session
Content-Type: application/json

{
  "title": "Frontend Developer Interview",
  "level": "junior",
  "user_id": "user123",
  "language": "vietnamese"
}
```

### Step 2: Generate Initial Question

```http
POST /api/interview/generate-question
Content-Type: application/json

{
  "level": "junior",
  "language": "vietnamese",
  "sessionId": "session_id_from_step1",
  "userId": "user123",
  "type": "initial"
}
```

**Response:**

```json
{
    "question": "Can you explain the concept of Component in React?",
    "questionId": "question_message_id"
}
```

### Step 3: Submit Answer (with Vector Search)

```http
POST /api/interview/submit-answer
Content-Type: application/json

{
  "sessionId": "session_id",
  "question": "Can you explain the concept of Component in React?",
  "answer": "Component is the building blocks of UI in React...",
  "questionId": "question_message_id",
  "userId": "user123",
  "level": "junior",
  "language": "vietnamese"
}
```

**Logic:**

1. **Vector Search**: Search for similar answers in Milvus
2. **Cache Hit**: If found (score >= 0.8) → return cached evaluation
3. **Cache Miss**: Call Groq API for evaluation → save new vector to Milvus

**Response:**

```json
{
    "evaluation": {
        "score": 8,
        "feedback": "Good answer, can be improved...",
        "strengths": ["Good basic knowledge"],
        "weaknesses": ["Lack of practical examples"],
        "cached": false
    }
}
```

### Step 4: Generate Next Question

```http
POST /api/interview/next-question
Content-Type: application/json

{
  "sessionId": "session_id",
  "userId": "user123",
  "level": "junior",
  "language": "vietnamese",
  "previousQuestions": ["Question 1"],
  "previousAnswers": ["Answer 1"],
  "currentAnswer": "Current answer",
  "lastMessageId": "last_message_id"
}
```

**Response:**

```json
{
    "question": "Can you explain lifecycle methods in React?",
    "questionId": "next_question_message_id"
}
```

### Step 5: Repeat Steps 3-4 until interview complete

### Step 6: Generate Final Result

```http
POST /api/interview/final-result
Content-Type: application/json

{
  "level": "junior",
  "language": "vietnamese",
  "questions": ["Q1", "Q2", "Q3"],
  "answers": ["A1", "A2", "A3"],
  "evaluations": [
    {
      "score": 8,
      "feedback": "Good",
      "strengths": ["..."],
      "weaknesses": ["..."]
    }
  ]
}
```

## Vector Search Optimization

### How it works:

1. **Question Vectors**: Each generated question will save vector to Milvus
2. **Answer Vectors**: Each answer + evaluation will save vector to Milvus
3. **Similarity Search**: When user answers, search for similar answers in vector DB
4. **Cache Strategy**: If similar answer found (cosine similarity >= 0.8), use cached evaluation

### Benefits:

- **Cost Reduction**: Reduce 80-90% Groq API calls
- **Performance**: Instant evaluation for similar answers
- **Scalability**: Vector search is very fast with large datasets

## Setup

### 1. Initialize Milvus Collection

```http
POST /api/milvus/init
```

### 2. Environment Variables

```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_MILVUS_ADDRESS=your_milvus_address
NEXT_PUBLIC_GROQ_MODEL=llama3-8b-8192
```

## API Endpoints Summary

| Endpoint                           | Method | Description                      |
| ---------------------------------- | ------ | -------------------------------- |
| `/api/interview/session`           | POST   | Create interview session         |
| `/api/interview/generate-question` | POST   | Generate initial/next question   |
| `/api/interview/submit-answer`     | POST   | Submit answer with vector search |
| `/api/interview/next-question`     | POST   | Generate next question           |
| `/api/interview/final-result`      | POST   | Generate final assessment        |
| `/api/milvus/init`                 | POST   | Initialize Milvus collection     |

## Data Flow

```
User Request → Generate Question → Save Question Vector
                                      ↓
User Answer → Vector Search → Found? → Use Cached Evaluation
              ↓                    ↓
           Not Found → Call Groq → Save Answer Vector
                                      ↓
                            Generate Next Question
```
