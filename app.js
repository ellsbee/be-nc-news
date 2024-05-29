const express = require("express")
const {getTopics, getArticleById, getArticles, getCommentsByArticleId} = require("./controllers/controller")
const {getEndpoints} = require("./controllers/controller.endpoints")
const app = express()

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)



app.all('*', (req, res, next) => { 
    res.status(404).send({ msg: 'Not Found' }); 
}); 

app.use((err, req, res, next) => { 
    if (err.code === "22P02"){ 
        res.status(400).send({ msg: 'Bad Request' }); 
    } 
    if (err.status && err.msg){ 
        res.status(err.status).send({ msg: err.msg });
    } else { 
        next(err); 
    } 
}); 


module.exports = app;