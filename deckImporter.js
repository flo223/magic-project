var mysql = require('mysql');
var data = require ('./AllCards-x.json')

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jaRJarbin0923K2r3for1%win",
  database: "magic"
});




/*for (var i = 0; i<10 ; i++ ){
    console.log (data[i])
}*/

/*for (key of Object.keys(data)) {
   console.log(key);
}
*/

con.connect(function(err) {
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
    con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    con.end();
    });
});



// `INSERT INTO cards (ID, Name) VALUES (1, ${card1})`