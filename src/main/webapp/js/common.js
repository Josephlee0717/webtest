if (!String.prototype.ltrim) {
	String.prototype.ltrim = function() {
		return this.replace(/^\s+/, "");
	}
}

String.prototype.trimn = function() {
	return this.trim().replace(/^[\n|\r\n]*|[\n|\r\n]*$/g, '');
}

String.prototype.replaceAll = function(s1, s2) {
	var r = new RegExp(s1.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
	return this.replace(r, s2);
}

function isNull(obj) {
	if (obj == null || obj == undefined || obj.length == 0)
		return true;
	return false;
}

joe = {
	requestTplStr:'{"action":"","body":{}}',	
	
	request:function(ops){
		if (!ops) {
			return;
		}
		
		ops.async = !(false === ops.async);
		
		if (!ops.params) {
			ops.params = {};
		}
		
		var d = joe.webtest.buildRequestParam(ops);
		var params = $.toJSON(d);
		$.ajax({
			type:  ops.method ? ops.method : 'POST',
			async: ops.async,
            url: joe.webtest.url,
            cache: false,
            
            data: {
				request : params
			},
			
            dataType: "json",
            
            success: function(data){
            	var status = data.status;
            	if(status == '0000'){
    				if (ops.success) {
    					ops.success(data);
    				}
            	}else if(status == '9999'){
            		if (!ops.systemErrorHandle) {
            			if(joe.webtest.ui.systemErrorHandle){
            				joe.webtest.ui.systemErrorHandle(data.error);
            			}
    					return;
    				}
    				ops.systemErrorHandle(data.error);
            	}else if(status == "9997"){
            		if (!ops.systemErrorHandle) {
            			if(joe.webtest.ui.systemErrorHandle){
            				joe.webtest.ui.systemErrorHandle(data.error);
            			}
    					return;
    				}
    				ops.systemErrorHandle(data.error);
            	}else {
            		if (!ops.requestFailureHandle) {
            			if(joe.webtest.ui.requestFailureHandle){
            				joe.webtest.ui.requestFailureHandle(data.error);
            			}
    					return;
    				}
    				ops.requestFailureHandle(data.error);
            	}
            },
            
            error: function(XMLHttpRequest, textStatus, errorThrown){
            	if (!ops.serverErrorHandle) {
            		if(joe.webtest.ui.serverErrorHandle){
            			joe.webtest.ui.serverErrorHandle();
            		}
					return;
				}
				ops.serverErrorHandle();
            }
            
         });
	}
};

joe.webtest = {
//		url :  (location.href.lastIndexOf('qiduwl.com/') >=0) ? (location.href.slice(0, location.href.lastIndexOf('qiduwl.com/'))+'qiduwl.com/HttpService'): (location.href.slice(0, location.href.lastIndexOf('datapersons/'))+'datapersons/HttpService'),
		url :  location.href.slice(0, location.href.lastIndexOf('webtest/'))+'webtest/HttpService',
		
		buildRequestParam : function(ops){
			var r = $.evalJSON(joe.requestTplStr);
			var requestParams = $.extend({},r);
			
			requestParams.action = ops.action;
			
			$.extend(requestParams.body,ops.body);
			
			if(joe.webtest.manager && joe.webtest.manager.sessionid && !isNull(joe.webtest.manager.sessionid)){
				requestParams.sessionid = joe.webtest.manager.sessionid;
			}
			
			return requestParams;
		},
		
		createRequestParam : function(action){
			var requestParams = $.extend({},joe.requestParamTpl);
			requestParams.action = action;
			return requestParams;
		}
};
