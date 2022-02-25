//IMPORTS
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const cryptoJs = require('crypto-js')
const db = require('./models/index.js')

require('dotenv').config() //allows us to access env vars

app.set('view engine', 'ejs') // set the view engine to ejs
app.use(ejsLayouts) // tells express we want to user layouts
app.use(cookieParser()) //cookie parser => give access to req.cookies
app.use(express.urlencoded({ extended: false })) //body parser => give access to req.body

//CUSTOM LOGIN MIDDLEWARE
app.use(async (req, res, next) => {
    if (req.cookies.userId) {
        //decrypting the incoming user id from the cookie
        const decryptedId = cryptoJs.AES.decrypt(req.cookies.userId, process.env.SECRET)
        //converting the decrypted id into a readable string
        const decryptedIdString = decryptedId.toString(cryptoJs.enc.Utf8)
        // querying the db for the user with that id
        const user = await db.user.findByPk(decryptedIdString)
        // assigning the found user to res.locals.user in the routes, and user in the ejs
        res.locals.user = user
    } else res.locals.user = null
    next()// move on to next middleware
})

//Controllers
app.use('/users', require('./controllers/users.js'))

app.get('/', (req, res) => {
    res.render('home.ejs')
})


//check for an env PORT, otherwise use 8000
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Auth appp running on ${PORT}`)
})