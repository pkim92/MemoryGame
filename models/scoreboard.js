let db = require('../util/db')
const gameModel = require('../models/scoreboard')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())

function insertUser(data) {
    let sql = "Insert into scoreboard (name, score) values ('" + data.name + "','" + data.score + "')";
    db.execute(sql)
}

function getAllUsers() {
    return db.execute('select * from scoreboard order by score desc limit 5')
}

module.exports = {
    insertUser: insertUser,
    getAllUsers: getAllUsers
}