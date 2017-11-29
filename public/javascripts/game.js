window.onload = function() {
    console.log(data)
    
    var canvases = []
    var titles = []
    for (var i = 0; i < 6; i++) {
        canvases.push(document.getElementById("canvas" + i));
        titles.push(document.getElementById("title" + i));
    }

    var sequences = data.patterns
    var sqptr = -1;
    var sequence = [];
    var ptr = 0;
    var count = 0;
    var counter = null;

    var keycodeMap = {0:83, 1:68, 2:70, 3:74, 4:75, 5:76}
    var expectedKey = -1;
    var correctEntry = false;
    var keyPressed = false;
    var hits = 0;
    var misses = 0; 

    var hitsDisplay = document.getElementById("hits");
    var missesDisplay = document.getElementById("misses");

    document.addEventListener("keydown", keyDownHandler, false);
    function keyDownHandler(e) {
        keyPressed = true;
        if (e.keyCode == expectedKey) {
            correctEntry = true
        } else {
            misses += 1;
        }
    }

    var y = Array(6).fill(0); 
    var dy = 1; 
    var intervals = Array(6);
    
    function draw(forCanvas) {
        titles[forCanvas].style.color = "orange"
        expectedKey = keycodeMap[forCanvas]
        var skip = false;

        hitsDisplay.innerHTML = "Hits: " + hits;
        missesDisplay.innerHTML = "Misses: " + misses;
    
        var canvas = canvases[forCanvas];
        var ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(canvas.width / 2, y[forCanvas], 50, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
        y[forCanvas] += dy; 

        if (correctEntry) {    
            hits += 1;
            correctEntry = false;
            titles[forCanvas].style.color = "green"
            skip = true;
        }  

        if (skip || y[forCanvas] > canvas.height + 80) {
            y = Array(6).fill(0)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            titles[forCanvas].style.color = "black"
            clearInterval(intervals[forCanvas]);
            callback()
        }
    }

    function callback() {
        ptr += 1;
        if (ptr >= sequence.length) {
            display();
            return;
        }
        var stack = sequence[ptr]
        intervals[stack] = setInterval( function() { draw(stack) }, 10);
    }

    function display() {
        y = Array(6).fill(0); 
        intervals = Array(6);
        ptr = 0;
        dy += 2;
        if (dy > 20) {
            clearInterval(counter);
            saveAndReset()
            sequencer();
            return;
        }
        callback();
    }

    function saveAndReset() {
        data.patterns[sqptr].results.push({
            "hits": hits,
            "misses": misses,
            "time": count
        })
  
        hits = 0;
        misses = 0;
        ptr = 0;
        count = 0;
        dy = 0;
    }

    function timer() {
        count++;
        document.getElementById("timer").innerHTML= "" + count / 100+ " secs"; 
    }

    function sequencer() {
        sqptr++;
        if (sqptr < sequences.length) {
            sequence = sequences[sqptr].pattern;
            console.log(sequence)
            
            counter = setInterval(timer, 10);
            display()
        } else {
            $.ajax({
                type: "POST",
                url: "/game/trainstore",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){ },
                failure: function(errMsg) { }
            });
            console.log(data);
        }
    }

    sequencer()
}