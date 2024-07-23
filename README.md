# Blogger REST API

This project is a simple blogging API built with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/). It provides CRUD operations for `User` and `Post` entities.

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js (>= 18.x)
- npm (>= 10.x)
- Prisma CLI
- NestJS CLI
- pgAdmin 4

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kennykay20/Blogger_System_Home_Task.git
cd BLOGGING_API


## Install Dependencies
```bash
$ npm install
```


##### Set Up Prisma
- Prisma is used as the ORM to interact with the database. Initialize Prisma:
- Install Prisma client as a dependency @Prisma/client
- Initialize prisma with -  `npx prisma init`
- navigate to the Prisma folder Edit the `prisma/schema.prisma` file which includes the `Users` and `Posts` Models
## Run the Prisma Migrations
- Create the database and apply the schema changes - `npx prisma migrate dev --name init`
- note: make sure your "DATABASE_URL" details are correct
## Generate Prisma Client
- Generate the Prisma Client to Interact with the database `npx prisma generate`
- Add a Prisma Service to handle the Prisma Client.
## Prisma Studio
- Prisma provides a GUI to interact with your database called Prisma Studio. run `npx prisma studio` it will display a localhost open the localhost on your browser.


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
Note: This Assessment includes a `SwaggerModule` you can open the localhost `http://localhost:4600/api` on your browser.

#### API Endpoints
The API provides the following endpoints:

- Create User
POST http://localhost:4600/api/v1/user/register
Body
{
  "username": "kennybowen1",
  "email": "kennyoluwadamilare2@gmail.com",
  "password": "Password1",
  "firstname": "kenny1",
  "lastname": "kayode1"
}
- email and username are unique, and password, should contain atleast 5 chars and 1 uppercase.
- firstname and lastname are optional
- Login as a registered User
POST http://localhost:4600/api/v1/auth/login
Body
{
  "username": "kennybowen1",
  "password": "Password1"
}
- when you login and you are authenticated, the api generate a token for authentication send to the user and as well added into the cookies server.

- Clear Cookie/Logout
GET localhost:4600/api/v1/auth/logout
- It clears the token from the cookie server

- Get All Users
GET http://localhost:4600/api/v1/users

- Get User by ID
GET http://localhost:4600/api/v1/users/:id

- Update User
PUT http://localhost:4600/api/v1/users/:id
Body
{
  "username": "kennybowen1",
  "email": "kennyoluwadamilare2@gmail.com",
  "password": "Password1",
  "firstname": "kenny1",
  "lastname": "kayode1"
}

- Delete a User
DELETE http://localhost:4600/api/v1/users/:id


- Create a Post
POST http://localhost:4600/api/v1/posts
Body
{
  "title": "First Post",
  "content": "This is the content of the first post",
  "published": true,
  "userId": 1
}

- Get all Post
GET http://localhost:4600/api/v1/posts

- Get Post by ID
GET http://localhost:4600/api/v1/posts/:id

- Update a post
PUT http://localhost:4600/api/v1/posts/:id
Body
{
  "title": "Updated Post",
  "content": "This is the updated content of the post"
}

- Delete a post
DELETE http://localhost:4600/api/v1/posts/:id


### Project Structure
- src/: Contains the source code for the Blogging_api application.
  - auth/: Contains the auth Module, service, dto, and controller.
  - config/: Contain an index file which is used to validate the .env details
  - users/: Contains the User module, service, and controller.
  - posts/: Contains the Post module, service, and controller.
  - guards/: Contains auth.guards file, jwt.strategy file for Authorization process.
  - utils/: Contains an helper, and auth functions, which act like re-useable function
- .env.example - Contains the necessary credentials you need to add to your .env file as an example
- prisma/: Contains the Prisma schema file, migration files, the Prisma service and module for database interactions.


##

This `README.md` file provides a clear guide on setting up and running the Blogger REST API, along with details on the available API endpoints and project structure. You can adjust it based on any additional features or customizations you might have in your project.
