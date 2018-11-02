var mysql = require('mysql');
var data = require ('../AllCards-x.json')
var dbconnection = require ('../dbconnection.js')

var pool = dbconnection.multiplePool

pool.getConnection(function(err, connection) {
    
    if (err) throw err;
    console.log("Connected!");    
    var queries = bulkUpdate (data)
    console.log (`queries is ${queries}`)
    connection.query(queries, function (err, result) {
        if (err) throw err;                
        connection.release();
        console.log("connection released")
        process.exit()             
    });            
})
  
function bulkUpdate(data) {    
    var i = 0;
    var queries = '';
    for (var key of Object.keys(data)) {
        i++                
        if (i >= 500 && i<800) {
            var types = data[key].types
            var name =  data[key].name            
            if (types) {
                var sql = mysql.format(`update cards set Type = '${types[0]}' where name = ?;`, name)                
                queries += sql                
                if (types.length >= 2) {
                    var sql2 = mysql.format(`update cards set Second_Type = '${types[1]}' where name = ?;`, name)                
                    queries += sql2
                }
                if (types.length == 3) {
                    var sql3 = mysql.format(`update cards set Third_Type = '${types[2]}' where name = ?;`, name)                  
                    queries += sql3
                } else if (types.length > 3) {
                    console.log (`card ${name} has more than 3 types`)
                }
            } else {
                console.log ("this card does not have any type" + data[key].name)
            }
        }      
    }   
    return queries
}
