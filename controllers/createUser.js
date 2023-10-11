const { User, findByUserID, findAllUsers } = require('../models/User');
const { Exercise } = require('../models/Exercise');

const addNewUser = async (req, res) => {
  const broughtName = req.body.username;
  try {
    const user = new User({
      username: broughtName,
    });
    await user.save();
    return res.json({
      username: broughtName,
      _id: user._id
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
};
const getAllUsers = async (req, res) => {
  const data = await findAllUsers()
  res.json(data)
}

const exercises = async (req, res) => {
  const { ':_id': _id, description, duration, date } = req.body;
  // Set the default value for date if it is not provided
  const currentDate = date ? new Date(date) : Date.now();
  try {
    // Create a new exercise using the Exercise model
    const newExercise = new Exercise({ createdBy: _id, description, duration, date: currentDate });
    // Save the new exercise to the database
    const savedExercise = await newExercise.save();
    // Prepare the response data
    const responseData = {
      _id: savedExercise.createdBy,
      username: savedExercise.username,
      date: savedExercise.date.toDateString(),
      duration: savedExercise.duration,
      description: savedExercise.description,
    };
    res.status(201).json(responseData);
  } catch (error) {
    res.json({ error: error.message });//removed status 400 for testing
  }
};

const getByParams = async (req, res) => {
  res.status(404).json({mgs: 'hi mom'})
};

const getUserLogs = async (req, res) => {
  const _id = req.params._id;
  if (!_id) return res.json({ error: 'Please provide a valid _id' });//removed status 400 for testing
  const { from, to, limit } = req.query;
  const query = { createdBy: _id };
  // Add date range query if 'from' and 'to' parameters are provided
  if (from && to) {
    query.date = { $gte: new Date(from), $lte: new Date(to) };//this might be risky, it's better changing to regExp 
  }
  try {
    const findUser = await findByUserID(_id);
    const count = await Exercise.countDocuments(query);//to count length
    // Fetch the logs based on the query and limit the result if 'limit' parameter is provided
    let logsQuery = Exercise.find(query).select('description duration date -_id');
    if (limit) logsQuery = logsQuery.limit(parseInt(limit));
    const logs = await logsQuery;
    // Map the logs array to extract required fields for each log
    const responseData = logs.map(log => ({
      description: log.description,
      duration: log.duration,
      date: log.date ? log.date.toDateString() : null,
    }));
    res.json({
      _id: String(findUser[0]._id),
      username: String(findUser[0].username),
      count: Number(count),
      log: Object(responseData)
    });
  } catch (error) {
    res.json({ error: error.message });//removed status 400 for testing
  }
};

module.exports = {
  getAllUsers,
  addNewUser,
  getByParams,
  exercises,
  getUserLogs
}