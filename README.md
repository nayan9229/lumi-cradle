# Baby Cry Detection Dashboard

A production-ready React dashboard application for a Smart Baby Cry Detection & Monitoring System with AI-powered insights.

## Features

- **AI-Driven Cry & Distress Translator** - Real-time cry classification with suggested actions
- **Predictive Sleep Coaching** - Sleep quality tracking and routine suggestions
- **Health Anomaly Detection** - Temperature and health monitoring
- **Developmental Milestone Tracking** - Auto-tagged milestone video capture
- **Multi-User Logbook** - Shared activity tracking
- **Real-time Monitor Status** - Live streaming, audio monitoring, and smart home integration

## Tech Stack

- React 18
- React Router
- Tailwind CSS
- Recharts (data visualization)
- Framer Motion (animations)
- Lucide React (icons)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (Card, Badge, Button, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   └── layout/          # Layout components (Sidebar, Header, Layout)
├── data/                # Static JSON data files
├── pages/               # Page components
├── App.jsx              # Main app with routing
└── main.jsx             # Entry point
```

## Data

All data is stored in static JSON files under `/src/data/`. No API calls are made - everything is client-side for demonstration purposes.

## Responsive Design

The application is fully responsive with:
- Mobile-first design
- Collapsible sidebar on mobile devices
- Fluid layouts that adapt to all screen sizes

## Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states for all interactive elements

