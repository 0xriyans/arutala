<div align="center">
  <img src="https://via.placeholder.com/150x150/1a1a1a/c5a880?text=Logo" alt="Arutala Logo" width="120">
  
  # 🌙 Arutala - Premium Local Perfumery 
  ### *A Full-Stack E-Commerce Masterpiece*

  [![Status: Production Ready](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)]()
  [![UI/UX: Luxury Dark Mode](https://img.shields.io/badge/UI%2FCX-Luxury_Dark_Mode-black?style=for-the-badge)]()
  [![Architecture: Microservices](https://img.shields.io/badge/Architecture-Decoupled-blue?style=for-the-badge)]()
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)]()
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)]()
  
  Arutala (meaning "Moon" or "Light" in Sanskrit) is a conceptual Direct-to-Consumer (D2C) premium local perfumery brand. This project serves as a **flagship portfolio piece** demonstrating my ability to design, architect, and develop a holistic, enterprise-grade digital experience that embodies luxury, elegance, and profound storytelling.

  ---
  
  **Looking for a top-tier developer to build your next web application?**  
  👉 **[Let's collaborate on Fiverr!](#-hire-me-on-fiverr)** 👈

</div>

---

## 📑 Table of Contents
1. [Project Overview & Business Vision](#-project-overview--business-vision)
2. [Platform Highlights (Gallery)](#-platform-highlights)
3. [Deep Dive: Key Features](#-deep-dive-key-features)
4. [Technical Architecture & Stack](#%EF%B8%8F-technical-architecture--stack)
5. [Database Schema](#-database-design)
6. [Security & Performance](#-security--performance)
7. [Installation & Setup](#%EF%B8%8F-installation--setup)
8. [Hire Me on Fiverr](#-hire-me-on-fiverr)

---

## 💼 Project Overview & Business Vision

Arutala was built with a single goal: to prove that an e-commerce platform can be both a highly performant sales engine and a beautiful, immersive digital boutique. 

**Unique Selling Propositions (USP) of this platform:**
- **Story-Driven Commerce**: The UI/UX is designed to sell the *story* of the perfume, utilizing a clean, minimalist "dark-mode luxury" theme that replicates stepping into an exclusive, high-end boutique.
- **Frictionless Buyer Journey**: Meticulously optimized user flows from catalog exploration to checkout, engineered specifically to reduce cart abandonment rates.
- **Scalable Foundation**: Built on a decoupled architecture, ensuring the platform can scale to handle high traffic spikes during product launches or flash sales.

---

## 📸 Platform Highlights

*(Visual proof of the platform's premium design and functionality. Replace placeholders with actual high-res screenshots)*

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Storefront / Hero Section</b><br><img src="https://via.placeholder.com/800x450/1a1a1a/c5a880?text=Premium+Hero+Section" width="400"></td>
      <td align="center"><b>Immersive Product Details</b><br><img src="https://via.placeholder.com/800x450/1a1a1a/c5a880?text=Product+Details+Page" width="400"></td>
    </tr>
    <tr>
      <td align="center"><b>Seamless Checkout Flow</b><br><img src="https://via.placeholder.com/800x450/1a1a1a/c5a880?text=Optimized+Checkout" width="400"></td>
      <td align="center"><b>Admin Analytics Dashboard</b><br><img src="https://via.placeholder.com/800x450/1a1a1a/c5a880?text=Secure+Admin+Panel" width="400"></td>
    </tr>
  </table>
</div>

---

## 🛍️ Deep Dive: Key Features

This platform is not just a template; it's a custom-engineered solution equipped with features designed to solve real business challenges.

### 👤 Customer Facing Features (Storefront)
- **Advanced Olfactory Filtering**: Customers can filter fragrances by scent notes (e.g., Woody, Floral, Citrus), intensity, and occasion.
- **Dynamic Scent Pyramid**: Visual representation of Top, Heart, and Base notes for every fragrance to educate the buyer.
- **Frictionless Cart & State Management**: Persistent cart state utilizing React Context, ensuring users never lose their selected items.
- **Secure Authentication**: JWT-based login, registration, and password recovery, with a dedicated User Dashboard to track order history.
- **Automated Shipping Calculation**: Integration with third-party logistics APIs to fetch real-time shipping rates across regions based on weight and distance.
- **Instant Payment Gateway**: Webhook-integrated payments supporting Credit Cards, Virtual Accounts, and e-Wallets for instant automated verification.

### 🛡️ Admin Facing Features (Backoffice)
- **Centralized Dashboard**: Real-time overview of total revenue, active orders, and top-selling products.
- **Order Management System (OMS)**: Admins can update order statuses (Processing, Shipped, Delivered), trigger automated customer emails, and input tracking numbers.
- **Dynamic Catalog Management**: Full CRUD (Create, Read, Update, Delete) capabilities for products, including uploading images, managing stock levels, and updating pricing.
- **Discount & Promotion Engine**: Create dynamic voucher codes (fixed amount or percentage) with expiration dates and minimum spend requirements.

---

## 🛠️ Technical Architecture & Stack

The platform utilizes a modern, decoupled (Headless) architecture. The presentation layer (Frontend) is completely separated from the business logic layer (Backend), communicating purely via RESTful APIs.

### 🎨 Frontend (Client-Side)
- **Core:** React 19 + TypeScript + Vite (Lightning-fast HMR and optimized builds)
- **Styling:** Tailwind CSS v4 (Utility-first, highly maintainable design system)
- **Animation:** Framer Motion (60fps cinematic page transitions and micro-interactions)
- **Routing:** React Router DOM
- **State Management:** Custom React Hooks + Context API
- **Data Fetching:** Axios / TanStack Query (React Query) for caching and optimistic updates.

### ⚙️ Backend (Server-Side) & API
- **Core Engine:** Node.js with Express.js / FastAPI (Python)
- **Architecture:** MVC (Model-View-Controller) pattern for clean code separation.
- **Authentication:** JWT (JSON Web Tokens) with strict Role-Based Access Control (RBAC).
- **ORM:** Prisma / Sequelize (Type-safe database queries).

### 🗄️ Database Design
- **Engine:** PostgreSQL
- **Structure:** Fully normalized relational structure designed for data integrity.
  - `Users` (Authentication, Roles, Profiles)
  - `Products` (Details, Pricing, Stock)
  - `Categories` & `Notes` (For complex filtering)
  - `Orders` & `OrderItems` (Transactional integrity)
  - `Promotions` (Discount logic)

---

## 🔒 Security & Performance

Enterprise-grade applications require enterprise-grade security and optimization.

- **Security Measures:**
  - Passwords hashed via **Bcrypt** before reaching the database.
  - Strict **CORS policies** to prevent unauthorized API access.
  - Input sanitization and payload validation to prevent **SQL Injection** and **XSS** attacks.
  - **Rate Limiting** on authentication routes to prevent brute-force attacks.
- **Performance Optimization:**
  - **Lazy Loading & Code Splitting:** Ensuring fast initial load times on mobile networks.
  - **Database Indexing:** Optimized queries for fast product filtering.
  - **Semantic HTML:** Fully optimized for search engine crawlers (SEO).

---

## ⚙️ Installation & Setup

Want to run this project locally? Follow these steps:

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL installed and running

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/arutala.git
cd arutala
```

### 2. Backend Setup
```bash
cd arutala-backend
npm install
# Create a .env file based on .env.example and add your database credentials
npm run migrate # Run database migrations
npm run seed    # Optional: Seed the database with sample fragrances
npm run dev     # Start the backend server
```

### 3. Frontend Setup
```bash
# Open a new terminal window
cd arutala-frontend
npm install
# Create a .env file and set your API base URL
npm run dev     # Start the Vite development server
```

---

## 🤝 Hire Me on Fiverr

I specialize in building **high-performance, visually stunning web applications** tailored specifically to your business needs. Whether you need a luxury e-commerce store like Arutala, a complex SaaS dashboard, or a custom interactive platform, I can bring your vision to life.

### **Why Work With Me?**
- 💻 **End-to-End Full-Stack Expertise:** From database architecture to pixel-perfect UI.
- 🎨 **Design-to-Code Mastery:** I translate Figma designs into flawless, responsive code.
- 🔌 **Seamless Integrations:** Payment gateways, shipping APIs, AI tools, you name it.
- 🚀 **Focus on Business Goals:** I build applications designed to convert, perform, and scale.
- 🗣️ **Clear Communication:** Professional, timely updates throughout the project lifecycle.

**Ready to elevate your digital presence?**

### 👉 **[Click here to view my Fiverr Profile and let's discuss your project!](https://www.fiverr.com/)** 👈
*(Note: Be sure to update this link with your actual Fiverr profile URL)*

---
<div align="center">
  <i>Arutala — Crafted with dedication for the love of fine fragrances, coded with passion for the love of technology.</i>
</div>
