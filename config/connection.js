const {connect, connection} = require('mongoose');

connect('mongodb://localhost/socialpullapiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  // EXPORT connection 
module.exports = connection;
