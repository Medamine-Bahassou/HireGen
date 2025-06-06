# HireGen 

## Description
This application is designed to streamline the hiring process by providing features for managing missions, tracking history, and interacting with a Groq-powered chat for AI-driven insights.

### Key Features:
*   **Mission Management**: Create, update, and track hiring missions.
*   **Mission History**: View a comprehensive history of all missions.
*   **AI Chat Integration**: Interact with a Groq-powered AI for assistance and insights related to hiring tasks.
    *   **System Prompt and Response**: The AI chat is configured to receive a system prompt that guides its behavior and context. This system prompt is defined within the `hiregen1.client/src/components/GroqChat.jsx` file. Responses are typically in a conversational format, providing relevant information or suggestions based on the user's input and the predefined system prompt.

## Technologies Used

### Frontend
*   **React**: A JavaScript library for building user interfaces.
*   **Vite**: A fast build tool for modern web projects.
*   **CSS**: For styling the application.

### Backend
*   **.NET 8**: A free, cross-platform, open-source developer platform for building many different types of applications.
*   **ASP.NET Core**: A framework for building web apps and services with .NET.
*   **Entity Framework Core**: An object-relational mapper (ORM) for .NET.
*   **MySQL**: A relational database management system.

## Installation

To set up the project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/hiregen1.git
cd hiregen1
```

### 2. Backend Setup (hiregen1.Server)

Navigate to the `hiregen1.Server` directory:
```bash
cd hiregen1.Server
```

#### Install .NET Dependencies
```bash
dotnet restore
```

#### Database Setup
This project uses MySQL with Entity Framework Core.
1.  Ensure you have a MySQL server running.
2.  Update the connection string in `hiregen1.Server/appsettings.json` and `hiregen1.Server/appsettings.Development.json` to point to your MySQL database.
    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Server=localhost;Port=3306;Database=hiregen1db;Uid=your_user;Pwd=your_password;"
    }
    ```
3.  Apply database migrations:
    ```bash
    dotnet ef database update
    ```

### 3. Frontend Setup (hiregen1.client)

Navigate to the `hiregen1.client` directory:
```bash
cd hiregen1.client
```

#### Install Node.js Dependencies
```bash
npm install
```

#### Environment Variables
Create a `.env` file in the `hiregen1.client` directory and add your Groq API key:
```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

## Running the Project

### 1. Start the Backend (hiregen1.Server)

From the `hiregen1.Server` directory:
```bash
dotnet run
```
This will start the ASP.NET Core backend, typically on `https://localhost:7000` or a similar port.

### 2. Start the Frontend (hiregen1.client)

From the `hiregen1.client` directory:
```bash
npm run dev
```
This will start the React development server, typically on `http://localhost:5173` or a similar port. The frontend will proxy API requests to the backend.

## Screenshots

### Home Page
![Home Page Screenshot]

### Mission History
![Mission History Screenshot]

