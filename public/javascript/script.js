console.log("show me the money")

$('#decks').change (function () {
    
    var deckId = $('#decks option:selected' ).val()
    
    $.ajax({
        type: "POST",
        url: "/getDecks",
        data: JSON.stringify({ deckId: deckId }),
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        success: function(data) {            
            $("#creatures").children().remove()
            $("#lands").children().remove()
            $("#totalCards").children().remove()
            $("#lands").append("<strong>Lands:</strong>")
            $("#creatures").append("<strong>Creatures:</strong>")
            $("#spells").append("<strong>Spells:</strong>")
            var cardSum = 0            
            for (element in data) {
                console.log ("types are: " + data[element].types)
                if (data[element].types.includes("Land")) {                    
                    $("#lands").append(`<li>${data[element].amount} ${data[element].name}</li>`);
                }
                else if (data[element].types.includes("Creature"))             
                    $("#creatures").append(`<li>${data[element].amount} ${data[element].name}</li>`);
                else             
                    $("#spells").append(`<li>${data[element].amount} ${data[element].name}</li>`);
                cardSum += parseInt(data[element].amount)             
            }
            $("#totalCards").append(`<strong><span>Total ${cardSum} cards </span></strong>`)
        },
        error: function(err) {
          var msg = 'Status: ' + err.status + ': ' + err.responseText;
          alert(msg);
        }
    });      
})
