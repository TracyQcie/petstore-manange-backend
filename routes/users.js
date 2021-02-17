var express = require('express');
var router = express.Router();
let { add, deleted, query, update } = require("../dao/users/users_dao.js");
let result = require("../util/result.js")

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('users', { title: 'usersApi', 
        apiList:[
            {
                url:"users/adduser(添加用户)",
                method:"POST",
                params:{
                    headerImg:"用户头像", 
                    username:"用户名称",
                    addres:"用户地址",
                    sex:"用户性别",
                    mobile:"手机号",
                    email:"邮箱"
                },
                result:{
                    "success": true,
                    "data":``
                }
            },
            {
                url:"users/deleteuser(删除用户)",
                method:"GET",
                params:{
                    id:"用户ID"
                },
                result:{
                    "success": true,
                    "data":``
                }
            },
            {
                url:"users/deleteuser(查询用户)",
                method:"GET",
                params:{
                    id:"用户ID"
                },
                result:{
                    "success": true,
                    "data":`{
                        id: 1,
                        headerImg:"用户头像", 
                        username:"用户名称",
                        addres:"用户地址",
                        sex:"用户性别",
                        mobile:"手机号",
                        email:"邮箱"
                    }`
                }
            },
        ]
    });;
});
// 添加用户
router.post('/adduser', function(req, res, next) {
  // res.send('respond with a resource');
  let urlParam = req.body;
  console.log(urlParam);
  add(urlParam,function(success){
    let r =  result.createResult(success, null);
    res.json(r);
  })
});
// 删除指定用户
router.get('/deleteuser', function(req, res, next) {
  // res.send('respond with a resource');
  let urlParam = {
    id: req.query.id
  };
  console.log(urlParam);
  deleted(urlParam,function(success){
    let r =  result.createResult(success, null);
    res.json(r);
  })
});
// 获取指定用户信息
router.get('/queryuser', function(req, res, next) {
  // res.send('respond with a resource');
  let urlParam = {
    id: req.query.id
  };
  console.log(urlParam);
  query(urlParam,function(success){
    let r =  result.createResult(true, success);
    res.json(r);
  })
});
// 更新指定用户信息
router.post('/updateuser', function(req, res, next) {
  // res.send('respond with a resource');
  let urlParam = req.body;
  console.log(urlParam);
  update(urlParam,function(success){
    let r =  result.createResult(success, null);
    res.json(r);
  })
});

module.exports = router;
