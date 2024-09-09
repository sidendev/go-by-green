# GoByGreen

## Introduction

GoByGreen is a Android mobile app concept designed to promote eco-friendly travel by providing directions exclusively through low-carbon transport options. Users can view carbon emissions for each travel option, encouraging environmentally conscious decisions. The app allows users to create accounts, save routes, and access detailed information about their travel choices.

This project is a work in progress, initially developed as part of a group project during the Northcoders bootcamp. Future plans include trying out building versions in iOS and nextJS for web platforms.

Original group project can be found at [https://github.com/HelloKt-8/GoByGreen](https://github.com/HelloKt-8/GoByGreen).

## Project Structure

GoByGreen is structured as a monorepo, containing both the backend API and the frontend mobile application. This architecture was chosen to facilitate future expansion to iOS and web versions.

- `api/`: Backend API code
- `application/`: Frontend mobile application code

## Tech Stack

### Backend (API)

- Language: JavaScript
- Framework: Express.js
- Database: PostgreSQL
- Testing: Jest
- Additional libraries: cors, dotenv, pg

### Frontend (Mobile Application)

- Language: JavaScript
- Framework: React Native with Expo
- State Management: Redux, React Redux
- Navigation: React Navigation
- Maps: react-native-maps, react-native-maps-directions
- UI Components: react-native-elements
- Styling: twrnc (Tailwind for React Native)
- API Requests: Axios

## Prerequisites

- Node.js
- npm
- Expo CLI
- PostgreSQL

## Setup and Installation

### Backend Setup

1. Navigate to the `api/` directory
2. Create two .env files for database connections:
   - `.env.development`: Add `PGDATABASE=go_by_green_db`
   - `.env.test`: Add `PGDATABASE=go_by_green_db_test`
3. Install dependencies: `npm install`
4. Set up the database: `npm run setup-dbs`
5. Seed the database: `npm run seed`
6. Start the server: `npm start`

### Frontend Setup

1. Navigate to the `application/` directory
2. Install dependencies: `npm install`
3. Create a `.env` file and add: `GOOGLE_MAPS_APIKEY=[Your Google Maps API Key]`
4. Start the Expo development server: `npm start`

## API Endpoints

- `GET /api/users`
- `GET /api/users/:user_id`
- `GET /api/users/:user_id/routes`
- `GET /api/users/:user_id/routes/:route_id`

Note: The API is hosted on Render and may take upto 60 seconds to respond on first access, current set up is just for testing.

## Deployment

- Database: Hosted on Supabase
- Backend API: Hosted on Render

## Future Plans

- Expand to iOS platform
- Develop a web version with NextJS
- Enhance features and user experience
- Add gamification features to improve user engagement

## Acknowledgements

Thanks to my other group team members for all their support during this project.

This project was initially created as part of the Northcoders Digital Skills Bootcamp in Software Engineering.
