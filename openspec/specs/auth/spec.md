# Auth Specification

## Purpose

Provides authentication for the CMS using the Firebase Auth client SDK, with email/password login, auth state observation, and a React context that propagates the authenticated user throughout the admin panel.

## Requirements

### Requirement: Users authenticate with Firebase client SDK

The system SHALL use Firebase Authentication via the client SDK, accepting email and password credentials through `signInWithEmailAndPassword`.

#### Scenario: Successful login

- **WHEN** a user enters valid email and password on the login page
- **THEN** the system calls `signInWithEmailAndPassword` and navigates to the dashboard

#### Scenario: Failed login shows error

- **WHEN** a user enters invalid email or password
- **THEN** the system catches the `AuthError` and displays an error toast with the Firebase error message

#### Scenario: Already authenticated redirects

- **WHEN** an already-authenticated user navigates to `/login`
- **THEN** the system redirects them to the dashboard

### Requirement: Auth state is observed reactively

The system SHALL use `onAuthStateChanged` to track the authentication state and expose the current user via a React context.

#### Scenario: Auth state listener on mount

- **WHEN** the app initializes
- **THEN** it registers an `onAuthStateChanged` listener that updates the auth context on state changes

#### Scenario: Authenticated user in context

- **WHEN** a user is signed in
- **THEN** the `useAuth` hook returns the current `User` object from Firebase Auth

#### Scenario: Null user when signed out

- **WHEN** no user is signed in
- **THEN** the `useAuth` hook returns `null`

### Requirement: Unauthenticated users are redirected to login

The system SHALL protect admin routes by redirecting unauthenticated users to the login page.

#### Scenario: Route guard redirects

- **WHEN** an unauthenticated user attempts to access any admin route
- **THEN** they are redirected to `/login` with their intended destination preserved

#### Scenario: Loading state during auth check

- **WHEN** the auth state is being determined (initial load)
- **THEN** a loading indicator is shown and routes are not rendered

### Requirement: Users can sign out

The system SHALL provide a sign-out mechanism that clears the auth state and redirects to the login page.

#### Scenario: Sign out

- **WHEN** a user clicks the sign-out button
- **THEN** `signOut` is called and the user is redirected to `/login`

### Requirement: Firebase Auth errors are surfaced appropriately

The system SHALL map common Firebase Auth errors to user-friendly messages.

#### Scenario: Wrong password

- **WHEN** a user enters an incorrect password
- **THEN** the system displays "Invalid email or password" rather than the raw Firebase error

#### Scenario: User not found

- **WHEN** a user enters an email that is not registered
- **THEN** the system displays "No account found with this email"
