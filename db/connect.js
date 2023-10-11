try {
  mongoose = require("mongoose");
  mongoose.set('strictQuery', false);//this is for the ugly warning messages! because of using 6 for deploying on render.com
} catch (e) {
  console.log(e);
}
const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
