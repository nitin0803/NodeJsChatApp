var socket = io();

function scrollBottom () {
	var messages = jQuery('#allMessages');
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');

	if (clientHeight + scrollTop >=scrollHeight ) {
		console.log('should scroll down')
	}
}

socket.on('connect',function(){
  console.log("Chat.js : connected to server");
  var params = jQuery.deparam (window.location.search);
  
  socket.emit('join', params, function (err) {
  	if (err) {
  		alert (err);
  		window.location.href = './'
  	} else {
  		console.log('Chat.js : no error');
  	}
  });

  // socket.emit('createMessage', {
  //   from:"Client",
  //   text:"Hello All chatters"
  // }, function(data) {
  // 	console.log('Got it ', data);
  //})
  
});

socket.on('disconnect',function(){
  console.log("disconnected from server");
});

socket.on('updateUserList',function(recievedUserList){
  var ol = jQuery('<ol><ol>');
  recievedUserList.forEach ( function(user){
  	 console.log("Chat.js : User Name = " , user);
  	ol.append(jQuery('<li><li>').text(user));
  });
  jQuery('#users').html(ol);
  console.log("Chat.js : Users List " , recievedUserList);
});



socket.on('newMessage',function(recievedServerMessage){

  var template = jQuery('#message-template').html();
  var html = Mustache.render(template,{
  	from: recievedServerMessage.from,
  	text: recievedServerMessage.text
  });

  jQuery('#allMessages').append(html);
  scrollBottom ();
});

socket.on('newLocationMessage', function (locationMessage) {
	console.log( 'Chat.js : locationMessage', locationMessage)
	var template = jQuery('#location-template').html();
    var html = Mustache.render(template,{
    	from : locationMessage.from,
    	url  : locationMessage.url
    });

    jQuery('#allMessages').append(html);
    scrollBottom () ;
});



jQuery('#message-form').on('submit', function(e){
	e.preventDefault();
	var messgTxtBx = jQuery('[name=message]');

	socket.emit('createMessage',{
		// from: 'User',
		text: messgTxtBx.val()
	}, function() {		
		messgTxtBx.val('');
	});
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function() {

	if (!navigator.geolocation) {
		return alert ('Geolocation not supported by browser.') ;
	}

    locationButton.attr('disabled','disabled').text('Sending location');

	navigator.geolocation.getCurrentPosition( function (position){
		locationButton.removeAttr('disabled').text('Send location');
		socket.emit('createLocationMessage',{
			longitude : position.coords.longitude,
			latitude : position.coords.latitude
		});

		console.log(position);
	}, function(){
		locationButton.removeAttr('disabled').text('Send location');
		alert ('Unable to fetch location');
	});
})
