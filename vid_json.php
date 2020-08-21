<?php

	header('Content-Type: application/json');

	include "./config.php";

	$smst_videos=$connection->prepare("SELECT * FROM videos WHERE show=true ORDER BY date DESC");
	$smst_videos->execute();
		$smst_arr = $smst_videos->fetchAll(PDO::FETCH_ASSOC);

	$smst_videos_count = 0;

	foreach($smst_arr as $type) {
		$smst_videos_count += count($type);
	}

	$smst_videos_columns = sizeof($smst_arr[0]);
	$rows = $smst_videos_count/$smst_videos_columns;

	$video_arr = array();

	for($i=0; $i<$rows; $i++) {
		$video_arr[$smst_arr[$i]['id']] = $smst_arr[$i];	
	}

	$json = json_encode($smst_arr);
	echo $json;

?>
