# EARTH-42 --- Friendly Neighborhood Network (FNN)

> ## 🚀 LIVE DEMO
>
> **https://fnn-earth42v2.vercel.app/#/dashboard**
>
> **GitHub Repository:**
> https://github.com/akshaykumarp987063-ai/fnn-earth42
>
> **Team:** Empty Minds\
> **Institution:** PSG College of Technology, Coimbatore\
> **Hackathon:** HackVerse --- Into the Web

------------------------------------------------------------------------

## 1. The Story Behind EARTH-42

### A world without a Spider-Man.

Who protects a city when there is no Spider-Man?

Maybe the answer isn't one hero.

Maybe the neighborhood itself can become the web.

Every day, people notice things that are unusual, disturbing, dangerous,
or simply in need of help: a fight at a bus stand, harassment, a
suspicious situation, someone stranded late at night, an elderly person
who needs assistance, a medical emergency, extra food that could help
someone, or a local hazard.

People notice. People care. But most people still do not act.

Why?

-   **Should I interfere?** --- Fear of escalation and personal risk.
-   **What if it gets worse?** --- There is no structured de-escalation
    path.
-   **What if they involve me?** --- Identity exposure and liability
    anxiety.
-   **Who do I even call?** --- Services are fragmented and there is no
    local coordination layer.

This is the **Bystander Gap**.

FNN is designed to close that gap.

**Friendly Neighborhood Network (FNN)** is a privacy-preserving,
geospatial mutual-aid and emergency-coordination layer for hyperlocal
incidents. It turns passive observation into safe, structured, verified
action.

The central idea is simple:

> **You don't have to become the hero. Just send the signal.**

The system turns one person's observation into a coordinated
neighborhood response:

**NOTICE → REPORT → AI TRIAGE → GEO MATCH → VERIFY → RESPOND → ESCALATE
IF NEEDED → RESOLVE → AUDIT**

------------------------------------------------------------------------

# 2. What Is FNN?

FNN is a civic-tech Progressive Web App that connects people who
**notice** local problems with people and organizations that can
**help**, while minimizing unnecessary exposure of identity and exact
location.

It combines:

-   Hyperlocal incident reporting
-   AI-assisted incident triage
-   Geospatial radius matching
-   Privacy-preserving public identities
-   Community verification
-   Verified volunteer / Hero matching
-   Reputation and credit incentives
-   SOS workflows
-   Community organizations
-   Public services
-   Disaster/offline resilience
-   Controlled escalation and auditability

FNN is deliberately positioned between a pure emergency app and a pure
social platform.

It is not simply a place to post incidents.

It is a **local coordination layer**.

------------------------------------------------------------------------

# 3. The Core Vision

## What if the hero was never just one person?

One person notices something.

Three people can verify it.

Ten people can coordinate.

A neighborhood can respond.

FNN turns the idea of the Spider-Man "web" into a civic network:

-   **Spider-Sense** → AI-assisted situational awareness
-   **Web** → Geospatial neighborhood graph
-   **Hero** → Verified community volunteer
-   **Spider Signal** → Structured community report

> **We don't need one Spider-Man. We need a network of people who can
> act like one.**

Anyone can wear the mask.

------------------------------------------------------------------------

# 4. The Problem

Modern neighborhoods have a large gap between **observation** and
**action**.

A person may witness an incident but hesitate to intervene because:

1.  They do not know whether the situation is serious.
2.  They do not know who nearby can help.
3.  They do not want their identity exposed.
4.  They do not want to publish someone's exact location.
5.  They do not know which service or institution should receive the
    case.
6.  Existing social platforms optimize for visibility, not safe
    resolution.
7.  Emergency systems are designed for emergencies, not the broad range
    of everyday mutual-aid situations.
8.  Network outages can make conventional digital workflows unavailable.

FNN addresses this by creating a structured pipeline from observation to
resolution.

------------------------------------------------------------------------

# 5. How FNN Operates

## Step 1 --- NOTICE

