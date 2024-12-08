const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://abdulhananch404:duUqZBg0PcZw6g3B@undefined/?replicaSet=atlas-xlc3yl-shard-0&ssl=true&authSource=admin',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  }
};

module.exports = connectDB;
