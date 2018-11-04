var setsJson = require ('./AllSets-x.json')
var fs = require('fs');
var formatJson = require('./data/format.json')

var extension = []
for (element in setsJson){
    var extensionObj = {}
    extensionObj["name"] = setsJson[element].name
    extensionObj["releaseDate"] = setsJson[element].releaseDate
    extension.push (extensionObj)    
}

function writeInJson(fileName, json) {
    fs.writeFile(fileName,JSON.stringify(json), function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 
}

function orderJson (json) {   
    var jsonOrdered = json.sort(function(a, b){
        var x = a.releaseDate.toLowerCase();
        var y = b.releaseDate.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });
    return jsonOrdered.reverse()
}

var orderedJson = orderJson (formatJson)
writeInJson("formatOrdered.json", orderedJson)