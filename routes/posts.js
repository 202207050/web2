var express = require('express');
var router = express.Router();
var {getConnection} = require('./connect');
var oracledb = require('oracledb');

//게시판
router.get('/', function(req, res, next) {
  res.render('index', {title:'게시판', pageName:'posts/list.ejs'});
});


//게시글 목록 데이터 브라우저: /posts/list.json?page=1&size=5
router.get('/list.json', async function(req, res){
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 5;
    let word = req.query.word || '';
    let off_rows = (page-1) * size;
    let con;
    try{
        con = await getConnection();

        let sql="SELECT * FROM VIEW_POSTS ";
            sql+=` WHERE TITLE LIKE '%${word}%' OR CONTENT LIKE '%${word}%' OR SNAME LIKE '%${word}%'`;
            sql+="  ORDER BY ID DESC ";
            sql+=` OFFSET ${off_rows} ROWS FETCH NEXT ${size} ROWS ONLY`;
        let result = await con.execute(sql, {}, {outFormat:oracledb.OUT_FORMAT_OBJECT});
        let list = result.rows;

        sql = " select count(*) from view_posts ";
        sql += ` WHERE TITLE LIKE '%${word}%' OR CONTENT LIKE '%${word}%' OR SNAME LIKE '%${word}%'`;
        result = await con.execute(sql);
        let count=result.rows[0][0];

        res.send({list, count});
    }catch(err){
        console.log('게시글 목록 데이터', err.message)
    }finally{
        if(con) await con.close();
    }
});

//글쓰기 페이지 이동
router.get('/insert', function(req, res){
    res.render('index', {title: '글쓰기', pageName:'posts/insert.ejs'});
});

module.exports = router;