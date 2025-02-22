# RAG Application

A full-stack application for Retrieval-Augmented Generation (RAG) that combines document processing with AI-powered question answering.

## Features

- Document upload and processing
- AI-powered question answering using Azure OpenAI
- Vector storage using Weaviate
- Authentication and role-based access control
- React frontend with TypeScript
- FastAPI backend with Python

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- Mantine UI components
- React Query for data fetching
- React Router for navigation

### Backend
- FastAPI (Python)
- Azure OpenAI for embeddings and chat
- Weaviate vector database
- JWT authentication

## Development

1. Start the services:
```bash
./dev.sh
```

This will start:
- Weaviate database
- Backend server on http://localhost:8000
- Frontend dev server on http://localhost:5173

2. Default login credentials:
- Admin: username: `admin`, password: `admin`
- User: username: `user`, password: `user`
