var express = require('express');
var router = express.Router();
var fetch = require("fetch").fetchUrl
var { $rq } = require("../util/rq")
let result = require("../util/result.js")
// console.log(fetch)

/* GET base page. */
router.get('/', function (req, res, next) {
    res.render('base', {
        title: 'baseApi',
        apiList: [
            {
                url: "base/getAccessToken(请求第三方Api，获取access_token)",
                method: "GET",
                params: {
                    key: "grant_type",
                    appid: "小程序appid",
                    secret: "小程序密钥"
                },
                result: {
                    "success": true,
                    "data": "{"
                        + "access_token" + ":" + "23_w0OtD1X72LIQo4dwctVsp99kjtIRRk9Gw5bx7UOglotfL7k9LqB1gKbZw86CNht6cnCv9oKBcFEcPg5u4seXN0hJMSEocsbun2dQxCTyZarP06YcToVbdP-MOLc7o7EhMSzqR4URT__BdZc-NMLbAIARQP,"
                        + "expires_in" + ":" + 7200
                        + "}"
                }
            },
            {
                url: "base/getdatabase(获取指定云环境集合信息)",
                method: "post",
                params: {
                    env: "云开发数据库环境id",
                    limit: "获取数量限制,默认10",
                    offset: "偏移量,默认0"
                },
                result: {
                    "success": true,
                    "data": `{
                        {
                        "errcode": 0,
                        "errmsg": "ok",
                        "collections": [
                            {
                                "name": "geo",
                                "count": 13,
                                "size": 2469,
                                "index_count": 1,
                                "index_size": 36864
                            },
                            {
                                "name": "test_collection",
                                "count": 1,
                                "size": 67,
                                "index_count": 1,
                                "index_size": 16384
                            }
                        ],
                        "pager": {
                            "Offset": 0,
                            "Limit": 10,
                            "Total": 2
                        }
                      }
                    }`
                }
            }
        ]
    });
});
router.get('/getAccessToken', function (req, res, next) { // 请求第三方Api，获取access_token
    let urlParam = {
        grant_type: "client_credential",
        appid: req.query.appid ? req.query.appid : "wx59b835009107ef44",
        secret: req.query.secret ? req.query.secret : "03fb8bfad80d8c60bf25d27db8c404ab"
    };
    $rq.get("cgi-bin/token", urlParam).then(response => {
        global.TOKEN_INFO = response
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
        console.log(err)
    })
});

router.get('/getdatabase', function (req, res, next) { // 获取指定云环境集合信息
    let urlParam = {
        // access_token: req.query.access_token?req.query.access_token:"",
        env: req.query.env ? req.query.env : "your-cloud-env",
        limit: req.query.limit ? req.query.limit : 10,
        offset: req.query.offset ? req.query.offset : 0
    };
    $rq.post("tcb/databasecollectionget?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
        // console.log(err)
    })
});

