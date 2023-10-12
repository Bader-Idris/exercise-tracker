const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide name'],
    // maxlength: 50,
    // minlength: 3,
  },
});

userSchema.pre('save', async function (next) {
  const username = this.username//.trim(); // they don't trim it 😡
  // const nameLength = username.length;
  // if (nameLength > 2 && nameLength < 51) {
    try {
      // Perform any other validation or modification before saving the user
      this.username = username;
      next();
    } catch (error) {
      next(error);
    }
  // } else {
    // next(new Error('Please provide a valid name'));
  // }
});

const findByUserID = async (ID) => {
  try {
    const foundUser = await User.find({ _id: ID }).select('_id username');
    if (foundUser.length === 0) {
      return res.status(404).send('Please provide a valid user ID');
    }
    return foundUser;
  } catch (error) {
    return res.status(404).send('Please provide a valid user ID');
  }
};

const findAllUsers = async () => {
  const msg = 'Please provide create a username to see it'
  try {
    const foundUsers = await User.find({}).select('_id username');
    if (foundUsers.length === 0) {
      return res.status(404).send(msg);
    }
    return foundUsers;
  } catch (error) {
    return res.status(404).send(msg);
  }
};

const User = mongoose.model('User', userSchema);
module.exports = {
  User,
  findByUserID,
  findAllUsers
};