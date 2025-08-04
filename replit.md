# Replit Project Guide

## Overview

This is a mobile-first React-based reaction time testing application that measures user reflexes through visual and auditory stimuli. The application allows users to test their reaction times with configurable trials (3/5/10), track personal bests, export results as CSV, and share via Web Share API. It features a modern dark theme UI with electric blue and vibrant green accent colors, built with Tailwind CSS and shadcn/ui components, with complete data persistence through local storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React hooks with local state and custom hooks for localStorage persistence
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack React Query for server state management (configured but minimal usage in current implementation)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Prepared for PostgreSQL session storage with connect-pg-simple
- **Development Setup**: Hot reload with Vite integration and custom middleware for API logging

### Data Storage Solutions
- **Primary Storage**: Currently using in-memory storage (MemStorage class) for user data
- **Client Persistence**: localStorage for test sessions, personal bests, and user settings
- **Database Schema**: Defined users table with UUID primary keys, unique usernames, and password fields
- **Migration System**: Drizzle migrations configured with PostgreSQL dialect

### Authentication and Authorization
- **Current State**: Basic user schema defined but authentication not fully implemented
- **Session Storage**: PostgreSQL session store configured for production use
- **User Model**: Username/password based authentication system prepared

### External Dependencies
- **Database**: Neon Database (PostgreSQL-compatible serverless database)
- **UI Components**: Extensive use of Radix UI primitives for accessibility
- **Audio**: Web Audio API for generating auditory test stimuli
- **Development Tools**: Replit integration with custom error handling and development banners
- **Build Tools**: ESBuild for server-side bundling, Vite for client-side development

### Key Design Patterns
- **Component Architecture**: Functional components with custom hooks for logic separation
- **Type Safety**: Comprehensive TypeScript usage with Zod schema validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **State Persistence**: Custom localStorage hooks for client-side data persistence
- **Modular Structure**: Clear separation between client, server, and shared code

### Application Features
- **Reaction Testing**: Visual and auditory reaction time measurements
- **Statistics Tracking**: Personal bests, session averages, and consistency metrics
- **Settings Management**: Configurable trial counts, volume levels, and haptic feedback
- **Data Export**: CSV export functionality for test results
- **Performance Rating**: Categorized performance feedback based on reaction times