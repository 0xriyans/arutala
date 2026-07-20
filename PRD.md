# Product Requirements Document (PRD): Arutala

## 1. Executive Summary & Vision
**Product Name**: Arutala (Sanskrit for "Moon" or "Light")
**Product Type**: Premium Direct-to-Consumer (D2C) E-Commerce Platform
**Core Value Proposition**: Arutala revolutionizes the digital fragrance shopping experience. Purchasing perfume online has historically been hindered by the inability to smell the product. Arutala bridges this gap through two core pillars: **Immersive Visual Storytelling** (translating scent into visual design and micro-animations) and a **Generative AI Concierge** (a highly intelligent bot that translates user memories and preferences into accurate scent profiles).

## 2. User Personas
* **The Fragrance Connoisseur**: Understands top, heart, and base notes. Seeks niche, complex olfactory compositions (e.g., Oud, Vetiver). They value the detailed Scent Pyramids on the product pages.
* **The Emotional Explorer**: Buys perfumes based on a feeling or memory (e.g., "I want to smell like a rainy morning in a pine forest"). They rely heavily on the AI Chatbot's "Find My Scent" interactive quiz.
* **The Premium Shopper**: Expects a frictionless, luxurious digital experience. They appreciate the dark-mode aesthetic, smooth Framer Motion animations, and instant secure checkout.

## 3. Detailed Feature Specifications

### 3.1. Front-End: Immersive Storefront
* **Luxury Aesthetic**: A strictly enforced dark-mode design system utilizing `Tailwind CSS`. High-contrast serif typography for headings, paired with clean sans-serif for body text.
* **Snap-Scrolling Presentation**: Product discovery utilizes a cinematic, full-screen vertical snap-scrolling interface (reminiscent of high-end editorial magazines).
* **Advanced Olfactory Filtering**: Users can filter the catalog by fragrance families (Woody, Floral, Fresh, Oriental), occasions (Daytime, Evening, Office), and intensity.
* **Persistent Cart Drawer**: A slide-out cart utilizing React Context for global state management, allowing users to review their order without leaving the current page.

### 3.2. Generative AI Fragrance Concierge (Bot Microservice)
* **Floating Widget Integration**: A globally accessible chat interface built with React and Framer Motion, hovering over the storefront.
* **Engine**: Powered by **Google Gemini 2.5 Flash**, initialized via the official Python SDK.
* **Interactive Quiz ("Find My Scent")**: The bot is programmed via a strict System Prompt to never list products immediately. Instead, it acts as a human concierge, asking 3-4 branching, evocative questions to gauge the user's personality and olfactory preferences.
* **Automated Tool Calling (Function Calling)**: Once the user's profile is understood, the AI autonomously calls a `search_fragrances` function, hitting the backend database to find matching products, and returns a highly personalized recommendation.
* **Direct Add-to-Cart Action**: The bot can generate special UI tags (e.g., `[ADD_TO_CART:slug]`) which the React frontend parses to render an interactive "Add to Cart" button directly inside the chat stream.
* **Customer Support**: Capable of securely calling the `get_order_status` function to retrieve real-time shipping updates for users.

### 3.3. Back-End: Core API & Admin
* **Catalog Management System**: Full CRUD REST API to manage the product lifecycle, including uploading product images, defining complex scent pyramids (Top/Heart/Base arrays), and managing inventory thresholds.
* **Order Processing Engine**: Handles the transition of cart data into formalized Orders. Integrates with Midtrans (or similar) for secure payment token generation.
* **Shipping Calculator**: Calculates shipping costs based on integrated third-party logistics APIs, considering weight and destination province/city.
* **Secure Authentication**: Stateless authentication utilizing JSON Web Tokens (JWT). Passwords are cryptographically hashed using `Bcrypt`.

## 4. User Flows
1. **The Consultation Flow**: User lands on the site -> Opens Chatbot -> Completes the 4-step interactive quiz -> AI recommends "Swarna" -> User clicks "Add to Cart" inside the chat -> User opens Cart Drawer -> Checkout.
2. **The Discovery Flow**: User lands on site -> Uses the horizontal scrolling Editorial Product List -> Clicks a product -> Views the dynamic 3D Scent Pyramid -> Adds to Cart -> Checkout.

## 5. Non-Functional Requirements
* **Performance**: The frontend must achieve a Lighthouse score of 90+ for Performance. Images must be heavily optimized and lazy-loaded.
* **Security**: API endpoints must be protected against SQL injection. Rate limiting must be enforced on the AI Chatbot endpoint to prevent API abuse and excessive billing.
* **Scalability**: The microservices architecture (Frontend, Core API, Bot API) must allow independent scaling of the AI Bot during traffic spikes.
* **Accessibility**: The custom UI components must maintain WCAG compliance (keyboard navigable, aria-labels on custom toggles).

## 6. System Design & Database Schema

### 6.1. System Architecture Diagram (Conceptual)
The system employs a **Microservices-Oriented Architecture (MOA)** to decouple the AI inference workload from core e-commerce transactions.
* **Client Layer**: React 19 SPA running in the browser.
* **API Gateway / Core Service (Port 8000)**: A FastAPI service handling all CRUD operations, authentication, cart management, and checkout. Connects directly to PostgreSQL.
* **AI Bot Service (Port 8001)**: A dedicated FastAPI service handling WebSocket/HTTP streams for the Gemini Chatbot. It possesses secure cross-service communication capabilities to fetch catalog data and order statuses from the Core Service without exposing raw database access to the AI.
* **Data Layer**: PostgreSQL database acting as the single source of truth.

### 6.2. Core Database Entities

* **`users`**: Manages secure authentication and Role-Based Access Control (RBAC). Stores unique emails, Bcrypt hashed passwords, and role definitions (`ADMIN` or `USER`).
* **`products`**: The core catalog entity. Stores standard e-commerce metrics (price, stock, display name, URL slug) alongside complex olfactory data. It utilizes PostgreSQL's `JSONB` data type to store arrays of `top_notes`, `heart_notes`, and `base_notes` for highly flexible querying.
* **`orders`**: Engineered for transactional integrity. Tracks the overall purchase lifecycle, linking the `user_id` to the cart's `total_amount`, shipping destination, logistics tracking numbers, and the overarching status (`PENDING`, `PAID`, `SHIPPED`, `DELIVERED`).
* **`order_items`**: The financial snapshot layer. Links multiple products to a single order and strictly records the `price_at_purchase`. This prevents historical orders from retroactively changing if a product's price is updated in the future.
