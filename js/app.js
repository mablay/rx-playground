$(document).ready(function(){
  console.log('[READY] Init');
  $('#tracker').text('asdf');

  // click stream
  var refreshButton = document.querySelector('.refresh');
  var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
  refreshClickStream.subscribe(function(event){
    console.log('[EVENT] User clicked refresh button');
  });


  // request stream
  var requestStream = refreshClickStream.startWith('startup click')
    .map(function() {
      var randomOffset = Math.floor(Math.random()*500);
      return 'https://api.github.com/users?since=' + randomOffset;
    });


  /// Response Stream
  var responseStream = requestStream.flatMap(function(requestUrl) {
    return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
  });

  responseStream.subscribe(function(response) {
    $('#debug').text(JSON.stringify(response,null,4));
    console.log('[SUB] response %o', response);
  });


  // Suggestion Stream
  var suggestionStream = responseStream.map(function(listUsers) {
    return [
      listUsers.splice(Math.floor(Math.random()*listUsers.length), 1).pop(),
      listUsers.splice(Math.floor(Math.random()*listUsers.length), 1).pop(),
      listUsers.splice(Math.floor(Math.random()*listUsers.length), 1).pop()
    ];
  });
  suggestionStream.subscribe(function(suggestion) {
    var names = suggestion.map(s => s.login);
    $('#tracker').html(names.join('<br>'));
    console.log('[SUGGESTION] Render %o', names);
  });



});