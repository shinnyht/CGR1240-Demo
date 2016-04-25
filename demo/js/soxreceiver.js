var boshService = "http://sox.ht.sfc.keio.ac.jp:5280/http-bind/";
var xmppServer = "sox.ht.sfc.keio.ac.jp";

window.onload = function () {
    $(document).foundation();
    var tempALPS = 0;
    var humidALPS = 0;
    var lightALPS = 0;
    var tempAkasaka = 0;
    var humidAkasaka = 0;
    var newestTweetImage = "";
    var newestTweetText = "";
    var initFlagALPS = true;
    var initFlagAkasaka = true;
    var lastTimestamp = null;

    // SoxServerへ接続
	var client = new SoxClient(boshService, xmppServer);
	var soxEventListener = new SoxEventListener();

	soxEventListener.connected = function (soxEvent) {
		console.log("[main.js] Connected "+soxEvent.soxClient);
		status("Connected: "+soxEvent.soxClient);
		
        var deviceNames = [
            'CGR1240-ALPS-Sensor',
            '東京都港区ピンポイント天気(3時間)',
            '東京ミッドタウン最新ツイート画像'
        ];
        deviceNames.forEach(function (name) {
            var device = new Device(name);

            if (!client.subscribeDevice(device)) {
                /* サーバに繋がってない場合などで、要求を送信できなかった場合はfalseが返ってくる */
                status("Couldn't send subscription request: " + device);
            }
        });
	};

	soxEventListener.connectionFailed = function (soxEvent) {
		status("Connection Failed: "+soxEvent.soxClient);
	};

	soxEventListener.resolved = function (soxEvent) {
		status("Device Resolved: "+soxEvent.soxClient);
	};

	soxEventListener.resolveFailed = function (soxEvent){
		/* couldn't get device information from the server */
		status("Resolve Failed: " + soxEvent.device
            + " code=" + soxEvent.errorCode
            + " type=" + soxEvent.errorType);
	};

	soxEventListener.subscribed = function (soxEvent){
		status("Subscribed: " + soxEvent.device);
	};
	soxEventListener.subscriptionFailed = function (soxEvent) {
		/* デバイスが存在しないなどのときはここに来る */
		status("Subscription Failed: " + soxEvent.device);
	};
	soxEventListener.metaDataReceived = function (soxEvent) {
		/**
		 * SoXサーバからデバイスのメタ情報を受信すると呼ばれる。
		 * 受信したメタ情報に基づいて、Device内にTransducerインスタンスが生成されている。
		 */
		status("Meta data received: " + soxEvent.device);
	};
	soxEventListener.sensorDataReceived = function (soxEvent) {
		/**
		 * SoXサーバからセンサデータを受信すると呼ばれる。
		 * 受信したデータはTransducerインスタンスにセットされ、そのTransducerがイベントオブジェクトとして渡される。
		 */

        var device = soxEvent.device;
        if (device.name == 'CGR1240-ALPS-Sensor') {
            var lightIndex = 2;
            var temperatureIndex = 4;
            var humidityIndex = 5;

            tempALPS = device.transducers[temperatureIndex].sensorData.rawValue;
            humidALPS = device.transducers[humidityIndex].sensorData.rawValue;
            lightALPS = device.transducers[lightIndex].sensorData.rawValue;
            var timestamp = device.transducers[temperatureIndex].sensorData.timestamp;

            setALPSTemperature(tempALPS);
            setALPSHumidity(humidALPS);
            setALPSBrightness(lightALPS);
            setRoomComfortness(tempALPS, humidALPS);

            if (initFlagALPS) {
                setALPSGraph([timestamp, tempALPS]);
                initFlagALPS = false;
            }
            else {
                updateALPSGraph([timestamp, tempALPS]);
            }

        }
        if (device.name == '東京都港区ピンポイント天気(3時間)') {
            var temperatureIndex;
            var humidityIndex;
            var currentTime = new Date();
            currentHour = currentTime.getHours();

            temperatureIndex = getTempIndexNumber(currentHour);
            humidityIndex = getHumidIndexNumber(currentHour);

            tempAkasaka = device.transducers[temperatureIndex].sensorData.rawValue;
            humidAkasaka = device.transducers[humidityIndex].sensorData.rawValue;
            var timestamp = device.transducers[temperatureIndex].sensorData.timestamp;

            setAkasakaTemperature(tempAkasaka);
            setAkasakaHumidity(humidAkasaka);
            if (initFlagAkasaka) {
                setAkasakaGraph([timestamp, tempAkasaka], [timestamp, humidAkasaka]);
                initFlagAkasaka = false;
            }
            else {
                updateAkasakaGraph([timestamp, tempAkasaka], [timestamp, humidAkasaka]);
            }
        }
        if (device.name == '東京ミッドタウン最新ツイート画像') {
            var newestTweetTextIndex = 3;
            var newestTweetImageIndex = 4;
            newestTweetText = device.transducers[newestTweetTextIndex].sensorData.rawValue;
            newestTweetImage = device.transducers[newestTweetImageIndex].sensorData.rawValue;

            setNewestTweetText(newestTweetText);
            setNewestTweetImage(newestTweetImage);
        }

		status("Sensor data received: " + soxEvent.device);
	};
	
	client.setSoxEventListener(soxEventListener);
	client.connect();
};

function  status(message){
	var html = (new Date().toLocaleString()) + " [main.js] "
        + message + "<hr>\n" + $("#status").html();
	$("#status").html(html);
}

function getTempIndexNumber(hour) {
    var index = 0;

    switch (parseInt(hour / 3)) {
        case 0: 
            index = 11;
            break;
        case 1: 
            index = 12;
            break;
        case 2: 
            index = 13;
            break;
        case 3: 
            index = 14;
            break;
        case 4: 
            index = 15;
            break;
        case 5: 
            index = 16;
            break;
        case 6: 
            index = 17;
            break;
        case 7: 
            index = 18;
            break;
    }

    return index
}

function getHumidIndexNumber(hour) {
    var index = 0;

    switch (parseInt(hour / 3)) {
        case 0: 
            index = 35;
            break;
        case 1: 
            index = 36;
            break;
        case 2: 
            index = 37;
            break;
        case 3: 
            index = 38;
            break;
        case 4: 
            index = 39;
            break;
        case 5: 
            index = 40;
            break;
        case 6: 
            index = 41;
            break;
        case 7: 
            index = 42;
            break;
    }

    return index
}
