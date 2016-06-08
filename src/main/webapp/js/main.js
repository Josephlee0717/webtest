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
	ver:"20160607B",
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
	},
	
	consumeName:function(url){
		return url+"?ver="+joe.webtest.manager.ver;
	},
	
	getRandom:function(){
        joe.webtest.manager.ver = joe.webtest.manager.ver+"&p=" +  Math.floor(Math.random()*999+1);
    }
}

$(function() {
	var htmlPos = window.location.href.indexOf(".html");
	
	var pageName = window.location.href.slice(window.location.href
					.lastIndexOf('/')
					+ 1, htmlPos);
	joe.webtest.manager.pageName = pageName;
	
	joe.webtest.manager.getRandom();
	$("#termTree").treegrid({	
		url:'treegrid_data1.json',
		method: 'get',                
	    idField:'uri',
	    rownumbers: true,
	    height: 800,			    
	    treeField:'lemma',
	    columns:[[
			{field:'lemma',title:'Lemma',width:180,align:'left'},
			{field:'uri',title:'URI',width:360,align:'center'}
	    ]]
	});
	
	joe.webtest.manager.pages.loginPage();
	
	switch (joe.webtest.manager.pageName) {
		case "index" :
//			$.getScript("css/body.css");
//			$.getScript("../js/artDialog/skins/black.css?4.1.2");
//			$.getScript("../js/artDialog/artDialog.source.js?skin=black");
//			$.getScript("../js/judg.js");
//			
//			var data = localStorage.getItem("innerData");
//			var json = joe.webtest.buildRequestParam(data);
//			
//			
//			$("#firstPage").tmpl().appendTo("appContent");
			
			
			break;
		case "setUserInfor" :
			$.getScript("../js/Area.js");
			
			break;
		default :
			break;
	}
	
	

});