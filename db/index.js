/**
 * Created by Window 7 on 2015/12/7.
 */
var mongoose=require('mongoose');//是基于node-mongodb-native开发的MongoDB nodejs驱动，可以在异步的环境下执行
var ObjectId = mongoose.Schema.Types.ObjectId;//转换id

mongoose.connect('mongodb://10.1.20.97/chenshaomeiblog');//连接数据库

//'User'表的名称 创建数据骨架模型 Schema 一种以文件形式存储的数据库模型骨架 键值字段
mongoose.model('User',new mongoose.Schema({
    username:String,
    password:String,
}));

//文章的数据骨架模型
mongoose.model('Article',new mongoose.Schema({
    title:String,
    content:String,
    poster:String,
    user:{type:ObjectId,ref:'User'}//用户信息，对象ID类型，从User引用得到
}))

//Model: 由Schema构造生成的模型，除了Schema定义的数据库骨架以外，还具有数据库操作的行为，类似于管理数据库属性、行为的类
//绑在global上 ，全局
global.Model = function(modName){
    return mongoose.model(modName);
}