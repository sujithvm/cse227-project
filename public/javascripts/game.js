window.onload = function() {
    
        //console.log(userdata)
        
        var canvases = []
        var titles = []
        for (var i = 0; i < 6; i++) {
            canvases.push(document.getElementById("canvas" + i));
            titles.push(document.getElementById("title" + i));
        }
        var lineMarker = 180;
        var ballRadius = 50;
    
        var hits = 0;
        var misses = 0; 
        var hitsDisplay = document.getElementById("hits");
        var missesDisplay = document.getElementById("misses");
    
        var keycodeMap = {0:83, 1:68, 2:70, 3:74, 4:75, 5:76}
        var charNumMap = {'S': 0, 'D': 1, 'F': 2, 'J': 3, 'K': 4, 'L':5}
        var expectedKey = -1;
        var correctkeyPressed = false;
        var keyPressed = false;
    
        var queue = []    
        var currentBall = null;
        var levels = userdata["data"]["levels"]
        var gameRender = null;
    
        document.addEventListener("keydown", keyDownHandler, false);
        function keyDownHandler(e) {
            keyPressed = true;
    
            if (currentBall && e.keyCode == expectedKey && currentBall.y >= canvases[currentBall.canvasNumber].height - lineMarker - ballRadius ) {
                hits += 1;
                pattern_hits += 1;
                expectedKey = -1;
                correctkeyPressed = true

                currentBall.show = false;
                cleanQueue()

            } else {
                misses += 1;
                pattern_misses += 1;
            }
        }
    
        function guid() {
            function s4() {
              return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
          }
    
        var Ball = {
            create: function(level, pattern, patternPosition, canvasNumber, dy) {
                var ball = Object.create(this);
                ball.id = guid();
                ball.level = level;
                ball.pattern = pattern;
                ball.patternPosition = patternPosition;
                ball.canvasNumber = canvasNumber;
                ball.canvas = canvases[canvasNumber];
                ball.ctx = ball.canvas.getContext("2d");
                ball.x = ball.canvas.width / 2;
                ball.dx = 0;
                ball.y = 0;
                ball.dy = dy;
                ball.show = true;
                return ball;
            },
    
            draw: function() { 
                this.ctx.beginPath();
                this.ctx.arc(this.x, this.y, ballRadius, 0, Math.PI*2);
    
                if (this.y >= canvases[this.canvasNumber].height - lineMarker - ballRadius) {
                    this.ctx.fillStyle = "orange"
                    titles[this.canvasNumber].style.color = "orange"
                } else {
                    this.ctx.fillStyle = "#0095DD";
                }
    
                this.ctx.fill();
                this.ctx.closePath();
                this.move();
            },
    
            move: function() {
                this.y += this.dy;
            }
        }
    
        function drawLineMarkers() {
            for (var i = 0; i < canvases.length; i++) {
                var ctx = canvases[i].getContext("2d")
                ctx.setLineDash([5, 3]);
                ctx.beginPath();
                ctx.moveTo(0, canvases[i].height - lineMarker);
                ctx.lineTo(canvases[i].width, canvases[i].height - lineMarker);
                ctx.stroke();
            }
        }
        
        var levptr = -1
        var sqptr = -1
        var patptr = -1 
        var sequence = []
        var pattern = "";
        var pattern_hits = 0;
        var pattern_misses = 0;
        var speed = 0;
        var interval = 0;
    
        function nextLevel() {
            levptr++;
            if (levptr < levels.length) {
                var level = levels[levptr]
                sequence = level["sequence"]
                speed = level["speed"]
                interval = level["interval"]
                sqptr = -1;
		lineMarker += 20;
                
                setTimeout(function() {
                    playSequence()
                }, 2500);
            } 
        }
    
        function playSequence() {
            sqptr++;
            if (sqptr < sequence.length) {
                pattern = sequence[sqptr];
                patptr = -1
                showPattern()
            } else {
                nextLevel();
            }
        }
    
        function showPattern() {
            patptr++;
            if (patptr < pattern.length) {
                setTimeout(function() {

                    queue.push(Ball.create(levptr, pattern, patptr, charNumMap[pattern[patptr]], speed))
                    showPattern()
                }, interval * 1000);
            } else {
                playSequence(); 
            }
        }
    
        function display() {
            hitsDisplay.innerHTML = "Hits: " + hits;
            missesDisplay.innerHTML = "Misses: " + misses;
    
            for (var i = 0; i < 6; i++) {
                canvases[i].getContext("2d").clearRect(0, 0, canvases[i].width, canvases[i].height)
                titles[i].style.color = "black"
            }
            drawLineMarkers();
    
            cleanQueue()
            
            for (var i = 0; i < queue.length; i++) {
                queue[i].draw()
            }
    
            if (queue.length > 0) {
                currentBall = queue.reduce((p, c) => (p.y > c.y) ? p : c)
                expectedKey = keycodeMap[currentBall.canvasNumber];
            }

            if (levptr == levels.length && queue.length == 0) {
                clearInterval(gameRender)

                $.ajax({
                    type: "POST",
                    url: type == "train" ? "/game/trainstore" : "/game/teststore",
                    data: JSON.stringify(userdata),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });

                if (type == "train") {
                    alert("You are now trained with game. Go to Authenticate !!")
                    window.location.href = "/authenticate"
                } else {
                    alert("Thank you!")
                    window.location.href = "/"
                }
                
            }
        }

        function cleanQueue() {

            var temp = queue.filter(b => (b.show == false || b.y >= b.canvas.height + ballRadius) && b.patternPosition == 5)
            if (temp.length == 1) {
                var b = temp[0];
                userdata["data"]["levels"][b.level]["pattern_scores"][b.pattern].push({"hits": pattern_hits, "misses": pattern_misses})
                
                pattern_hits = 0;
                pattern_misses = 0;
            }
            
            queue = queue.filter(b => b.show == true);
            queue = queue.filter(b => b.y < b.canvas.height + ballRadius);
        }
    
        nextLevel();
        gameRender = setInterval(function(){ display() }, 10);
    
    }
