const express = require("express")
const {getTopics, getArticleById} = require("./controllers/controller")
const {getEndpoints} = require("./controllers/controller.endpoints")
const app = express()

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticleById)

app.use((err, req, res, next) => {
    if(err.status === 400){
        res.status(400).send({ msg: 'Bad Request'})
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    res.status(404).send({msg: 'Not Found'})
})

app.use((req, res) => {
    res.status(404).send({ msg: 'Not Found' });
});

module.exports = app;