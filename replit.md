# Overview

This is a React-based e-commerce application for selling Symantec endpoint security licenses. Built as a full-stack application with Node.js/Express backend and React frontend, it provides a complete purchasing flow including email verification, payment processing, and license key delivery. The application is designed specifically for NK2IT, an Australian-based authorized Symantec reseller.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **State Management**: Zustand for cart management with persistence
- **Data Fetching**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom color scheme (NK2IT branding)
- **Navigation**: Tab-based navigation system without routing library
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error middleware with proper HTTP status codes

## Data Storage
- **Database**: PostgreSQL (via Neon Database serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage class for rapid development
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple

## Authentication & Security
- **Email Verification**: OTP-based email verification system
- **Session Management**: Server-side sessions with secure cookies
- **Input Validation**: Zod schemas for both frontend and backend validation
- **Payment Security**: Integration with BPOINT payment gateway for secure transactions

## External Dependencies

### Payment Processing
- **BPOINT Payment Gateway**: Australian payment processor for credit card transactions
- **Test Mode**: Simulated payments in development environment

### Email Services
- **Nodemailer**: SMTP email delivery for OTP codes and order confirmations
- **Template System**: HTML email templates with NK2IT branding

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database access with PostgreSQL dialect

### Development Tools
- **Vite**: Development server with HMR and build optimization
- **ESBuild**: Production bundle compilation for server code
- **Replit Integration**: Development environment plugins and error handling

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component system with consistent design patterns

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Type-safe CSS class management
- **clsx & tailwind-merge**: Conditional className utilities