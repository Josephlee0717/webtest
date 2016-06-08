co.iplatform.ruleeditor.ws = {
		
		startTmpl:'<request><header><action value="start"/><debugid value="${debugid}" /></header><body/></request>',
		
		stopTmpl:'<request><header><action value="stop"/><debugid value="${debugid}" /></header><body/></request>',
		
		heartbeatTmpl:'<request><header><ip value="" /><action value="heartbeat"/></header><body/></request>',
		
		heartbeatTimer :null,
		
		websokect:null,
		
		wsUrl:"",
		
		isEnabled:false,
		
		isStart:false,
		
		init:function(url){
			
			if(!(window.WebSocket || window.MozWebSocket)){
				$('#debugServiceswitchBtn').switchbutton('disable');
				writeToConsole("your browse does not support webSocket.","error");
				return;
			}
			
			if(isNull(url)){
				$('#debugServiceswitchBtn').switchbutton('disable');
				writeToConsole("debug service is unavailable. Rootcause: remote server url is null.","error");
				return;
			}
			
			$('#debugServiceswitchBtn').switchbutton({
		        onChange: function(checked){
		        	co.iplatform.ruleeditor.ws.isStart= checked;
		        	if(checked){
		        		co.iplatform.ruleeditor.ws.startDebugService();
		        	}else {
		        		co.iplatform.ruleeditor.ws.stopDebugService();
		        		co.iplatform.localStorage.clearAll();
		        	}
		        }
		    });
			co.iplatform.ruleeditor.ws.wsUrl = url;
			
			$.template("startTmpl",co.iplatform.ruleeditor.ws.startTmpl);
			
			$.template("stopTmpl",co.iplatform.ruleeditor.ws.stopTmpl);
			
			$.template("heartbeatTmpl",co.iplatform.ruleeditor.ws.heartbeatTmpl);
			
			co.iplatform.ruleeditor.ws.createWs();
			
		},
		
		createWs:function(){
			var webSocketCls =  window.WebSocket || window.MozWebSocket;
			
			co.iplatform.ruleeditor.ws.websokect = new webSocketCls(co.iplatform.ruleeditor.ws.wsUrl);
			
			co.iplatform.ruleeditor.ws.websokect.onopen = function(){
				writeToConsole("connected to server :"+co.iplatform.ruleeditor.ws.wsUrl,"debug");
				co.iplatform.ruleeditor.ws.isEnabled = true;
				$('#debugServiceswitchBtn').switchbutton('enable');
				//create timer to send heartbeat
				co.iplatform.ruleeditor.ws.heartbeatTimer = self.setInterval(function(){
					co.iplatform.ruleeditor.ws.heartbeat();
				},10000);
				
			};
			
			co.iplatform.ruleeditor.ws.websokect.onerror = function(event){
//				writeToConsole("websocket occurd error +"+event,"error");
				writeToConsole("websocket can not connect to server ","error");
				co.iplatform.ruleeditor.ws.isEnabled = false;
				$('#debugServiceswitchBtn').switchbutton("uncheck");  
				$('#debugServiceswitchBtn').switchbutton('disable');
			};
			
			co.iplatform.ruleeditor.ws.websokect.onclose = function(){
				writeToConsole("websocket: close connection","error");
				co.iplatform.ruleeditor.ws.isEnabled = false;
				$('#debugServiceswitchBtn').switchbutton("uncheck");  
				$('#debugServiceswitchBtn').switchbutton('disable');
			};
			
			co.iplatform.ruleeditor.ws.websokect.onmessage = function(message){
				self.clearInterval(co.iplatform.ruleeditor.ws.heartbeatTimer);
				if(co.iplatform.ruleeditor.ws.isStart){
					$($.trim(message.data)).find("debug").each(function(index,ele){
						var debugInfo = $(ele).find("path").find("location").attr("id");
						if(!isNull(debugInfo)){
							writeToConsole("message coming:"+debugInfo,"debug");
							var filename = "";
							var pinfo ={page:'',target:[]};
							if(debugInfo.indexOf("#s")>0){//case 1 solute.vsd#s0.13-o2
								var info = debugInfo.split("#s");
								if(info.length!=2){
									return;
								}
								//solute.vsd#s0.13-o2
								//cyberobject/ntelagent/Document/Close_POTS_0225.vsd#s0.4-o5
								filename = info[0];
								var pageInfo = info[1].split(".");
								pinfo.page = pageInfo[0];
								
								if(pageInfo[1].indexOf("-")>0){
									pinfo.target.push(pageInfo[1].split("-")[1].substring(1));
								}else{
									pinfo.target.push(pageInfo[1]);
								}
							}else if(debugInfo.indexOf("#c-p")>0){//case 2 c-p0-4-9-o1-a1-vid-0-5 or c-p0-4-9
								var info = debugInfo.split("#c-p");
								if(info.length!=2){
									return;
								}
								filename = info[0];
								var info = info[1].split("-");
								pinfo.page = info[0];
								while(pinfo.target.length<2){
									var item = info.pop();
									if($.isNumeric(item)){
										pinfo.target.unshift(item);
									}
								}
							}
							//open file or send message to iframe
							var selectedNode = $('#fileTree').tree('getSelected');
							
							var fname = selectedNode.text;
							var nodeId= utf8to16(base64decode(selectedNode.path.replace(/[\r\n]/ig,'')));
//							var fnameArray = [];
//							fnameArray[0] =	fname.slice(0, fname.lastIndexOf('.'));
//							fnameArray[1] =	fname.slice(fname.lastIndexOf('.')+1);
//							
//							var filenameArray = [];
//							filenameArray[0] =	filename.slice(0, filename.lastIndexOf('.'));
//							filenameArray[1] =	filename.slice(filename.lastIndexOf('.')+1);
							
							if(filename.toLowerCase()==fname.toLowerCase()||filename.toLowerCase()==nodeId.toLowerCase()){
//							if(filenameArray[0].toLowerCase()==fnameArray[0].toLowerCase()){
								//push that debug info into loaclstorage
								co.iplatform.localStorage.set(fname,pinfo);
								writeToConsole("post message to iframe: " + $.toJSON(pinfo),"debug");
								//send to iframe
								var win = document.getElementById("visio_file_iframe").contentWindow;
								if(!isNull(win)){
									 win.postMessage($.toJSON(pinfo),"*");  
								}
							}else {
								co.iplatform.localStorage.set(filename.substring(filename.lastIndexOf("/")+1),pinfo);
								if(filename.split("/").length<=1){
									var anotherNode = nodeId.substring(0,nodeId.lastIndexOf("/")+1)+filename;
									var node = $("#fileTree").tree('find',anotherNode);
									if(node&&node.target){
										node.target.click();
									}
								}else {
									co.iplatform.ruleeditor.debugQueue.submit(filename,pinfo.page);
								}
							}
						}
					});
				}
				co.iplatform.ruleeditor.ws.heartbeatTimer = self.setInterval(function(){
					co.iplatform.ruleeditor.ws.heartbeat();
				},10000);
			};
		},
		
		send:function(msg){
			if(!co.iplatform.ruleeditor.ws.isEnabled){
				writeToConsole("can not send msg to debug service, Rootcause: websocket object is null or init failed.","error");
				return;
			}
			if(isNull(msg)){
				return;
			}
			co.iplatform.ruleeditor.ws.websokect.send(msg);
		},
		
		heartbeat:function(){
			if(!co.iplatform.ruleeditor.ws.isEnabled){
				return;
			}
			var msg = $($.tmpl("heartbeatTmpl",{})[0]).prop("outerHTML");
			co.iplatform.ruleeditor.ws.send(msg);
		},
		
		startDebugService:function(){
			var msg = $($.tmpl("startTmpl",{debugid:co.currentDebugId})[0]).prop("outerHTML");
			co.iplatform.ruleeditor.ws.send(msg);
		},
		
		stopDebugService:function(){
			var msg = $($.tmpl("stopTmpl",{debugid:co.currentDebugId})[0]).prop("outerHTML");
			co.iplatform.ruleeditor.ws.send(msg);
		}
};