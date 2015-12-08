/**
 * Created by Window 7 on 2015/12/7.
 */
var mongoose=require('mongoose');//�ǻ���node-mongodb-native������MongoDB nodejs�������������첽�Ļ�����ִ��
var ObjectId = mongoose.Schema.Types.ObjectId;//ת��id

mongoose.connect('mongodb://10.1.20.97/chenshaomeiblog');//�������ݿ�

//'User'������� �������ݹǼ�ģ�� Schema һ�����ļ���ʽ�洢�����ݿ�ģ�͹Ǽ� ��ֵ�ֶ�
mongoose.model('User',new mongoose.Schema({
    username:String,
    password:String,
}));

//���µ����ݹǼ�ģ��
mongoose.model('Article',new mongoose.Schema({
    title:String,
    content:String,
    poster:String,
    user:{type:ObjectId,ref:'User'}//�û���Ϣ������ID���ͣ���User���õõ�
}))

//Model: ��Schema�������ɵ�ģ�ͣ�����Schema��������ݿ�Ǽ����⣬���������ݿ��������Ϊ�������ڹ������ݿ����ԡ���Ϊ����
//����global�� ��ȫ��
global.Model = function(modName){
    return mongoose.model(modName);
}