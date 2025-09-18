# Nabha Rural Digital Learning App

## Overview

The Nabha Rural Digital Learning App is a comprehensive educational platform designed specifically for rural students in Punjab, India. The application provides multilingual digital literacy content with offline-first capabilities, supporting students with limited internet connectivity. The platform features separate dashboards for students, teachers, and administrators, with real-time progress tracking, assignment management, and interactive learning modules.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using React with TypeScript, leveraging Vite for development and build tooling. The UI is constructed with shadcn/ui components built on Radix UI primitives and styled with Tailwind CSS. The frontend follows a component-based architecture with:

- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management with built-in caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with CSS variables for theme customization
- **Authentication**: Context-based auth state management with protected routes

### Backend Architecture
The server is built using Express.js with TypeScript, following a RESTful API design pattern. The architecture includes:

- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Authentication**: Passport.js with local strategy for both teacher/admin email+password and student class+roll+PIN authentication
- **Database Access**: Drizzle ORM providing type-safe database queries
- **Route Organization**: Modular route handlers separated by domain (auth, content, progress, etc.)

### Database Design
PostgreSQL database with Drizzle ORM schema definition includes:

- **User Management**: Separate tables for teachers, students, and schools with role-based access
- **Content Structure**: Hierarchical content organization with categories, items, and multilingual support
- **Progress Tracking**: Student progress and analytics with assignment submissions
- **Gamification**: Badges and achievements system to encourage engagement

### Multilingual Support
The application implements a custom i18n system supporting four languages (English, Punjabi, Hindi, Telugu) with:

- **Content Parity**: All educational content available in all supported languages
- **UI Localization**: Complete interface translation with language switcher component
- **Dynamic Loading**: Runtime language switching without page reloads

### Offline-First Architecture
IndexedDB-based offline storage system enables:

- **Content Caching**: Lessons, quizzes, and media stored locally for offline access
- **Progress Sync**: Background synchronization when connectivity returns
- **Offline Indicators**: Real-time connectivity status with sync notifications

### Authentication System
Dual authentication approach accommodating different user types:

- **Teachers/Admins**: Traditional email and password with JWT sessions
- **Students**: Simplified class + roll number + 4-digit PIN for rural accessibility
- **Session Security**: PostgreSQL-backed sessions with proper CSRF protection

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with schema migrations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI & Styling
- **Radix UI**: Headless component primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with design system variables
- **Lucide React**: Icon library for consistent iconography

### Development & Build Tools
- **Vite**: Fast build tool with HMR and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds

### Client-Side Libraries
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for forms and API contracts
- **Wouter**: Lightweight routing solution

### Server-Side Libraries
- **Express.js**: Web application framework with middleware support
- **Passport.js**: Authentication middleware with strategy pattern
- **ws**: WebSocket library for real-time features (used by Neon database)

### Optional Integrations
- **Speech Recognition API**: Browser-native voice commands for accessibility
- **Service Workers**: Background sync capabilities for offline functionality
- **Web Share API**: Content sharing on supported mobile devices