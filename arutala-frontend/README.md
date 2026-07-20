# 🎨 Arutala Frontend Service

[← Back to Main Repository README](../README.md)

The **Arutala Frontend** is a luxury Direct-to-Consumer (D2C) e-commerce user interface built with modern web technologies, cinematic micro-animations, and a responsive dark-mode aesthetic.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: React Router DOM

## 🌟 Key Features

- **Storefront & Hero Showcase**: Immersive visuals, smooth horizontal scrolls, and interactive olfactory story cards.
- **Product Experience**: Interactive fragrance note breakdown (Top, Heart, Base notes) with animated hover effects.
- **AI Chat Concierge UI**: Floating interactive chat drawer connected to the Gemini AI bot service.
- **Admin Dashboard**: Comprehensive order management, inventory control, and sales analytics charts.
- **Responsive Layout**: Designed for high DPI displays and mobile devices alike.

## 📁 Directory Structure

```text
arutala-frontend/
├── src/
│   ├── components/       # Reusable UI components (Navbar, Cart, ChatWidget, Admin)
│   ├── routes/           # Page routes (Home, ProductDetail, Cart, AdminRoute, etc.)
│   ├── data/             # State stores and API fetch utilities
│   ├── types/            # TypeScript interfaces & type definitions
│   ├── App.tsx           # Main application router & layout wrapper
│   └── main.tsx          # React application entry point
└── package.json
```
