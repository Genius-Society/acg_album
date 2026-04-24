// 加载主题 & 语言
if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "./config-37.json");
}

let cfg = localStorage.getItem("theme");
let zh_CN = ($("title").text() == "二次元相册");

function previewImg(src, txt) {
    $(".perfundo__image").css("background-image", "url(" + src + ")");
    $(".perfundo__caption").text(txt);
}

// 加载图片 & 音频
function loadSrc() {
    $.ajaxSettings.async = false;
    $.getJSON(cfg, function (result) {
        $("body").css("background-image", "url(" + result.wallpaper + ")");
        $("#contentToWrite").append(result.content);
        let sound = $("#soundname").find("a");
        sound.empty();
        sound.attr("href", result.bgmurl);
        sound.append(result.bgm);
        $.each(result.pics, function (i, item) {
            let desc = result.idol + " " + (i + 1).toString();
            let li = $("<li></li>");
            let a = $("<a></a>");
            a.attr("class", "perfundo__link");
            a.attr("href", "#perfundo-single2");
            a.append(`<img src="${item}">`);
            a.click(function () { previewImg(item, desc); });
            li.append(a);
            li.append(`<p class="date">${desc}</p>`);
            $("#myRoundabout").prepend(li);
        });
        $("#music").attr("src", result.bgmsrc);
    });
}

// 加载音乐播放器
function playPause() {
    let player = document.getElementById("music");
    let play_btn = $("#music_btn");
    if (player.paused) {
        player.play();
        play_btn.css("background", "url(./src/on.png) no-repeat");
    }
    else {
        player.pause();
        play_btn.css("background", "url(./src/mute.png) no-repeat");
    }
}

// 加载相册
function move() {
    // Get the moved DIV object
    let obj = document.getElementById("container");
    // Set the style positioning property to drag the div out of the current document flow.
    // In this way, he belongs to the entire active form. Can be stacked.
    obj.style.position = "absolute";
    obj.style.opacity = 0;
    // Animation counter.
    let num = 0;
    let period = 105;
    // Get the mobile div, the X coordinate of the entire active area
    let right = 0;
    // Get the mobile div, the Y coordinate of the entire active area
    let top = 140;
    // Move a DIV with a timer
    let timer = setInterval(function () { // moving function
        if (num == period) { // Move 105 times
            clearInterval(timer);
        }
        // Set by the left style property. unit is required
        obj.style.right = right + "px";
        // Set by the top style attribute, it must be with units
        obj.style.top = top - num * 2 + "px";
        // Increment the counter by one
        obj.style.opacity = num * 1.0 / period;
        obj.style.visibility = "visible";
        num++;
    }, 20); // 190
}

// 加载计时器
function thenceThen() {
    $.getJSON(cfg, function (result) {
        let followDate = new Date(result.date);
        let totalSecs = (new Date() - followDate) / 1000;
        let days = Math.floor(totalSecs / 3600 / 24);
        let hours = Math.floor((totalSecs - days * 24 * 3600) / 3600);
        let mins = Math.floor((totalSecs - days * 24 * 3600 - hours * 3600) / 60);
        let secs = Math.floor((totalSecs - days * 24 * 3600 - hours * 3600 - mins * 60));
        if (zh_CN) {
            document.getElementById("thenceThen").innerText = "成为" + result.idol + "粉丝已有\n" +
                days + "天" + hours + "小时" + mins + "分钟" + secs + "秒";
        }
        else {
            document.getElementById("thenceThen").innerText = "Has become the fan of " + result.idol + " for\n" +
                days + " days " + hours + " hours " + mins + " minutes " + secs + " seconds";
        }
    });
}

// 检查设备类型
function checkDeviceType() {
    const userAgent = navigator.userAgent || window.opera;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        let warning = zh_CN ? "请使用 PC 端浏览器查看!" : "Please view on PC browsers!"
        $("body").remove();
        $("html").append(`<body><h1 style="text-align: center; font-size: xxx-large;">${warning}</h1></body>`);
        return false;
    }
    return true;
}

// 加载全屏按钮
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}

// exit fullscreen
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}

function loadFullscreen() {
    // fullscreen related
    document.getElementById("fullscreen").addEventListener("click", function () {
        console.log("fullscreenElement" + document.fullscreenElement);
        console.log("documentElement" + document.documentElement);
        if (document.fullscreenElement) {
            closeFullscreen();
        } else {
            openFullscreen(document.documentElement);
        }
    });

    document.addEventListener('fullscreenchange', function () {
        if (document.fullscreenElement) {
            document.getElementById("fullscreen").innerText = zh_CN ? "退出全屏" : "Exit fullscreen";
        } else {
            document.getElementById("fullscreen").innerText = zh_CN ? "全屏" : "Fullscreen";
        }
    });
}

$(function () {
    if (!checkDeviceType()) return;
    loadSrc();
    writeContent(true);
    setTimeout(move, 1618);

    $("#myRoundabout").roundabout({
        shape: "figure8",
        minOpacity: 1
    });

    self.setInterval("thenceThen()", 1000);

    $("#theme").click(function () {
        localStorage.setItem("theme", cfg == "./config-37.json" ? "./config-rem.json" : "./config-37.json");
        if (document.fullscreenElement) closeFullscreen();
        location.reload(true);
    });

    $("#nav").hover(function () {
        $(this).removeClass("first");
    });

    loadFullscreen();
});