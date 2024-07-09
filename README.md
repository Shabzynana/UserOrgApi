# User Authentication and Organisation System

This project is a Node.js-based API for user authentication and organisation management. It allows users to register, log in, create or join organisations. The API is built with Express, postgres, prisma and JWT for authentication.

## API Endpoint

***Endpoint***: `https://user-org-api.vercel.app`
## Installation
To set up this project locally, follow these steps:

1. Clone the repository:
```
git clone https://github.com/Shabzynana/UserOrgApi.git
cd UserOrgApi
```

2. Install dependencies:
```
npm install
```


3. Create a `.env` file in the root directory and add your environment variables:
```
DATABASE_URL = postgres://host_user:host_password@localhost:port/database_name

```

4. Start the server:
```
npm start
```

The server should now be running on `http://localhost:3000`

### Environment Variables
The following environment variables are required:

- `DATABASE_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `SECRET_KEY`: Secret key for app


## Technologies Used
- Node.js
- Express.js
- Prisma

## more information on usage coming soon
