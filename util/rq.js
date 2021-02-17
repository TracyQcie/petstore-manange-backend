var axios = require("axios")
var qs = require("qs")
// import qs from "qs"
// console.log(axios)

const CONFIG_KEY = "dev"
const SERVICE_CONF = {
    "dev":{
        baseUrl: "https://api.weixin.qq.com/"
    }
}[CONFIG_KEY]

const rq = axios.create({
    baseURL: SERVICE_CONF.baseUrl,
    timeout: 10000,
    headers: {
        "Content-Type":"application/json; charset=utf-8"
    }
})

// axios 请求头拦截器
rq.interceptors.request.use(req => {
    // req.data = qs.stringify(req.data)
    // console.log(req,"请求头--请求方式")
    console.log(req.method,"请求头--请求方式")
    console.log(req.params,"请求头--请求参数")
    
    // var requestUrl = request.url

    if (req.data && req.headers['Content-Type'] === 'application/x-www-form-urlencoded') {

        req.data = qs.stringify(req.data);

    }

    return req
},error => {
    return Promise.reject(error)
})

// axios 返回信息拦截器
rq.interceptors.response.use(res => {
    // console.log(res)
    console.log(res.data,"返回信息")
    return res.data
},error => {
    return Promise.reject(error)
})

const $rq = {
    get(url,params) {
        return rq.get(url,{
            params: params
        })
    },
    post(url,params={}) {
        return rq({
            url: url,
            method: 'post',
            data:params
        })
    }
}

module.exports = {
    SERVICE_CONF,
    rq,
    $rq,
}

