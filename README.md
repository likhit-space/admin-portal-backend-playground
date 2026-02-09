# admin-portal-backend-playground

This repository is a personal practice project for designing a backend system with a strong focus on
business logic, clear responsibility boundaries, and long-term maintainability.

The goal is not to build features quickly, but to practice **designing backend systems that can evolve** —
where business rules are explicit, dependencies are controlled, and the core logic can be tested
without relying on infrastructure or transport layers.

## Design Principles

- **Business-first design**  
  The system is designed from business flows and rules first, before thinking about frameworks or infrastructure.

- **Clear responsibility boundaries**  
  The codebase is structured around three main areas:
  - **Transport**: entry points to the system (e.g. HTTP)
  - **Core**: business logic and orchestration
  - **Infra**: external concerns such as databases, security, and time

- **Contract-driven development**  
  The core depends only on well-defined interfaces (contracts), not on implementation details.
  Infrastructure can be replaced without changing business logic.

- **TypeScript as a design tool**  
  TypeScript is used to model business concepts, enforce boundaries, and prevent illegal states —
  not just to avoid runtime errors.

- **Testability by design**  
  Business logic can be unit-tested in isolation, without databases, HTTP servers, or external services.

## Scope

This project focuses on internal / admin-style backend systems and prioritizes:
- correctness over speed
- clarity over cleverness
- design that supports refactoring and growth

It is intended as a learning and experimentation space rather than a production-ready product.