A user observes an incident in physical space.

Examples:

-   A street fight
-   Someone stranded late at night
-   A person who appears injured
-   A lost child
-   An elderly person needing help
-   A suspicious situation
-   A broken infrastructure element
-   A local disaster
-   Food surplus that could be redirected

The observer does not need to physically intervene.

------------------------------------------------------------------------

## Step 2 --- REPORT

The user sends a **Spider Signal** through the mobile/web interface.

A Spider Signal can contain:

-   Description
-   Category
-   Location
-   Optional photo/video
-   Severity
-   Supporting information

The system creates a structured incident rather than an unstructured
social-media post.

------------------------------------------------------------------------

## Step 3 --- AI TRIAGE

The AI Incident Manager analyzes the signal.

It can assist with:

-   Category classification
-   Summary generation
-   Severity estimation
-   Urgency estimation
-   Duplicate detection
-   Spam assessment
-   Responder recommendation

The AI does **not** have unlimited authority.

Deterministic safety rules provide a minimum safety floor around
critical incidents.

The philosophy is:

> **AI recommends. Safety rules constrain. Humans remain responsible for
> consequential action.**

------------------------------------------------------------------------

## Step 4 --- GEO MATCH

FNN uses geospatial logic to determine who is relevant to an incident.

Only users within the configured local radius should participate in
sensitive verification workflows.

This makes the system:

-   Hyperlocal
-   Less noisy
-   More relevant
-   More privacy-preserving

The goal is not to broadcast every incident to an entire city.

The goal is to connect the incident with the **right nearby people**.

------------------------------------------------------------------------

## Step 5 --- VERIFY

Nearby authenticated users can help validate an incident.

Depending on the workflow, they can:

-   Upvote or downvote signal quality
-   Verify that an incident exists
-   Add contextual advice
-   Provide fresh location evidence
-   Participate as a potential responder

The verification model is radius-aware and designed to resist
manipulation.

------------------------------------------------------------------------

## Step 6 --- RESPOND

FNN identifies an appropriate response layer.

Potential responders include:

-   Verified community Heroes
-   Local public-service providers
-   Community organizations
-   Emergency workflows
-   Authorized institutional review

Hero matching can consider:

-   Distance
-   Availability
-   Skills
-   Reliability
-   Reputation
-   Existing workload

------------------------------------------------------------------------

## Step 7 --- ESCALATE IF NEEDED

Not every signal requires the same response.

FNN routes incidents according to severity.

  Severity   Response Layer
  ---------- ---------------------------------------------
  LOW        Community assistance / mutual aid
  MEDIUM     Nearby verified Heroes / local coordination
  HIGH       Restricted authorized review
  CRITICAL   SOS / emergency workflow

The system therefore avoids treating every report as either a normal
social post or an emergency dispatch.

------------------------------------------------------------------------

## Step 8 --- RESOLVE

A Hero or appropriate responder progresses through a controlled task
lifecycle:

**ASSIGNED → ACCEPTED → RESPONDING → ARRIVED → RESOLVED**

Resolution can trigger appropriate reputation/credit settlement.

------------------------------------------------------------------------

## Step 9 --- AUDIT

Sensitive actions should be auditable.

The architecture is designed around recording:

-   Sensitive access
-   Incident changes
-   Identity-resolution actions
-   Reviewer actions
-   Escalation events

This creates accountability around sensitive workflows.

------------------------------------------------------------------------

# 6. Spider Signals

Spider Signals are FNN's primary incident-reporting mechanism.

Supported categories include:

-   TRANSPORT
-   PHYSICAL HELP
-   MEDICAL
-   PERSONAL SAFETY
-   CHILD SAFETY
-   WOMEN SAFETY
-   ELDERLY ASSISTANCE
-   COMMUNITY SERVICE
-   INFRASTRUCTURE
-   SUSPICIOUS ACTIVITY
-   DISASTER
-   LOST & FOUND
-   FOOD AID
-   OTHER

