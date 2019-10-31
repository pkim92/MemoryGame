const express = require('express')
const app = express()
const config = require('./config/config')
const routes = require('./routes/routes')
const hbs= require('express-handlebars')
const path = require("path")
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())


app.use(express.static(path.join(__dirname, 'public')))

app.engine(
    'hbs', hbs({
        extname: 'hbs',
        defaultLayout: 'layout',
        layoutsDir: path.join(__dirname + "/views/")
    })
)
app.set('view engine', 'hbs')

app.use(routes)

app.listen(config.port, () => {
    console.log(`Server running at http://${config.hostname}:${config.port}/`)
});