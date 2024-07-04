const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/database');
const indexRoutes = require('./routes/index');

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', indexRoutes);
S
mongodb.initDb((err) => {
    if (err) {
    console.log(err);
    } else {
    app.listen(port, () => {
        console.log(`Connected to DB and listening on ${port}`);
    }
    );
    }
});