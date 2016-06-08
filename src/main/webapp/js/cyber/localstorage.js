co.iplatform.localStorage = {
		
		isEnabled:false,
		
		localKeys:[],
		
		init:function(){
			if(window.localStorage){
				co.iplatform.localStorage.isEnabled =  true;
			}else {
				co.iplatform.localStorage.isEnabled =  false;
			}
		},
		
		set:function(k,v){
			if(co.iplatform.localStorage.isEnabled){
				var json = co.iplatform.localStorage.get(k);
				if(!isNull(json)){//value == infos
					json.infos.push(v);
					localStorage.setItem(k,$.toJSON(json));
				}else {
					var j = {infos:[]};
					j.infos.push(v);
					localStorage.setItem(k,$.toJSON(j));
					co.iplatform.localStorage.localKeys.push(k);
				}
			}
		},
		
		get:function(k){
			if(co.iplatform.localStorage.isEnabled){
				var value = localStorage.getItem(k);
				if(isNull(value)){
					return null;
				}else {
					return $.evalJSON(value);
				}
			}
			return null;
		},
		
		remove:function(k){
			if(co.iplatform.localStorage.isEnabled){
				localStorage.removeItem(k);
			}
		},
		
		clearAll:function(){
//			while(co.iplatform.localStorage.localKeys.length>0){
//				var key = co.iplatform.localStorage.localKeys.shift();
//				co.iplatform.localStorage.remove(key);
//			}
			if(window.localStorage){
				localStorage.clear();
			}
		}
};