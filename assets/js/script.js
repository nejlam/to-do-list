//check a specific todos

 $('ul').on('click', 'li', function(event){
	$(this).toggleClass('completed');
	event.stopPropagation();
});



//delete a todo

$('ul').on('click', 'span', function(event) {
	$(this).parent().slideUp('fast', function(){
		$(this).remove()
	});
	event.stopPropagation();
});

//input a todo

$('input').keypress(function(event) {
	if (event.which == 13) {
	   event.preventDefault();
	   $('ul').append('<li style="display: none;"><span><i class="fas fa-trash"></i></span>' + $('input').val() + '</li>');
	   $('ul').find("li:last").slideDown("fast");  
	   $('input').val("");
	};
})


//toggle input

$('.fa-plus').on('click', function(event){
	$('input').slideToggle('fast')
})


