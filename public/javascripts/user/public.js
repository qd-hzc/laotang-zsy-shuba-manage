$(function() {

	$('#uploadForm').on('submit', function(evt) {
		evt.preventDefault();

		$('.progress').removeClass('hide');
		var formData = new FormData();
		var file = document.getElementById('myFile').files[0];
		formData.append('myFile', file);

		var xhr = new XMLHttpRequest();

		xhr.open('POST', '/', true);

		xhr.upload.onprogress = function(e) {
			if (e.lengthComputable) {
				var percentage = (e.loaded / e.total) * 100;
				$('.progress .progress-bar').css('width', percentage + '%');
			}
		};

		xhr.onerror = function(e) {
			showInfo('An error occurred while submitting the form. Maybe your file is too big');
		};

		xhr.onload = function() {
			if (xhr.status === 200) {
				$('.alert').removeClass('hide');
				$('.alert').addClass('alert-success');
				$('.message').text('上传成功！');
				console.log('上传成功');
			} else {
				$('.alert').removeClass('hide');
				$('.alert').addClass('alert-danger');
				$('.message').text('出错了……');
				console.log('出错了……');
			}
			
		};

		xhr.send(formData);

	});
	
});