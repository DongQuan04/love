window.requestAnimationFrame =
    window.__requestAnimationFrame ||
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        (function () {
            return function (callback, element) {
                var lastTime = element.__lastTime;
                if (lastTime === undefined) {
                    lastTime = 0;
                }
                var currTime = Date.now();
                var timeToCall = Math.max(1, 33 - (currTime - lastTime));
                window.setTimeout(callback, timeToCall);
                element.__lastTime = currTime + timeToCall;
            };
        })();
window.isDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase()));
var loaded = false;
var init = function () {
    if (loaded) return;
    loaded = true;
    var mobile = window.isDevice;
    var koef = mobile ? 0.5 : 1;
    var canvas = document.getElementById('heart');
    var ctx = canvas.getContext('2d');
    var width = canvas.width = koef * innerWidth;
    var height = canvas.height = koef * innerHeight;
    var rand = Math.random;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    // Phần code mới - Hiệu ứng chữ lãng mạn
    var clickCount = 0;
    var textAlpha = 0;
    var textSize = mobile ? 10 : 20;
    var textTargetSize = mobile ? 25 : 40;
    var glowIntensity = 0;
    var hearts = [];
    var maxHearts = mobile ? 10 : 20;
    var messages = [
        "Anh yêu em rất nhiều cục Dzàng",
        "Anh iu tục tưng lắm <3"
    ];

    canvas.addEventListener('click', function() {
        clickCount++;
        if (clickCount > 2) clickCount = 1;
        
        // Tạo các trái tim bay khi click
        for (var i = 0; i < maxHearts; i++) {
            hearts.push({
                x: width / 2,
                y: height / 2,
                size: rand() * 10 + 5,
                speedX: (rand() - 0.5) * 4,
                speedY: (rand() - 0.5) * 4,
                alpha: 1,
                life: rand() * 100 + 50
            });
        }
    });

    function drawRomanticText() {
        if (clickCount > 0) {
            // Hiệu ứng fade in
            textAlpha = Math.min(1, textAlpha + 0.02);
            textSize = Math.min(textTargetSize, textSize + 0.5);
            glowIntensity = Math.min(15, glowIntensity + 0.2);
            
            // Tạo gradient màu hồng
            var gradient = ctx.createLinearGradient(width/2 - 200, height/2 - 30, width/2 + 200, height/2 + 30);
            gradient.addColorStop(0, 'rgba(255, 105, 180, 0.9)');
            gradient.addColorStop(0.5, 'rgba(255, 20, 147, 1)');
            gradient.addColorStop(1, 'rgba(255, 0, 100, 1)');
            
            // Hiệu ứng glow
            ctx.shadowColor = 'rgba(255, 105, 180, 0.7)';
            ctx.shadowBlur = glowIntensity;
            
            // Vẽ text chính
            ctx.font = 'bold ' + textSize + 'px "Arial", sans-serif';
            ctx.fillStyle = gradient;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Chọn message theo clickCount
            var currentMessage = messages[(clickCount-1) % messages.length];
            
            // Vẽ nhiều lần để đậm hơn
            ctx.fillText(currentMessage, width / 2, height / 2);
            ctx.fillText(currentMessage, width / 2, height / 2);
            
            // Vẽ trái tim nhỏ cuối câu
            ctx.font = (textSize/2) + 'px Arial';
            ctx.fillText('❤', width / 2 + ctx.measureText(currentMessage).width/2 + 20, height / 2);
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
            
            // Vẽ các trái tim bay
            for (var i = 0; i < hearts.length; i++) {
                var h = hearts[i];
                ctx.fillStyle = 'rgba(255, ' + (100 + rand() * 100) + ', ' + (150 + rand() * 100) + ', ' + h.alpha + ')';
                ctx.font = h.size + 'px Arial';
                ctx.fillText('❤', h.x, h.y);
                
                // Cập nhật vị trí
                h.x += h.speedX;
                h.y += h.speedY;
                h.life--;
                h.alpha = h.life / 100;
                
                // Loại bỏ trái tim đã hết hiệu ứng
                if (h.life <= 0) {
                    hearts.splice(i, 1);
                    i--;
                }
            }
        } else {
            // Hiệu ứng fade out
            textAlpha = Math.max(0, textAlpha - 0.02);
            textSize = Math.max(mobile ? 10 : 20, textSize - 0.5);
            glowIntensity = Math.max(0, glowIntensity - 0.2);
        }
    }
    // Kết thúc phần code mới

    var heartPosition = function (rad) {
        return [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
    };
    var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
        return [dx + pos[0] * sx, dy + pos[1] * sy];
    };

    window.addEventListener('resize', function () {
        width = canvas.width = koef * innerWidth;
        height = canvas.height = koef * innerHeight;
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, width, height);
    });

    var traceCount = mobile ? 20 : 50;
    var pointsOrigin = [];
    var i;
    var dr = mobile ? 0.3 : 0.1;
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
    var heartPointsCount = pointsOrigin.length;

    var targetPoints = [];
    var pulse = function (kx, ky) {
        for (i = 0; i < pointsOrigin.length; i++) {
            targetPoints[i] = [];
            targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
            targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
        }
    };

    var e = [];
    for (i = 0; i < heartPointsCount; i++) {
        var x = rand() * width;
        var y = rand() * height;
        e[i] = {
            vx: 0,
            vy: 0,
            R: 2,
            speed: rand() + 5,
            q: ~~(rand() * heartPointsCount),
            D: 2 * (i % 2) - 1,
            force: 0.2 * rand() + 0.7,
            f: "hsla(0," + ~~(40 * rand() + 60) + "%," + ~~(60 * rand() + 20) + "%,.3)",
            trace: []
        };
        for (var k = 0; k < traceCount; k++) e[i].trace[k] = {x: x, y: y};
    }

    var config = {
        traceK: 0.4,
        timeDelta: 0.01
    };

    var time = 0;
    var loop = function () {
        var n = -Math.cos(time);
        pulse((1 + n) * .5, (1 + n) * .5);
        time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;
        ctx.fillStyle = "rgba(0,0,0,.1)";
        ctx.fillRect(0, 0, width, height);
        for (i = e.length; i--;) {
            var u = e[i];
            var q = targetPoints[u.q];
            var dx = u.trace[0].x - q[0];
            var dy = u.trace[0].y - q[1];
            var length = Math.sqrt(dx * dx + dy * dy);
            if (10 > length) {
                if (0.95 < rand()) {
                    u.q = ~~(rand() * heartPointsCount);
                }
                else {
                    if (0.99 < rand()) {
                        u.D *= -1;
                    }
                    u.q += u.D;
                    u.q %= heartPointsCount;
                    if (0 > u.q) {
                        u.q += heartPointsCount;
                    }
                }
            }
            u.vx += -dx / length * u.speed;
            u.vy += -dy / length * u.speed;
            u.trace[0].x += u.vx;
            u.trace[0].y += u.vy;
            u.vx *= u.force;
            u.vy *= u.force;
            for (k = 0; k < u.trace.length - 1;) {
                var T = u.trace[k];
                var N = u.trace[++k];
                N.x -= config.traceK * (N.x - T.x);
                N.y -= config.traceK * (N.y - T.y);
            }
            ctx.fillStyle = u.f;
            for (k = 0; k < u.trace.length; k++) {
                ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
            }
        }
        
        drawRomanticText();
        
        window.requestAnimationFrame(loop, canvas);
    };
    loop();
};

var s = document.readyState;
if (s === 'complete' || s === 'loaded' || s === 'interactive') init();
else document.addEventListener('DOMContentLoaded', init, false);