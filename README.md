
# EduSys (Smart Classroom Management System)

![image](https://github.com/user-attachments/assets/cda79992-a8c8-493f-a3dd-d664d162fe33)

## Problem Statement
Educational institutions face challenges in managing virtual classrooms and ensuring active student engagement during remote learning. Teachers need tools that support interactive teaching methods, allow for real-time communication, and simplify administrative tasks like attendance tracking and assignment distribution. EduConnect aims to address these needs by providing a virtual classroom management platform where teachers can create and manage their own subjects, post assignments and notices, conduct meetings with real-time whiteboard capabilities, and engage students through dedicated group chats. Additionally, EduConnect includes a Real-Time Attendance Checker to streamline attendance tracking during virtual sessions, ultimately enhancing teaching effectiveness and learning outcomes for institutions.

## Overview
The **EduSys (Smart Classroom Management System)** is a comprehensive solution designed to enhance the learning experience for both educators and students. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), this application leverages **Socket.IO** for real-time communication, the **Stream SDK** for chat functionalities, and integrates an AI-powered chatbot to assist with common queries and guidance.

## Features
- **Create and Manage Assignments and Notices**: Easily create, edit, and manage assignments and important notices for students.
- **AI-Powered Chatbot**: A responsive chatbot to assist students and teachers by answering frequently asked questions, providing guidance on using the platform, and supporting general queries.
- **Group Chat Functionality**: Enable communication within different classes with a dedicated group chat feature.
- **Class Meeting**: A Class Meeting is a scheduled virtual session where teachers and students connect for instruction, discussion, and support.
- **Real-Time Attendance**: Automatically captures participant names during Class Meetings, allowing teachers to easily mark attendance for their institution.
- **Interactive Whiteboard**: A virtual whiteboard for teachers to visually explain concepts, draw diagrams, and facilitate collaborative learning during Class Meetings.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Real-Time Communication**: Socket.IO
- **Meet Functionality**: Stream SDK
- **AI Chatbot**: Gemini ai

## Installation
To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/smart-classroom-management-system.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd EduSync
   ```

3. **Install dependencies**:
   For the server:
   ```bash
   cd server
   npm install
   ```

   For the client:
   ```bash
   cd client
   npm install
   ```

4. **Set up environment variables**:
   Create a `.env` file in the server directory and add the necessary environment variables. Refer to `.env.example` for guidance.

5. **Run the application**:
   Start the server:
   ```bash
   npm start
   ```

   Start the client:
   ```bash
   cd client
   npm start
   ```

## Usage
Once the application is running, you can access it via `http://localhost:3000`. Use the dashboard to navigate through the various features, manage classroom activities, and interact with the AI-driven chatbot for assistance.

## Acknowledgments
A big thank you to **@Anurag-singh-thakur** for their invaluable help with the frontend. Your expertise and support made a significant impact on the project.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