A signal is more than a post: it is an input into the FNN response
pipeline.

------------------------------------------------------------------------

# 7. AI Incident Manager

The AI layer is designed as an incident-management assistant.

### Inputs

-   User description
-   Incident category information
-   Location context
-   Optional evidence
-   Existing nearby signals

### Outputs

-   Category
-   Summary
-   Severity
-   Urgency
-   Confidence
-   Duplicate/spam assessment
-   Recommended responder

### Safety principle

FNN does not give an AI model unrestricted control over high-stakes
decisions.

Critical cases are protected by deterministic rules.

The intended architecture is:

**AI classification → deterministic safety floor → controlled routing**

This is particularly important for safety-related applications where an
incorrect AI decision could have real-world consequences.

------------------------------------------------------------------------

# 8. Privacy by Design

## Every Hero needs a mask.

Privacy is not an optional add-on to FNN.

It is part of the product.

The identity architecture separates:

**REAL PERSON**

Authenticated user

↓

**SECURE LAYER**

Authentication tokens / device-level verification

↓

**PUBLIC IDENTITY**

Example:

**Spider #4812**

The public interface should not unnecessarily expose:

-   Real name
-   Exact GPS coordinates
-   Private identity payload
-   Raw biometric templates

Public users see a pseudonymous identity and an approximate area rather
than a person's exact location.

------------------------------------------------------------------------

# 9. Identity Separation

FNN separates:

### Verified identity

Used internally for authentication, authorization and accountability.

### Public identity

A pseudonym used for community-facing interaction.

For example:

> **Anonymous Spider #4812**

This gives users the ability to participate without turning every safety
report into a public disclosure of their identity.

The MVP does not require storing raw fingerprints or facial templates.

Where device biometrics are used, the preferred model is to rely on
device-level authentication and retain only the necessary verification
result/token.

------------------------------------------------------------------------

# 10. Privacy Map

The public map is intentionally approximate.

The design principle is:

> **The community needs to know where help is needed; it does not
> automatically need to know exactly where a person is.**

Therefore:

-   Public map → approximate area
-   Protected workflow → exact coordinates when authorized
-   Public identity → pseudonym
-   Protected identity → authenticated account

This reduces unnecessary exposure while preserving the geospatial
usefulness of FNN.

------------------------------------------------------------------------

# 11. Radius-Based Verification

FNN treats physical proximity as part of trust.

A user should not be able to verify an incident simply because they can
see it on a global feed.

The intended model is:

1.  Authenticate the user.
2.  Determine their location.
3.  Check whether they are inside the configured radius.
4.  Require appropriate fresh evidence where applicable.
5.  Enforce one vote per user per signal.
6.  Apply rate limits and anti-gaming controls.

This produces **local verification**, rather than popularity-based
verification.

------------------------------------------------------------------------

# 12. Hero Matching

A **Hero** is a verified community volunteer who is willing and able to
help nearby.

FNN can rank potential Heroes based on:

-   Distance
-   Availability
-   Skills
-   Reliability
-   Reputation
-   Current workload

The goal is not simply:

> "Find the closest person."

It is:

> **"Find the most appropriate available person nearby."**

Hero tasks use an explicit state machine:

**ASSIGNED → ACCEPTED → RESPONDING → ARRIVED → RESOLVED**

This makes the response process visible and structured.

------------------------------------------------------------------------

# 13. Credit & Reputation System

FNN uses credits as a reputation mechanism and anti-abuse incentive.

Users can earn recognition for:

-   Validated contributions
-   Verified problem solving
-   Useful advice
-   Emergency assistance
-   Community assistance

Abusive behavior can be penalized.

The critical principle is:

> **Credits are reputation, not a paywall.**

Credits cannot be purchased to obtain safety privileges.

SOS and emergency access should never depend on a user's credit balance.

For ordinary reports, a small amount of reputation can be placed at
stake and later returned or penalized depending on validation.

This creates a cost for malicious manipulation without turning safety
into a paid service.

------------------------------------------------------------------------

