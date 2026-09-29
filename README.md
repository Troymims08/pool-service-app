# Service Management Application

A full-stack mobile application designed to help service-based businesses manage customers, appointments, services, and day-to-day operations from a centralized platform.

> 🚧 **Status: In Development**

## Overview

This project is being built as a real-world business management application using **React Native, Expo, TypeScript, and Firebase**.

The goal is to create an application that can handle the workflow of a service-based business, from managing customer information to scheduling appointments and maintaining service records.

While the current implementation is centered around a pool-service business use case, the application is being designed with a broader service-management structure that can be adapted to other service industries.

## Current Features

* 👤 Customer management

  * Create customers
  * View customer information
  * Edit customer information
  * Store customer records in Firebase Firestore

* 📅 Appointment management

  * Create appointments
  * View appointments
  * Appointment details
  * Associate appointments with customers

* 🔥 Firebase integration

  * Cloud Firestore database
  * Real-time data synchronization
  * CRUD operations

* 📱 Mobile application

  * React Native
  * Expo
  * Expo Router
  * TypeScript

## Technologies

| Technology      | Purpose                             |
| --------------- | ----------------------------------- |
| React Native    | Mobile application development      |
| Expo            | Development and application tooling |
| TypeScript      | Type-safe application development   |
| Expo Router     | Navigation and routing              |
| Firebase        | Backend services                    |
| Cloud Firestore | Database and real-time data         |
| Git/GitHub      | Version control                     |

## Architecture

The application follows a mobile client + cloud backend architecture.

```text
React Native / Expo
        │
        ▼
   Expo Router
        │
        ▼
   Application UI
        │
        ▼
 Firebase SDK
        │
        ▼
 Cloud Firestore
        │
        ▼
 Customer & Appointment Data
```

## Project Structure

```text
project/
├── app/
│   ├── customers/
│   ├── appointments/
│   └── ...
├── components/
├── lib/
│   └── firebase.ts
├── assets/
├── package.json
├── tsconfig.json
└── README.md
```

*Project structure will continue to evolve as development progresses.*

## Development Goals

The application is being developed incrementally with an emphasis on building features that resemble a production software environment.

Planned areas include:

* [ ] Customer management improvements
* [ ] Appointment scheduling
* [ ] Appointment status tracking
* [ ] Service management
* [ ] Customer history
* [ ] Business dashboard
* [ ] Search and filtering
* [ ] Authentication and authorization
* [ ] Improved data validation
* [ ] Error handling
* [ ] Loading and empty states
* [ ] Notifications
* [ ] Reporting and analytics
* [ ] UI/UX improvements
* [ ] Testing
* [ ] Production deployment

## What I'm Learning

This project is also being used to strengthen practical software engineering skills, including:

* Building applications from an initial concept
* Designing application architecture
* Working with REST-style CRUD concepts
* Database design
* Cloud database integration
* Authentication and authorization
* State management
* Navigation and routing
* Form handling and validation
* Debugging
* Version control with Git
* Writing maintainable TypeScript
* Developing and testing features incrementally

## Development Approach

Features are being developed incrementally rather than building the entire application at once.

Each major feature is implemented, tested, debugged, and integrated into the existing application before moving to the next feature.

## Project Status

**Current phase:** Active development 🚧

The application is functional in several core areas, but development is ongoing. Features, architecture, UI, and backend functionality will continue to evolve as the project progresses.

## Future Direction

The long-term goal is to turn this project into a more complete business management platform capable of supporting different types of service-based businesses.

The current implementation provides the foundation for expanding into additional workflows, business intelligence, automation, and other production-level capabilities.

---

### Author

**Troy Mims**

B.S. Computer Science — Langston University

Interested in software engineering, cybersecurity, application development, and technology.
