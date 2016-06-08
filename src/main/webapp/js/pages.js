/**
 * 
 */
joe.webtest.manager.pages ={
	loginPage :function(){
		$("#appContent").load(joe.webtest.manager.consumeName("consume/land.html"),function() {
			$("#loginBtn").click(function() {
				joe.webtest.manager.pages.findPage();
			})		
		});
	},
	
	findPage: function(){
		$("#appContent").load(joe.webtest.manager.consumeName("consume/infor.html"),function() {
			$("#loginBtn").click(function() {
				alert("adfads");
			})		
		});
	}
}