const mongodb = require('../db/database');

const isAuthenticated = (req, res, next) => {
    next();
};

const checkUserIsInDB = async (id) => {
    //make sure authenticated user matches a user in the db
    //console.log("id:", id);
    const user = await mongodb
        .getDb()
        .db()
        .collection('users')
        .findOne({ githubId: parseInt(id) });
    console.log(user);
    if (!user) {
        //console.log("User not found in database");
        throw new Error('User not found');
    }

    //console.log("User found in database:", user);
    return { _id: user._id, role: user.role };
};

const checkUserIsNotInDB = async (id) => {
    try {
        console.log('step 2');
        const user = await mongodb
            .getDb()
            .db()
            .collection('users')
            .findOne({ githubId: parseInt(id) });
        console.log(user);

        if (user) {
            throw new Error(
                'User Account already exists.  Cannot create new Account'
            );
        }
    } catch (error) {
        throw error;
    }
};

const checkOrderIsNotInDB = async (id) => {
    try {
        console.log('step 2');
        const user = await mongodb
            .getDb()
            .db()
            .collection('orders')
            .findOne({ githubId: parseInt(id) });
        console.log(user);

        if (user) {
            throw new Error(
                'Current Order already exists. Please adjust quantity in cart'
            );
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    isAuthenticated,
    checkUserIsInDB,
    checkUserIsNotInDB,
    checkOrderIsNotInDB
};
