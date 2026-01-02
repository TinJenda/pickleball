# Pickleball Ranking Web App

A complete frontend-only Pickleball round-robin tournament ranking system built with Next.js, React, TypeScript, and TailwindCSS.

## Features

- **View Rankings**: Real-time tournament standings with win/loss records and point differentials
- **Match Management**: View all matches and scores
- **Admin Panel**: Create teams, generate round-robin matches, input results, and reset tournaments
- **Local Persistence**: All data stored in localStorage
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Admin Access

- **Username**: admin
- **Password**: 123456

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- localStorage for data persistence

## Project Structure

```
/app
  - page.tsx (main page)
  - layout.tsx
  - globals.css
/components
  - Header.tsx
  - LoginModal.tsx
  - Tabs.tsx
  - RankingTable.tsx
  - MatchList.tsx
  - MatchItem.tsx
  - TeamManager.tsx
/hooks
  - useTournament.ts
/utils
  - roundRobin.ts
  - ranking.ts
  - storage.ts
/types
  - index.ts
```

## Future Enhancements

- Replace localStorage with Firestore
- Add authentication service
- Multi-tournament support
