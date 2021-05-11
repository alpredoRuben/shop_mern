const app = require('./app');
const dotenv = require('dotenv');

const connectDatabase = require('./config/database');

/** Handle Uncaught exceptions */
process.on('uncaughtException', err => {
  console.log(`ERROR: ${err.message}`);
  console.log('Shutting down due to uncaught exception');
  process.exit(1); 
});

/** Setting up config environment */
dotenv.config({ path: './rest_api/config/config.env' });

/** Connect to database mongo db */
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode..`)
});

/** Handle unhandled Promise rejection */
process.on('unhandledRejection', err => {
  console.log(`Error ${err.message}`);
  console.log('Shutting down the server due to Unhandled Promise Rejection');
  server.close(() => { process.exit(1); })
})