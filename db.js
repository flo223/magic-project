var dbconnection = require ('./dbconnection.js')
var log4js = require('log4js')
var db = require ('./db')
log4js.configure('data/log4jConfig.json')
const logger = log4js.getLogger('console')

var pool = dbconnection.pool

var db = {
    insert: function (card, amount, deckNumber, callback) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;            
            var checkExistsQuery = `SELECT * from cards_decks where CardID = '${card}' and DeckID = ?` 
            connection.query(checkExistsQuery, deckNumber, function (err, results) {
                if (err) throw err;                               
                if (results.length > 0) {                   
                    var updatedAmount = parseInt(results[0].amount) + parseInt(amount)
                    var id = results[0].ID    
                    var regroupQuery = `UPDATE cards_decks set amount = ${updatedAmount} where ID = ?` 
                    connection.query(regroupQuery, id, function (err, results) {
                        if (err) throw err;                        
                        connection.release();
                        return callback("updated")
                    })
                } else {
                    var params = []
                    var sqlQuery = "INSERT INTO cards_decks (ID, CardID, DeckID, amount) VALUES ?";
                    var paramsValues = [0, card, deckNumber, amount]
                    params.push(paramsValues)
                    connection.query(sqlQuery, [params], function (err, result) {
                        if (err) throw err;                                    
                        connection.release();
                        return callback("inserted")
                    });
                }
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
            
            var sqlQuery = `INSERT INTO ${table} (${columns}) VALUES ?`;
            var params = []
            params.push(queryValues)
            connection.query(sqlQuery, [params], function (err, result) {
                if (err) throw err;                
                connection.release();
            });
        })
    },

    updateCard: function (amount, id, callback){
        pool.getConnection(function(err, connection) {
            var query = `UPDATE cards_decks set amount = ${amount} where ID = ?` 
            connection.query(query, id, function (err, results) {
                if (err) throw err;                        
                connection.release();
                return callback(logger.info(`card ${id} updated correctly`))
            })
        })
    }
    ,

    updateDeck: function (table, parameters, id, callback) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;                    
            var setter = ""
            var columns = Object.keys(parameters)
            var values = Object.values(parameters)
            var i
            
            for (i=0; i<columns.length; i++){                
                var column = columns[i]                
                var value = values[i]
                setter += `${column}="${value}",`               
            }         
           
            setter = setter.slice(0,-1)
            var sqlQuery = `UPDATE ${table} set ${setter} where id=?`;
            var params = id
            console.log(sqlQuery + params)          
            
            connection.query(sqlQuery, params, function (err, result) {
                if (err) {
                    logger.error(err)
                    connection.release()
                    return callback(false)
                }                                  
                connection.release()
                logger.info(`deck ${parameters.name} updated successfully`)
                return callback(true);
            });
        })
    },

    getCardId: function (cardName, callback) {
        pool.getConnection(function(err, connection) {            
            var sql = `SELECT ID FROM cards WHERE name = ? `;            
            return connection.query(sql, cardName, (error, results, fields) => {
              if (error) {
                return logger.error(error.message);
              }
              connection.release();              
              if (results[0])
                return callback (results[0].ID);
              else
                return callback (false);
            });
        })      

    },

    getDeckByFormat: function (format, callback) {
        pool.getConnection(function(err, connection) {           
            var sql = "SELECT * FROM decks where format = ?"
            return connection.query(sql, format, (error, results, fields) => {
                if (error) {
                    return logger.error(error.message);
                }              
                connection.release();
                return callback (results);
            });
        })
    },

    getDecks: function (callback) {
        pool.getConnection(function(err, connection) {            
            var sql = "SELECT * FROM decks";            
            return connection.query(sql, (error, results, fields) => {
                if (error) {
                    return logger.error(error.message);
                }              
                connection.release();
                return callback (results);
            });
        })
    },

    getDeckList: function (deckId, callback) {
        var sql = "select cd.amount, cd.ID, c.Name, c.Type, c.Second_Type, c.Third_Type from cards_decks cd left join cards c on cd.CardID=c.ID where deckID = ?;";            
        try {            
            pool.query(sql,deckId, function(error, results, fields) {                
                if (error) {
                    return logger.error(error.message);
                }
                
                var deckList = []
                for (i = 0; i<results.length; i++ ) {
                    cardObject = {}
                    cardObject.name = results[i].Name
                    cardObject.id = results[i].ID
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
            logger.error(e + "error with db query")
            connection.release();
        }         
    },
 

    addUser: function (name, surname, email, username, password, birthdate, callback) {
        try {
            pool.getConnection(function(err, connection) {
                var sqlQuery = "INSERT INTO users (ID, Name, Surname, Email, Username, Password, Birthdate, Created_date) VALUES ?";
     
                var params = []
                var createdDate = new Date()
                var paramsValues = [0, name, surname, email, username, password, birthdate, createdDate]
                params.push(paramsValues)
                pool.query(sqlQuery, [params], function (err, result) {
                    if (err) throw err;
                    connection.release();                                
                    return callback ();
                });
            })      
        } catch (e) {
            logger.error(e + "error with db query")
            connection.release();
        }    
    },

    login: function (username, password, callback) {
        sqlQuery = "select * from users where username = ?"        
        pool.getConnection(function(err, connection) {
            pool.query(sqlQuery, username, function (err, result) {
                if (err) throw err;
                    connection.release();                           
                if (result.length > 0) {    
                    if (password === result[0].Password) {
                        
                        return callback (true);
                    }
                }                   
                return callback (false);
            })
        })

    },

    getBooks: function (callback) {
        pool.getConnection(function(err, connection) {           
            var sql = "SELECT * FROM books;"
            return connection.query(sql, (error, results, fields) => {
                if (error) {
                    return logger.error(error.message);
                }              
                connection.release();
                return callback (results);
            });
        })
    },

    setBookAsRead: function (bookId, userName, callback) {
        pool.getConnection(function(err, connection) {    
            var getUserIdQuery = "Select * from users where Username = ?"
            connection.query(getUserIdQuery, userName, function (err, results) {
                
                var userId = results[0].ID                
                var params = []
                var readDate = new Date()              
                var sqlQuery = "INSERT INTO readings (ID, user_id, book_id, read_date) VALUES ?";
                var paramsValues = [0, userId, bookId, readDate]
                params.push(paramsValues)
                connection.query(sqlQuery, [params], function (err, result) {
                    if (err) throw err;                                    
                    connection.release();
                    return callback("bookread inserted")
                });
            })
        });
    },
    
    getReadsForUser: function (user, callback) {
        pool.getConnection(function(err, connection) {         
            var getUserIdQuery = "Select * from users where Username = ?"            
            connection.query(getUserIdQuery, user, function (err, results) {
                var userId = results[0].ID 
                sqlQuery = `select * from readings where user_id = ?`
                connection.query(sqlQuery, userId, function (err, results) {
                    var booksRead = []
                    for (i=0; i<results.length; i++) {
                        booksRead.push(results[i].book_id)                        
                    }                    
                    return callback(booksRead)
                })
            })
        })
    }
}


module.exports = db;

