const {selectTopics, selectArticle} = require("../models/model")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next);
    };

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.query;
    selectArticle(article_id).then((article) => {
            res.status(200).send({ article });
        })
        .catch((next));
    };




