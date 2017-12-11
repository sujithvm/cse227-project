function *permute(a, n = a.length) {
    if (n <= 1) yield a.slice();
    else for (let i = 0; i < n; i++) {
        yield *permute(a, n - 1);
        const j = n % 2 ? 0 : i;
        [a[n-1], a[j]] = [a[j], a[n-1]];
    }
}

function gamePatternGenerator(n) {
    var permutations = Array.from(permute("SDFJKL".split(''))).map(perm => perm.join(''))
    var results = []
    var dict = "SDFJKL"
    for (var i = 0; i < permutations.length; i++) {
        var obj = new Object()
        obj.encoding = permutations[i];
        obj.pattern = [0]
        obj.results = []
  
        for (var j = 0; j < permutations[i].length; j++) {
            obj.pattern.push( dict.indexOf(permutations[i][j]))
        }
        results.push(obj);
    }

    var shuffled = results.sort(function(){ return .5 - Math.random()} );
    var selected = shuffled.slice(0,n);
    return selected
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function gameSequenceGenerator(pass_seq) {

    var permutations = Array.from(permute("SDFJKL".split(''))).map(perm => perm.join(''))
    shuffle(permutations)

    var data = {}
    data["password"] = pass_seq ? pass_seq : permutations.splice(0, 1)
    data["levels"] = []

    var initial_interval = 1.2;
    var initial_speed = 2.5;
    for (var lev = 1; lev <= 1; lev++) {

        var temp = []
        for (var i = 0; i < data["password"].length; i++) {
            temp = temp.concat(Array(1).fill(data["password"][i]))
        }
        shuffle(temp)
        var sequence = []
        for (var i = 0; i < temp.length; i++) {
            sequence.push(temp[i]);

            if (pass_seq && i % 3 == 0) {
                sequence.push(permutations[Math.floor(Math.random() * permutations.length)])
            }
        }

        var pattern_scores = {}
        for (var i = 0; i < sequence.length; i++) {
            pattern_scores[sequence[i]] = []
        }

        var level = {
            "speed": initial_speed + (lev-1) * 1.1,
            "interval": initial_interval - ((1.1) * (lev-1) * initial_interval)/(initial_speed + (lev-1) * 1.1),
            "sequence": sequence,
            "pattern_scores" : pattern_scores
        }
        data["levels"].push(level)
    }
    return data;
}

function gameSequenceGenerator(pass_seq) {

    var permutations = Array.from(permute("SDFJKL".split(''))).map(perm => perm.join(''))
    shuffle(permutations)

    var data = {}
    data["password"] = pass_seq ? pass_seq : permutations.splice(0, 5)
    data["levels"] = []

    var initial_interval = 1.2;
    var initial_speed = 2.5;
    for (var lev = 1; lev <= 5; lev++) {

        var temp = []
        for (var i = 0; i < data["password"].length; i++) {
            temp = temp.concat(Array(5).fill(data["password"][i]))
        }
        shuffle(temp)
        var sequence = []
        for (var i = 0; i < temp.length; i++) {
            sequence.push(temp[i]);

            if (pass_seq && i % 5 == 0) {
                sequence.push(permutations[Math.floor(Math.random() * permutations.length)])
            }
        }

        var pattern_scores = {}
        for (var i = 0; i < sequence.length; i++) {
            pattern_scores[sequence[i]] = []
        }

        var level = {
            "speed": initial_speed + (lev-1) * 1.1,
            "interval": initial_interval - ((1.1) * (lev-1) * initial_interval)/(initial_speed + (lev-1) * 1.1),
            "sequence": sequence,
            "pattern_scores" : pattern_scores
        }
        data["levels"].push(level)
    }
    return data;
} 

function gameSequenceGenerator4(pass_seq) {
    
    var permutations = Array.from(permute("DFJK".split(''))).map(perm => perm.join(''))
    shuffle(permutations)

    var data = {}
    data["password"] = pass_seq ? pass_seq : permutations.splice(0, 4)
    data["levels"] = []
    
    var initial_interval = 1.2;
    var initial_speed = 2.5;
    for (var lev = 1; lev <= 5; lev++) {
    
        var temp = []
        for (var i = 0; i < data["password"].length; i++) {
            temp = temp.concat(Array(5).fill(data["password"][i]))
        }
        shuffle(temp)
        var sequence = []
        for (var i = 0; i < temp.length; i++) {
            sequence.push(temp[i]);
    
            if (pass_seq && i % 4 == 0) {
                sequence.push(permutations[Math.floor(Math.random() * permutations.length)])
            }
        }
    
        var pattern_scores = {}
        for (var i = 0; i < sequence.length; i++) {
            pattern_scores[sequence[i]] = []
        }
    
        var level = {
            "speed": initial_speed + (lev-1) * 1.1,
            "interval": initial_interval - ((1.1) * (lev-1) * initial_interval)/(initial_speed + (lev-1) * 1.1),
            "sequence": sequence,
            "pattern_scores" : pattern_scores
        }
        data["levels"].push(level)
    }
    console.log(pass_seq)
    return data;
}

module.exports = gameSequenceGenerator4
