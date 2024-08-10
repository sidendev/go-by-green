# GoByGreen

## Intro

Go by Green is an Android travel app dedicated to providing directions exclusively through low carbon transport options. Users can view the carbon emissions for each travel option, promoting awareness of their environmental impact. Our goal is to encourage eco-friendly travel choices, guiding users to make decisions that benefit the environment. Users can also create an account to save their routes and access detailed information about their travel options.

Demo: https://vimeo.com/984794832

## Project structure

The project is divided into two main folders:

- backend: contains all the code for the backend API
- frontend: contains all the code for the frontend mobile application


## Prerequisites

- Node.js
- npm
- Expo CLI
- PostgreSQL

## Backend setup

1. Clone the repository
2. Navigate to the backend folder
3. Create two .env files to connect to the databases locally:
   - **.env.development**: Add `PGDATABASE=go_by_green_db`
   - **.env.test**: Add `PGDATABASE=go_by_green_db_test`
4. Install dependencies: `npm install`
5. Start the server: `npm start`


URLs endpoints (please note, it might take a moment for these to load):

https://gobygreen.onrender.com/api/users

https://gobygreen.onrender.com/api/users/:user_id

https://gobygreen.onrender.com/api/users/:user_id/routes

https://gobygreen.onrender.com/api/users/:user_id/routes/:route_id

## Frontend setup

1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the Expo server: `expo start`
4. Create **.env** file: Add `GOOGLE_MAPS_APIKEY=[access key]`

## Tech stack

**Backend**:
- Language: JavaScript
- Framework: Express.js
- Database: PostgreSQL
- Testing: Jest

**Frontend**:
- Languages: JavaScript, HTML, CSS
- Framework: React Native
- Integration: Google Maps API

**Deployment and Hosting**:
- Database Hosting: Supabase
- Backend Hosting: Render


This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by Northcoders