# 14. Severity-Based Routing

Not every incident should trigger the same response.

## LOW

Examples:

-   Minor infrastructure problem
-   Community-service request
-   Small mutual-aid requirement

Response:

**Community assistance**

------------------------------------------------------------------------

## MEDIUM

Examples:

-   Person needing local help
-   Breakdown
-   Non-critical safety concern

Response:

**Nearby verified Heroes / local coordination**

------------------------------------------------------------------------

## HIGH

Examples:

-   Serious safety risk
-   Escalating situation
-   Potentially dangerous incident

Response:

**Restricted authorized review**

------------------------------------------------------------------------

## CRITICAL

Examples:

-   Immediate threat
-   Major medical emergency
-   Active danger

Response:

**SOS / emergency workflow**

This design ensures that critical cases are not suppressed simply
because the community disagrees or a user has insufficient reputation.

------------------------------------------------------------------------

# 15. SOS

FNN includes a dedicated SOS workflow.

Possible emergency options include:

-   POLICE
-   WOMEN HELP
-   CHILD HELP
-   FIRE
-   MEDICAL
-   OTHER

The SOS workflow is deliberately separate from ordinary community
reporting.

A critical signal can create a controlled escalation record and identify
the appropriate emergency workflow.

### Important scope boundary

FNN does **not** claim to replace emergency services.

The hackathon implementation demonstrates a controlled escalation
workflow and a future/appropriate 112-oriented integration path where
applicable.

Actual institutional dispatch requires real integrations and
authorization.

------------------------------------------------------------------------

# 16. Community Centre

The FNN ecosystem is not limited to emergencies.

The **Community Centre** connects people with local support nodes such
as:

-   Hospitals
-   Shelters
-   Old-age homes
-   Food banks
-   Community kitchens
-   Relief organizations
-   Other registered support organizations

Users can potentially:

-   Volunteer
-   Donate food or supplies
-   Offer transport
-   Find nearby support

This makes FNN a mutual-aid layer for everyday community needs.

------------------------------------------------------------------------

# 17. Public Services

FNN also includes a directory for verified local services.

Examples:

-   Plumbers
-   Electricians
-   Mechanics
-   Repair workers
-   Cleaners
-   Caregivers

This addresses another common neighborhood problem:

> People know that they need help, but do not know who nearby is
> reliable and available.

The same hyperlocal coordination principle can be applied to everyday
assistance.

------------------------------------------------------------------------

# 18. Top 5 Recognition

The Top 5 feature recognizes users who have made significant verified
contributions.

It is designed as a neighborhood reputation mechanism.

Potential future extensions include community recognition programs.

No municipal or police partnership should be implied unless an actual
partnership exists.

------------------------------------------------------------------------

# 19. Timed Privacy Challenge

Reported media can sometimes contain innocent bystanders.

FNN therefore includes a privacy-protection workflow in the prototype.

The concept is:

1.  An image may contain a person who does not want to be exposed.
2.  A short privacy challenge/dismissal window is provided.
3.  The person can submit fresh contextual evidence where appropriate.
4.  A restricted matching process can return a limited result.
5.  A likely match can pause the incident for privacy review.

### Safety boundary

The matcher is not intended to be an autonomous high-stakes identity
authority.

The prototype demonstrates the **workflow**, not a production biometric
identification system.

------------------------------------------------------------------------

# 20. Disaster Mode

A neighborhood safety system must still be useful when connectivity
fails.

FNN therefore includes a Disaster Mode concept based on:

-   Offline map/cache
-   Local incident queue
-   IndexedDB
-   Service Workers
-   Cached essential data
-   Offline emergency instructions
-   Device-to-device relay concepts
-   BLE / BitChat-style relay adapter concept

The goal is to preserve local functionality during:

-   Network outages
-   Floods
-   Fires
-   Infrastructure failures
-   Large-scale emergencies

### Prototype boundary

The offline/relay functionality is a prototype concept rather than a
claim of production-grade mesh-network coverage.

