SpScan = {
	//盘点数据提交盘点清单表中
	onScanOk: function(type) {
		var me = this;
		//取各字段的值
		
		var scan_id = document.getElementById("scan_id").value;
		var src_type = document.getElementById('src_type').value;
		var sp_code = document.getElementById('sp_code').value;
		var sp_name = document.getElementById('sp_name').value;
		var sp_type = document.getElementById('sp_type').value;
		var brand = document.getElementById('brand').value;
		var unit = document.getElementById('unit').value;
		var store_num = document.getElementById('store_num').value;
		var scan_num = document.getElementById('scan_num').value;
		var stock_name = document.getElementById('stock_name').value;
		var scan_det_id = document.getElementById("scan_det_id").value;
		var house_name = document.getElementById('house_name').value;
		
//		var ismore = document.getElementById('ismore').value;
		
		//判断数据有效行
        if (sp_code.length == 0 || sp_name.length == 0 || scan_num.length == 0 || store_num.length == 0) {
            mui.alert('必填字段不允许为空！');
            return;
        }

        //根据库存数量与盘点数量确定盘点状态
        if(store_num == scan_num){
            var ismore ='0';//正常
            me.saveScan(ismore,house_name,stock_name,sp_code, sp_name, store_num, scan_num, stock_name, ismore, sp_type, sp_type,scan_det_id);
        }else if(store_num > scan_num){
            var ismore ='2';//盘亏
            me.saveScan(ismore,house_name,stock_name,sp_code, sp_name, store_num, scan_num, stock_name, ismore, sp_type, sp_type,scan_det_id);
        }
        else if(store_num < scan_num){
            var ismore ='1';//盘盈
            me.saveScan(ismore,house_name,stock_name,sp_code, sp_name, store_num, scan_num, stock_name, ismore, sp_type, sp_type,scan_det_id);
        }
		
		//资产名称不可修改
	//	me.setAssetDisable(true);
		//保存后清空数据
		me.clearData();
//		document.getElementById("device_code").focus();
		
		
	},
	updateState: function(){
		
	},
	//保存盘点信息
	saveScan:function(ismore,house_name,stock_name,sp_code, sp_name, store_num, scan_num, stock_name, ismore, sp_type, sp_type,scan_det_id){
        var sql='update sp_scan_det set scan_num=?,ismore=?, isscan=?  where scan_det_id = ? ';
        var params = [scan_num,ismore, '1', scan_det_id];
        JxDao.update1(sql, params);
	},
	
	
	//保存盘点信息
//	saveScan: function(device_code, device_name, asset_code, dept_name, dept_id, use_state, install_site, memo, scan_id,device_type,label_code,type) {
////		var ismore;
////		if (type != undefined) {
////			console.log("type:"+type);
////			ismore = '2';
////		} else{
////			console.log("type2:"+type);
////			ismore = '0';
////		}
//
//		var sql = 'update sp_scan_det set asset_code=?,scan_state=?, device_name=?,  dept_name=?, dept_id=?,memo=?, install_site=?, '+
//				  'label_code=?, use_state=?, isscan=?, ismore=?, device_type = ? where device_code = ? and scan_id= ?';
//		var params = [asset_code,'2', device_name, dept_name, dept_id, memo, install_site, label_code, use_state, '1',ismore,device_type,device_code,scan_id];
//		
//		JxDao.update1(sql, params,function(){});
//	},
	//新增盘盈记录
	insertScan: function(device_code, device_name, asset_code, dept_name,dept_id, use_state, install_site,memo,scan_id,device_type,label_code) {
		var sql = 'insert into sp_scan_det(scan_id, scan_state, device_code, device_name, asset_code, dept_name, dept_id, '+
				  ' use_state, memo, isscan, ismore, device_type,install_site,label_code) '+
				  'values(? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
		var params = [scan_id , '2',device_code, device_name, asset_code, dept_name, dept_id, use_state, memo, 
					  '1', '1', device_type,install_site,label_code];
		JxDao.update1(sql, params,function(){});
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
		document.getElementById('src_type').value = "";
		document.getElementById('sp_code').value = "";
		document.getElementById('sp_name').value = "";
		document.getElementById('sp_type').value = "";
		document.getElementById('brand').value = "";
		document.getElementById('unit').value = "";
		document.getElementById('store_num').value = "";
		document.getElementById('stock_name').value = "";
		document.getElementById('house_name').value = "";
		document.getElementById("scan_num").value = "";
		document.getElementById('scan_det_id').value = "";
		document.getElementById('scan_id').value = "";
		document.getElementById('ismore').setAttribute("value","0");
		
		//资产条码聚集
//		document.getElementById('asset_code').focus();
	},
	
	//资产名称是否可以修改
	setAssetDisable: function(dised) {
		if (dised) {
			document.getElementById('device_name').readOnly=false;
			document.getElementById('device_name').setAttribute("style",'background-color', 'white');
//			document.getElementById('local_name').setAttribute("disabled",true);
//			document.getElementById('local_name').setAttribute("style",'background-color', 'white');
//			document.getElementById('card_user').setAttribute("disabled",true);
//			document.getElementById('card_user').setAttribute("style",'background-color', 'white');
			document.getElementById("use_state").readOnly=false;
			document.getElementById('use_state').setAttribute("style",'background-color', 'white');
		} else {
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
	queryAssetScan: function(code,scanid, backCall) {
		/*var params = 'eventcode=app_queryAsset&funid=asset_scan_det';
		params += '&scan_id='+scanid+" &asset_code="+code;
		jxm.post(params,backCall);*/
		
		//获取scan_id
//		console.log('---'+scan_det_id.length);
		if (device_code == undefined && scan_det_id != undefined && isOpen == undefined) {
			JxDao.getParam('scan_id',function(data){
//				document.getElementById('scan_id').value = data;
				var sql = 'select * from sp_scan_det where scan_det_id = ? and scan_id = ?';
				JxDao.query(sql, [scan_det_id,data], backCall);
			});
		} 
		if (device_code != undefined && scan_det_id != undefined && isOpen == undefined) {
			
			JxDao.getParam('scan_id',function(data){
	//			document.getElementById('scan_id').value = data;
				var sql = 'select * from sp_scan_det where scan_det_id = ? and scan_id = ?';
				JxDao.query(sql, [scan_det_id,data], backCall);
			});
		}
		if (isOpen == 1) {
			JxDao.getParam('scan_id',function(data){
	//			document.getElementById('scan_id').value = data;
				var sql = 'select * from sp_scan_det where isscan=0 and sp_code = ? and scan_id = ?';
				JxDao.query(sql, [code,data], backCall);
			});
		}
		
		
		
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
	onCodeAction: function(field, scan_det_id) {
		console.log(field+'---'+scan_det_id);
		var me = this;
		var code = field;
//		if (code.length == 0) return;
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
//			me.noEdit();
			
			//设置值
			document.getElementById("src_type").value = data.src_type;
			document.getElementById("sp_code").value = data.sp_code;
			document.getElementById("sp_name").value = data.sp_name;
			document.getElementById("sp_type").value = data.sp_type;
			document.getElementById("brand").value = data.brand;
			document.getElementById("unit").value = data.unit;
			
			if (device_code == undefined && scan_det_id != undefined && isOpen == undefined) {
				console.log('===='+scan_det_id.length)
				document.getElementById("scan_num").value = data.scan_num;
			} 
			if (device_code != undefined && scan_det_id != undefined && isOpen == undefined) {
				console.log('=1==='+scan_det_id)
				document.getElementById("scan_num").value = data.store_num;
			}
			if (isOpen == 1) {
				console.log('=3==='+scan_det_id)
				document.getElementById("scan_num").value = data.store_num;
			}
			document.getElementById("store_num").value = data.store_num;
			document.getElementById("house_name").value = data.house_name;
			document.getElementById("stock_name").value = data.stock_name;
			document.getElementById("scan_det_id").value = data.scan_det_id;
			
			document.getElementById("ismore").value = data.ismore;
			//标记非盘盈的
//			document.getElementById('device_code').focus();
		};
		
		var scanid = document.getElementById("scan_id").value;	
		//从本地库中取到资产信息更新
		me.queryAssetScan(code,scanid, function(assets){
			
			if (JSON.stringify(assets) !="[]") {
				dealAsset(assets);
			} 
			else {
				mui.alert('盘点任务中无此备件！');
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
			
				
				//资产名称可修改
				//document.getElementById("device_code").removeAttribute("disabled");
				document.getElementById("device_code").setAttribute("style","background-color:white");
				document.getElementById("device_name").readOnly=false;
				document.getElementById("device_name").setAttribute("style","background-color:white");
				document.getElementById("asset_code").readOnly=false;
				document.getElementById("asset_code").setAttribute("style","background-color:white");
				document.getElementById("device_type").readOnly=false;
				document.getElementById("device_type").setAttribute("style","background-color:white");
				document.getElementById("label_code").readOnly=false;
				document.getElementById("label_code").setAttribute("style","background-color:white");
				document.getElementById("use_state").readOnly=false;
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
		document.getElementById("device_name").setAttribute("style","background-color: #F2F2F2;margin-top: 1px;");
		document.getElementById("asset_code").readOnly=true;
		document.getElementById("asset_code").setAttribute("style","background-color:#F2F2F2");
		document.getElementById("device_type").readOnly=true;
		document.getElementById("device_type").setAttribute("style","background-color:#F2F2F2");
//		document.getElementById("local_name").setAttribute("disabled","disabled");
//		document.getElementById("local_name").setAttribute("style","background-color:#F2F2F2");
		document.getElementById("use_state").readOnly=true;
		document.getElementById("use_state").setAttribute("style","background-color:#F2F2F2");
		document.getElementById("memo").readOnly=true;
		document.getElementById("memo").setAttribute("style","background-color:#F2F2F2");
	}
	
	
}