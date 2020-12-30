AssetScan = {
	
	deleteCode:function(){
		var label_code = document.getElementById('label_code').value;
		var bind_id = document.getElementById("bind_id").value;
		var bind_det_id = document.getElementById('bind_det_id').value;
		var upSql = 'update device_bind_det set isbind=?,label_code=? where bind_det_id = ?';
		var params = ['0', '', bind_det_id];
//				console.log(params)
		JxDao.update2(upSql, params,function(){
			 //获得列表界面的webview  
			    var list = plus.webview.currentWebview().opener();  
			    //触发列表界面的自定义事件（refresh）,从而进行数据刷新  
			    mui.fire(list, 'refresh');  
		});
	},
	
	//盘点数据提交盘点清单表中
	onScanOk: function(type) {
		var me = this;
		//取各字段的值
//		var bind_id = document.getElementById("bind_id").value;
		var device_code = document.getElementById('device_code').value;
		var device_name = document.getElementById('device_name').value;
		var asset_code = document.getElementById('asset_code').value;
		var dept_name = document.getElementById('dept_name').value;
		var label_code = document.getElementById('label_code').value;
		var device_type = document.getElementById('device_type').value;
		var install_site = document.getElementById('install_site').value;
		var dept_id = document.getElementById("dept_id").value;
		var bind_id = document.getElementById("bind_id").value;
		var bind_det_id = document.getElementById('bind_det_id').value;
		var use_state = document.getElementById("use_state").value;
//		var memo = document.getElementById('memo').value;
		
//		console.log('--'+bind_id)
		
		
		me.saveScan(device_code, device_name, asset_code, dept_name,dept_id, use_state, install_site,bind_id,device_type,label_code,bind_det_id);
		
	},
	
	//保存信息
	saveScan: function(device_code, device_name, asset_code, dept_name, dept_id, use_state, install_site, bind_id,device_type,label_code,bind_det_id) {


		var sql = 'select * from device_bind_det where bind_id = ? and label_code = ?';
//				mui.toast('-bind_id----'+data);
		JxDao.query(sql, [bind_id,label_code], function(data){
			
			if (JSON.stringify(data) =="[]") {
				var upSql = 'update device_bind_det set isbind=?,label_code=? where bind_det_id = ?';
				var params = ['1', label_code, bind_det_id];
//				console.log(params)
				JxDao.update2(upSql, params,function(){
					 //获得列表界面的webview  
					    var list = plus.webview.currentWebview().opener();  
					    //触发列表界面的自定义事件（refresh）,从而进行数据刷新  
					    mui.fire(list, 'refresh');  
					    mui.currentWebview.close('auto');
				});
			} 
			else {
				mui.alert('该标签已经被绑定过了，请重新绑定！');
			}
		});

		
	},
	
	
	//查询盘点任务信息
	queryAssetScan: function(code,bind_id, backCall) {
		
		JxDao.getParam('bind_id',function(data){
			var sql = 'select * from device_bind_det where bind_det_id = ? and bind_id = ?';
//				mui.toast('-bind_id----'+data);
			JxDao.query(sql, [code,data], backCall);
		});
	},
	
	//查询资产信息
	queryAsset: function(code, backCall) {
		var params = 'eventcode=app_getAsset&funid=asset_scan_det';
		params += '&device_code='+code;
		jxm.post(params,backCall);
	
	},
	
	//扫描条码后提取数据处理
	onCodeAction: function(field, e) {
		var me = this;
		var code = field;
		if (code.length == 0) return;
		//根据条码查找资产信息
		//如果找到了判断资产信息与默认是否相同，如果相同就直接显示，如果不同就按默认值显示并提醒用户；
		//如果没找到资产就提示用户是否盘盈，如果是，就根据默认值显示，并开放资产编码与名称可以修改；如果不盘盈则清空条码并且不显示数据
		var dealAsset = function(data) {
			
			console.log('data----'+JSON.stringify(data));
			data = data[0];
			
			//设置值
			document.getElementById("device_code").value = data.device_code;
			document.getElementById("device_name").value = data.device_name;
			document.getElementById("asset_code").value = data.asset_code;
			document.getElementById("device_type").value = data.device_type;
			document.getElementById("dept_name").value = data.dept_name;
			document.getElementById("dept_id").value = data.dept_id;
			document.getElementById("bind_det_id").value = data.bind_det_id;
			document.getElementById("use_state").value = data.use_state;
			var label_code = data.label_code;
			document.getElementById("label_code").value = label_code;
			document.getElementById("install_site").value = data.install_site;
			
			document.getElementById("bind_id").value = data.bind_id;
			console.log('--'+label_code.length)
			if (label_code.length != 0 ) {
				console.log('-----'+label_code.length)
				document.getElementById('footer').classList.remove('mui-hidden');
			}
		};
		
		var bind_id = document.getElementById("bind_id").value;
		
		//从本地库中取到资产信息更新
		me.queryAssetScan(code,bind_id, function(assets){
//			console.log(code+'-----'+bind_id);
			if (JSON.stringify(assets) !="[]") {
				dealAsset(assets);
			} 
			else {
				mui.alert('该设备不属于本部门！');
			}
			
		});
		
	},

	
	
}