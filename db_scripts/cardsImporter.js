var mysql = require('mysql');
var data = require ('./AllCards-x.json')
var dbconnection = require ('../dbconnection.js')

var pool = dbconnection.pool


pool.getConnection(function(err, connection) { 
    if (err) throw err;
    console.log("Connected!");
    var values = []
    var i = 0;
    for (var key of Object.keys(data)) {
        i++
        var cardName = data[key].name

        var combinedValues = [i, cardName]
        values.push(combinedValues);

    }
    var sql = "INSERT INTO cards (ID, Name) VALUES ?";
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        connection.release();
    });
});


