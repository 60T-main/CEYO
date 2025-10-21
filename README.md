# CEYO

## Project Overview

CEYO is a full-stack e-commerce web application, featuring a modern React frontend and a robust Django backend. The platform allows users to browse products, filter by categories and subcategories, manage orders, and interact with a modern, dynamic UI. The project demonstrates advanced REACT state management, seamless frontend-backend integration, and a scalable architecture suitable for real-world deployment.

---

## Distinctiveness and Complexity

### Why CEYO Satisfies the Requirements

- **Distinctiveness:** CEYO stands out by combining a custom React overlay filter system with persistent state management using context, ensuring a smooth and intuitive user experience. The filter overlay is built as a custom React component that leverages context-based state management, allowing users to select categories and subcategories. When a user selects a category, only relevant subcategories are shown and any previously chosen subcategory is automatically cleared. Filtering also supports price ranges and debounced search input, enabling users to combine multiple criteria for precise results. The backend leverages Django's ORM and REST framework for secure, efficient data handling, and includes custom serializers and model relationships for complex product, order, and customer logic. The backend also features email sending functionality for user registration and notifications, enhancing user engagement and communication.
- **Complexity:** The project features:
  - Context-based state management for filters and overlays in React.
  - Dynamic category/subcategory filtering.
  - Django models with advanced relationships, migrations, and custom serializers.
  - RESTful API endpoints for products, orders, and customers.
  - Custom middleware and utility functions for backend logic.
  - Real-time UI updates and debounced search functionality.
  - Email sending functionality for registration and notifications.
  - Integrated Django Debug Toolbar for advanced debugging and development insights.

---

## File Structure and Contents

- **backend/**: Django backend project.
  - **manage.py**: Django management script.
  - **requirements.txt**: Python dependencies for backend.
  - **backend/**: Django project settings and core files.
    - **settings.py, urls.py, asgi.py, wsgi.py**: Project configuration and entry points.
  - **customers/**, **orders/**, **products/**: Django apps for core business logic.
    - **models.py**: Database models.
    - **serializers.py**: API serializers.
    - **views.py**: API views.
    - **urls.py**: App-specific routing.
    - **admin.py**: Django admin configuration.
    - **migrations/**: Database migration files.
    - **middleware.py, utils.py, resources.py**: Custom backend logic.
- **frontend/**: React frontend project.
  - **src/**: Main source code.
    - **App.jsx, main.jsx**: App entry points.
    - **components/**: Reusable UI components.
    - **overlays/**: Overlay components.
    - **hooks/**: Custom React hooks.
    - **pages/**: Page components.
    - **services/**: API service logic.
    - **style.css**: Custom styles.
    - **assets/**, **skeletons/**: Static assets and loading skeletons.
  - **public/**: Static files.
  - **index.html**: Main HTML template.
  - **vite.config.js**: Vite configuration.
  - **package.json**: Frontend dependencies.
  - **README.md**: Project documentation.

---

## How to Run the Application

### Backend (Django)

1. Install Python 3.10+ and pip.

2. Create and activate a virtual environment:

```powershell
python -m venv .venv
.venv\Scripts\activate
```

3. Navigate to the `backend` directory.

4. Create a `.env` file in the `backend` directory with the following required variables:

```env
DATABASE_NAME=your_db_name
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=your_db_host
DATABASE_PORT=your_db_port
EMAIL_HOST_USER=your_email@example.com
EMAIL_HOST_PASSWORD=your_email_password
```

Adjust values as needed for your environment. 5. Install dependencies:

```powershell
pip install -r requirements.txt
```

6. Run migrations:

```powershell
python manage.py migrate
```

7. Start the server:

```powershell
python manage.py runserver
```

### Frontend (React)

1. Navigate to the `frontend` directory.
2. Install Node.js (v18+) and npm.
3. Install dependencies:

```powershell
npm install
```

4. Start the development server:

```powershell
npm run dev
```

5. Access the app at `http://localhost:5173` (default Vite port).

---

## Additional Information

- **API Integration:** The frontend communicates with the backend via RESTful endpoints for products, orders, and customers.
- **State Management:** Uses React context for persistent filter and overlay state, ensuring user selections persist across overlay toggles.
- **Styling:** Combines Tailwind CSS and custom styles for a modern, responsive UI.
- **Import Paths:** Vite aliases (`@/`) are configured for clean, absolute imports in the frontend.
- **Testing:** Includes unit tests for backend models and serializers, and frontend components.
- **Extensibility:** Easily add new categories, products, or features by updating models and React components.
- **Requirements:** All Python dependencies are listed in `backend/requirements.txt`. Node dependencies are in `frontend/package.json`.

---

## Contact & Support

For questions, issues, or contributions, please open an issue or pull request on GitHub.

---
