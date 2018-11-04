
$('#decks').change (function () {
    
    var deckId = $('#decks option:selected' ).val()
    
    $.ajax({
        type: "POST",
        url: "/getDecks",
        data: JSON.stringify({ deckId: deckId }),
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        success: function(data) {
            var deckList = data.deckList
            var deckInfo = data.deckInfo            
            $("#creatures").children().remove()
            $("#lands").children().remove()
            $("#spells").children().remove();
            $("#totalCards").children().remove()
            $("#deckEdit").children().remove()
            $("#deckInfo").children().remove()
            $("#lands").append("<strong>Lands:</strong>")
            $("#creatures").append("<strong>Creatures:</strong>")
            $("#spells").append("<strong>Spells:</strong>")
            $("#deckEdit").append(`<a href=update-deck?id=${deckId} class="button">Edit Deck</a>`)
            $("#deckInfo").append(`<span>Format: ${deckInfo.format} </span>`)
            $("#deckInfo").append(`<span>Guild: ${deckInfo.Guild} </span>`)
            $("#deckInfo").append(`<span>Wins: ${deckInfo.Wins} </span>`)
            $("#deckInfo").append(`<span>Looses: ${deckInfo.Looses} </span>`)
            var cardSum = 0            
            for (element in deckList) {
                console.log ("types are: " + deckList[element].types)
                if (deckList[element].types.includes("Land")) {                    
                    $("#lands").append(`<li>${deckList[element].amount} ${deckList[element].name}</li>`);
                }
                else if (deckList[element].types.includes("Creature"))             
                    $("#creatures").append(`<li>${deckList[element].amount} ${deckList[element].name}</li>`);
                else             
                    $("#spells").append(`<li>${deckList[element].amount} ${deckList[element].name}</li>`);
                cardSum += parseInt(deckList[element].amount)             
            }
            $("#totalCards").append(`<strong><span>Total ${cardSum} cards </span></strong>`)
        },
        error: function(err) {
          var msg = 'Status: ' + err.status + ': ' + err.responseText;
          alert(msg);
        }
    });      
})
