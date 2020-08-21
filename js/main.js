$('#contactLinkId').click(function(e) {
	e.preventDefault();
	$('#contactDrop').toggleClass('show');	
	$('#wholeScreen_id').toggleClass('show');	
});

$('#wholeScreen_id').click(function() {
	$('#wholeScreen_id').toggleClass('show');	
	$('#contactDrop').toggleClass('show');
});

$(".homeDirect").click(function() {
	window.location.href="./";
});
