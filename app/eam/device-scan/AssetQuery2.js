AssetQuery = {
	//显示任务状态
	onQueryTask: function(bind_id,bdcall){
		var where="bind_id=?";
		var sql = 'SELECT isbind FROM device_bind_det WHERE ' + where + ' GROUP BY isbind';
		JxDao.query(sql, [bind_id], function(json){
			json=JSON.stringify(json);
			json=JSON.parse(json);
			if(json.length==1 && json[0].isbind==1){
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").innerText="已下载";	
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").classList.remove('mui-badge-warning');
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").classList.add('mui-badge-purple');
			}
			if(json.length==1 && json[0].isbind==2){
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").innerText="盘点中";	
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").classList.remove('mui-badge-warning mui-badge-purple');
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").classList.add('mui-badge-success');
			}
			if(json.length==1 && json[0].isbind==3){
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").innerText="已上传";	
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").classList.remove('mui-badge-warning mui-badge-purple mui-badge-success');
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").classList.add('mui-badge-danger');
			}
			if(json.length==2){		
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").innerText="盘点中";	
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").classList.remove('mui-badge-warning mui-badge-purple');
				document.getElementById(bind_id).querySelector("span[name='downloadscan']").classList.add('mui-badge-success')
			}
			if(bdcall)bdcall(bind_id);
		});
	},
	onQueryTask1: function(bind_id){
		var where="bind_id=?";
		var sql = 'SELECT isbind FROM device_bind_det WHERE ' + where + ' GROUP BY isbind';
		JxDao.query(sql, [bind_id], function(json){
			json=JSON.stringify(json);
			json=JSON.parse(json);
			if(json.length==1 && json[0].isbind==3){
//				document.getElementById("scan").setAttribute("style","display:none");
//				document.getElementById("uploadscan").setAttribute("style","display:none");
			//	var rhtml = document.querySelector("#de_re option[value='2']").innerHTML;
			//	var ohtml = document.getElementById("de_re").innerHTML;
			//	document.getElementById("de_re").innerHTML = ohtml.replace(rhtml,"");
			}
			

		});
	},
	
	//显示不同类型的数据
    onQueryData: function(ct, btn, isped,bind_id) {
		var me = this;
		
		if (isped) {	
			 		var t = btn.innerText;
			 		if (t.indexOf('未绑') >= 0) {
						this.showData("isbind = '0' and bind_id=?", 1,bind_id);
					} else if (t.indexOf('已绑') >= 0) {
						this.showData("isbind = '1' and bind_id=?", 1,bind_id);
					} 
//					else if(t.indexOf('盘盈') >= 0){
//						this.showData("isbind = '1' and ismore = '1' and bind_id=?", 1,bind_id);
//					}else{
//						this.showData("isbind = '1' and ismore = '2' and bind_id=?", 1,bind_id);
//					}
	
		}
    },
		//从本地数据库中读取数据
	showData: function(where, pageIndex,bind_id) {
		//先清空数据
		document.getElementById("pageinfo").setAttribute("currentPage",'');
		document.getElementById("pageinfo").setAttribute("currentWhere",'');
		
		//当前页面序号
		document.getElementById("pageinfo").setAttribute("currentPage",pageIndex);
		document.getElementById("pageinfo").setAttribute("currentWhere",where);
		
		var sql = 'SELECT * FROM device_bind_det WHERE ' + where + ' ORDER BY device_code';
		JxDao.query(sql, [bind_id], function(json){
			json=JSON.stringify(json);
			json=JSON.parse(json);
			console.log('---json--'+JSON.stringify(json));
		//根据查询条件判断将HTML拼接到哪里
			//
			if(where.indexOf("isbind = '0'")==0){
				var htm ="<tr><td style='width:30%;'>设备编号</td><td style='width:40%;'>设备名称</td><td style='width:30%;'>状态</td><td style='display:none'>id</td></tr>";
				for(var i=0;i<json.length;i++){
//					if(json[i].use_state=="1")json[i].use_state="在用";
//					if(json[i].use_state=="2")json[i].use_state="停用";
//					if(json[i].use_state=="3")json[i].use_state="封存";
//					if(json[i].use_state=="4")json[i].use_state="闲置";
					var use_state = jxm.getComboText(ComboData.usestate, json[i].use_state);
					var html="<tr><td>"+json[i].device_code+"</td><td>"+json[i].device_name+"</td><td>"+use_state+"</td><td style='display:none'>"+json[i].bind_det_id+"</td></tr>"
					htm += html;
				}
				document.getElementById("item1-table").innerHTML =htm;
				
				mui('#item1-table tbody').on('click','tr', function (e) {
					
					var e = e || window.event;
				    var target = e.target || e.srcElement;
				    if(target.tagName.toLowerCase() === "td") {
				        var rowIdx = target.parentNode.rowIndex ;
						console.log("第 " + rowIdx + " 行");
						if (rowIdx == 0) {
							return false;
						}
						var device_code = $("#item1-table tr:eq("+rowIdx+") td:eq(3)").text();
						console.log(device_code);
						jxm.open('bind-det-from.html',{extras:{device_code:device_code,weipan:'wp'}});
				    }
				});
				
			}
			//已绑
			else if(where.indexOf("isbind = '1'")>=0){
				var htm ="<tr><td style='width:30%;'>设备编号</td><td style='width:40%;'>设备名称</td><td style='width:30%;'>状态</td><td style='display:none'>id</td></tr>";
				for(var i=0;i<json.length;i++){
//					if(json[i].use_state=="1")json[i].use_state="在用";
//					if(json[i].use_state=="2")json[i].use_state="停用";
//					if(json[i].use_state=="3")json[i].use_state="封存";
//					if(json[i].use_state=="4")json[i].use_state="闲置";
					var use_state = jxm.getComboText(ComboData.usestate, json[i].use_state);
					var html="<tr><td>"+json[i].device_code+"</td><td>"+json[i].device_name+"</td><td>"+use_state+"</td><td style='display:none'>"+json[i].bind_det_id+"</td></tr>"
					htm += html;
				}	 
				document.getElementById("item2-table").innerHTML =htm;
				
				mui('#item2-table tbody').on('click','tr', function (e) {
					
					var e = e || window.event;
				    var target = e.target || e.srcElement;
				    if(target.tagName.toLowerCase() === "td") {
				        var rowIdx = target.parentNode.rowIndex ;
						console.log("第 " + rowIdx + " 行");
						if (rowIdx == 0) {
							return false;
						}
						var device_code = $("#item2-table tr:eq("+rowIdx+") td:eq(3)").text();
						console.log(device_code);
						jxm.open('bind-det-from.html',{extras:{device_code:device_code}});
				    }
				});
			
			
			}
		}, 50, pageIndex);
		//修改分页信息
		var psql = 'SELECT count(*) as cnt FROM device_bind_det WHERE ' + where + ' ORDER BY device_code';
		this.updatePage(psql, pageIndex,bind_id);
	},
	//统计清单数量，显示到标签中
	groupData: function(bind_id) {
		
		var me = this;
		var sql = 'SELECT isbind ,count(*) as cnt FROM device_bind_det where bind_id=? GROUP BY isbind';
		
		JxDao.query(sql, [bind_id], function(json){
			console.log('---')
			json=JSON.stringify(json);
			json=JSON.parse(json);
			console.log('----'+json)
			var wp = 0, yp = 0, py = 0, pk = 0;
			if (json && json.length > 0) {
				for (var i = 0; i < json.length; i++) {
					if (json[i].isbind == '0') wp = json[i].cnt;
					if (json[i].isbind == '1') yp = json[i].cnt;
				}
			}
			document.querySelector("a[href='#item1']").innerText= "未绑("+wp+")";
			document.querySelector("a[href='#item2']").innerText = "已绑("+yp+")";
		});
	},
	//修改分页信息
	updatePage : function(psql, pageIndex,bind_id) {
		var me = this;
		JxDao.query(psql, [bind_id], function(json){
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
			JxDao.getParam('bind_no', function(data){
				var scan_header="单号 "+data;
				document.getElementById("bind_no").innerText= scan_header;
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
		var bind_id=document.getElementById("bind_id").value;
		if (currentPage < 2)return;
		this.showData(currentWhere, currentPage - 1,bind_id);
	},
	//显示下一页数据
	onNextPage: function() {
		var currentPage=parseInt(document.getElementById("pageinfo").getAttribute("currentPage"));
		var currentWhere=document.getElementById("pageinfo").getAttribute("currentWhere");
		var bind_id=document.getElementById("bind_id").value;
		//当前页面序号
		var index = currentPage + 1;
		var page=document.getElementById("page").innerText;
		var totalPage=parseInt(page.substring(page.indexOf('/')+1,page.length));
		if(index > totalPage)return;
		this.showData(currentWhere, index,bind_id);
	}
}
