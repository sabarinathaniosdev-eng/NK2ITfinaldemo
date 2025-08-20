# Overview

This is a React-based e-commerce application for selling Symantec endpoint security licenses. Built as a full-stack application with Node.js/Express backend and React frontend, it provides a complete purchasing flow including email verification, payment processing, and license key delivery. The application is designed specifically for NK2IT, an Australian-based authorized Symantec reseller.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes (August 2025)

## NK2IT Branding Implementation
- **Logo Integration**: Added NK2IT logo to header navigation using attached logo file
- **Color Scheme**: Implemented orange (#F59E0B) and green (#10B981) branding throughout platform
- **Navigation**: Centered navigation menu with Home, Products, Support, and Cart sections
- **Footer Enhancement**: Added bigger NK2IT logo and comprehensive contact details

## PDF Invoice System
- **Professional Template**: Created NK2IT-branded PDF invoices matching provided template format
- **Company Branding**: NK2IT PTY LTD header with full business address (Norwest Business Park, Baulkham Hills NSW 2153)
- **License Key Integration**: Automatic inclusion of generated license keys in PDF invoices
- **Terms & Conditions**: Complete T&C section with payment terms, refund policy, and liability limitations
- **Contact Information**: Professional footer with email, phone, website, and ABN details
- **Thank You Message**: NK2IT branded closing message

## Checkout Flow Enhancements
- **Success Modal**: Professional order completion modal displaying license keys and download options
- **Email Verification**: Robust OTP-based email verification system with demo mode
- **Payment Processing**: BPOINT integration with comprehensive error handling
- **License Delivery**: Automatic license key generation and email delivery system
- **Invoice Download**: Instant PDF invoice download capability post-purchase

## Technical Improvements
- **Error Resolution**: Fixed all TypeScript compilation errors and LSP diagnostics
- **Performance**: Optimized checkout flow with proper loading states and user feedback
- **Demo Mode**: Comprehensive demo mode for testing without real payment processing
- **Data Validation**: Enhanced form validation with Zod schemas for all user inputs

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