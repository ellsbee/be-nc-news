const express = require("express")
const {getTopics} = require("./controllers/controller")
const {getEndpoints} = require("./controllers/controller.endpoints")
const app = express()

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics);

app.use((req, res) => {
    res.status(404).send({msg: 'Not Found'})
})

module.exports = app;