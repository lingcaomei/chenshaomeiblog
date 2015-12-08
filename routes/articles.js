/**
 * Created by Window 7 on 2015/12/7.
 */
var express = require('express');
var router = express.Router();

var middleware = require('../middleware');//确定登录与否 继续执行

router.get('/list',function(req,res,next){

    var keyword = req.query.keyword;
    var query = new RegExp(keyword,"i");
    Model('Article').find(function(err,articles){
        //console.log(articles)
        var data={title:'发布文章',articles:articles};
        //console.log(data)
        res.render('index',data);

    })
})

router.get('/add',middleware.checkLogin,function(req,res,next){
    res.render('article/add', { title: '发表文章',article:{} });
})

router.post('/add',middleware.checkLogin,function(req,res,next){
    var article=req.body;

    article.user = req.session.user._id;
    new Model('Article')(article).save(function(err,article){
        if(err){
            res.redirect('back');
        }else{

            res.redirect('/')
        }
    })

})
module.exports = router;
