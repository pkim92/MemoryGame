const gameModel = require('../models/scoreboard')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())


exports.getScoreboard = (req, res) => {
    let name = req.body.userName
    let score = req.body.summaryScore

    let userObj = {
        name: name,
        score: score
    }
    gameModel.insertUser(userObj)
    res.redirect(301, 'scoreboardranking')
}

exports.showScoreboard = (req, res) => {
    let users = gameModel.getAllUsers()
    users.then(([rows, fieldData]) => {
        res.render('scoreboardranking', { user: rows, scoreboard: true });
   });
}