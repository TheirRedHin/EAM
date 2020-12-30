TaskDown = {
	//点击数据条中的“下载”按钮，时从服务上下载盘点清单数据
//  onDisclose: function(list, record, target, index) {
//		var me = this;
//		var down = function() {
//			var scanid = record.scan_id;
//			var scancode = record.scan_code;
//			
//			//下载盘点清单数据写入本地数据库中
//			//当前盘点任务写入系统参数中
//			var hdcall = function(data){
//				 me.saveScanAsset(scanid,data, function(){
//					//还需要保存任务信息到系统参数中
//					var scantask = '{"scanid":"'+ scanid +'", "scancode":"'+ scancode +'"}';
//					JxDao.setParam('scantask', scantask,function(){window.location.reload();});
//				//	me.getTextCode().setHtml(scancode);
//				
//				alert('下载数据成功！');
//					
//				});
//			};
//			var params = 'funid=asset_scan&eventcode=readasset&scanid='+scanid;
//			jxm.post(params, hdcall);
//		};
//		down();
//		
//  },
    onDisclose1: function(list, record, target, index) {
//  	console.log(mui.alert('--'+JSON.stringify(record)));
		var me = this;
		var down = function() {
			var scanid = record.scan_id;
			var status = record.status;
			var user_name = record.user_name;
			var dectask = record.dectask;
			var scancode = record.scan_code;
			var setScan = function(){
				
			};
//			mui.toast("下载任务中...");
			//下载盘点清单数据写入本地数据库中
			//当前盘点任务写入系统参数中
			var hdcall = function(data){
//				alert(0);
				data = JSON.stringify(data);
				console.log('--盘点明细--'+data.length);
				console.log('--盘点明细--'+data);
				
				
				 me.saveScanAsset(scanid, data, function(){
				 	
				 	//保存离线数据
				 	var data = '{"scanid":"'+ scanid+'","scancode":"'+scancode+
				 	'","user_name":"'+user_name+'","dectask":"'+dectask+'","status":"'+status+'"}';
//					localStorage.setItem("data", data);
				 	
				 	
					//还需要保存任务信息到系统参数中
					var scantask = '{"scanid":"'+ scanid +'", "scancode":"'+ scancode +'"}';
					JxDao.setParam('scantask', scantask);
					JxDao.setParam('data', data);
				//	me.getTextCode().setHtml(scancode);
					JxDao.setParam("scan_code",scancode);
//					JxDao.setParam("keyid",scanid);
					localStorage.setItem("keyid", scanid);
					JxDao.setParam("scan_id",scanid,function(){window.location.href="queryScan.html";})
					
					mui.toast('下载数据成功！');
					
				});
			};
			var params = 'funid=device_scan_ans&eventcode=readasset&scanId='+scanid;
			console.log(scanid);
			jxm.post(params, hdcall);
		};
		down();
		
    },
    updateState: function(scan_state,scan_id){
    	
    	var sql = 'update assetscan set scan_state= ? where scan_id = ?';
		var params = [scan_state, scan_id];
		JxDao.update(sql, params);
    },
    //保存本地盘点清单：
    saveScanAsset : function(scan_id,json, fn) {
    	console.log('json----'+json.length);
		JxDao.exe(function(tx){
			//记录执行完成的个数 
			var cnt = 0;
			//先删除再新增
			tx.executeSql('DELETE FROM assetscan where scan_id=?',[scan_id]);
			//新增数据
			json=JSON.parse(json);
			for (var i = 0; i < json.length; i++) {
				var d = json[i];
				var isscan = '0', ismore = '0';
				
//				console.log('----'+d.scan_result);
				if(d.scan_result == 'normal') isscan = '1';
				if (d.scan_result == 'more') {isscan = '1'; ismore = '1';}
				if (d.scan_result == 'loss') {isscan = '1'; ismore = '2';}
				//如果是盘亏表示没有盘点
				
				tx.executeSql('INSERT INTO assetscan(device_id,scan_state,scan_id,scan_det_id,device_code,asset_code,label_code,device_name, type_name,device_type,device_size,'+
							  'dept_name,dept_id, sec_dept, abc_type, site_name, install_site, handle,memo,scan_result,use_state, isscan, ismore) '+
							  'VALUES(?,?,?,?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[d.device_id,'1', scan_id, d.scan_det_id, d.device_code, d.asset_code,d.label_code, d.device_name, d.type_name,d.device_type,d.device_size, d.dept_name,d.dept_id, d.sec_dept, 
					 d.abc_type, d.site_name, d.install_site, d.handle,d.memo,d.scan_result,d.status, isscan, ismore],function(){
						cnt++;
						//当所有新增都执行成功后才执行回调函数
						if (cnt == json.length) fn(json);
					},
					function(tx,error){console.error(error.source+"::"+error.message);}
				);
			}
		});
	},
	
	
	//上传盘点结果
	onTaskCommit: function(scan_id,backCall) {
		var me = this;
		//上传盘点结果数据的方法
		var comtask = function(content) {
			//清除当前盘点任务
			var clear = function() {
				
				var sql = 'SELECT isscan, ismore, count(*) as cnt FROM assetscan where scan_id=? GROUP BY isscan, ismore';
				JxDao.query(sql, [scan_id], function(json){
					json=JSON.stringify(json);
					json=JSON.parse(json);
					var wp = 0;
					if (json && json.length > 0) {
						for (var i = 0; i < json.length; i++) {
							if (json[i].isscan == '0') wp = json[i].cnt;
						}
					}
					console.log('------'+wp);
					//如果是未盘=0，删除全部
//					if (wp == 0) {
//						JxDao.exe(function(tx){//删除盘点清单明细
//							tx.executeSql('DELETE FROM assetscan where scan_id = ?',[scan_id]);
//						});
//						JxDao.setParam('scantask', '',function(){if(backCall)backCall();});//删除当前盘点任务信息
//				
//					} else{
						//删除盘盈的数据
//						var detsql = 'delete from assetscan where isscan = 1 and scan_id = ?';
//						var detparams = [scan_id];
//						JxDao.update2(detsql, detparams,function(){window.location.reload();});	
						var detsql = 'delete from assetscan where isscan = 1 and scan_id = ?';
						var detparams = [scan_id];
						JxDao.update1(detsql, detparams,function(){window.location.reload();});	
//					}
				});
				
				
				
				
				
				//me.showData();//重新加载数据
			};
			
			//将盘点状态标示为3,--盘点完成
			var updateState=function(){
				JxDao.exe(function(tx){//删除盘点清单明细
					tx.executeSql('update assetscan set scan_state=? where scan_id=?',['3',scan_id]);
				});
				JxDao.setParam('scantask', '',function(){if(backCall)backCall();});//删除当前盘点任务信息
			};
			
			var comm = function(scanid, content){
				var hdcall = function(data){
					mui.toast('上传盘点结果成功！');
						//清除当前盘点单号
//						clear();
//					updateState();
				
					var sql = 'update assetscan set isupload=? where scan_state = 4 and ismore  and scan_id= ?';
					var params = ['1',scan_id];
					
					JxDao.update1(sql, params,function(){});
				
				};
				var e = encodeURIComponent;
				var params = 'funid=device_scan_ans&eventcode=commtask&scanid='+scanid+'&content='+e(content);
				jxm.post(params, hdcall);
			};
			
			//取当前盘点任务单号
			
					
			var r=confirm('您确定要上传当前的盘点结果吗？');
				if(r==true){
					comm(scan_id, content);
				}
		};
		
		//查询已盘点资产的回调函数
		var qrycall = function(json) {
			if (json.length == 0) {
				alert('没有已盘点的设备，不能上传！');
				return;
			}
			//资产条码,临时条码,资产编码,资产名称,型号规格,部门名称,管理状态,管理人,安装地点,dept_id,备注,原资产编码,非盘盈
			var content='[';
			console.log('json---'+JSON.stringify(json));
			for (var i = 0; i < json.length; i++) {
				var d = json[i];
				
				if(d.isupload == '1'){
					console.log('--4---'+d.isupload);
					continue;
				}
				
				
				console.log('--memo-'+d.memo);
//				var fm = (d.ismore == '1') ? '0' : '1';
//				if (d.ismore == 0) {
//					var scan_result = '1';
//				}
//				else if(d.ismore == 1){
//					var scan_result = '2';
//				}else{
//					var scan_result = '3';
//				}
//				content += d.device_code+','+d.label_code+','+d.asset_code+','+d.device_name+','+d.device_type+','+d.dept_name+','+
//					d.use_state+','+d.install_site+','+d.dept_id+','+d.memo+','+fm+'\n';
//				if (d.ismore == '1') {		
					content+='{"scan_id":"'+ scan_id +'","scan_det_id":"'+ d.scan_det_id +'","device_code":"'+d.device_code+'","label_code":"'+d.label_code+'","asset_code":"'+d.asset_code+
                    '","device_name":"'+d.device_name+'","device_type":"'+d.device_type+'","dept_name":"'+d.dept_name+'","dept_id":"'+d.dept_id+
                    '","status":"'+d.use_state+'","install_site":"'+d.install_site+'","memo":"'+d.memo+'","scan_result":"'+d.ismore+'"},';
			}
			//提示提交成功，并清空当前盘点任务
			content=content.substring(0,content.length-1);
            content+=']';
            comtask(content);
		};
		
		//第一步
		var sql = "select * from assetscan where isscan = '1' and scan_id = ?";
		JxDao.query(sql, [scan_id], qrycall);
	}
	
}