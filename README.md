# Nucleus

Turn a course syllabus into a tracked schedule.

Nucleus takes the PDF syllabi you get at the start of every term, extracts the
assignments and deadlines out of them with an LLM, and turns them into tasks you can
actually track, so you are not copying due dates into a calendar by hand.

## Features

- **SylaScan** — upload a syllabus PDF and have its assignments, weights, and due dates
  extracted automatically instead of entered manually.
- **Course dashboard** — all enrolled courses in one view, with per-course assignment
  breakdowns.
- **Task tracking** — list and detail views for upcoming work, including recurring
  progression tasks and one-off items.
- **Google sign-in** — OAuth login, no separate password to manage.
- **Email notifications** — a standalone service for deadline and account mail.

## Architecture

The repo is a monorepo of four deployable pieces:

| Directory   | What it is                          | Stack                                  |
|-------------|-------------------------------------|----------------------------------------|
| `syllabus/` | The main product UI                 | React (CRA), Tailwind                  |
| `fe/`       | Marketing and auth entry point      | React (CRA), Ant Design, Framer Motion |
| `be/`       | REST API and persistence            | Spring Boot 3, Java 17, MongoDB        |
| `email/`    | Transactional email microservice    | Express, Nodemailer                    |

The backend exposes user, course, and data endpoints under `com.qtma.be`, secured with
Spring Security and JWT, with MongoDB repositories backing users, courses, enrollments,
and notifications.

## Getting started

Each package runs independently. You will need Node 18+, JDK 17, Maven, and a MongoDB
instance.

**Backend** (`be/`, serves on `:8080`)

```bash
cd be
./mvnw spring-boot:run
```

Or with Docker, which builds the jar in a Maven image and runs it on a JDK 17 base:

```bash
cd be
docker build -t nucleus-be .
docker run -p 8080:8080 nucleus-be
```

**Main app** (`syllabus/`, serves on `:3000`)

```bash
cd syllabus
npm install
npm start
```

**Landing app** (`fe/`)

```bash
cd fe
npm install
npm start
```

**Email service** (`email/`)

```bash
cd email
npm install
npm run dev
```

### Configuration

Credentials are not committed. Before running you will need to supply, via each
package's local environment file:

- a MongoDB connection URI (backend)
- a Google OAuth client ID (frontends and backend)
- an OpenAI API key (syllabus parsing)
- SMTP credentials (email service)

## Status

Built for and used by Queen's students. Four contributors; see the commit history for
the breakdown.