// 获取商品列表
// https://api.weixin.qq.com/tcb/databasequery?access_token=ACCESS_TOKEN
router.get(`/getProductList/:page/:keyword`, (req, res, next) => {
    let pageCount = 9;
    let offet = pageCount * (req.params.page - 1);
    let urlParam = {};
    if (req.params.keyword == 'empty') {
        urlParam = {
            env: req.query.env ? req.query.env : "your-cloud-env",
            query: `db.collection("product").limit(${pageCount}).skip(${offet}).get()`
        }
    } else {
        urlParam = {
            env: req.query.env ? req.query.env : "your-cloud-env",
            query: `db.collection("product").where({
                name: db.RegExp({
                  regexp: '.*' + '${keyword}' + '.*',
                  options: 'i',
                })
            }).limit(${pageCount}).skip(${offet}).get()`
        }
    }
    $rq.post("tcb/databasequery?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})

// 统计商品
// https://api.weixin.qq.com/tcb/databasequery?access_token=ACCESS_TOKEN
router.get(`/getAllProductList`, (req, res, next) => {
    let urlParam = {
            env: req.query.env ? req.query.env : "your-cloud-env",
            query: `db.collection("product").limit(100).get()`
        }
    $rq.post("tcb/databasequery?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})

// 获取商品数据库长度
// POST https://api.weixin.qq.com/tcb/databasecount?access_token=ACCESS_TOKEN
router.get(`/getProductListLength/:keyword`, function (req, res, next) {
    let urlParam = {};
    if (req.params.keyword == 'empty') {
        urlParam = {
            env: req.query.env ? req.query.env : "your-cloud-env",
            query: `db.collection("product").count()`
        }
    } else {
        urlParam = {
            env: req.query.env ? req.query.env : "your-cloud-env",
            query: `db.collection("product").where({
                name: db.RegExp({
                  regexp: '.*' + ${keyword} + '.*',
                  options: 'i',
                })
            }).count()`
        }
    }
    $rq.post("tcb/databasecount?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})

// 删除商品
// POST https://api.weixin.qq.com/tcb/databasedelete?access_token=ACCESS_TOKEN
router.get('/deleteProductById/:id', function (req, res, next) {
    let productId = req.params.id
    let urlParam = {
        env: req.query.env ? req.query.env : "your-cloud-env",
        query: `db.collection("product").where({id:"${productId}"}).remove()`
    }
    $rq.post("tcb/databasedelete?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})
// 插入商品
// POST https://api.weixin.qq.com/tcb/databaseadd?access_token=ACCESS_TOKEN
router.post('/addProduct', function (req, res, next) {
    let newProduct = JSON.stringify(req.body)
    let urlParam = {
        env: req.query.env ? req.query.env : "your-cloud-env",
        query: `db.collection("product").add({data:${newProduct}})`
    }
    console.log(urlParam)
    $rq.post("tcb/databaseadd?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})

// 更新商品
// POST https://api.weixin.qq.com/tcb/databaseupdate?access_token=ACCESS_TOKEN
router.put('/updateProduct', function (req, res, next) {
    let newProduct = JSON.stringify(req.body)
    let id = req.body.id
    let urlParam = {
        env: req.query.env ? req.query.env : "your-cloud-env",
        query: `db.collection("product").where({id:'${id}'}).update({data:${newProduct}})`
    }
    $rq.post("tcb/databaseupdate?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})

// 获取分类列表
// https://api.weixin.qq.com/tcb/databasequery?access_token=ACCESS_TOKEN
router.get('/getCatergoryList', function (req, res, next) {
    let urlParam = {
        env: req.query.env ? req.query.env : "your-cloud-env",
        query: `db.collection("category").get()`
    }
    $rq.post("tcb/databasequery?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})
// 获取订单列表（按照时间倒序）
// https://api.weixin.qq.com/tcb/databasequery?access_token=ACCESS_TOKEN
router.get(`/order/:page/:status`, (req, res, next) => {
    let pageCount = 5;
    let offet = pageCount * (req.params.page - 1);
    let urlParam = {}
    if (req.params.status == 'all') {
        urlParam = {
            env: req.query.env ? req.query.env : "your-cloud-env",
            query: `db.collection("user_order").orderBy('date','desc').limit(${pageCount}).skip(${offet}).get()`
        }
    } else {
        urlParam = {
            env: req.query.env ? req.query.env : "your-cloud-env",
            query: `db.collection("user_order").where({
                'status.value': '${req.params.status}'
              }).orderBy('date','desc').limit(${pageCount}).skip(${offet}).get()`
        }
    }
    $rq.post("tcb/databasequery?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})
// 获取订单数据库长度
// POST https://api.weixin.qq.com/tcb/databasecount?access_token=ACCESS_TOKEN
router.get(`/getOrderListLength/:status`, function (req, res, next) {
    let urlParam = {}
    if (req.params.status == 'all') {
        urlParam = {
            env: req.query.env ? req.query.env : "your-cloud-env",
            query: `db.collection("user_order").count()`
        }
    } else {
        urlParam = {
            env: req.query.env ? req.query.env : "your-cloud-env",
            query: `db.collection("user_order").where({
                'status.value': '${req.params.status}'
              }).count()`
        }
    }

    $rq.post("tcb/databasecount?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})
// 获得已完成状态订单
// https://api.weixin.qq.com/tcb/databasequery?access_token=ACCESS_TOKEN
router.get(`/order/close`, (req, res, next) => {
    urlParam = {
        env: req.query.env ? req.query.env : "your-cloud-env",
        query: `db.collection("user_order").where({
            'status.value': 'close'
          }).limit(100).get()`
    }
    $rq.post("tcb/databasequery?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})
// 修改订单状态
// https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=ACCESS_TOKEN&env=ENV&name=FUNCTION_NAME
router.put('/changeOrderStatus', function (req, res, next) { // 触发云函数获取响应数据
    let urlParam = {
        POSTBODY: {
            "orderId": req.body.orderId,
            "newStatus": JSON.stringify(req.body.newStatus)
        }
    }
    $rq.post("tcb/invokecloudfunction?access_token=" + global.TOKEN_INFO.access_token + "&env=your-cloud-env&name=changeOrderStatus", urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
        // console.log(err)
    })
})
// 获取订单投诉列表
// https://api.weixin.qq.com/tcb/databasequery?access_token=ACCESS_TOKEN
router.get(`/complain/:orderId`, (req, res, next) => {
    // 只获取最新的一条申诉
    let orderId = req.params.orderId
    let urlParam = {
        env: req.query.env ? req.query.env : "your-cloud-env",
        query: `db.collection("user_complain").where({orderId:'${orderId}'}).orderBy('date','desc').limit(1).get()`
    }
    $rq.post("tcb/databasequery?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})
// 处理投诉
// https://api.weixin.qq.com/tcb/databaseupdate?access_token=ACCESS_TOKEN
router.put(`/complain`, (req, res, next) => {
    let response = req.body.response
    let status = JSON.stringify(req.body.status)
    let complainId = req.body._id
    let urlParam = {
        env: req.query.env ? req.query.env : "your-cloud-env",
        query: `db.collection("user_complain").where({_id:"${complainId}"}).update({data:{"status":${status},"response":"${response}"}})`
    }
    console.log(urlParam)
    $rq.post("tcb/databaseupdate?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})

// 退款
// https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=ACCESS_TOKEN&env=ENV&name=FUNCTION_NAME
router.put('/refundToUser', function (req, res, next) { // 触发云函数获取响应数据
    console.log(req.body, 'refundToUser')
    let urlParam = {
        POSTBODY: {
            "resetStorage": req.body.resetStorage,
            "userId": req.body.userId,
            "productIndex": req.body.productIndex,
            "payList": req.body.payList,
            "paymentFee": req.body.paymentFee
        }
    }
    $rq.post("tcb/invokecloudfunction?access_token=" + global.TOKEN_INFO.access_token + "&env=your-cloud-env&name=refundToUser", urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
        // console.log(err)
    })
})

// 插入日志
// POST https://api.weixin.qq.com/tcb/databaseadd?access_token=ACCESS_TOKEN
router.post('/log', function (req, res, next) {
    let log = JSON.stringify(req.body)
    let urlParam = {
        env: req.query.env ? req.query.env : "your-cloud-env",
        query: `db.collection("log").add({data:${log}})`
    }
    console.log('log', urlParam)
    $rq.post("tcb/databaseadd?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})
// 获取日志
// https://api.weixin.qq.com/tcb/databasequery?access_token=ACCESS_TOKEN
router.get('/log', function (req, res, next) {
    let urlParam = {
        env: req.query.env ? req.query.env : "your-cloud-env",
        query: `db.collection("log").orderBy('date','desc').limit(100).get()`
    }
    $rq.post("tcb/databasequery?access_token=" + global.TOKEN_INFO.access_token, urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
    })
})
// https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=ACCESS_TOKEN&env=ENV&name=FUNCTION_NAME
router.get('/getVitaeDetail', function (req, res, next) { // 触发云函数获取响应数据
    console.log(req.query, 'getVitaeDetail')
    let urlParam = {
        POSTBODY: {
            "vidtaName": req.query.vidtaName,
            "creatTime": req.query.creatTime,
            "template": req.query.template,
            "theme": req.query.theme,
            "customModal": req.query.customModal,
            "baseInfoId": req.query.baseInfoId,
            "jobIntentionId": req.query.jobIntentionId,
            "workListId": req.query.workListId,
            "educationId": req.query.educationId,
            "projectId": req.query.projectId,
            "skillTreeId": req.query.skillTreeId,
            "addedTagId": req.query.addedTagId,
            "evauationId": req.query.evauationId,
        }
    }
    $rq.post("tcb/invokecloudfunction?access_token=" + global.TOKEN_INFO.access_token + "&env=test-3b6a08&name=getVidtaDetail", urlParam).then(response => {
        let r = result.createResult(true, response);
        res.json(r);
    }).catch(err => {
        let r = result.createResult(false, err);
        res.json(r);
        // console.log(err)
    })
})

module.exports = router;