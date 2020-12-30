TaskDown2 = {
	//点击数据条中的“下载”按钮，时从服务上下载盘点清单数据
//  onDisclose: function(list, record, target, index) {
//		var me = this;
//		var down = function() {
//			var scanid = record.bind_id;
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
    	console.log('--'+JSON.stringify(record));
		var me = this;
		var down = function() {
			
			var bind_id = record.bind_id;
			var status = record.status;
			var bind_user = record.bind_user;
			var dectask = record.dectask;
			var bind_no = record.bind_no;
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
				
				
				 me.saveScanAsset(bind_id, data, function(){
				 	
				 	//保存离线数据
				 	var data = '{"bind_id":"'+ bind_id+'","bind_no":"'+bind_no+
				 	'","bind_user":"'+bind_user+'","dectask":"'+dectask+'"}';
//					localStorage.setItem("data", data);
				 	
				 	
					//还需要保存任务信息到系统参数中
					var bindtask = '{"bind_id":"'+ bind_id +'", "bind_no":"'+ bind_no +'"}';
					JxDao.setParam('bindtask', bindtask);
					JxDao.setParam('bindData', data);
				//	me.getTextCode().setHtml(scancode);
					JxDao.setParam("bind_no",bind_no);
//					JxDao.setParam("keyid",scanid);
//					localStorage.setItem("keyid", scanid);
					JxDao.setParam("bind_id",bind_id,function(){window.location.href="device-bind-det.html";})
					
					mui.toast('下载数据成功！');
					
				});
			};
			var params = 'funid=device_bind&eventcode=readasset&bindId='+bind_id;
			console.log(params);
			jxm.post(params, hdcall);
		};
		down();
		
    },
    updateState: function(scan_state,bind_id){
    	
    	var sql = 'update assetscan set scan_state= ? where bind_id = ?';
		var params = [scan_state, bind_id];
		JxDao.update(sql, params);
    },
    //保存本地盘点清单：
    saveScanAsset : function(bind_id,json, fn) {
    	console.log('json----'+json.length);
		JxDao.exe(function(tx){
			//记录执行完成的个数 
			var cnt = 0;
			//先删除再新增
			tx.executeSql('DELETE FROM device_bind_det where bind_id=?',[bind_id]);
			//新增数据
			json=JSON.parse(json);
			for (var i = 0; i < json.length; i++) {
				var d = json[i];
				var isbind = '0';
				
				console.log('----'+d.label_code.length);
				//如果有标签编码，标记为已绑
				if (d.label_code.length != 0) {
					var isbind = '1';
				} 
				
				tx.executeSql('INSERT INTO device_bind_det(device_id,isbind,bind_id,bind_det_id,device_code,asset_code,label_code,device_name, type_name,device_type,device_size,'+
							  'dept_name,dept_id, sec_dept, abc_type, site_name, install_site,use_state) '+
							  'VALUES(?,?,?,?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[d.device_id,isbind, bind_id, d.bind_det_id, d.device_code, d.asset_code,d.label_code, d.device_name, d.type_name,d.device_type,d.device_size, d.dept_name,d.dept_id, d.sec_dept, 
					 d.abc_type, d.site_name, d.install_site,d.status],function(){
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
	onTaskCommit: function(bind_id,backCall) {
		var me = this;
		//上传盘点结果数据的方法
		var comtask = function(content) {
			
			var comm = function(scanid, content){
				var hdcall = function(data){
					mui.toast('上传绑定标签成功！');
						//清除当前盘点单号
//						clear();
//					updateState();
				
				
				};
				var e = encodeURIComponent;
				var params = 'funid=device_bind_det&eventcode=upLoad&content='+e(content);
				jxm.post(params, hdcall);
			};
			
			//取当前盘点任务单号
			
			var r=confirm('您确定要上传当前的绑定标签吗？');
			if(r==true){
				comm(bind_id, content);
			}
		};
		
		//查询已盘点资产的回调函数
		var qrycall = function(json) {
//			if (json.length == 0) {
//				alert('没有已盘点的设备，不能上传！');
//				return;
//			}
			//资产条码,临时条码,资产编码,资产名称,型号规格,部门名称,管理状态,管理人,安装地点,dept_id,备注,原资产编码,非盘盈
			var content='[';
			console.log('json---'+JSON.stringify(json));
			for (var i = 0; i < json.length; i++) {
				var d = json[i];
				
				content+='{"bind_code":"'+ d.label_code +'","bind_det_id":"'+ d.bind_det_id+'"},';
			}
			//提示提交成功，并清空当前盘点任务
			content=content.substring(0,content.length-1);
            content+=']';
            comtask(content);
            
		};
		
		//第一步
		var sql = "select * from device_bind_det where  bind_id = ?";
		JxDao.query(sql, [bind_id], qrycall);
	}
	
}