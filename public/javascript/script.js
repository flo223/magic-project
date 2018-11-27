$("#buttonAddCard").click(function() {  
    var deckId = $('#decks option:selected' ).val()
    
    if (!$('#addCardForm').is(':visible')) {
        $("#addCardForm").append(`<input type="text" id ="deckId" name="deckId" class="hide" value= ${deckId}>`);
    } else {
        $("#deckId").remove()
    }
    $("#addCardForm").toggle("slow");
    
    
    return false;
    
  });


$('#editPageAddCardForm').submit (function (e) {
    e.preventDefault();
    var form = $(this)
    var url = form.attr('action')
    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),                
        success: function(cardExists) {
        $('#confirmationMessage').children().remove()
            if (cardExists){
                $('#confirmationMessage').append('<span>Card inserted correctly</span>')
            } else {                
                $('#confirmationMessage').append('<span>Card does not exists</span>')
            }
        }

    })
})
$('#formats').change (function () {
    var formatName = $('#formats option:selected' ).val()
    $.ajax({
        type: "POST",
        url: "/getDeckByFormat",        
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ formatName: formatName }),
        dataType: "JSON",
        success: function(data) {
            $('#formats option[value=""]').remove()
            $('#decks').children().remove()
            $('#decks').append(`<option value="">Select a deck</option>`)
            for (element in data) {
                $('#decks').append(`<option value="${data[element].ID}">${data[element].name}</option>`)
            }
            
            $('#decksContainer').removeClass('hide');            
        }
    })
})


$('#decks').change (function () {
    
    var deckId = $('#decks option:selected' ).val()
    if(!$('#deckId').is(':visible')){
        $("#addCardForm").hide();
        $("#deckId").remove()
    }
    
    $.ajax({
        type: "POST",
        url: "/getDecks",
        data: JSON.stringify({ deckId: deckId }),
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        success: function(data) {
            var deckList = data.deckList
            var deckInfo = data.deckInfo 
           
            $('#decks option[value=""]').remove()           
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
