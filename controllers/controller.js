const {selectTopics, selectArticle, selectAllArticles, selectCommentsByArticleId, addCommentToArticle, updateArticleVoteCountByArtileId } = require("../models/model")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next);
    };

exports.getArticleById = (req, res, next) => { 
    const { article_id } = req.params; 
    selectArticle(article_id) 
    .then((article) => {
        res.status(200).send({ article: article[0] }); 
    }) .catch((err) => { 
        next(err); 
    }); 
};

exports.getArticles = (req, res, next) => {
    selectAllArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next);
}

exports.postCommentToArticle = (req, res, next) => {
    const {article_id,} = req.params;
    const {username, body} = req.body;    
    addCommentToArticle(article_id, username, body)
    .then(comment => {
        res.status(201).send({comment})
    })
    .catch(err => {
        next(err);
    });
}

exports.patchVoteCount = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;    
    updateArticleVoteCountByArtileId(article_id, inc_votes)
    .then(updatedArticle => {
        console.log(updatedArticle[0])
        res.status(200).send(updatedArticle[0])
    })
    .catch(err => {
        next(err);
    });
}









