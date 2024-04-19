function readURL(input, imageid) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $(imageid).attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function emptyFile(fileId, buttonId) {
  $(buttonId).click(function(e) {
    event.preventDefault();
    $(fileId).val("");
  });
}

function emptyImage(fileId, previewId, buttonId) {
  $(buttonId).click(function(e) {
    event.preventDefault();
    $(fileId).val("");
    $(previewId).attr("src", "img/transspec.png");
  });
}

if (uploadtype == "project") {
  emptyFile("#fileUp_id_1", "#emptyFile_id_1");
  emptyFile("#fileUp_id_2", "#emptyFile_id_2");
  emptyFile("#fileUp_id_3", "#emptyFile_id_3");

  emptyImage("#image1", "#preview1", "#emptyImage_id_1");
  emptyImage("#image2", "#preview2", "#emptyImage_id_2");
  emptyImage("#image3", "#preview3", "#emptyImage_id_3");
  emptyImage("#image4", "#preview4", "#emptyImage_id_4");
  emptyImage("#image5", "#preview5", "#emptyImage_id_5");
  emptyImage("#image6", "#preview6", "#emptyImage_id_6");

  emptyImage("#imgfileid", "#previewimg", "#emptyDispImg_id");

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

  var fileDelete_1 = false;
  var fileDelete_2 = false;
  var fileDelete_3 = false;

  function fileToggle(id, fileButton, undoButton, fileOccDiv, fileFormDiv) {
    $(fileButton).click(function(e) {
      e.preventDefault();
      $(fileButton).fadeToggle(400);
      $(fileFormDiv).slideToggle(400);
      setTimeout(function() {
        $(undoButton).removeClass("noShow");
        $(fileOccDiv).addClass("crossThru");
      }, 500);
      switch (id) {
        case 1:
          fileDelete_1 = true;
          $("#fileDelete_1_id").val(`1`);
          break;
        case 2:
          fileDelete_2 = true;
          $("#fileDelete_2_id").val(`1`);
          break;
        case 3:
          fileDelete_3 = true;
          $("#fileDelete_3_id").val(`1`);
          break;
      }
    });

    $(undoButton).click(function(e) {
      e.preventDefault();
      $(fileButton).fadeToggle(400);
      $(fileFormDiv).slideToggle(400);
      $(undoButton).addClass("noShow");
      $(fileOccDiv).removeClass("crossThru");
      switch (id) {
        case 1:
          fileDelete_1 = false;
          $("#fileDelete_1_id").val(`0`);
          break;
        case 2:
          fileDelete_2 = false;
          $("#fileDelete_2_id").val(`0`);
          break;
        case 3:
          fileDelete_3 = false;
          $("#fileDelete_3_id").val(`0`);
          break;
      }
    });
  }

  fileToggle(
    1,
    "#fileDelButton1_id",
    "#fileUndoButton1_id",
    "#file1OccDiv_id",
    "#file1UpDiv_id",
  );
  fileToggle(
    2,
    "#fileDelButton2_id",
    "#fileUndoButton2_id",
    "#file2OccDiv_id",
    "#file2UpDiv_id",
  );
  fileToggle(
    3,
    "#fileDelButton3_id",
    "#fileUndoButton3_id",
    "#file3OccDiv_id",
    "#file3UpDiv_id",
  );

  var imgFileDelete_1 = false;
  var imgFileDelete_2 = false;
  var imgFileDelete_3 = false;
  var imgFileDelete_4 = false;
  var imgFileDelete_5 = false;
  var imgFileDelete_6 = false;

  if (imgFileUploaded_1) $("#childImgBox1_id").addClass("noShow");
  if (imgFileUploaded_2) $("#childImgBox2_id").addClass("noShow");
  if (imgFileUploaded_3) $("#childImgBox3_id").addClass("noShow");
  if (imgFileUploaded_4) $("#childImgBox4_id").addClass("noShow");
  if (imgFileUploaded_5) $("#childImgBox5_id").addClass("noShow");
  if (imgFileUploaded_6) $("#childImgBox6_id").addClass("noShow");

  function imageToggle(id, delButton, undoButton, overlayDiv, formDiv) {
    $(delButton).click(function(e) {
      e.preventDefault();
      $(delButton).fadeToggle(400);
      $(formDiv).slideToggle(400);
      $(overlayDiv).slideToggle(400);
      setTimeout(function() {
        $(undoButton).removeClass("noShow");
      }, 400);
      switch (id) {
        case 1:
          imgFileDelete_1 = true;
          $("#imgFileDelete_1_id").val(`1`);
          break;
        case 2:
          imgFileDelete_2 = true;
          $("#imgFileDelete_2_id").val(`1`);
          break;
        case 3:
          imgFileDelete_3 = true;
          $("#imgFileDelete_3_id").val(`1`);
          break;
        case 4:
          imgFileDelete_4 = true;
          $("#imgFileDelete_4_id").val(`1`);
          break;
        case 5:
          imgFileDelete_5 = true;
          $("#imgFileDelete_5_id").val(`1`);
          break;
        case 6:
          imgFileDelete_6 = true;
          $("#imgFileDelete_6_id").val(`1`);
          break;
      }
    });

    $(undoButton).click(function(e) {
      e.preventDefault();
      $(delButton).fadeToggle(400);
      $(formDiv).slideToggle(400);
      $(undoButton).addClass("noShow");
      $(overlayDiv).slideToggle(400);
      switch (id) {
        case 1:
          imgFileDelete_1 = false;
          $("#imgFileDelete_1_id").val(`0`);
          break;
        case 2:
          imgFileDelete_2 = false;
          $("#imgFileDelete_2_id").val(`0`);
          break;
        case 3:
          imgFileDelete_3 = false;
          $("#imgFileDelete_3_id").val(`0`);
          break;
        case 4:
          imgFileDelete_4 = false;
          $("#imgFileDelete_4_id").val(`0`);
          break;
        case 5:
          imgFileDelete_5 = false;
          $("#imgFileDelete_5_id").val(`0`);
          break;
        case 6:
          imgFileDelete_6 = false;
          $("#imgFileDelete_6_id").val(`0`);
          break;
      }
    });
  }

  imageToggle(
    1,
    "#childDelButton1_id",
    "#childUndoButton1_id",
    "#childOverlayDiv1_id",
    "#childImgBox1_id",
  );
  imageToggle(
    2,
    "#childDelButton2_id",
    "#childUndoButton2_id",
    "#childOverlayDiv2_id",
    "#childImgBox2_id",
  );
  imageToggle(
    3,
    "#childDelButton3_id",
    "#childUndoButton3_id",
    "#childOverlayDiv3_id",
    "#childImgBox3_id",
  );
  imageToggle(
    4,
    "#childDelButton4_id",
    "#childUndoButton4_id",
    "#childOverlayDiv4_id",
    "#childImgBox4_id",
  );
  imageToggle(
    5,
    "#childDelButton5_id",
    "#childUndoButton5_id",
    "#childOverlayDiv5_id",
    "#childImgBox5_id",
  );
  imageToggle(
    6,
    "#childDelButton6_id",
    "#childUndoButton6_id",
    "#childOverlayDiv6_id",
    "#childImgBox6_id",
  );
}
