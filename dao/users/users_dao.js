let { pool } = require("../../conf/mysqlConf.js")
let {addUser, deleteUser, queryUser, updateUser} = require('./users_sql.js')

module.exports = {
    add: function (user, callback) {
        // password, addres, sex, mobile, email
        let sqlparam = [
            user.headerImg?user.headerImg:"",
            user.username?user.username:"",
            user.password?user.password:"",
            user.addres?user.addres:"",
            user.sex?user.sex:1,
            user.mobile?user.mobile:"",
            user.email?user.email:"",
        ]
        pool.query(addUser, sqlparam, function (error, result) {
            if (error) throw error;
            callback(result);
        });
    },
    deleted: function(params, callback) {
        let {id} = params
        let sqlparam = [id]
        pool.query(deleteUser, sqlparam, function (error, result) {
            if (error) throw error;
            callback(result);
        });
    },
    query: function(params, callback) {
        let {id} = params
        let sqlparam = [id]
        pool.query(queryUser, sqlparam, function (error, result) {
            if (error) throw error;
            // console.log(result);
            console.log(result[0]);
            callback(result[0]);
            // callback(result);
        });
    },
    update: function(user, callback) {
        let sqlparam = [
            user.id?user.id:"",
            user.headerImg?user.headerImg:"",
            user.username?user.username:"",
            user.password?user.password:"",
            user.addres?user.addres:"",
            user.sex?user.sex:1,
            user.mobile?user.mobile:"",
            user.email?user.email:"",
        ]
        pool.query(updateUser, sqlparam, function (error, result) {
            if (error) throw error;
            callback(result);
        });
    }
}