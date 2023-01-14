# Hugo challenge

## Summary

The goal is to to create a reusable and efficient solution for handling the process of uploading and updating data in a Prisma-managed database via CSV file uploads.

DataStore class was developed to handle the process of uploading CSV files, parsing the data, and inserting or updating that data in a Prisma-managed database. The class is designed to handle file uploads via an Express.js Request object, and it expects the file to be in CSV format. To accomplish this, I included two main methods: the `upload` method, which handles the initial file upload and parsing process and calls the `upSert` method, and the `upSert` method which handles the inserting or updating of the data in the database using the Prisma client.

Additionally, I added the ability to pass a callback function to the upload method, so that any further operations can be performed on the data after it has been uploaded.

## Requirement

- Node 16.x.x
- Yarn 1.2.x
- Postgres 11.x.x

## Tech Stack

- Express.js
- Prisma

## Setup Postgres

1. Follow https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-macos/
1. Create a database for this project

## Usage

1. Open 2 terminals, for both backend and frontend
1. Copy `.env-template` and rename to `.env`, open the file and point to your postgres database
1. Run `yarn` to install dependencies
1. Run `npx prisma db push` to load up the schema to your database
1. Run `yarn dev` to run the backend endpoint, URL is `http://localhost:5001/upload`
1. Use Postman or any other API client to load up your csv file, use the sample `file.csv`
1. Details below for Postman
1. Click button Send

## Postman

Endpoint: http://localhost:5001/upload
Method: Post
Body: use form-data, and add key/value item, key is file (change type to file), and value is your csv file

## Test

1. Run `yarn test`
