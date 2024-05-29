const db = require("../db/connection")

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics')
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows
    })
}

exports.selectArticle = (article_id) => {
    if(!article_id || isNaN(article_id)){
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }

    const sqlQuery = `SELECT * FROM articles WHERE article_id = $1`;
    const queryValues = [article_id];
    
    return db.query(sqlQuery, queryValues)
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Not Found' });
        }
        return rows;
    });
};

exports.selectAllArticles = () => {
    const sqlQuery = `SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM 
    articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
`;
    return db.query(sqlQuery)
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows;
    })
}

exports.selectCommentsByArticleId = (article_id) => {
    const sqlQuery = `SELECT 
    comment_id,
    votes,
    created_at,
    author,
    body,
    article_id
    FROM comments WHERE article_id = $1
    ORDER BY created_at DESC;
`;
    return db.query(sqlQuery, [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows;
    })
}

