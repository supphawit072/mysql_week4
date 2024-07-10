'use strict';
const express = require('express');
const crypto = require('crypto');
const wrRoute = express.Router();
const connection = require('../db');

wrRoute.post('/users', function (req, res, next) {
    let mypass = crypto.createHash('md5').update(req.body.password).digest("hex");
    connection.execute(`INSERT INTO Users_tbl (name, tel, username, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);`,
        [req.body.name, req.body.tel, req.body.username, mypass, Date.now(), Date.now()])
        .then(() => {
            console.log('ok');
            res.status(201).send("Insert Successfully");
        }).catch((err) => {
            console.log(err);
            res.end();
        });
});

wrRoute.get('/users', function (req, res, next) {
    connection.execute('SELECT * FROM Users_tbl;')
        .then((result) => {
            var rawData = result[0];
            res.send(JSON.stringify(rawData));
            //res.send(rawData);
        }).catch((err) => {
            console.log(err);
            res.end();
        });
});

wrRoute.post('/check', function (req, res, next) {
    let mypass = crypto.createHash('md5').update(req.body.password).digest("hex");
    connection.execute('SELECT * FROM Users_tbl WHERE username=? AND password=?;',
        [req.body.username, mypass]).then((result) => {
            var data = result[0];
            if (data.length === 0) {
                res.sendStatus(400);
            }
            else {
                res.sendStatus(200);
            }
        }).catch((err) => {
            console.log(err);
            res.sendStatus(404);
        });
});

wrRoute.use('/', function (req, res, next) {
    res.sendStatus(404);
});

module.exports = wrRoute;