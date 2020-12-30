//本地数据库操作工具，只有chrome浏览器才可以用
//注意数据库操作都是异步操作，只能采用回调函数的方式操作数据库
JxDao = {
	//数据库操作对象
	db: null,
	
	//初始化数据库对象
	init : function() {
		if (typeof openDatabase == 'undefined') {
			alert('当前浏览器不支持数据库操作，\r\n请使用Chrome浏览器！');
			return;
		}
		this.db = openDatabase('XScanDB','','Jxstar Cloud ScanSystem DataBase',102400); 
		
		this.db.transaction(function(tx){
			//创建系统变量表
			tx.executeSql('CREATE TABLE IF NOT EXISTS sysparam(name TEXT,value TEXT)',[]); 
			
			//创建基础数据表
			tx.executeSql('CREATE TABLE IF NOT EXISTS basedata(key TEXT,name TEXT,type TEXT)',[]); 
			
			//创建资产数据表
			tx.executeSql('CREATE TABLE IF NOT EXISTS asset(device_id TEXT,device_code TEXT,  asset_code TEXT, device_name TEXT,  device_type TEXT, use_date DATE,dept_name TEXT, card_user TEXR, use_state TEXT,  dept_id TEXT,  dev_memo TEXT , local_name TEXT)',[]);
//			{"scan_det_id","device_id","device_code","asset_code","label_code", "device_name","type_name", "device_type","device_size", "dept_name", "sec_dept", 
//				"abc_type", "site_name", "install_site", "handle","use_state"};bind_det_id
			
			//创建设备绑定清单表
			tx.executeSql('CREATE TABLE IF NOT EXISTS device_bind_det(scan_state TEXT,bind_code TEXT,is_novalid TEXT,device_code TEXT,bind_id TEXT,bind_det_id TEXT, '+
			'asset_code TEXT,label_code TEXT, device_name TEXT,type_name TEXT, device_type TEXT, device_size TEXT, device_id TEXT, '+
			'dept_name TEXT,dept_id TEXT,sec_dept TEXR, use_state TEXT,abc_type TEXT,  site_name TEXT, install_site TEXT, isbind TEXT)',[]);
			
			
			//创建设备盘点清单表
			tx.executeSql('CREATE TABLE IF NOT EXISTS assetscan(scan_state TEXT,scan_id TEXT,scan_det_id TEXT,  device_code TEXT, '+
			'asset_code TEXT,label_code TEXT, device_name TEXT,type_name TEXT, device_type TEXT, device_size TEXT, device_id TEXT, '+
			'dept_name TEXT,dept_id TEXT,sec_dept TEXR, use_state TEXT,abc_type TEXT,  site_name TEXT, install_site TEXT, handle TEXT,memo TEXT,scan_result TEXT,isscan TEXT, ismore TEXT, isupload TEXT)',[]);
			
			//创建备件盘点清单表
			tx.executeSql('CREATE TABLE IF NOT EXISTS sp_scan_det(src_type TEXT,sp_code TEXT,sp_name TEXT,  sp_type TEXT, brand TEXT, unit TEXT, '+
			'store_num TEXT,scan_num TEXT, house_name TEXT,stock_name TEXT, scan_result TEXT,'+
			'scan_det_id TEXT,scan_id TEXT,sp_id TEXR, stock_id TEXT,house_id TEXT,  isscan TEXT, scan_state TEXT,ismore TEXT)',[]);
				
			
		});
	},
	exe: function(backCall) {
			JxDao.db.transaction(backCall);
	},
		
	//执行sql
	update: function(sql, params){
		JxDao.db.transaction(function(tx){
			tx.executeSql(sql,params,
				function(tx,rs){console.log('update sql success!');},
				function(tx,error){console.error(error.source+"::"+error.message);}
			);
		});
	},
	update1: function(sql, params,hdcall){
		JxDao.db.transaction(function(tx){
			tx.executeSql(sql,params,
				function(tx,rs){console.log('update sql success!');if(hdcall)hdcall();},
				function(tx,error){console.error(error.source+"::"+error.message);}
			);
		});
	},
	update2: function(sql, params,hdcall){
		JxDao.db.transaction(function(tx){
			tx.executeSql(sql,params,
				function(tx,rs){mui.toast('保存成功！');if(hdcall)hdcall();},
				function(tx,error){console.error(error.source+"::"+error.message);}
			);
		});
	},
	
	//保存本地资产：
	//device_code,  asset_code, device_name, device_type, dept_name, use_state, card_user, dept_id,  dev_memo,local_name
	insertAsset : function(json, total,num) {
		JxDao.exe(function(tx){
			//记录执行完成的个数 
			var cnt = 0;
			//新增数据
			for (var i = 0; i < json.length; i++) {
				var d = json[i];
				tx.executeSql('INSERT INTO asset(device_id,device_code, asset_code, device_name,device_type, dept_name, card_user, '
						+'use_state,   dept_id ,dev_memo,local_name,use_date) '+
							  'VALUES(?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
					[d.device_id,d.device_code, d.asset_code, d.device_name,d.device_type, d.dept_name, d.card_user,d.use_state, 
					  d.dept_id, d.dev_memo,d.local_name,d.use_date],
					function(){
						cnt++;
						//当所有新增都执行成功后才执行回调函数
						if (cnt == json.length){
							if(total > num+200){
								num += 200;
								var hdcall=function(data){
									var asset = data.data.root;
									JxDao.insertAsset(asset,total,num);
								};
								var params = "eventcode=downAsset&funid=asset_scan&pagetype=grid&limit=200&start="+num;
								JxRequest.post(params, hdcall, {masked:false});
							}else{
								document.body.querySelector('.mui-loader').classList.add("mui-hidden");
								alert("下载完成");
							}
						}
					},
					function(tx,error){console.log(error.source+"::"+error.message);}
				);
			}
		});
	},
	
	
	
		//取系统常用变量
	getParam : function(name, backCall) {
		JxDao.db.transaction(function(tx){
			//执行查询
			tx.executeSql('SELECT * FROM sysparam WHERE name = ?',[name],
				function(tx,rs){
					var v = '';
					if (rs.rows.length > 0) {
						v = rs.rows.item(0).value;
					}
					backCall(v);
				},
				function(tx,error){console.error(error.source+"::"+error.message);}
				); 
			});
	},
	
		//保存系统常用变量
		setParam : function(name, value, backCall) {
			JxDao.db.transaction(function(tx){
				//先删除再新增
				tx.executeSql('DELETE FROM sysparam WHERE name = ?',[name]);
				//新增数据
				tx.executeSql('INSERT INTO sysparam(value, name) VALUES(?, ?)',[value, name],
					function(tx,rs){if (backCall) backCall(); console.log(name +"::"+ value)},
					function(tx,error){console.error(error.source+"::"+error.message);}
				);
			});
	},
		
		//查询选项值
		queryCombo : function(type, backCall) {
			JxDao.db.transaction(function(tx){
				tx.executeSql('select key, name from basedata where type = ?',[type],
					function(tx,rs){
						var json = [];
						for (var i = 0; i < rs.rows.length; i++) {
							json[i] = rs.rows.item(i);
						}
						backCall(json);
					},
					function(tx,error){console.error(error.source+"::"+error.message);}
				);
			});
	},
		
		//通用查询数据方法，支持分页功能
		query: function(sql, params, backCall, pageSize, pageIndex) {
			JxDao.db.transaction(function(tx){
				//传入的页序号是从1开始的，需要-1
				if (pageSize && pageIndex) {
					sql=sql+' limit '+pageSize+' offset '+pageSize*(pageIndex-1);
					pageIndex=pageIndex-1;
				}
				
				if (!params) params = [];
				
				tx.executeSql(sql,params,
					function(tx,rs){
						var json = [];
						for (var i = 0; i < rs.rows.length; i++) {
							json[i] = rs.rows.item(i);
						}
						backCall(json);
					},
					function(tx,error){console.error(error.source+"::"+error.message);}
				);
			});
		},
	
	//清除数据库信息，方便调整已有表的数据库结构
	clear : function() {
		var me = this, cnt = 0;
		var cb = function(){//重新创建表对象
			cnt++;
			if (cnt == 4) {
				me.init();
				alert('初始化成功！');
			}
		};
		
		this.db.transaction(function(tx){
			tx.executeSql('DROP TABLE sysparam',[],cb);
			tx.executeSql('DROP TABLE basedata',[],cb);
			tx.executeSql('DROP TABLE assetscan',[],cb);
			tx.executeSql('DROP TABLE assetscan',[],cb);
			tx.executeSql('DROP TABLE sp_scan_det',[],cb);
			
		});
	},
	
	//初始化所有选项值
	comboData : {},
	
	//初始化所有选项值，实时提取需要回调处理，实现不方便
	initCombo : function() {
		var me = this;
		me.comboData = {state:[
				{key:'20', name:'在库'},
				{key:'25', name:'在用'},
				{key:'30', name:'维修'},
				{key:'40', name:'报废'},
				{key:'50', name:'盘亏'}
			]};
	}
};

(function(){
	JxDao.init();
	JxDao.initCombo();
	
})();
