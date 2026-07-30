## Purpose

Enables external systems to receive real-time notifications when content events occur, via configurable HTTP callouts with retry logic and delivery logging.

> ⚠️ **ARCHITECTURE CONFLICT: REQUIRES SERVER-SIDE COMPONENT**
>
> Webhook delivery requires making outbound HTTP POST requests to external URLs — something a client-side SPA cannot do reliably (browser CORS restrictions, page lifecycle, exposed auth tokens). Implementation requires either:
>
> - A lightweight server-side component (Cloud Function, Edge Function, or tiny Node service) solely for webhook dispatch
> - Integration with a third-party webhook relay service (e.g., Svix, Zapier) triggered by Firestore document writes
>
> This spec is written assuming a minimal server-side dispatch layer is added. If the client-side-only constraint is strict, this capability should be deferred.

## ADDED Requirements

### Requirement: Admins can configure webhooks

The system SHALL allow creating webhook endpoints that fire on specified content lifecycle events.

#### Scenario: Create a webhook for content publish

- **WHEN** an admin creates a webhook with URL `https://example.com/hook` and events `collection.posts.publish`, `collection.posts.unpublish`
- **THEN** the webhook is saved and active

#### Scenario: Webhook includes required fields

- **WHEN** the webhook form is displayed
- **THEN** it includes fields for: URL, events (multi-select), secret/token, enabled toggle, and optional description

### Requirement: Webhooks fire on content lifecycle events

The system SHALL fire webhooks for: create, update, delete, publish, unpublish, archive, restore for both collections and globals.

#### Scenario: Webhook fires on content create

- **WHEN** a new post is created
- **THEN** all webhooks subscribed to `collections.posts.create` receive a POST request

#### Scenario: Webhook payload includes event data

- **WHEN** a webhook fires
- **THEN** the POST body contains the event type, timestamp, document ID, slug, and the full document data

### Requirement: Webhook delivery includes signing

The system SHALL sign each webhook payload with a configurable secret so receivers can verify authenticity.

#### Scenario: Signed payload

- **WHEN** a webhook with a configured secret fires
- **THEN** the request includes an `X-Webhook-Signature` header with an HMAC-SHA256 signature of the body

### Requirement: Failed deliveries are retried

The system SHALL retry failed webhook deliveries with exponential backoff.

#### Scenario: Retry on 5xx response

- **WHEN** the webhook target returns a 5xx status code
- **THEN** the system retries up to 5 times with backoff intervals of 1m, 5m, 15m, 30m, 1h

#### Scenario: No retry on 4xx response

- **WHEN** the webhook target returns a 4xx status code
- **THEN** the system does not retry (the client rejected the payload)

#### Scenario: Max retries exceeded

- **WHEN** all 5 retry attempts fail
- **THEN** the webhook delivery is marked as failed in the delivery log

### Requirement: Webhook deliveries are logged

The system SHALL maintain a log of every webhook delivery attempt with status, response code, and timestamp.

#### Scenario: Successful delivery logged

- **WHEN** a webhook delivers successfully
- **THEN** the log records the attempt with status 200, response time, and timestamp

#### Scenario: View delivery history

- **WHEN** an admin views a webhook's detail page
- **THEN** the last 100 delivery attempts are displayed with status, response code, and timestamp

### Requirement: Webhooks can be disabled and tested

The system SHALL allow toggling a webhook on/off and sending a test payload.

#### Scenario: Disable webhook

- **WHEN** an admin toggles a webhook off
- **THEN** no events fire to that webhook until it is re-enabled

#### Scenario: Send test payload

- **WHEN** an admin clicks "Test" on a webhook configuration
- **THEN** the system sends a sample payload and displays the response status code
