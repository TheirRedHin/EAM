SpQuery = {
	//显示任务状态
	onQueryTask: function(scan_id,bdcall){
		var where="scan_id=?";
		var sql = 'SELECT scan_state FROM sp_scan_det WHERE ' + where + ' GROUP BY scan_state';
		JxDao.query(sql, [scan_id], function(json){
			json=JSON.stringify(json);
			json=JSON.parse(json);
			if(json.length==1 && json[0].scan_state==1){
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").innerText="已下载";	
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").classList.remove('mui-badge-warning');
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").classList.add('mui-badge-purple');
			}
			if(json.length==1 && json[0].scan_state==2){
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").innerText="盘点中";	
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").classList.remove('mui-badge-warning mui-badge-purple');
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").classList.add('mui-badge-success');
			}
			if(json.length==1 && json[0].scan_state==3){
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").innerText="已上传";	
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").classList.remove('mui-badge-warning mui-badge-purple mui-badge-success');
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").classList.add('mui-badge-danger');
			}
			if(json.length==2){		
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").innerText="盘点中";	
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").classList.remove('mui-badge-warning mui-badge-purple');
				document.getElementById(scan_id).querySelector("span[name='downloadscan']").classList.add('mui-badge-success')
			}
			if(bdcall)bdcall(scan_id);
		});
	},
	onQueryTask1: function(scan_id){
		var where="scan_id=?";
		var sql = 'SELECT scan_state FROM sp_scan_det WHERE ' + where + ' GROUP BY scan_state';
		JxDao.query(sql, [scan_id], function(json){
			json=JSON.stringify(json);
			json=JSON.parse(json);
			if(json.length==1 && json[0].scan_state==3){
//				document.getElementById("scan").setAttribute("style","display:none");
//				document.getElementById("uploadscan").setAttribute("style","display:none");
			//	var rhtml = document.querySelector("#de_re option[value='2']").innerHTML;
			//	var ohtml = document.getElementById("de_re").innerHTML;
			//	document.getElementById("de_re").innerHTML = ohtml.replace(rhtml,"");
			}
			

		});
	},
	
	//显示不同类型的数据
    onQueryData: function(ct, btn, isped,scan_id) {
//  	console.log('000')
		var me = this;
		
		if (isped) {	
			 		var t = btn.innerText;
			 		if (t.indexOf('未盘') >= 0) {
						this.showData("isscan = '0' and scan_id=?", 1,scan_id);
					} else if (t.indexOf('正常') >= 0) {
						this.showData("isscan = '1' and ismore = '0' and scan_id=?", 1,scan_id);
					} else if(t.indexOf('盘盈') >= 0){
						this.showData("isscan = '1' and ismore = '1' and scan_id=?", 1,scan_id);
					}else{
						this.showData("isscan = '1' and ismore = '2' and scan_id=?", 1,scan_id);
					}
	
		}
    },
		//从本地数据库中读取数据
	showData: function(where, pageIndex,scan_id) {
		//先清空数据
		document.getElementById("pageinfo").setAttribute("currentPage",'');
		document.getElementById("pageinfo").setAttribute("currentWhere",'');
		
		//当前页面序号
		document.getElementById("pageinfo").setAttribute("currentPage",pageIndex);
		document.getElementById("pageinfo").setAttribute("currentWhere",where);
		
		var sql = 'SELECT * FROM sp_scan_det WHERE ' + where + ' ORDER BY sp_code';
		JxDao.query(sql, [scan_id], function(json){
			json=JSON.stringify(json);
			json=JSON.parse(json);
			console.log('-----'+JSON.stringify(json));
			//根据查询条件判断将HTML拼接到哪里
			//未盘
			if(where.indexOf("isscan = '0'")==0){
				var htm ="<tr><td style='width:30%;'>备件编号</td><td style='width:40%;'>备件名称</td><td style='width:30%;'>库位</td><td style='display:none'>id</td></tr>";
				for(var i=0;i<json.length;i++){
					var html="<tr><td>"+json[i].sp_code+"</td><td>"+json[i].sp_name+"</td><td>"+json[i].stock_name+"</td><td style='display:none'>"+json[i].scan_det_id+"</td></tr>"
					htm += html;
				}
				document.getElementById("item1-table").innerHTML =htm;
				
				//给每行添加点击事件
				mui('#item1-table tbody').on('click','tr', function (e) {
					
					var e = e || window.event;
				    var target = e.target || e.srcElement;
				    if(target.tagName.toLowerCase() == "td") {
				        var rowIdx = target.parentNode.rowIndex ;
						console.log("第 " + rowIdx + " 行");
						if (rowIdx == 0) {
							return false;
						}
						var device_code = $("#item1-table tr:eq("+rowIdx+") td:eq(0)").text();
						var scan_det_id = $("#item1-table tr:eq("+rowIdx+") td:eq(3)").text();
						console.log(scan_det_id);
						console.log(device_code);
						jxm.open('sp-scan.html',{extras:{device_code:device_code,scan_det_id:scan_det_id}});
						
//						jxm.open('sp-scan.html',{extras:{device_code:device_code}});
				    }
//					alert(9)
				    
				});
			}
			//正常
			else if(where.indexOf("isscan = '1' and ismore = '0'")>=0){
				var htm ="<tr><td style='width:30%;'>备件编号</td><td style='width:40%;'>备件名称</td><td style='width:30%;'>库位</td><td style='display:none'>id</td></tr>";
				for(var i=0;i<json.length;i++){
					var html="<tr><td>"+json[i].sp_code+"</td><td>"+json[i].sp_name+"</td><td>"+json[i].stock_name+"</td><td style='display:none'>"+json[i].scan_det_id+"</td></tr>"
					htm += html;
				}
				document.getElementById("item2-table").innerHTML =htm;
				
				//给每行添加点击事件
				mui('#item2-table tbody').on('click','tr', function (e) {
					
					var e = e || window.event;
				    var target = e.target || e.srcElement;
				    if(target.tagName.toLowerCase() == "td") {
				        var rowIdx = target.parentNode.rowIndex ;
						console.log("第 " + rowIdx + " 行");
						if (rowIdx == 0) {
							return false;
						}
						var scan_det_id = $("#item2-table tr:eq("+rowIdx+") td:eq(3)").text();
						console.log(scan_det_id);
						jxm.open('sp-scan.html',{extras:{scan_det_id:scan_det_id}});
				    }
				    
				});
			}
			//盘盈
			else if(where.indexOf("isscan = '1' and ismore = '1'")>=0){
				var htm ="<tr><td style='width:30%;'>备件编号</td><td style='width:40%;'>备件名称</td><td style='width:30%;'>库位</td><td style='display:none'>id</td></tr>";
				for(var i=0;i<json.length;i++){
					var html="<tr><td>"+json[i].sp_code+"</td><td>"+json[i].sp_name+"</td><td>"+json[i].stock_name+"</td><td style='display:none'>"+json[i].scan_det_id+"</td></tr>"
					htm += html;
				}
				document.getElementById("item3-table").innerHTML = htm;
				
				//给每行添加点击事件
				mui('#item3-table tbody').on('click','tr', function (e) {
					
					var e = e || window.event;
				    var target = e.target || e.srcElement;
				    if(target.tagName.toLowerCase() == "td") {
				        var rowIdx = target.parentNode.rowIndex ;
						console.log("第 " + rowIdx + " 行");
						if (rowIdx == 0) {
							return false;
						}
						var scan_det_id = $("#item3-table tr:eq("+rowIdx+") td:eq(3)").text();
						console.log(scan_det_id);
						jxm.open('sp-scan.html',{extras:{scan_det_id:scan_det_id}});
				    }
				    
				});
				
			}
			//盘亏
			else{
				var htm ="<tr><td style='width:30%;'>备件编号</td><td style='width:40%;'>备件名称</td><td style='width:30%;'>库位</td><td style='display:none'>id</td></tr>";
				for(var i=0;i<json.length;i++){
					var html="<tr><td>"+json[i].sp_code+"</td><td>"+json[i].sp_name+"</td><td>"+json[i].stock_name+"</td><td style='display:none'>"+json[i].scan_det_id+"</td></tr>"
					htm += html;
				}
				document.getElementById("item4-table").innerHTML = htm;
				
				//给每行添加点击事件
				mui('#item4-table tbody').on('click','tr', function (e) {
					
					var e = e || window.event;
				    var target = e.target || e.srcElement;
				    if(target.tagName.toLowerCase() == "td") {
				        var rowIdx = target.parentNode.rowIndex ;
						console.log("第 " + rowIdx + " 行");
						if (rowIdx == 0) {
							return false;
						}
						var scan_det_id = $("#item4-table tr:eq("+rowIdx+") td:eq(3)").text();
						console.log(scan_det_id);
						jxm.open('sp-scan.html',{extras:{scan_det_id:scan_det_id}});
				    }
				    
				});
				
			}
		}, 50, pageIndex);
		//修改分页信息
		var psql = 'SELECT count(*) as cnt FROM sp_scan_det WHERE ' + where + ' ORDER BY sp_code';
		this.updatePage(psql, pageIndex,scan_id);
	},
	//统计清单数量，显示到标签中
	groupData: function(scan_id) {
		var me = this;
		var sql = 'SELECT isscan, ismore, count(*) as cnt FROM sp_scan_det where scan_id=? GROUP BY isscan, ismore';
		JxDao.query(sql, [scan_id], function(json){
			json=JSON.stringify(json);
			json=JSON.parse(json);
			var wp = 0, yp = 0, py = 0, pk = 0;
			if (json && json.length > 0) {
				for (var i = 0; i < json.length; i++) {
					if (json[i].isscan == '0') wp = json[i].cnt;
					if (json[i].isscan == '1' && json[i].ismore == '0') yp = json[i].cnt;
					if (json[i].isscan == '1' && json[i].ismore == '1') py = json[i].cnt;
					if (json[i].isscan == '1' && json[i].ismore == '2') pk = json[i].cnt;
				}
			}
			document.querySelector("a[href='#item1']").innerText= "未盘("+wp+")";
			document.querySelector("a[href='#item2']").innerText = "正常("+yp+")";
			document.querySelector("a[href='#item3']").innerText= "盘盈("+py+")";
			document.querySelector("a[href='#item4']").innerText= "盘亏("+pk+")";
		});
	},
	//修改分页信息
	updatePage : function(psql, pageIndex,scan_id) {
		var me = this;
		JxDao.query(psql, [scan_id], function(json){
			var cnt = json[0].cnt;//总记录数
			var pageNum = Math.floor(cnt / 50);//总页数
			if (pageNum*50 < cnt) pageNum++;
			if (cnt == 0) pageIndex = 0;
			//如果小于50条就不显示分页栏
			if(cnt<50){
				document.getElementById("onPre").setAttribute("style","display:none");
				document.getElementById("onNext").setAttribute("style","display:none");
				document.getElementById("li_page").setAttribute("style","display:none");
			}else{
				document.getElementById("onPre").setAttribute("style","display:inline");
				document.getElementById("onNext").setAttribute("style","display:inline");
				document.getElementById("li_page").setAttribute("style","display:inline");
			}
			var info = pageIndex + '/' + pageNum;
			document.getElementById("page").innerText = info;
			JxDao.getParam('scan_code', function(data){
				var scan_header="单号 "+data;
				document.getElementById("scan_code").innerText= scan_header;
			});
			//设置上、下一页的disabled属性
			pageIndex <= 1?document.getElementById("onPre").classList.add("mui-disabled"):document.getElementById("onPre").classList.remove("mui-disabled");
			pageIndex == pageNum?document.getElementById("onNext").classList.add("mui-disabled"):document.getElementById("onNext").classList.remove("mui-disabled");
		});
	},
	//显示上一页数据
	onPrePage: function() {
		var currentPage=parseInt(document.getElementById("pageinfo").getAttribute("currentPage"));
		var currentWhere=document.getElementById("pageinfo").getAttribute("currentWhere");
		var scan_id=document.getElementById("scan_id").value;
		if (currentPage < 2)return;
		this.showData(currentWhere, currentPage - 1,scan_id);
	},
	//显示下一页数据
	onNextPage: function() {
		var currentPage=parseInt(document.getElementById("pageinfo").getAttribute("currentPage"));
		var currentWhere=document.getElementById("pageinfo").getAttribute("currentWhere");
		var scan_id=document.getElementById("scan_id").value;
		//当前页面序号
		var index = currentPage + 1;
		var page=document.getElementById("page").innerText;
		var totalPage=parseInt(page.substring(page.indexOf('/')+1,page.length));
		if(index > totalPage)return;
		this.showData(currentWhere, index,scan_id);
	}
}
