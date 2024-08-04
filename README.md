
# Todo-Fullstack

## Description
Todo-Fullstack is a comprehensive task management application designed to streamline task organization and collaboration. With this application, users can efficiently create, update, delete, and manage tasks. Additionally, users can collaborate with their team members, upload photos to tasks, and receive email notifications for task reminders.

## Features
- **User Authentication and Authorization:** Secure user login and registration system.
- **Task Management:** Create, read, update, and delete tasks with ease.
- **Photo Uploads:** Attach photos to tasks for better context and documentation.
- **Email Notifications:** Receive reminders and updates about task deadlines and changes.
- **Calendar View:** Manage tasks with a monthly calendar view, drag and drop tasks to update deadlines.
- **Kanban View:** Manage tasks with a kanban board view, drag and drop tasks to update status.

## Technologies Used
- **Backend:** FastAPI, SQLAlchemy
- **Frontend:** React, Shadcn, Tailwind CSS
- **Database:** SQLite (or specify your database)
- **Email Service:** FastMail for sending email notifications

## Installation

### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/AsuSociety/Todo-Fullstack.git
   cd Todo-Fullstack/backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   Create a `.env` file in the `backend` directory with the following content:
   ```
   DATABASE_URL=sqlite:///./test.db
   SECRET_KEY=your_secret_key
   EMAIL_USER=your_email_user
   EMAIL_PASSWORD=your_email_password
   ```
5. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Run the frontend application:
   ```bash
   npm start
   ```

## Usage
1. Navigate to `http://localhost:3000` in your web browser.
2. Create an account or log in to manage your tasks.
3. Use the interface to:
   - Add new tasks by clicking the "Add Task" button.
   - Edit existing tasks by clicking on them.
   - Delete tasks using the delete button.
   - Upload photos to tasks for better context.
   - Manage deadlines using the calendar view.
   - Toggle email notifications for reminders.

## API Endpoints
### Authentication
- **POST /register:** Register a new user.
- **POST /login:** Authenticate a user and return a JWT token.

### Tasks
- **GET /tasks:** Retrieve all tasks for the authenticated user.
- **POST /tasks:** Create a new task.
- **GET /tasks/{id}:** Retrieve a specific task by ID.
- **PUT /tasks/{id}:** Update a specific task by ID.
- **DELETE /tasks/{id}:** Delete a specific task by ID.

### Photos
- **POST /tasks/{id}/photos:** Upload a photo to a specific task.
- **GET /tasks/{id}/photos:** Retrieve all photos for a specific task.
- **DELETE /photos/{photo_id}:** Delete a photo by ID.

## Contributing
Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments
- **FastAPI:** For the powerful and flexible backend framework.
- **React:** For the interactive and dynamic frontend library.
- **Shadcn and Tailwind CSS:** For the beautiful and responsive UI components.
- **SQLAlchemy:** For the robust and efficient ORM.
- **FastMail:** For handling email notifications.

