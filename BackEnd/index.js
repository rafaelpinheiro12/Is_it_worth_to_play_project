const app      = require('express')()
require("dotenv").config()
const port     = process.env.PORT || 4444 

app.use(require("express").urlencoded({extended: true}))
app.use(require("express").json())

async function connectingToDB  () {
  try {
    await require("mongoose").connect(process.env.MONGO, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to the DB");
  } catch (error) {
    console.log("ERROR: Your DB is not running, start it up");
  }
}
connectingToDB()

app.use(require('cors')())

app.use('/fetchGame', require('./routes/routes.js'))
app.use('/users', require('./routes/users.routes.js'))

app.listen(port, () => console.log("Listening on port: " + port));