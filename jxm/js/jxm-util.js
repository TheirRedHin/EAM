
(function ($) {
	//设置选择功能，如：selectData('select-account', "../util/select-account.html", 'account_name', 'account_id');
	$.selectData = function(e, href, fname, fid, fcode){
		document.getElementById(fname).addEventListener('tap', function(){
			var param = {callbackWinId:mui.currentWebview.id, callbackEvent:e};
			jxm.open(href,{extras:{selectParams:param}});
  		});
  		var fc = document.getElementById(fcode);
  		window.addEventListener(e, function(event){
			var obj = event.detail;
			document.getElementById(fname).value = obj.dataname;
			if (fc) fc.value = obj.datacode;
			document.getElementById(fid).value = obj.dataid;
			
		});
		document.getElementById(fname).addEventListener('change', function(){
			if (this.value.length == 0) {
				if (fc) fc.value = '';
				document.getElementById(fid).value = '';
			}
		});
	},
  		
	//返回下拉选项的显示值
    $.getComboText = function(combo, value) {
		if (!combo || combo == null) {
			return '';
		}
		var text = '';
		mui.each(combo, function(n, c){
			if (value == c.value) {
				text = c.text;
				return text;
			}
		});
		return text;
	};
	
	//获取当前用户ID
	$.getUserId = function() {
		var json = localStorage.getItem('cur_user');
		var data = JSON.parse(json);
		var userId = '';
		if (data) userId = data.user_id;
		return userId;
	};
	
	//获取当前用户编号
	$.getUserCode = function() {
		var json = localStorage.getItem('cur_user');
		var data = JSON.parse(json);
		var userCode = '';
		if (data) userCode = data.user_code;
		return userCode;
	};
	
	//获取当前用户姓名
	$.getUserName = function() {
		var json = localStorage.getItem('cur_user');
		var data = JSON.parse(json);
		var userName = '';
		if (data) userName = data.user_name;
		return userName;
	};
	
	
	/**
	* 取当前日期, 格式：yyyy-mm-dd
	*/
	$.getToday = function(inc){
		var now = new Date();
       
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        if (inc != null) {
        	day = day + inc;
        }
       
        var clock = year + "-";
        if(month < 10)
            clock += "0";
        clock += month + "-";
        if(day < 10)
            clock += "0";
        clock += day;
        
        return(clock); 
	};
	
	/**
	* 取当前日期时间, 格式：yyyy-mm-dd HH:mm:ss
	*/
	$.getTodayTime = function(){
		var now = new Date();
       
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var ss = now.getSeconds();          //秒
       
        var clock = this.getToday();
        clock += " ";
        if(hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0'; 
        clock += mm + ":";
        if (ss < 10) clock += '0'; 
        clock += ss; 
        
        return(clock); 
	};
	
	$.getTodayTime2 = function(){
		var now = new Date();
       
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
       
        var clock = this.getToday();
        clock += " ";
        if(hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0'; 
        clock += mm;
        
        
        return(clock); 
	};
	
	/*
	 * 格式：yyyy-mm-dd
	 */
	$.format = function(date){
						
		var sep = "-";
			var year = date.getFullYear();
            var month =(date.getMonth() + 1).toString();
            var day = (date.getDate()).toString();
            if (month.length == 1) {
                month = "0" + month;
            }
            if (day.length == 1) {
                day = "0" + day;
            }
            return year+sep+month+sep+day;
		};
		
	$.format2 = function(date){
						
		var sep = "-";
		var sep2 = ":";
			var year = date.getFullYear();
            var month =(date.getMonth() + 1).toString();
            var day = (date.getDate()).toString();
            
            
            var hour  = date.getHours().toString(); 
      		var minute = date.getMinutes().toString() 
      		var second = date.getSeconds().toString(); 
            
            if (month.length == 1) {
                month = "0" + month;
            }
            if (day.length == 1) {
                day = "0" + day;
            }
            if (hour.length == 1) {
            	hour = '0' + hour;
            }
            if (minute.length == 1) {
            	minute = '0' + minute;
            }
            if (second.length == 1) {
            	second = '0' + second;
            }
            return year+sep+month+sep+day+" "+hour+sep2+minute+sep2+second;
		};
		$.format3 = function(date){
						
		var sep = "-";
		var sep2 = ":";
			var year = date.getFullYear();
            var month =(date.getMonth() + 1).toString();
            var day = (date.getDate()).toString();
            
            
            var hour  = date.getHours().toString(); 
      		var minute = date.getMinutes().toString() 
      		
            if (month.length == 1) {
                month = "0" + month;
            }
            if (day.length == 1) {
                day = "0" + day;
            }
            if (hour.length == 1) {
            	hour = '0' + hour;
            }
            if (minute.length == 1) {
            	minute = '0' + minute;
            }
           
            return year+sep+month+sep+day+" "+hour+sep2+minute;
		};
		$.date = function(date){
			if (date < 1 && date != 0) {
	  				return '0'+date;
	  			}
	  			else{
	  				return date;
	  			}
		};
	
return $;
})(jxm);