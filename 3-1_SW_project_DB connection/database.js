const mysql = require('mysql')
const db_info = {
    host:'localhost',
    port: '3306',
    user: 'manager',
    password: 'manager',
    database: 'SW_db'
}


module.exports = {
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}
