//Get articles
$.getJSON('/articles', function(data) {
	for (var i = 0; i < data.length; i++) {
		$("#articles").append("<div class='headcard'><h4><a href="+ data[i].link +">" + data[i].headline + 
			"</a><button class='btnComment' data-id='" + 
			data[i]._id + "'>Add Comment</button></h4><p>" + 
			data[i].summary + "</p></div>");
	}
});


$(document).ready(function() {

	$(document).on('click', '.btnComment', function(e){
		e.preventDefault();
		
		var id = $(this).data('id');
		$.ajax({
			method: 'GET',
			url: '/articles/' + id
		})
		.done(function(data){
			console.log(data.comment.body);
			//need to put saved notes here
			$('#commentsSection').append('<p>'+ data.comment.body + '</p>');
		});


		$('#myModalLabel').text("Comment for " + id);
		$('#saveComments').data('id', id);
		$("#myModal").modal('show');
	});


	$(document).on('click','#saveComments', function(e){
		e.preventDefault();
		var id = $('#saveComments').data('id');
		$.ajax({
			method: 'POST',
			url: '/articles/' + id,
			data: {
				body: $('#comment').val()  
			}
		})
		.done(function(data){
			console.log(data);
			$('#commentsSection').empty();
		});
		$('#comment').val('');
	})

	$(document).on('click', '#dismiss', function(e){
		$("#commentsSection").empty();
	});

});