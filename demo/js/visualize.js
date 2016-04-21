var alpsTempData = [];
var akasakaTempData = [];
var ALPSPlot;
var AkasakaPlot;

function setALPSTemperature(temp) {
    var color = "";

    if (temp < 10) {
        color = "#0101DF";
    }
    else if (temp < 15) {
        color = "#5882FA";
    }
    else if (temp < 20) {
        color = "#04B404";
    }
    else if (temp < 25) {
        color = "#FACC2E";
    }
    else if (temp < 30) {
        color = "#FE642E";
    }
    else if (30 < temp) {
        color = "#FF0000";
    }
    $("#alps-temp").css("color", color);
    $("#alps-temp").html(temp);
}
function setALPSHumidity(humid) {
    $("#alps-humid").html(humid);
}
function setALPSBrightness(light) {
    $("#alps-light").html(light);
}
function setAkasakaTemperature(temp) {
    var color = "";

    if (temp < 10) {
        color = "#0101DF";
    }
    else if (temp < 15) {
        color = "#5882FA";
    }
    else if (temp < 20) {
        color = "#04B404";
    }
    else if (temp < 25) {
        color = "#FACC2E";
    }
    else if (temp < 30) {
        color = "#FF4000";
    }
    else if (30 < temp) {
        color = "#FF0000";
    }
    $("#akasaka-temp").css("color", color);
    $("#akasaka-temp").html(temp);
}
function setAkasakaHumidity(humid) {
    $("#akasaka-humid").html(humid);
}

function setALPSGraph(data) {
    alpsTempData.push(data);

    var options = {
        series: { shadowSize: 0 },
        yaxis: { min: 0 },
        xaxis: {
            ticks: 30,
            tickSize: [1, "minute"],
            show: true,
            mode: "time",
            timeformat: "%H:%M"
        },
        yaxes: [{
            axisLabel:"℃",
            position: "left"
        }],
        lines: { show: true },
        points: { show: true },
        colors: ["#FF4000"]
    };
    ALPSPlot = $.plot($("#alps-temp-graph"), [alpsTempData], options);
}

function updateALPSGraph(data) {
    alpsTempData.push(data);
    if (alpsTempData.length > 30) {
        alpsTempData.shift();
    }
    ALPSPlot.setData([alpsTempData]);
    ALPSPlot.setupGrid();
    ALPSPlot.draw();
}

function setAkasakaGraph(data) {
    akasakaTempData.push(data);

    var options = {
        series: { shadowSize: 0 },
        yaxis: {
            min: 0
        },
        xaxis: {
            ticks: 10,
            tickSize: [1, "minute"],
            show: true,
            mode: "time",
            timeformat: "%H:%M"
        },
        axisLabels: { show: true },
        yaxes: [{
            axisLabel:"℃",
            position: "left"
        }],
        lines: { show: true },
        points: { show: true },
        colors: ["#0022FF"]
    };
    AkasakaPlot = $.plot($("#akasaka-temp-graph"), [akasakaTempData], options);
}

function updateAkasakaGraph(data) {
    akasakaTempData.push(data);
    if (akasakaTempData.length > 10) {
        akasakaTempData.shift();
    }
    AkasakaPlot.setData([akasakaTempData]);
    AkasakaPlot.setupGrid();
    AkasakaPlot.draw();
}

function setRoomComfortness(temp, humidity) {
    var di = calculateRoomComfortness(temp, humidity);
    var text = "取得中...";

    if (di < 60) {
        color = "#5882FA";
        text = "少し寒い..."
    }
    else if (di < 75) {
        color = "#FACC2E";
        text = "快適!"
    }
    else if (di < 80) {
        color = "#FE642E";
        text = "少し暑い..."
    }
    else if (80 < di) {
        color = "#FF0000";
        text = "暑い..."
    }

    $("#comfortness").css("color", color);
    $("#comfortness").html(di);
    $("#comfort-text").html(text);
}

function setNewestTweetImage(img) {
    $("#midtown-img").attr("src", img);
}

function setNewestTweetText(text) {
    $("#tweet").html(text);
}

function calculateRoomComfortness(temp, humidity) {
    var discomfortIndex = 0.81 * temp + 0.01 * humidity * (0.99 * temp - 14.3) + 46.3;
    discomfortIndex = floatFormat(discomfortIndex, 2);

    /*
     * Discomfort Index Indication
     * DI < 60      : cold
     * 60 < DI < 75 : comfort
     * 75 < DI < 80 : bit hot
     * 80 < DI      : hot
    switch (discomfortIndex) {
        case discomfortIndex < 60:
            break;
        case 60 <= discomfortIndex && discomfortIndex < 75:
            break;
        case 75 <= discomfortIndex && discomfortIndex < 80:
            break;
        case discomfortIndex < 80:
            break;
    }
    */

    return discomfortIndex;
}

function floatFormat( number, n ) {
    var _pow = Math.pow( 10 , n ) ;

    return Math.round( number * _pow ) / _pow ;
}