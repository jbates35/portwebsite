window.courseSelect = 0;

$(document).ready(function() {
	listVideos();
});

function listVideos() {
	$.getJSON("vid_json_admin.php", function(json) {
		if(json!="Nothing found.") {
			var vidCount=json.length;
			resetVideo();
			if(!window.courseSelect) {
				for(var i=0; i<=vidCount; i++) {
					writeVideo(i, json[i].id , json[i].title , json[i].ylink , json[i].description , json[i].subject, json[i].course , json[i].chapter , json[i].question , json[i].show); 
					if(i>0) {
						hideContent(json[i].id);
					}
					if(typeof editVideo === "function")
						editVideo(json[i].id, json[i].title);
					toggleContent(json[i].id);
				}
			} else {
				var j=0;
				for(var i=0; i<=vidCount; i++) {
					if(json[i].subject==window.courseSelect) {
						writeVideo(i, json[i].id , json[i].title , json[i].ylink , htmlSCReplace(json[i].description), json[i].subject, json[i].course , json[i].chapter , json[i].question); 
						if(j>0) {
							hideContent(json[i].id);
						}
						if(typeof editVideo === "function")
							editVideo(json[i].id, json[i].title);
						toggleContent(json[i].id);
						j++;
					}
				}
			}
		}
	});
}

function resetVideo() {
	$('#mainContainer_id').html(``);
}

function writeVideo(id_i, id, title, ylink, description, subjectid, course, chapter, question, show) {
	var subject;

	switch(subjectid) {
		case 1: 
			subject="Physics";
			break;
		case 2:
			subject="Math/Calculus";
			break;
		case 3:
			subject="Circuit Analysis";
			break;
		case 4:
			subject="Digital Techniques";
			break;
	}

	$('#mainContainer_id').append(`
		<div class="childContainer" id="childContainer_id`+id+`">		
			<div class="gridContainer" id="gridContainer_id`+id+`">
				<div class="titleDiv" id="titleDiv_id`+id+`">
					<h3>(`+subject+`) `+title+`</h3>
				</div>
				<div class="contentContainer" id="contentContainer_id`+id+`">	
					<div class="contentDiv" id="contentDiv_id`+id+`">
						<div class="youtubeDiv" id="youtubeDiv_id`+id+`">
							<iframe id="ytframe_id" class="ytframe" src="https://www.youtube.com/embed/`+ylink+`" allowfullscreen>
							</iframe>
						</div>
						<div class="courseDiv" id="courseDiv_id`+id+`">
							<b>Course:</b> `+course+`<br>
							<b>Chapter:</b> `+chapter+`<br>
							<b>Question:</b> `+question+`<br>
						</div>
						<div class="courseDiv_mob" id="courseDiv_mob_id`+id+`">
							<b>Course:</b> `+course+`;
							<b>Chapter:</b> `+chapter+`;
							<b>Question:</b> `+question+`
						</div>
						<div class="descriptionDiv" id="descriptionDiv_id`+id+`">
						`+description+`
						</div>
					</div>
				</div>
			</div>
		</div>
	`);
	
	if(show==false) {
		$('#gridContainer_id'+id).addClass("showFalse");
		$('#titleDiv_id'+id).addClass("titleFalse");
		$('#titleDiv_id'+id).append(`(Hidden)`);
	}
}

function hideContent(id) {
	$('#contentContainer_id'+id).addClass("showNone");
}

function toggleContent(id) {
	$('#titleDiv_id'+id).click(function() {
		$('#contentContainer_id'+id).slideToggle('500', 'linear');
	});
}

function htmlSCReplace(text) {
	var map = {
		'&amp;': '&',
		'&#038;': "&",
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#039;': "'",
		'&#8217;': "’",
		'&#8216;': "‘",
		'&#8211;': "–",
		'&#8212;': "—",
		'&#8230;': "…",
		'&#8221;': '”'
	};

	return text.replace(/\&[\w\d\#]{2,5}\;/g, function(m) { return map[m]; });
};

function switchSubject(divId, sub) {
	$('#'+divId).click(function() {
		$('#subjectContainer_id>button.courseSelected').removeClass("courseSelected");
		$('#'+divId).addClass("courseSelected");
		window.courseSelect=sub;
		listVideos();
	});
}

switchSubject('allSubjects_id', 0);
switchSubject('physics_id', 1);
switchSubject('math_id', 2);
switchSubject('circuits_id', 3);
switchSubject('digi_id', 4);


function editVideo(id, title) {
	$('#contentDiv_id'+id).append(`
		<div class="editDiv" id="editDiv_`+id+`">
			<button class="eButton" id="editVideo_id_`+id+`" onclick="editDirect(`+id+`)">Edit</button>|<button class="eButton" id="deleteVideo_id_`+id+`" onclick='deleteAlert(`+id+`, "`+title+`")'>Delete</a>
		</div>
	`);
}


function editDirect(id) {
	window.location.href="./edit.php?type=video&id="+id;
}

function deleteAlert(id, title) {
/*	var dA = confirm('Are you sure you want to delete video titled "'+title+'"?');
	if(dA==true) {*/
		window.location.href="./delete.php?type=video&id="+id;
// 	}
}		
