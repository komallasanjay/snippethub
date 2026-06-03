# 💻 SnippetHub — Code Snippet Manager

[![Java Version](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3+-green.svg)](https://spring.io/projects/spring-boot)
[![React Version](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-black.svg)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**SnippetHub** is a production-grade, full-stack web application designed for developer productivity. It provides a clean, centralized library to store, organize, search, share, and discover high-quality code snippets. 

Featuring a strict, premium monochrome UI, SnippetHub balances personal organization with community features. It includes advanced sharing mechanisms (with expiration and view limits), categorized collections, tagging, a threaded commenting system, and secure token-based authentication.

---

## 🎨 Design Philosophy & UX

SnippetHub adheres to a **strict monochrome design system** built primarily with slate/zinc grays, rich blacks, and pure whites. 
- **Accents:** A single highlight accent (`zinc-900` in light mode / `zinc-100` in dark mode) directs user attention.
- **Typography:** Uses `JetBrains Mono` for code rendering and `Geist` or `IBM Plex Sans` for UI copy.
- **Rich Interaction:** Micro-animations, smooth hover states, and dynamic loaders provide a highly responsive, native-like user experience.
- **Code Highlighting:** Powered by CodeMirror 6, custom-themed to match the application's clean aesthetic.

---

## ✨ Features

*   **🔒 Secure JWT Authentication:** Stateless sessions using short-lived Access Tokens and long-lived Refresh Tokens with automatic Axios interceptor silent refresh.
*   **📝 Advanced Code Editing:** Custom-themed CodeMirror 6 editor with syntax highlighting for popular languages, auto-focus, and full-screen compatibility.
*   **📁 Structured Collections:** Organize snippets into folder-like collections (e.g., "React Hooks", "Spring Utils") with public or private visibility.
*   **🏷️ Intelligent Tagging & Search:** Full-text search over titles, descriptions, and tags. Fast filtering and query debouncing.
*   **🔗 Secure Expiring Share Links:** Generate temporary, UUID-tokenized URLs for sharing code with options for:
    *   *Expiration timestamps* (link automatically becomes invalid after time passes).
    *   *Maximum view counts* (link self-destructs after being viewed $N$ times).
*   **💬 Developer Community:** 
    *   Threaded/nested commenting support on public snippets.
    *   Star/unstar snippets to bookmark community highlights.
    *   One-click copy-to-clipboard tracking.
*   **⚡ Rate Limiting:** Armed with Bucket4j on public sharing and authentication endpoints to prevent brute-force attacks and abuse.
*   **🌓 Native Light/Dark Mode:** Automatic system preference detection with persistent manual override in local storage.

---

## 🏗️ Project Architecture

```
snippethub/
├── backend/                   # Spring Boot REST API
│   ├── src/main/java/         # Java Source Code
│   │   └── com/snippethub/
│   │       ├── config/        # Security, CORS, JWT configs
│   │       ├── controller/    # REST API Controllers
│   │       ├── dto/           # MapStruct Request/Response models
│   │       ├── entity/        # JPA Entities (Hibernate)
│   │       ├── exception/     # Global Error Handling
│   │       ├── repository/    # Spring Data JPA Repository interfaces
│   │       ├── security/      # JWT filter and User details service
│   │       └── service/       # Business Logic Implementations
│   └── src/main/resources/    # Application Configs & Migrations
│       └── db/migration/      # Flyway SQL schema version files
│
└── frontend/                  # React (Vite) Single Page App
    ├── public/                # Static assets
    └── src/
        ├── api/               # Axios instances & API routes
        ├── components/
        │   ├── ui/            # Reusable primitive UI components
        │   ├── layout/        # Navbar, Sidebar, Page Shells
        │   ├── snippet/       # Snippet editor, viewer, cards
        │   ├── collection/    # Collection UI components
        │   └── comment/       # Comment threads and replies
        ├── contexts/          # Auth & Theme React contexts
        ├── hooks/             # Custom utility hooks (clipboard, debounce, localstorage)
        ├── pages/             # App page views (Dashboard, Share, Auth, Profile)
        ├── router/            # React Router v6 setup with route guards
        └── store/             # Zustand stores for lightweight global states
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite build tool)
- **Styling:** Tailwind CSS v4 (Monochrome styling)
- **State Management:** Zustand (UI state) & TanStack React Query v5 (Server cache state)
- **Editor Engine:** CodeMirror 6 (`@uiw/react-codemirror`)
- **HTTP Client:** Axios with Interceptors for token rotation
- **Icons & Notifications:** Lucide React & React Hot Toast

### Backend
- **Core Platform:** Java 21 & Spring Boot 3.3+
- **Security:** Spring Security 6 & JSON Web Tokens (jjwt 0.12+)
- **Data Persistence:** Spring Data JPA / Hibernate
- **Database Migrations:** Flyway Migrations
- **Utilities:** MapStruct (DTO mapping), Lombok (boilerplate reduction)
- **Resilience:** Bucket4j (Token Bucket algorithm for Rate Limiting)

### Database
- **Storage Engine:** MySQL 8.x

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
*   [Java Development Kit (JDK) 21](https://adoptium.net/)
*   [Node.js](https://nodejs.org/) (v18.x or later)
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/) (v8.0 or later)
*   [Maven](https://maven.apache.org/) (Optional, wrapper `./mvnw` is included in backend)

---

### Step 1: Database Setup
1. Log into your MySQL instance:
   ```sql
   CREATE DATABASE snippethub_db;
   ```
2. Flyway will automatically run all migrations upon starting the backend application, creating the required tables and setting up indexes.

---

### Step 2: Backend Configuration & Run
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Open `src/main/resources/application-dev.yml` and check your database connection credentials:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/snippethub_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
       username: your_mysql_username
       password: your_mysql_password
   ```
3. Run the Spring Boot application:
   - On Windows (PowerShell):
     ```powershell
     ./mvnw.cmd spring-boot:run
     ```
   - On Linux/macOS:
     ```bash
     chmod +x mvnw
     ./mvnw spring-boot:run
     ```
4. The backend server will start on [http://localhost:8080](http://localhost:8080). You can access the Interactive Swagger documentation at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html).

---

### Step 3: Frontend Configuration & Run
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Create a `.env` file based on `.env.example` to point to your backend API:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the address outputted by Vite (typically [http://localhost:5173](http://localhost:5173)).

---

## 🔒 API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/register` | Public | Register a new user account |
| `POST` | `/login` | Public | Login credentials, returns access & refresh tokens |
| `POST` | `/refresh` | Public | Requests a new access token using a refresh token |
| `POST` | `/logout` | Authenticated | Revokes and invalidates the user session |

### Snippets (`/api/v1/snippets`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/` | Optional | Paginated list of public snippets (supports search, tags, sort) |
| `POST` | `/` | Authenticated | Create a new code snippet |
| `GET` | `/{id}` | Optional | Get snippet details by ID (increments views for non-owners) |
| `PUT` | `/{id}` | Owner | Update an existing snippet |
| `DELETE` | `/{id}` | Owner | Delete a snippet |
| `GET` | `/my` | Authenticated | Get currently authenticated user's snippets |
| `POST` | `/{id}/star` | Authenticated | Star or unstar a snippet |
| `POST` | `/{id}/copy` | Optional | Increments the copy count of a snippet |
| `GET` | `/search` | Optional | Search snippets across title, desc, tag lists |
| `GET` | `/languages` | Public | List all unique languages currently stored on the platform |

### Sharing Module (`/api/v1/share`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/snippets/{id}/links` | Owner | Create a custom share link (optional expiration & max views) |
| `GET` | `/links/{token}` | Public | Resolves snippet contents from public UUID token (rate-limited) |
| `DELETE` | `/links/{token}` | Owner | Revoke/Delete an active share link |
| `GET` | `/snippets/{id}/links` | Owner | List all generated share links for a snippet |

### Collections (`/api/v1/collections`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/my` | Authenticated | List all collections belonging to current user |
| `POST` | `/` | Authenticated | Create a new collection |
| `GET` | `/{id}` | Public/Owner | Fetch details of a collection and its snippets |
| `PUT` | `/{id}` | Owner | Update collection details (name, desc, privacy) |
| `DELETE` | `/{id}` | Owner | Delete collection |
| `POST` | `/{id}/snippets/{snippetId}` | Owner | Add a snippet to a collection |
| `DELETE` | `/{id}/snippets/{snippetId}` | Owner | Remove a snippet from a collection |

### Comments (`/api/v1/snippets/{snippetId}/comments`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/` | Optional | List all comments for a snippet in a threaded tree |
| `POST` | `/` | Authenticated | Post a new comment (supports `parentId` for sub-replies) |
| `PUT` | `/{commentId}` | Author | Edit comment content |
| `DELETE` | `/{commentId}` | Author/Admin | Delete comment |

### Profile & Settings (`/api/v1/users`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/{username}` | Public | Fetch public user profile and public snippets |
| `PUT` | `/me` | Authenticated | Update user profile bio or avatar URL |
| `PUT` | `/me/password` | Authenticated | Change account password |
| `DELETE` | `/me` | Authenticated | Deletes account permanently |

---

## 🗄️ Database Schema & Migrations

SnippetHub uses Flyway to execute database migrations in numerical order. Let's look at the schema layout:

*   `V1__create_users.sql`: Sets up core users details, credentials (password hashes), roles, and indexes on usernames.
*   `V2__create_snippets.sql`: Creates snippets metadata including visibility configuration, interaction logs (views, copies, stars), and references `owner_id`.
*   `V3__create_tags.sql`: Stores globally unique lowercase tags. Includes a link table `snippet_tags` with composite keys.
*   `V4__create_collections.sql`: Holds custom folder categories, links `snippet_collections` as a composite key relationship.
*   `V5__create_comments.sql`: Handles commentary, linking author, snippet, and a nullable `parent_id` reference to itself for nested tree structures.
*   `V6__create_stars.sql`: Join table tracks stars per user and snippet.
*   `V7__create_share_links.sql`: Connects unique tokens (UUIDs) with snippet constraints like `expires_at`, `max_views`, and `view_count`.
*   `V8__add_public_id.sql`: Adds public random IDs to snippets for secure URL endpoints.
*   `V9__cleanup_schema.sql`: Fine-tunes database constraints and indexing.

---

## 🧪 Testing

### Backend Unit Tests (JUnit 5 & Mockito)
Runs business rule checks and mock service-level constraints:
```bash
cd backend
./mvnw test
```

### API Endpoint Tests
Access the Swagger Dashboard on a running local instance at `http://localhost:8080/swagger-ui/index.html` to test parameters, headers, and endpoints dynamically.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
