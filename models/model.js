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
    const query = `SELECT * FROM articles WHERE article_id = $1`;
    return db.query(query, [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0];
    })
}