BitChat-style communication is treated as an optional adapter rather
than something rebuilt from scratch.

------------------------------------------------------------------------

# 21. The FNN Ecosystem

FNN consists of interconnected layers:

### 🕷️ Spider Signals

Structured local incident reporting.

### 🧠 AI Incident Manager

Classification, prioritization and routing assistance.

### 🗺️ Privacy Map

Approximate public geospatial visibility.

### 🦸 Heroes

Verified nearby community responders.

### 🛡️ Radius Verification

Local evidence and community validation.

### 🪙 Credit System

Reputation and anti-spam incentives.

### 🚨 SOS

Critical emergency workflow.

### 🏥 Community Centre

Community organizations and support nodes.

### 🔧 Public Services

Local service providers.

### 🏆 Top 5

Recognition for verified contribution.

### 📡 Disaster Mode

Offline-first resilience.

### 🔐 Audit & Privacy

Controlled identity and sensitive-action handling.

------------------------------------------------------------------------

# 22. Technical Architecture

## Frontend

-   React
-   TypeScript
-   Tailwind CSS
-   Progressive Web App (PWA)

The deployed web application provides the primary user interface for:

-   Dashboard
-   Spider Signals
-   Privacy Map
-   Heroes
-   SOS
-   Community Centre
-   Public Services
-   Credits
-   Top 5
-   Privacy Challenge
-   Disaster Mode

------------------------------------------------------------------------

## Backend

-   Node.js
-   Express
-   Socket.IO

The backend is responsible for:

-   Authentication middleware
-   API routing
-   Signal management
-   AI triage integration
-   Hero/task management
-   Credits
-   SOS
-   Services
-   Privacy workflows
-   Audit-related operations

------------------------------------------------------------------------

## Database & Geospatial Layer

Designed stack:

-   PostgreSQL
-   PostGIS
-   Redis
-   Geohash

Geospatial infrastructure supports:

-   Radius filtering
-   Nearby signal discovery
-   Hero matching
-   Local verification
-   Location-aware coordination

------------------------------------------------------------------------

## Security

Designed security technologies include:

-   WebAuthn
-   JWT
-   RBAC
-   SHA-256
-   Audit logs

The security architecture emphasizes:

-   Authentication
-   Authorization
-   Identity separation
-   Least-privilege access
-   Sensitive-action auditing
-   Privacy-preserving public views

------------------------------------------------------------------------

## Disaster / Offline Layer

-   IndexedDB
-   Service Workers
-   Offline maps
-   Offline queue
-   BLE / BitChat-style relay concept

------------------------------------------------------------------------

## Deployment

-   GitHub
-   Cloud hosting
-   Vercel
-   Production frontend deployment
-   Full-stack service architecture

------------------------------------------------------------------------

# 23. Repository Structure

The project is organized around separate application layers:

``` text
fnn-earth42/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
│
├── database/
│
├── docs/
│
├── shared/
│
└── vercel.json
```

------------------------------------------------------------------------

# 24. Frontend Experience

The deployed interface is designed around a single coherent safety
dashboard.

Major screens include:

### Dashboard

Provides a neighborhood safety overview and entry points into the main
workflows.

### Spider Signal

Creates a new incident report and walks the user through AI-assisted
triage.

### Privacy Map

Visualizes approximate incident areas and nearby Heroes without
unnecessarily exposing exact coordinates.

### Heroes

Shows responder availability and supports the task lifecycle.

### SOS Emergency

Provides emergency categories and the controlled escalation workflow.

### Community

Connects users with community organizations and support resources.

### Services

Provides local service categories and assistance workflows.

### Credits

Displays reputation balance and contribution history.

### Top 5

Highlights high-impact verified contributors.

### Privacy Challenge

Demonstrates the timed privacy-protection workflow.

### Disaster Mode

Demonstrates offline resilience, queueing and reconnection behavior.

------------------------------------------------------------------------

# 25. Demo Mode & Resilience

