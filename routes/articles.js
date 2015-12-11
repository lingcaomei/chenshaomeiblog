/**
 * Created by Window 7 on 2015/12/7.
 */
var express = require('express');
var router = express.Router();

//图片上传 Start
var path = require('path');
var multer = require('multer');//Multer是一个nodejs中间件，用来处理http提交multipart/form-data，也就是文件上传。

//磁盘存储引擎让你控制存储文件到磁盘
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/upload')//../public/upload 储存的路径
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'.'+path.extname(file.originalname))//保存的文件名
    }
})

var upload = multer({ storage: storage });
//End

var middleware = require('../middleware');//确定登录与否 继续执行

router.get('/list/:pageNum',function(req,res,next){

    var pageSize=4;
    var pageNum=parseInt(req.params.pageNum);
    //如果小于等于0 只有一页
    pageNum=pageNum<=0?1:pageNum;
    var keyword = req.query.keyword;//查询字符串
    var query = new RegExp(keyword,"i");
    Model('Article').count({$or:[{title:query},{content:query}]},function(err,count){//获取总条数

        var totalPage=Math.ceil(count/pageSize);//总页数
        pageNum=pageNum>=totalPage?totalPage:pageNum;
        Model('Article').find({$or:[{title:query},{content:query}]}).skip((pageNum-1)*pageSize).limit(pageSize).exec(function(err,articles){
            //console.log(articles)
            var data={
                title:'发布文章',
                totalPage:totalPage,
                pageNum:pageNum,
                pageSize:pageSize,
                keyword:keyword,//查询关键字
                articles:articles
            };

            res.render('index',data);

        })
    })
})

router.get('/add',middleware.checkLogin,function(req,res,next){
    res.render('article/add', { title: '发表文章',article:{} });
})

// upload.single('avatar'),上传一张图片
router.post('/add', upload.single('avatar'),middleware.checkLogin,function(req,res,next){

    var article=req.body;
    var id=article.id;//要表单提交过来才有 <input type="hidden" name="id" value="<%= article._id%>"/>传过来的

    if(id){
        var updateObj={
            title:article.title,
            content:article.content
        }

        //如果存在
        if(req.file){
            var avatar = path.join('/upload',req.file.filename);//拼接成图片的路径
            updateObj.avatar = avatar;
        }

        //修改更新数据  Model.update(查询条件,更新对象,callback); {_id:id}根据_id查找 修改更新 标题和内容
        Model('Article').update({_id:id},{$set:updateObj},function(err){
            if(err){
                res.redirect('back');
            }else{
                res.redirect('/articles/detail/'+id);//在详情页的路由，会取数据，已是最新的数据了
            }
        })
    }else{

        article.avatar = path.join('/upload',req.file.filename);//拼接成图片的路径
        article.user = req.session.user._id;

        console.log(article)
        new Model('Article')(article).save(function(err,article){
            if(err){
                res.redirect('back');
            }else{

                res.redirect('/')
            }
        })

    }

})

//详情页
router.get('/detail/:id',function(req,res,next){
    var id=req.params.id;
    Model('Article').findById(id,function(err,article){//若修改更新，取到的是更新后的数据
        console.log(article)
        if(err){
            res.redirect('back');
        }else{
            res.render('article/detail',{article:article})
        }
    })
})
//删除
router.get('/delete/:id',function(req,res,next){
    var id=req.params.id;

    Model('Article').remove({_id:id},function(err){
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/')
        }
    })
})
//编辑
router.get('/edit/:id',function(req,res,next){
    var id=req.params.id;

    Model('Article').findById({_id:id},function(err,article){
        res.render('article/add',{article:article})
    })
})

module.exports = router;
