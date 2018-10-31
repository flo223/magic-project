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
            $("#deckList").children().remove()
            $("#totalCards").children().remove()
            var cardSum = 0            
            for (element in data) {
                $("#deckList").append(`<li>${data[element].amount} ${data[element].name}</li>`);
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
