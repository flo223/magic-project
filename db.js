var dbconnection = require ('./dbconnection.js')

var pool = dbconnection.pool

var db = {
    insert: function (card, amount, deckNumber) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            var params = []
            var sqlQuery = "INSERT INTO cards_decks (ID, CardID, DeckID, amount) VALUES ?";
            var paramsValues = [0, card, deckNumber, amount]
            params.push(paramsValues)
            connection.query(sqlQuery, [params], function (err, result) {
                if (err) throw err;                
                connection.release();
            });
        })
    },

    insertDeck: function (table, parameters) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            var columnsValues = Object.keys(parameters)
            var queryValues = []
            var columns = ""
            for (element in parameters){                
                queryValues.push(parameters[element])                
            }
            for (element in columnsValues){              
                columns += `${columnsValues[element]},`                
            }
           
            columns = columns.slice(0,-1)        
            console.log(queryValues)
            var sqlQuery = `INSERT INTO ${table} (${columns}) VALUES ?`;
            console.log(sqlQuery)
            var params = []
            //var paramsValues = [0, card, deckNumber, amount]
            params.push(queryValues)
            connection.query(sqlQuery, [params], function (err, result) {
                if (err) throw err;                
                connection.release();
            });
        })
    },

    updateDeck: function (table, parameters, id) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;                    
            var setter = ""
            var columns = Object.keys(parameters)
            var values = Object.values(parameters)
            var i
            
            for (i=0; i<columns.length; i++){                
                var column = columns[i]                
                var value = values[i]
                setter += `${column}='${value}',`               
            }         
           
            setter = setter.slice(0,-1)
            var sqlQuery = `UPDATE ${table} set ${setter} where id=?`;
            console.log(sqlQuery)
            var params = id          
            
            connection.query(sqlQuery, params, function (err, result) {
                if (err) throw err;                
                connection.release();
            });
        })
    },

    getCardId: function (cardName, callback) {
        pool.getConnection(function(err, connection) {            
            var sql = `SELECT ID FROM cards WHERE name = ? `;            
            return connection.query(sql, cardName, (error, results, fields) => {
              if (error) {
                return console.error(error.message);
              }
              connection.release();              
              if (results[0])
                return callback (results[0].ID);
              else
                return callback (false);
            });
        })      

    },

    getDecks: function (callback) {
        pool.getConnection(function(err, connection) {            
            var sql = "SELECT * FROM decks";            
            return connection.query(sql, (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }              
                connection.release();
                return callback (results);
            });
        })
    },

    getDeckList: function (deckId, callback) {
        var sql = "select cd.amount, c.Name, c.Type, c.Second_Type, c.Third_Type from cards_decks cd left join cards c on cd.CardID=c.ID where deckID = ?;";            
        try {            
            pool.query(sql,deckId, function(error, results, fields) {                
                if (error) {
                    return console.error(error.message);
                }
                
                var deckList = []
                for (i = 0; i<results.length; i++ ) {
                    cardObject = {}
                    cardObject.name = results[i].Name
                    cardObject.amount = results[i].amount
                    cardObject.types = []
                    cardObject.types.push(results[i].Type)
                    cardObject.types.push(results[i].Second_Type)
                    cardObject.types.push(results[i].Third_Type)
                    deckList [i] = cardObject
                }
                pool.releaseConnection;
                return callback (deckList);
            });
      
        } catch (e) {
            console.log(e + "error with db query")
            connection.release();
        }         
    }   
}

module.exports = db;

