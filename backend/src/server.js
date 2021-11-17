//import { databaseSetUp } from './setupDatabase.js';
const { serverSetUp } = require('./setupServer');
const { databaseSetUp } = require('./setupDatabase')
const dotenv = require('dotenv');

async function init() {
  dotenv.config({});
  await serverSetUp();
  await databaseSetUp();
  console.log("everything working");
}
init()