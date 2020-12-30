AssetScan = {
	//盘点数据提交盘点清单表中
	onScanOk: function(type) {
		var me = this;
		//取各字段的值
		var scan_id = document.getElementById("scan_id").value;
		var device_code = document.getElementById('device_code').value;
		var device_name = document.getElementById('device_name').value;
		var asset_code = document.getElementById('asset_code').value;
		var dept_name = document.getElementById('dept_name').value;
		var label_code = document.getElementById('label_code').value;
		var device_type = document.getElementById('device_type').value;
		var install_site = document.getElementById('install_site').value;
		var dept_id = document.getElementById("dept_id").value;
//		var card_user = document.getElementById('card_user').value;
		var use_state = document.getElementById("use_state").value;
		var memo = document.getElementById('memo').value;
//		if (type != undefined) {
//			var ismore = document.getElementById('ismore').value;
//		}
		var ismore = document.getElementById('ismore').value;
		
		//判断数据有效行
		if (device_code.length==0) {
			alert('请输入设备编号！');
			return;
		}
		//判断数据有效行
		if (device_name.length==0) {
			alert('请输入设备名称！');
			return;
		}
		
		
		//盘盈就新增记录，否则修改，并标记已盘点过
		if (ismore == '1') {
			me.insertScan(device_code, device_name, asset_code, dept_name,dept_id, use_state, install_site,memo,scan_id,device_type,label_code);
		} 
		else{
			me.saveScan(device_code, device_name, asset_code, dept_name,dept_id, use_state, install_site,memo,scan_id,device_type,label_code,type);
		}
		
		//资产名称不可修改
		me.setAssetDisable(true);
		//保存后清空数据
		me.clearData();
//		document.getElementById("device_code").focus();
		
		
	},
	updateState: function(){
		
	},
	//保存盘点信息
	saveScan: function(device_code, device_name, asset_code, dept_name, dept_id, use_state, install_site, memo, scan_id,device_type,label_code,type) {
		var ismore;
		
		if (type != undefined) {
			console.log("type:"+type);
			ismore = '2';
		} else{
			console.log("type2:"+type);
			ismore = '0';
		}

		var sql = 'update assetscan set asset_code=?,scan_state=?, device_name=?,  dept_name=?, dept_id=?,memo=?, install_site=?, '+
				  'label_code=?, use_state=?, isscan=?, ismore=?, device_type = ? where device_code = ? and scan_id= ?';
		var params = [asset_code,'2', device_name, dept_name, dept_id, memo, install_site, label_code, use_state, '1',ismore,device_type,device_code,scan_id];
		
		JxDao.update2(sql, params,function(){});
	},
	//新增盘盈记录
	insertScan: function(device_code, device_name, asset_code, dept_name,dept_id, use_state, install_site,memo,scan_id,device_type,label_code) {
		var sql = 'insert into assetscan(scan_id, scan_state, device_code, device_name, asset_code, dept_name, dept_id, '+
				  ' use_state, memo, isscan, ismore, device_type,install_site,label_code) '+
				  'values(? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
		var params = [scan_id , '4',device_code, device_name, asset_code, dept_name, dept_id, use_state, memo, 
					  '1', '1', device_type,install_site,label_code];
		JxDao.update2(sql, params,function(){});
	},
	
	//盘点数据清空
	onCancel: function() {
		this.clearData();
		
		//资产名称不可修改
		this.setAssetDisable(true);
	},
	
	//清空数据
	clearData: function() {
		//清空各字段的值
		document.getElementById('asset_code').value = "";
		document.getElementById('device_code').value = "";
		document.getElementById('device_name').value = "";
		document.getElementById('device_type').value = "";
		document.getElementById('dept_name').value = "";
		document.getElementById('label_code').value = "";
		document.getElementById('install_site').value = "";
		document.getElementById('dept_id').value = "";
		document.getElementById("use_state").value = "0";
		document.getElementById('memo').value = "";
		document.getElementById('ismore').setAttribute("value","0");
		
		//资产条码聚集
//		document.getElementById('asset_code').focus();
	},
	
	//资产名称是否可以修改
	setAssetDisable: function(dised) {
		if (dised) {
			console.log(0)
			document.getElementById('device_name').readOnly=true;
			document.getElementById('device_name').setAttribute("style","background-color:#F2F2F2");
			document.getElementById("device_code").readOnly=true;
			document.getElementById('device_code').setAttribute("style","background-color: #F2F2F2;margin-top: 1px;");
			
			document.getElementById('device_type').readOnly=true;
			document.getElementById('device_type').setAttribute("style","background-color:#F2F2F2");
			document.getElementById("asset_code").readOnly=true;
			document.getElementById('asset_code').setAttribute("style","background-color:#F2F2F2");
			
			document.getElementById('label_code').readOnly=true;
			document.getElementById('label_code').setAttribute("style","background-color:#F2F2F2");
			document.getElementById("dept_name").readOnly=true;
			document.getElementById('dept_name').setAttribute("style","background-color:#F2F2F2");
			
			document.getElementById('install_site').readOnly=true;
			document.getElementById('install_site').setAttribute("style","background-color:#F2F2F2");
			document.getElementById("use_state").setAttribute("disabled","disabled");
			document.getElementById("use_state").setAttribute("style","background-color:#F2F2F2");
			
			document.getElementById("memo").readOnly=true;
			document.getElementById('span').classList.add('mui-hidden');
			document.getElementById("memo").setAttribute("style","background-color:#F2F2F2");
			
			document.getElementById("device_code").readOnly=true;
			document.getElementById('codeSpan').classList.add('mui-hidden');
			document.getElementById("device_code").setAttribute("style","background-color:#F2F2F2");
		} else {
			console.log(6)
			document.getElementById('device_name').readOnly=false;
			document.getElementById('device_name').setAttribute("style",'background-color', 'white');
//			document.getElementById('local_name').setAttribute("disabled",false);
//			document.getElementById('local_name').setAttribute("style",'background-color', 'white');
//			document.getElementById('card_user').setAttribute("disabled",false);
//			document.getElementById('card_user').setAttribute("style",'background-color', 'white');
			document.getElementById("use_state").readOnly=false;
			document.getElementById('use_state').setAttribute("style",'background-color', 'white');
		}
	},
	
	//查询盘点任务信息
	queryAssetScan: function(code,code,code,scanid, backCall) {
		
		JxDao.getParam('scan_id',function(data){
//			var scan_id = document.getElementById('scan_id').value = data;
			
				var sql = 'select * from assetscan where (device_code like ? or asset_code like ? or label_code like ?) and scan_id = ?';
//				mui.toast('-scan_id----'+data);
				JxDao.query(sql, [code,code,code,data], backCall);
	//			mui.toast('--'+scan_id);
			});
		
		/*var params = 'eventcode=app_queryAsset&funid=asset_scan_det';
		params += '&scan_id='+scanid+" &asset_code="+code;
		jxm.post(params,backCall);*/
//		var sql = 'select * from assetscan where device_code = ? and scan_id = ?';

		
	},
	
	//查询资产信息
	queryAsset: function(code, backCall) {
		var params = 'eventcode=app_getAsset&funid=asset_scan_det';
		params += '&device_code='+code;
		jxm.post(params,backCall);
	
	
	//	var sql = 'select * from asset where asset_code = ?';
	//	JxDao.query(sql, [code], backCall);
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
			//正常处理
			//data=JSON.stringify(data);
			//data=JSON.parse(data);
			console.log('data----'+JSON.stringify(data));
			data = data[0];
			
			me.clearData();
			//设置字段不可编辑
			me.noEdit();
			
			//设置值
			document.getElementById("device_code").value = data.device_code;
			document.getElementById("device_name").value = data.device_name;
			document.getElementById("asset_code").value = data.asset_code;
			document.getElementById("device_type").value = data.device_type;
			document.getElementById("dept_name").value = data.dept_name;
			document.getElementById("dept_id").value = data.dept_id;
//			document.getElementById("local_name").value = data.local_name;
			document.getElementById("use_state").value = data.use_state;
			document.getElementById("label_code").value = data.label_code;
			document.getElementById("install_site").value = data.install_site;
			
			if (data.memo != 'undefined') {
				console.log(''+data.memo)
				document.getElementById("memo").value = data.memo;
			}
			
			
			document.getElementById("ismore").value = data.ismore;
			//标记非盘盈的
//			document.getElementById('device_code').focus();
		};
		
		var scanid = document.getElementById("scan_id").value;
		
		//从本地库中取到资产信息更新
		me.queryAssetScan(code,code,code,scanid, function(assets){
//			console.log(code+'-----'+scanid);
			if (JSON.stringify(assets) !="[]") {
				dealAsset(assets);
			} 
			else {
				mui.alert('该设备不属于本部门！');
			}
			
		});
		
	},
	
	addAsset:function() {//盘盈处理
		var me = this;
//		var device_code = code;
		//用户与部门取缺省值
		var use_state='1';//在用
//			me.queryAsset(code,function(data){
			
			//正常处理
//				if(JSON.stringify(data) == '{}'){
//				mui.toast("该资产不存在，可手动添加");
				/*JxDao.getParam('cur_session',function(data){
					data=JSON.parse(data);
					//先清空数据
					me.clearData();
					document.getElementById("asset_code").value = asset_code;
					document.getElementById("card_user").value = data.user_name;
					document.getElementById("dept_name").value =data.dept_name;
					document.getElementById("dept_id").value =data.dept_id;
					document.getElementById("use_state").value =use_state;
				});*/
				
				//--------------------------------
				me.clearData();
				
//				document.getElementById("device_code").value = device_code;
				var session = jxm.getSession();
//					document.getElementById("card_user").value=session.user_name;
				document.getElementById("dept_name").value=session.dept_name;
				document.getElementById("dept_id").value=session.dept_id;
				document.getElementById("use_state").value =use_state;
				var code = '';
				for (var i=0;i<12;i++) {
					code += Math.floor(Math.random()*10);
				}
				document.getElementById("device_code").value =code;
				//资产名称可修改
				document.getElementById("codeSpan").classList.remove('mui-hidden');
				document.getElementById("device_code").readOnly=false;
				document.getElementById("device_code").setAttribute("style","background-color:white");
				document.getElementById("device_name").readOnly=false;
				document.getElementById("device_name").setAttribute("style","background-color:white");
				document.getElementById("asset_code").readOnly=false;
				document.getElementById("asset_code").setAttribute("style","background-color:white");
				document.getElementById("device_type").readOnly=false;
				document.getElementById("device_type").setAttribute("style","background-color:white");
				document.getElementById("label_code").readOnly=false;
				document.getElementById("label_code").setAttribute("style","background-color:white");
				document.getElementById("use_state").removeAttribute("disabled");
				document.getElementById("use_state").setAttribute("style","background-color:white");
				document.getElementById("install_site").readOnly=false;
				document.getElementById("install_site").setAttribute("style","background-color:white");
				document.getElementById("memo").readOnly=false;
				document.getElementById("memo").setAttribute("style","background-color:white");
//				}else{
//					if(confirm('该设备非本科室设备，确定盘盈吗？')){
//						data=JSON.stringify(data);
//						data=JSON.parse(data);
//						//先清空数据
//						me.clearData();
//						
//						//设置字段不可编辑
//						me.noEdit();
//						
//						//设置值
//						document.getElementById("device_code").value = data.device_code;
//						document.getElementById("device_name").value =data.device_name;
//						document.getElementById("asset_code").value =data.asset_code;
//						//------------
//						document.getElementById("device_type").value =data.device_type;
//						//------------
//						document.getElementById("dept_name").value= data.dept_name;
////						document.getElementById("dept_id").value =data.dept_id;
////						document.getElementById("card_user").value =data.card_user;
////						document.getElementById("local_name").value=data.local_name;
//						document.getElementById("use_state").value=data.use_state;
////						document.getElementById("memo").value=data.dev_memo;
//					};
//				}
			
			//标记是盘盈的
			document.getElementById("ismore").value = "1";
//			document.getElementById('device_name').focus();
//			});	

	},
	
	//设置不可编辑
	noEdit: function() {
		document.getElementById("device_name").readOnly=true;
		document.getElementById("device_name").setAttribute("style","background-color:#F2F2F2");
		document.getElementById("asset_code").readOnly=true;
		document.getElementById("asset_code").setAttribute("style","background-color:#F2F2F2");
		document.getElementById("device_type").readOnly=true;
		document.getElementById("device_type").setAttribute("style","background-color:#F2F2F2");
//		document.getElementById("local_name").setAttribute("disabled","disabled");
//		document.getElementById("local_name").setAttribute("style","background-color:#F2F2F2");
		document.getElementById("use_state").setAttribute("disabled","disabled");
		document.getElementById("use_state").setAttribute("style","background-color:#F2F2F2");
//		document.getElementById("memo").setAttribute("disabled","disabled");
//		document.getElementById("memo").setAttribute("style","background-color:#F2F2F2");
	}
	
	
}