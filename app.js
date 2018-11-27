var express = require('express');
var bodyParser = require('body-parser');
var db = require ('./db');
var setsJson = require ('./data/formatOrdered.json')

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
        res.render('deckLists', { decks:decks, formats:setsJson });         
    });     
});

app.get('/update-deck', function(req, res) {       
    id = 0
    if (req.query.id) {
        id = parseInt(req.query.id) - 1
    }
    db.getDecks(function (decks) { 
        //We don't want to show null in the fields of the update form. Display empty field instead.
        for (element in decks[id]) {
            if (decks[id][element] === null)
                decks[id][element] = ""
        }
        res.render('updateDeck', {deck:decks[id], success:req.query.success})
    });
});

app.post('/update-deck', function(req, res) {       
    var name = req.body.name;
    var looses = parseInt(req.body.looses);
    var guild = req.body.guild;
    var wins = parseInt(req.body.wins);
    var format = req.body.format;
    var table = "decks"
    var id = parseInt(req.body.id);
    db.updateDeck(table, {"name":name, "guild":guild, "format":format, "looses":looses, "wins":wins }, id, function(result){
        res.redirect(`/update-deck?id=${id}&success=${result}`) 
    })
        
});

app.post('/getDeckByFormat', function(req,res) {
    var format = req.body.formatName    
    db.getDeckByFormat(format, function (deckByFormat) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(deckByFormat));            
        res.end();
    })
})

app.post('/getDecks', function(req, res) {
    db.getDecks(function (decks) {
        var deckId = req.body.deckId       
        db.getDeckList(req.body.deckId, function (deckList) {          
            res.writeHead(200, { 'Content-Type': 'application/json' });
            var deck = {}
            deck["deckList"] = deckList            
            deck["deckInfo"] = decks[parseInt(deckId - 1)]            
            res.write(JSON.stringify(deck));            
            res.end();  
        }) 
    });
});

app.get('/add-card', function(req, res) {  
    res.setHeader('Content-Type', 'text/html');
    var card = req.query.card
    var amount = req.query.amount
    var deckNumber = req.query.deckNumber
    var cardExists = req.query.cardExists     
    res.render('insertCard', { card: card, amount: amount, deckNumber: deckNumber, cardExists:cardExists });    
});

app.get('/add-deck', function(req, res) {  
    var name = req.query.name
    var extensionNames = []
    for (element in setsJson){
        extensionNames.push (setsJson[element].name)        
    }
    
    res.setHeader('Content-Type', 'text/html');        
    res.render('addDeck', {name: name, extensionNames: extensionNames});    
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


app.post ('/submit-card', function (req,res){    
    var cardName = req.body.card
    var amount = req.body.amount
    var deckNumber = req.body.deckId
    
    var cardId = db.getCardId ( cardName , function (cardId) {        
        if (cardId) {
            var cardExists="true"  
            db.insert(cardId, amount, deckNumber, function (result){                
                if (result === "updated") 
                    console.log (cardName +" amount updated correctly")
                else if (result ==="inserted")
                    console.log (cardName +" inserted correctly")
            })                     
        }            
        else {
            console.log (cardName +" does not exists")
            var cardExists="false"
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        
        res.write(cardExists);            
        res.end();
        //res.redirect(`/add-card?card=${cardName}&amount=${amount}&deckNumber=${deckNumber}&cardExists=${cardExists}`)
        
    })
        
        
})

app.get('/add-book', function(req, res) {   
    var title = req.query.title
    res.setHeader('Content-Type', 'text/html');
    var genders = ["Policier", "Drame"]               
    res.render('addBook', {genders:genders, title:title});    
});

app.post('/submit-book', function(req, res) {   
    res.setHeader('Content-Type', 'text/html');    
    var title = req.body.title;
    var author = req.body.author;    
    var year = req.body.year;
    if (!year)
        year = null
    var description = req.body.description;
    var category = req.body.category;
    var table = "books"
    db.insertDeck(table, {"Title":title, "Author":author, "Description":description, "Category":category, "Published_Year":year })        
    res.redirect(`/add-book?title=${title}`)       
});

app.get('/test', function (req, res) {
    res.render('test')
})

app.listen(8080);