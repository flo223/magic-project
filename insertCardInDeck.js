var express = require('express');
var bodyParser = require('body-parser');
var db = require ('./db');
var $ = require ('jquery')



var app = express();
app.set('view engine', 'pug')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname+'/public'));

// parse application/json
app.use(bodyParser.json())
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));


app.get('/decks', function(req, res) {       
    db.getDecks(function (decks) {
        db.getDeckList(6, function (deckList) {            
            res.render('deckLists', { deckList: deckList, decks:decks });            
        }) 
    });
     
});

app.post('/getDecks', function(req, res) {
    db.getDecks(function (decks) {
        console.log(req.body.deckId)
        db.getDeckList(req.body.deckId, function (deckList) {          
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(deckList));            
            res.end();  
        }) 
    });
});

app.get('/form', function(req, res) {  
    res.setHeader('Content-Type', 'text/html');
    var card = req.query.card
    var amount = req.query.amount
    var deckNumber = req.query.deckNumber    
    res.render('insertCard', { card: card, amount: amount, deckNumber: deckNumber });    
});

app.get('/add-deck', function(req, res) {  
    var name = req.query.name
    res.setHeader('Content-Type', 'text/html');        
    res.render('addDeck', {name: name});    
});

app.post('/submit-deck', function(req, res) {  
    res.setHeader('Content-Type', 'text/html');    
    var name = req.body.name;
    var looses = parseInt(req.body.looses);
    var guild = req.body.guild;
    var wins = parseInt(req.body.wins);
    var format = req.body.format;
    var table = "decks"
    db.insertDeck(table, {"name":name, "guild":guild, "format":format, "looses":looses, "wins":wins })        
    res.redirect(`/add-deck?name=${name}`)   
});


app.post ('/send', function (req,res){    
    var cardName = req.body.card
    var amount = req.body.amount
    var deckNumber = req.body.deckNumber
    
    var cardId = db.getCardId ( cardName , function (result) {        
        if (result) {
            db.insert(result, amount, deckNumber)
            console.log (cardName +" inserted correctly")
        }            
        else
            console.log (cardName +" does not exists")
    })      
        
    res.redirect(`/form?card=${cardName}&amount=${amount}&deckNumber=${deckNumber}`)
})

app.listen(8080);