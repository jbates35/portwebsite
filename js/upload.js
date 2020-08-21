
$(document).ready(function() {
	$('#formuploadtype').on('change', function() {
		if(this.value=='project') {
			$(".projectc").show();
		} else {
			$(".projectc").hide();
		}
		if(this.value=='video') {
			$(".videoc").show();
		} else {
			$(".videoc").hide();
		}
	});
});
function readURL(input, imageid) {
	if(input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function(e) {
			$(imageid).attr('src', e.target.result);
		}

		reader.readAsDataURL(input.files[0]);
	}
}

function emptyFile(fileId, buttonId) {
	$(buttonId).click(function(e) {
		event.preventDefault();
		$(fileId).val('');
	});
}

function emptyImage(fileId, previewId, buttonId) {
	$(buttonId).click(function(e) {
		event.preventDefault();
		$(fileId).val('');
		$(previewId).attr('src', 'img/transspec.png');
	});
}

emptyFile('#fileUp_id_1', '#emptyFile_id_1');
emptyFile('#fileUp_id_2', '#emptyFile_id_2');
emptyFile('#fileUp_id_3', '#emptyFile_id_3');

emptyImage('#image1', '#preview1', '#emptyImage_id_1');
emptyImage('#image2', '#preview2', '#emptyImage_id_2');
emptyImage('#image3', '#preview3', '#emptyImage_id_3');
emptyImage('#image4', '#preview4', '#emptyImage_id_4');
emptyImage('#image5', '#preview5', '#emptyImage_id_5');
emptyImage('#image6', '#preview6', '#emptyImage_id_6');

emptyImage('#imgfileid', '#previewimg', '#emptyDispImg_id');


$("#imgfileid").change(function() {
	readURL(this, "#previewimg");
});
$("#image1").change(function() {
	readURL(this, "#preview1");
});
$("#image2").change(function() {
	readURL(this, "#preview2");
});
$("#image3").change(function() {
	readURL(this, "#preview3");
});
$("#image4").change(function() {
	readURL(this, "#preview4");
});
$("#image5").change(function() {
	readURL(this, "#preview5");
});
$("#image6").change(function() {
	readURL(this, "#preview6");
});
