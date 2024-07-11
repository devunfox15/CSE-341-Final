const mongodb = require('../db/database');
const { checkUserIsInDB } = require('./authenticate');

//const checkUserInDB = async (id) => {
//    console.log("id:", id);
//    const user = await mongodb.getDb().db().collection('users').findOne({ githubId: parseInt(id) });
//    console.log(user)
//    if (!user) {
//        console.log("User not found in database");
//        throw new Error("User not found");
//    }

//    console.log("User found in database:", user);

//    return { _id: user._id, role: user.role };
//};

const isAdmin = async (req, res, next) => {
  try {
    const { _id, role } = await checkUserIsInDB(req.session.user.id);

    // Attach MongoDB user _id and role to req.session.user for potential later use
    req.session.user._id = _id;
    req.session.user.role = role;

    // Check if user is admin
    if (role.toLowerCase() !== 'admin') {
      console.log('User is not admin');
      return res.status(403).json('Unauthorized. Admin privileges required.');
    }

    console.log('User is admin');
    next();
  } catch (error) {
    console.error('Error checking user role:', error);

    // Handle specific error cases
    if (error.message === 'User not found') {
      return res
        .status(404)
        .json('User not found in the database.  Access Denied');
    }

    return res.status(500).json('Internal server error');
  }
};

const isCustomer = async (req, res, next) => {
  try {
    const { _id, role } = await checkUserInDB(req.session.user.id);

    // Attach MongoDB user _id and role to req.session.user for potential later use
    req.session.user._id = _id;
    req.session.user.role = role;

    // Check if user is customer
    if (role.toLowerCase() !== 'customer') {
      console.log('User is not customer');
      return res
        .status(403)
        .json('Unauthorized. Customer credentials required.');
    }

    console.log('User is customer');
    next();
  } catch (error) {
    console.error('Error checking user role:', error);

    // Handle specific error cases
    if (error.message === 'User not found') {
      return res.status(404).json('User not found in the database.');
    }

    return res.status(500).json('Internal server error');
  }
};

module.exports = { isAdmin, isCustomer };
