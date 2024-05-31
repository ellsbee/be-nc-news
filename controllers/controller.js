const {selectTopics, selectArticle, selectAllArticles, selectCommentsByArticleId, addCommentToArticle, updateArticleVoteCountByArtileId, removeCommentByCommentId, selectUsers } = require("../models/model")

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
    const {topic} = req.query;
    selectAllArticles(topic).then((articles) => {
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
        res.status(200).send(updatedArticle[0])
    })
    .catch(err => {
        next(err);
    });
}

exports.deleteCommentByCommentId = (req, res, next) => {
    const {comment_id} = req.params
    removeCommentByCommentId(comment_id)
    .then(() => {
        res.status(204).send();
    })
    .catch(err => {
        next(err);
    });
};

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch(next);
    };