The application is designed to remain demonstrable even when external
services are unavailable.

The frontend includes a local/demo fallback architecture so the core
experience can still demonstrate:

-   Incident creation
-   AI triage visualization
-   Privacy controls
-   Hero matching
-   Task progression
-   SOS workflow
-   Credits
-   Disaster mode

This is important for a hackathon because a live demo should not
collapse simply because a third-party API or backend dependency is
temporarily unavailable.

When simulated behavior is shown, it should be treated as a
prototype/demo state rather than a claim of a live institutional
integration.

------------------------------------------------------------------------

# 26. Recommended Judge Demonstration

## Demo 1 --- Bus Stand Safety Incident

### Story

A user notices a fight or escalating situation.

### Flow

**Spider Signal → AI Triage → Privacy Protection → Nearby Verification →
Hero Matching → Escalation if Critical**

The judge should see:

1.  Report the incident.
2.  AI classifies the category.
3.  Severity and urgency are estimated.
4.  Public location remains approximate.
5.  Nearby users can verify.
6.  A suitable Hero is matched.
7.  A critical case can enter controlled escalation.

### Message to the judge

> "The observer does not have to become the hero. They simply send the
> signal, and FNN turns that observation into a structured local
> response."

------------------------------------------------------------------------

# 27. Recommended Judge Demonstration --- Elderly Assistance

### Story

An elderly person needs help nearby.

### Flow

**Spider Signal → Local Hero Match → Accept → Respond → Arrive → Resolve
→ Credits**

The judge sees that:

-   The report is local.
-   Appropriate Heroes are identified.
-   The responder accepts the task.
-   The task moves through explicit states.
-   Resolution can reward verified contribution.

This demonstrates that FNN is not only about emergencies.

It is a neighborhood mutual-aid system.

------------------------------------------------------------------------

# 28. Recommended Judge Demonstration --- Community Food Aid

### Story

A local source has extra food that could help people.

### Flow

**Community Service / Food Aid → Community Centre → Nearby Organization
→ Volunteer / Donation / Transport**

This demonstrates the broader ecosystem beyond incident response.

------------------------------------------------------------------------

# 29. Recommended Judge Demonstration --- Network Failure

### Story

The network goes down during a disaster.

### Flow

**Disaster Mode → Offline Map → Local Queue → Offline Action →
Reconnection → Sync**

This demonstrates the resilience layer.

The key idea:

> A safety system should not become useless precisely when
> infrastructure is failing.

------------------------------------------------------------------------

# 30. Live MVP vs Prototype vs Future

## MVP / Live Demonstration

The current product experience demonstrates:

-   Signals
-   Map
-   AI categorization
-   Severity
-   Radius voting
-   Pseudonyms
-   Hero matching
-   Credits
-   SOS
-   Community Centre
-   Public Services

## Prototype Concepts

Some deeper capabilities are demonstrated as prototypes/concepts:

-   Offline map and queue
-   BLE-style relay
-   Timed privacy challenge
-   Authorized review dashboard

## Future Extensions

Potential future development includes:

-   Institutional integrations
-   City-scale deployment
-   Production emergency-service integration
-   Stronger disaster communications
-   Expanded community partnerships
-   More advanced anomaly detection

------------------------------------------------------------------------

# 31. Safety & Trust Principles

FNN is built around several principles.

### Safety First

Critical incidents should not be suppressed by downvotes, reputation,
credit shortage or community disagreement.

### Privacy by Default

Public users receive pseudonyms and approximate areas.

### Local Verification

Only relevant nearby users should participate in sensitive verification.

### Proof of Presence

Where appropriate, fresh location evidence helps establish that a
verifier is actually near the incident.

### AI With Guardrails

AI assists with classification and routing; deterministic safety rules
provide constraints.

### Credits as Reputation

Credits discourage abuse without turning safety into a paid privilege.

### No Duplicate Incidents

Deduplication and idempotency are important for reliable incident
handling.

### Auditable Sensitive Actions

Sensitive access and reviewer actions should be logged.

