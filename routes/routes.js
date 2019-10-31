const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())

const gameController = require('../controller/game-controller')


/* Home Page */
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Memory Game',
        mainPage: true
    })
})
router.post('/summary', (req, res) => {
    res.render('summary', {
        score: req.body.scoreSubmit,
        summary: true
    })
})

router.post('/scoreboard', (req, res) => {
    gameController.getScoreboard(req, res)
})

router.get('/scoreboardranking', (req, res) => {
    gameController.showScoreboard(req, res)
})


module.exports = router