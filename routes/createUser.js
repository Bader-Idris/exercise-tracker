const router = require('express').Router();
const { getAllUsers, getByParams, addNewUser, exercises, getUserLogs } = require('../controllers/createUser');

router.route('/users').get(getAllUsers).post(addNewUser);
router.route('/users/:_id/exercises').get(getByParams).post(exercises);
router.route('/users/:_id/logs').get(getUserLogs)
module.exports = router;
/*
  to get them all
  http://localhost:3000/api/users

  to post new details, as you can see in front end!
  http://localhost:3000/api/users/:id/exercises

  to get logs with from && to and limit;  Remove them for getting them all! Use a valid :id though
  http://localhost:3000/api/users/:id/logs?from=1994-01-01&to=2022-01-31&limit=2
*/