### Resilience

The core experience should degrade gracefully when connectivity or
external services fail.

------------------------------------------------------------------------

# 32. Why FNN Is Different

Many products solve only one part of the problem:

-   Emergency apps focus on emergency dispatch.
-   Social networks focus on information sharing.
-   Maps focus on geographic visualization.
-   Volunteer platforms focus on finding volunteers.
-   Messaging apps focus on communication.

FNN combines these concepts into a single local response loop.

The differentiator is the chain:

> **OBSERVE → PROTECT → VERIFY → SOLVE → ESCALATE → HELP**

The system connects:

**local observation**

↓

**privacy-preserving reporting**

↓

**AI triage**

↓

**geospatial filtering**

↓

**community verification**

↓

**Hero matching**

↓

**controlled escalation**

↓

**resolution**

↓

**reputation**

That is the FNN network effect.

------------------------------------------------------------------------

# 33. Product Philosophy

The Spider-Man theme is not just visual branding.

It represents a product philosophy:

> **"With great power comes great responsibility."**

The power to help is already distributed across a neighborhood.

The missing piece is coordination.

FNN provides the web.

Every person can be:

-   A sensor
-   A verifier
-   A responder
-   A contributor
-   A community guardian

The system does not ask everyone to become an emergency professional.

It asks people to do something simpler:

> **Notice something? Send the signal.**

------------------------------------------------------------------------

# 34. Running the Project Locally

## Frontend

``` bash
cd frontend
npm install
npm run dev
```

The Vite development server will provide the local web application.

For a production build:

``` bash
npm run build
```

------------------------------------------------------------------------

## Backend

``` bash
cd backend
npm install
```

Then configure the backend environment variables according to the
project's `.env.example`.

The backend entrypoint is:

``` text
backend/src/server.ts
```

------------------------------------------------------------------------

# 35. Environment Configuration

The backend is designed around environment-based configuration.

Typical variables include:

``` text
PORT
DATABASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
JWT_SECRET
CORS_ORIGIN
VOTING_RADIUS_METERS
DUPLICATE_WINDOW_MINUTES
DUPLICATE_RADIUS_METERS
SIGNAL_STAKE_AMOUNT
AI_API_KEY
AI_API_URL
```

Secrets should never be committed to the repository.

Use local `.env` files for development and secure environment-variable
configuration for deployment.

------------------------------------------------------------------------

# 36. API Overview

The backend provides an API surface for the major FNN workflows.

Examples include:

``` text
GET    /health
GET    /api/health
GET    /api/me
GET    /api/credits

POST   /api/signals
GET    /api/signals
GET    /api/signals/nearby
GET    /api/signals/:id

POST   /api/signals/:id/location-proof
POST   /api/signals/:id/vote

GET    /api/heroes/nearby

POST   /api/tasks/:id/accept
PATCH  /api/tasks/:id/status

POST   /api/signals/:id/escalate

POST   /api/sos

POST   /api/signals/:id/challenge
POST   /api/challenges/:id/selfie

GET    /api/services
```

Authenticated routes use bearer-token authentication.

------------------------------------------------------------------------

# 37. Authentication Model

The backend authentication middleware accepts:

``` text
Authorization: Bearer <supabase_access_token>
```

The authenticated user is resolved through the configured authentication
provider.

The application then uses the authenticated identity for:

-   User-specific data
-   Signal ownership
-   Voting restrictions
-   Hero actions
-   Credit accounting
-   Authorization checks

Public-facing identity remains pseudonymous where appropriate.

------------------------------------------------------------------------

# 38. Geospatial Model

FNN's geospatial model is central to its architecture.

Rather than asking:

> "Who on the internet can see this?"

FNN asks:

> **"Who is relevant to this incident because they are nearby?"**

Geospatial logic can support:

-   Nearby signals
-   Hero discovery
-   Radius verification
-   Local notifications
-   Community resources
-   Approximate public map views

This keeps the network hyperlocal and reduces unnecessary exposure.

