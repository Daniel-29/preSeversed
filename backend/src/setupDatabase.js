
const mongoose = require('mongoose');

const databaseSetUp = async () => {
  const connected = await connectToDatabase();
  if (!connected) {
    process.exit(1);
  }
}

const connectToDatabase = async () =>{
  const connectionOptions = {
    
  };

  try {
    console.log(process.env.MONGO_URL);
    await mongoose.connect(`${process.env.MONGO_URL}`, connectionOptions);
    console.log('Connected to database');
    return true;
  } catch (error) {
    console.log('Error occured while connecting to database :c', error);
    return false;
  }
}

module.exports = {databaseSetUp ,connectToDatabase}
