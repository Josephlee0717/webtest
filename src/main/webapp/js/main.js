joe.webtest.ui = {

	serverErrorHandle : function() {

	},

	systemErrorHandle : function(error) {
		art.dialog({
					content : error.message,
					cancelVal : 'Close',
					cancel : true
				});
	},

	requestFailureHandle : function(error) {
		art.dialog({
					content : error.message,
					cancelVal : 'Close',
					cancel : true
				});
	},

	init : function() {

	}

};

joe.webtest.manager = {
	userid : "",
	phonenumber : "",
	usertype : "",
	sessionid : "",
	verifyCode : "",
	verifyGraph : false,
	pageName : "",
	init : function() {
		if (!window.$) {
			return;
		}

	},

	pageLoad : function() {
		co.request({
			action : "user.getLoginData",
			body : {},
			success : function(data) {
				console.log(data);
				var result = data;
				if (result != undefined || result != null) {
					console.log(data);
				}
			}
		});
	}

}

$(function() {
	var htmlPos = window.location.href.indexOf(".html");

	var pageName = window.location.href.slice(window.location.href
					.lastIndexOf('/')
					+ 1, htmlPos);
	joe.webtest.manager.pageName = pageName;
	
	switch (joe.webtest.manager.pageName) {
		case "index" :
			$.getScript("css/body.css");
			$.getScript("../js/artDialog/skins/black.css?4.1.2");
			$.getScript("../js/artDialog/artDialog.source.js?skin=black");
			$.getScript("../js/judg.js");
			
			var data = localStorage.getItem("innerData");
			var json = joe.webtest.buildRequestParam(data);
			
			
			$("#appHeader").tmpl(json).appendTo("appContent");
			break;
		case "setUserInfor" :
			$.getScript("../js/Area.js");
			
			break;
		default :
			break;
	}

});