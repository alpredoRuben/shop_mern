const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose.connect(process.env.DB_MONGO_LOCAL_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }).then(con => {
    console.log(`Mongo DB Database Connection with Host : ${con.connection.host}`)
  })
}

module.exports = connectDatabase;