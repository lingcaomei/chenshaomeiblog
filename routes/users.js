var express = require('express');
var router = express.Router();

var middleware = require('../middleware');//确定登录与否 继续执行

/* GET users listing. */

/*注册*/
//middleware.checkNotLogin 检查登录与否 确定未登录才能访问此页面
router.get('/reg', middleware.checkNotLogin,function(req, res, next) {
    //
    res.render('user/reg',{});

    //if(req.session.user){//已经登陆过了
    //    req.flash('error','你已经注册，并已经登录，不能重复注册');
    //    res.redirect('back');
    //}else{
    //    res.render('user/reg',{});
    //}

});

router.post('/reg',middleware.checkNotLogin, function(req, res, next) {
  var user= req.body;//读取用户提交过来的注册表单
  //new Model('User') 加上new的意思是创建一个模型（表）'User'是对应数据骨架的名称 (user)是传入的数据
  new Model('User')(user).save(function(err,user){ //把提交过来的用户信息往数据库里面保存
      if(err){
        res.redirect('/users/reg')
      }else{
        res.redirect('/users/login')
      }
  })
});

/*登陆*/

router.get('/login',middleware.checkNotLogin,function(req,res,next){

    res.render('user/login',{})

    //middleware.checkNotLogin 注入这个与下面的逻辑是相同功能
    //if(req.session.user){
    //    req.flash('error','你已经登录，不能重复登录');
    //    res.redirect('back');
    //}else{
    //    res.render('user/login',{})
    //}

})
router.post('/login',middleware.checkNotLogin,function(req,res,next){
    var user=req.body;
     //不需要创建，已有'User'这个表，直接对它操作 调用方法
     Model('User').findOne(user,function(err,user){
         console.log(user)
        if(user){
            req.session.user=user;
            req.flash('success','登录成功')
            res.redirect('/')
        }else{
            res.redirect('/users/login')
        }
    })

})

router.get('/logout',middleware.checkLogin,function(req,res,next){

        req.session.user=null;
        req.flash('success','退出成功，请重新登录哦');
        res.redirect('/users/login')

})
module.exports = router;
