let inputDoms = document.getElementsByTagName("input")
let inputL = inputDoms.length
console.log(inputDoms)
let btnDoms = document.getElementsByClassName("btn")
console.log(btnDoms)
let btnL = btnDoms.length

for(let i=0; i<btnL; i++) {
    btnDoms[i].index = i
    btnDoms[i].onclick = function() {
        // console.log(this)
        let submitData = getParams()
        let type = this.dataset.type
        if(type=="addBtn") {
            console.log("添加事件")
            adduser(submitData)
        }
        if(type=="deleteBtn") {
            console.log("删除事件")
            deleteduser(submitData)
        }
        if(type=="getBtn") {
            console.log("获取事件")
            queryuser(submitData)
        }
        if(type=="updateBtn") {
            console.log("更新事件")
            updateuser(submitData)
        }
    }
}
function getParams() {
    let params = {}
    for(let i=0; i<inputL; i++) {
        let type = inputDoms[i].dataset.type
        params[type] = inputDoms[i].value
    }
    return params
}
function adduser(data) {
    requestFn({
        method:'post',
        url:'/users/adduser',
        data: data,
        success: function(res) {
            console.log(res,"from adduser")
        }
    })
}
function deleteduser(data) {
    requestFn({
        method:'get',
        url:'/users/deleteuser',
        data: data,
        success: function(res) {
            console.log(res,"from deleteduser")
        }
    })
}
function queryuser(data) {
    requestFn({
        method:'get',
        url:'/users/queryuser',
        data: data,
        success: function(res) {
            console.log(res,"from queryuser")
        }
    })
}
function updateuser(data) {
    requestFn({
        method:'post',
        url:'/users/updateuser',
        data: data,
        success: function(res) {
            console.log(res,"from updateuser")
        }
    })
}
function requestFn(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function () {};
    let params = []
    for (var key in opt.data){
        params.push(key + '=' + opt.data[key]);
    }
    let postData = params.join('&');
    // 兼容写法
    let xmlHttp = XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP')

    if(opt.method==="POST") {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    }
    if(opt.method==="GET") {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(xmlHttp.responseText);
        }
    };
}