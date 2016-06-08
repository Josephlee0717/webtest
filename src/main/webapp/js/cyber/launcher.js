$(function(){
	//step1, parse url
	//http://www.cyberobject.com:8082/iplatform-ruleeditor/?orgid=cyberobject&userid=admin@cyberobject.com&limit=100&key=e8dca82e706c46cb93e0dc2d6b1699a6
	co.serverURL = location.href.slice(0, location.href.lastIndexOf('/'));
	co.isInternalAddr = false;
	var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
	var host = window.location.host.split(":");
	var target = "";
	if(host.length>1){
		target = host[0];
	}
	if(reSpaceCheck.test(target)){
		co.isInternalAddr = true;
	}
	co.httpServiceUrl = co.serverURL+"/HttpService";
	co.developerUrl = co.serverURL+"/build/tr";

	var orgid = GetArgs(location.href, "orgid").replace("#", "");
	orgid = $.trim(orgid);
	if(isNull(orgid)){
		showErrWin("please provide organization id.");
		$("#err_win_ok").removeClass("show");
		return;
	}
	
	co.orgInfo.orgid = orgid;
	
	var userid = GetArgs(location.href, "userid").replace("#", "");
	userid = $.trim(userid);
	if(isNull(userid)){
		showErrWin("please provide your user id.");
		$("#err_win_ok").removeClass("show");
		return;
	}
	
	co.userInfo.userid = userid;
	
	var limit = GetArgs(location.href, "limit").replace("#", "");
	limit = $.trim(limit);
	if(isNull(limit)){
		showErrWin("please provide your authentication.");
		$("#err_win_ok").removeClass("show");
		return;
	}
	co.isAdmin = parseInt(limit.substring(0,1))==1?true:false;
	co.isInternal = parseInt(limit.substring(1,2))==1?true:false;
	co.isIndividual = parseInt(limit.substring(2,3))==1?true:false;
	
	var key = GetArgs(location.href, "key").replace("#", "");
	co.moduleKey = $.trim(key);
	
	//step2, setup ajax
	$.ajaxSetup({
		timeout:1000*60*60,
		error:function(xhr,msg,detail){
			var status = {};
			if(detail=='abort'){
				return;
			}
			showErrWin("The remote server is not available");
		}
	});
	
	window.addEventListener('message',function(e){
		co.iplatform.ruleeditor.ui.refreshDataNode(e.data);
	},false);
	
	//step3 request for init
	//a, query user info
	var requestParam = {
			url: co.developerUrl,
			action:"GetUser",
			params:{
				userid: co.userInfo.userid
			},
			success:function(data){
				if(data.body.result&&data.body.result.id){
					var user_result = data.body.result;
					co.userInfo.userid = user_result.id;
					co.userInfo.gender = user_result.gender;
					co.userInfo.securityQ = user_result.securityq;
					co.userInfo.securityA = user_result.securitya;
					//b, query org info
					var org_r_p = {
							url: co.developerUrl,
							action:"GetOrg",
							params:{
								orgid: co.orgInfo.orgid
							},			
							success:function(data){
								if(data.body.result&&data.body.result.id){
									var result = data.body.result;
									//set org info
									co.orgInfo.orgid = result.id;
									co.orgInfo.orgName = result.name;
									co.orgInfo.tel = result.phone;
									co.orgInfo.address = result.address;
									co.orgInfo.city = result.city;
									co.orgInfo.state = result.state;
									co.orgInfo.country = result.country;
									co.orgInfo.zip = result.zip;
									co.orgInfo.webSite = result.www;
									co.orgInfo.domain = result.domain;
									co.orgInfo.prefix = result.prefix;
									co.orgInfo.uri = result.uri;
									co.orgInfo.termPrefix = result.term_prefix;
									co.orgInfo.termUri = result.term_uri;
									//c, query fix_orgid and uri format
									var r_p = {
										url: co.developerUrl,
										action:"geturiformat",	
										success:function(data){
											co.orgInfo.fix_orgid = data.body.fix_orgid
											if(co.orgInfo.orgid==co.orgInfo.fix_orgid){
												co.orgInfo.app_format = data.body.app_format+"domain";
											}else {
												co.orgInfo.app_format = data.body.app_format+co.orgInfo.prefix ;
											}
											
											var r_p2 = {
													url: co.httpServiceUrl,	
													action:"compilePattern",
													success:function(data){
														$('#compilePattern').combo({
															required:false,
															editable:false
														});
														var current = data.body.current;
														var html = '';
														$.each(data.body.result,function(index,node){
															var isSelected = node==current?"checked":"";
															html +='<input type="radio" name="compilePattern" value="'+ node +'"'+ isSelected +'><span>'+ node +'</span><br/>';
															if(isSelected){
																$('#compilePattern').combo('setValue', node).combo('setText', node);
															}
														});
														$('#radioList').html(html);
														$('#compilePatternList').removeAttr("style");
														$('#compilePatternList').appendTo($('#compilePattern').combo('panel'));
														$('#compilePatternList input').click(function(){
															var v = $(this).val();
															var s = $(this).next('span').text();
															$('#compilePattern').combo('setValue', v).combo('setText', s).combo('hidePanel');
															var r_p3 = {
																	url: co.httpServiceUrl,	
																	action:"compilePattern",
																	success:function(data){
																		var current = data.body.current;
																		$("#compilePattern").val(current);
																	}
															};
															co.iplatform.request(r_p3);
														});
														co.iplatform.ruleeditor.init();
													}
												};
											co.iplatform.request(r_p2);
										}
									};
									co.iplatform.request(r_p);
								}else {
									showErrWin("please provide organization id.");
									$("#err_win_ok").removeClass("show");
								}
							}
					};
					co.iplatform.request(org_r_p);
				}
			}
	};
	co.iplatform.request(requestParam);
});