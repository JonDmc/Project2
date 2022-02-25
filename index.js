const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')

require('dotenv').config() //allows us to access env vars

app.set('view engine', 'ejs')
app.use(ejsLayouts)

app.get('/', (req, res) => {
    res.render('home.ejs')
})

//check for an env PORT, otherwise use 8000
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Auth appp running on ${PORT}`)
})