------------------------------------------------------------------------

# 39. Security Model

Security is layered.

### Authentication

Establish who is allowed to access protected operations.

### Authorization

RBAC determines what an authenticated user is allowed to do.

### Identity Separation

Public pseudonyms reduce unnecessary identity exposure.

### Location Protection

Exact coordinates are treated as protected information.

### Audit Logging

Sensitive operations can be recorded.

### Anti-Abuse

Voting limits, radius checks, proof-of-presence and credit stakes help
discourage manipulation.

### Biometric Safety

Raw biometric templates are not required for the MVP.

------------------------------------------------------------------------

# 40. Responsible Technology Boundaries

FNN is a safety-oriented prototype, so it deliberately avoids several
unsafe claims.

### FNN does not claim:

-   Automatic police dispatch without an integration.
-   Automatic 112 dispatch without an integration.
-   Autonomous AI emergency decision-making.
-   Production-grade facial recognition.
-   Storage of raw biometric templates.
-   Guaranteed emergency response.
-   A real police/municipal partnership unless one exists.
-   Production-grade BLE/BitChat mesh coverage.

### FNN demonstrates:

-   Controlled workflows
-   AI-assisted triage
-   Local coordination
-   Privacy-preserving interfaces
-   Prototype escalation
-   Disaster-mode concepts
-   Community response mechanisms

This distinction is essential for responsible deployment.

------------------------------------------------------------------------

# 41. Hackathon Differentiator

The strongest part of FNN is not any individual feature.

It is the **composition** of the features.

A signal does not simply appear on a feed.

It moves through a coordinated system:

``` text
PERSON NOTICES SOMETHING
          ↓
     SPIDER SIGNAL
          ↓
      AI TRIAGE
          ↓
   PRIVACY PROTECTION
          ↓
   GEO-RADIUS FILTER
          ↓
 COMMUNITY VERIFICATION
          ↓
     HERO MATCHING
          ↓
   RESPOND / ESCALATE
          ↓
       RESOLVE
          ↓
   CREDIT + AUDIT
```

That is what turns FNN from a reporting application into a
**neighborhood coordination network**.

------------------------------------------------------------------------

# 42. The Bigger Vision

FNN starts at the neighborhood scale.

The same architecture can eventually extend to:

-   College campuses
-   Residential communities
-   Towns
-   Cities
-   Disaster zones
-   Community organizations
-   Institutional response networks

The fundamental abstraction remains the same:

> **People who notice + people who can help + a trusted coordination
> layer.**

------------------------------------------------------------------------

# 43. Final Narrative

## Welcome to our EARTH-42.

Every person is a sensor.

Every person can be a responder.

Every person can send the signal.

### Safer Reporting

Act without immediate identity exposure.

### Smarter Triage

AI classifies, prioritizes and routes.

### Community Power

Verified nearby actors can respond.

### Resilient Layer

Offline paths remain available when networks fail.

**OBSERVE → PROTECT → VERIFY → SOLVE → ESCALATE → HELP**

Every neighborhood has people who notice.

Every neighborhood has people who can help.

We just need to connect them --- safely, verifiably, and at the right
radius.

------------------------------------------------------------------------

# 44. Closing

## In a world without a Spider-Man,

# WE MAKE EVERYONE A LITTLE MORE LIKE ONE.

You don't have to become the hero.

**JUST SEND THE SIGNAL.**

------------------------------------------------------------------------

## Links

### 🌐 Live Demo

**https://fnn-earth42v2.vercel.app/#/dashboard**

### 💻 GitHub

**https://github.com/akshaykumarp987063-ai/fnn-earth42**

### 👥 Team

**Empty Minds --- PSG College of Technology, Coimbatore**

------------------------------------------------------------------------

## EARTH-42

**Friendly Neighborhood Network**

> **Every person is a sensor.\
> Every person can be a responder.\
> Every person can send the signal.**

**FNN · EARTH-42 · HACKVERSE: INTO THE WEB**
