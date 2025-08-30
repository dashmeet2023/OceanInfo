# INCOIS Ocean Hazard Monitoring Platform

## Overview

This is a crowdsourced ocean hazard monitoring and reporting platform developed for the Indian National Centre for Ocean Information Services (INCOIS). The system enables citizens to report ocean hazards like tsunamis, storm surges, and high waves through a web/mobile interface, while integrating social media monitoring and providing real-time analytics to disaster management agencies.

The platform features a React frontend with shadcn/ui components, an Express.js backend with PostgreSQL database using Drizzle ORM, real-time WebSocket communication, and social media sentiment analysis using natural language processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight React Router alternative)
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with a custom design system
- **TanStack Query** for server state management and API calls
- **React Hook Form** with Zod validation for form handling

### Backend Architecture  
- **Express.js** server with TypeScript
- **RESTful API** design with role-based access control
- **WebSocket** integration for real-time updates and notifications
- **Session-based authentication** using Replit's OIDC provider
- **Natural Language Processing** service for social media analysis
- **Notification service** with multi-channel support (SMS, email, push)

### Database Design
- **PostgreSQL** database with Drizzle ORM for type-safe queries
- **Neon** serverless PostgreSQL for cloud hosting
- Core entities: users, incidents, citizen reports, social media posts, notifications
- **Geospatial support** for location-based queries and mapping
- **Session storage** table for authentication state management

### Real-time Communication
- **WebSocket server** for live updates and emergency alerts
- **Real-time dashboard** updates every 30 seconds
- **Event-driven notifications** for critical incidents
- **Live activity feed** showing recent reports and social media activity

### Social Media Integration
- **NLP engine** for analyzing social media posts and extracting hazard-related content
- **Sentiment analysis** to determine urgency and public concern levels
- **Keyword matching** for different hazard types and severity levels
- **Location extraction** from social media content
- **Confidence scoring** for automated content classification

### Security & Authentication
- **Replit OIDC integration** for secure user authentication
- **Role-based access control** (citizen, official, analyst roles)
- **Session management** with PostgreSQL session store
- **CSRF protection** and secure cookie handling
- **Input validation** using Zod schemas

### API Structure
- `/api/auth/*` - Authentication endpoints
- `/api/dashboard/*` - Dashboard data and statistics
- `/api/incidents/*` - Incident management (CRUD operations)
- `/api/reports/*` - Citizen report submission and retrieval
- `/api/social/*` - Social media monitoring data
- `/api/notifications/*` - Alert and notification management

## External Dependencies

### Database & Storage
- **Neon Database** - Serverless PostgreSQL hosting
- **Drizzle ORM** - Type-safe database queries and migrations
- **connect-pg-simple** - PostgreSQL session store for Express

### Authentication
- **Replit OIDC** - OpenID Connect authentication provider
- **Passport.js** - Authentication middleware
- **express-session** - Session management

### UI & Styling
- **shadcn/ui** - Pre-built accessible React components
- **Radix UI** - Headless UI primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Development & Build Tools
- **Vite** - Frontend build tool and dev server
- **TypeScript** - Type safety across the entire stack
- **ESBuild** - Fast JavaScript bundler for production
- **PostCSS** - CSS processing

### Data & State Management
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Form state management
- **Zod** - Runtime type validation and schema parsing

### Real-time & Communication
- **ws** - WebSocket implementation
- **date-fns** - Date manipulation and formatting

### Utility Libraries
- **clsx & tailwind-merge** - Conditional CSS class handling
- **class-variance-authority** - Component variant management
- **memoizee** - Function memoization for performance