# 🔍 Name Classifier API

A simple backend API that classifies a name using the Genderize API and adds a confidence layer on top of the prediction.

## 🚀 What it does

Given a name, this API:

- Calls the Genderize API
- Returns predicted gender
- Calculates confidence based on probability + sample size
- Adds metadata like processing time
- Handles errors gracefully

## 📡 Endpoint

### Classify Name

GET /api/classify?name={name}

## ✅ Success Response

{
"status": "success",
"data": {
"name": "john",
"gender": "male",
"probability": 0.99,
"sample_size": 1234,
"is_confident": true,
"processed_at": "2026-04-01T12:00:00Z"
}
}

## ❌ Error Response

{
"status": "error",
"message": "Error description here"
}

## ⚙️ Features

- External API integration (Genderize)
- Input validation
- Confidence scoring logic
- Clean structured responses
- Basic rate limiting support
- Handles edge cases (no prediction, invalid input)

## 🧠 Confidence Logic

A result is considered confident when:

- probability ≥ 0.7
- sample_size ≥ 100

## 🛠 Tech Stack

- Node.js
- Express
- Axios

## 💡 Purpose

This project demonstrates:

- API design
- data transformation
- backend validation logic
- clean response structuring
