NfcUtil = {
    initNfc : function(callback){
	    var listenNFCStatus = function() {
	    	var NfcAdapter;
	    	try {
	    		var main = plus.android.runtimeMainActivity();
	    		var Intent = plus.android.importClass('android.content.Intent');
	    		var Activity = plus.android.importClass('android.app.Activity');
	    		var PendingIntent = plus.android.importClass('android.app.PendingIntent');
	    		var IntentFilter = plus.android.importClass('android.content.IntentFilter');
	    		NfcAdapter = plus.android.importClass('android.nfc.NfcAdapter');
	    		var nfcAdapter = NfcAdapter.getDefaultAdapter(main);
	    		var intent = new Intent(main, main.getClass());
	    		intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
	    		var pendingIntent = PendingIntent.getActivity(main, 0, intent, 0);
	    		var ndef = new IntentFilter("android.nfc.action.TECH_DISCOVERED");
	    		ndef.addDataType("*/*");
	    		var intentFiltersArray = [ndef];
	    		var techListsArray = [
	    			["android.nfc.tech.IsoDep"],
	    			["android.nfc.tech.NfcA"],
	    			["android.nfc.tech.NfcB"],
	    			["android.nfc.tech.NfcF"],
	    			["android.nfc.tech.Nfcf"],
	    			["android.nfc.tech.NfcV"],
	    			["android.nfc.tech.NdefFormatable"],
	    			["android.nfc.tech.MifareClassi"],
	    			["android.nfc.tech.MifareUltralight"]
	    		];
	    		document.addEventListener("newintent",
	    			function() {
	    				console.log('newintent');
	    				setTimeout(NfcUtil.handle_nfc_data(callback), 100);
	    			}, false);
	    		document.addEventListener("pause", function(e) {
	    			if (nfcAdapter) {
	    				nfcAdapter.disableForegroundDispatch(main);
	    				console.log('pause');
	    			}
	    		}, false);
	    		document.addEventListener("resume", function(e) {
	    			if (nfcAdapter) {
	    				console.log('resume');
	    				nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray, techListsArray);
	    			}
	    		}, false);
	    		nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray, techListsArray);
	    	} catch (e) {
//	    		console.error(e);
	    	}
	    }
	    document.addEventListener('plusready', listenNFCStatus(), false);
    },

	handle_nfc_data: function(callback) {
		var NdefRecord;
		var NdefMessage;
		NdefRecord = plus.android.importClass("android.nfc.NdefRecord");
		NdefMessage = plus.android.importClass("android.nfc.NdefMessage");
		var main = plus.android.runtimeMainActivity();
		var intent = main.getIntent();
		console.log("action type:" + intent.getAction());
		if ("android.nfc.action.TECH_DISCOVERED" == intent.getAction()) {
			NfcUtil.__read(intent, callback);
		}
	},

    __read: function(intent, callback) {
    	var Parcelable = plus.android.importClass("android.os.Parcelable");
    	var tagid = intent.getByteArrayExtra("android.nfc.extra.ID");
    	console.log(NfcUtil.ByteArrayToHexString(tagid));
    	var s = plus.android.newObject("java.lang.String", NfcUtil.ByteArrayToHexString(tagid));
    	callback(s); //执行回调函数
    },
            
    ByteArrayToHexString: function ByteArrayToHexString(tagid) {
    	var i, j, ins;
    	var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    	var out = "";

    	for (j = 0; j < tagid.length; ++j) {
    		ins = tagid[j] & 0xff;
    		i = (ins >> 4) & 0x0f;
    		out += hex[i];
    		i = ins & 0x0f;
    		out += hex[i];
    	}
    	return out;
    }
};
            
