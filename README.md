# Back End Project - News App API

## Hosted Link
[ellsbees-nc-news](https://ellsbees-nc-news.onrender.com/api)

## Project Description
This project is a REST API using Node.js and Express.js that serves as the backend for a news app. It provides endpoints for retrieving and manipulating articles, topics, users, and comments in JSON format. The API interacts with a PostgreSQL database to perform CRUD operations, enabling integration and use of various data within the application.

The list of available endpoints and their descriptions are shown in the `endpoints.json` file. You can use the Google Chrome extension [JSON Viewer](https://chromewebstore.google.com/detail/json-viewer/aimiinbnnkboelefkjlenlgimcabobli?pli=1) to more easily inspect the available endpoints.

## Setting up / Installation Requirements

### Cloning
In the terminal:  
`$ git clone https://github.com/ellsbee/be-nc-news.git`  
`$ cd be-nc-news`

### Prerequisites
- Node.js 21
- PostgreSQL 14

### Dependencies
| Package    | Version   | Installation Command |
|------------|-----------|----------------------|
| dotenv     | 16.4.5    | `npm i dotenv`       |
| express    | 4.19.2    | `npm i express`      |
| pg         | 8.11.5    | `npm i pg`           |
| pg-format  | 1.0.4     | `npm i node-pg-format` |

### Dev Dependencies
| Package       | Version   | Installation Command   |
|---------------|-----------|------------------------|
| supertest     | 7         | `npm i supertest -D`   |
| jest          | 27.5.1    | `npm i jest -D`        |
| jest-sorted   | 1.0.15    | `npm i jest-sorted -D` |

For jest-sorted, change your `package.json`:
"jest": {
"setupFilesAfterEnv": [
"jest-extended/all",
"jest-sorted"
]
}

### To Run Application
1. Initialise Node and install dependencies: `$ npm install`
2. To create the necessary environment variables, create two `.env` files: `.env.test` and `.env.development`.
3. In the `.env.test` file, add:
PGDATABASE=nc_news_test
4. In the `.env.development` file, add:
PGDATABASE=nc_news

### Setup Database 
There is a `db` folder which contains test and dev data, a `setup.sql` file, and a `seeds` folder.

Run the following command to set up the database and seed the data:
`$ npm run setup-dbs`
`$ npm run seed`

### Testing the Application

To run tests:
`$ npm test app`

---- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
