const handleError = (message) => {
	$("#errorMessage").text(message);
	$("#popupMessage").animate({width:'toggle'},350);
};

const redirect = (response) => {
	$("popupMessage").animate({width:'hide'},350);
	window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: (xhr, status, err) => {
			let messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};