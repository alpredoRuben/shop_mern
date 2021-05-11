/** Use Library */
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

/** Use Middleware */
const errorMiddleware = require('./middlewares/errors');

/** Use Custom Lib */
const Routes = require('./router/routes');


app.use(express.json());
app.use(cookieParser());
app.use('/api', Routes);

app.use(errorMiddleware);

module.exports = app;