let mysql = require("mysql")

let mysql_config = {
    connectionLimit : 10, // 最大连接数
    host            : '47.102.141.22', 
    user            : 'root',
    password        : 'DBAdba456',
    database        : 'xqbase'
}
let pool = mysql.createPool(mysql_config);

module.exports = {
    pool
}
