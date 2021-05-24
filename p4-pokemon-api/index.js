var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pokeDataUtil = require("./poke-data-util");
var exphbs  = require('express-handlebars');
var _ = require("underscore");
var app = express();
var PORT = 3000;

// Restore original data into poke.json. 
// Leave this here if you want to restore the original dataset 
// and reverse the edits you made. 
// For example, if you add certain weaknesses to Squirtle, this
// will make sure Squirtle is reset back to its original state 
// after you restarted your server. 
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable. 
var _DATA = pokeDataUtil.loadData().pokemon;

/// Setup body-parser. No need to touch this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get("/", function(req, res) {
    // HINT: 
    var contents = "";
    var n = 1
     _.each(_DATA, function(i) {
        
       contents += `<tr><td>` + n + `</td><td><a href=` + `/pokemon/` + n + ">" + i.name + `</a></td></tr>\n`;
       n = n + 1
    })
    var html = `<html>\n<body>\n<table>`+ contents +`</table>\n</body>\n</html>`;
    res.send(html);
});

app.get("/pokemon/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id)
    var result = _.findWhere(_DATA, { id: _id })
    var contents = "";
    for (i = 0; i < Object.keys(result).length; i++) {
     

        var key = Object.keys(result)[i]
        var val = Object.values(result)[i]
        contents +=  `<tr><td>${key}</td><td>${JSON.stringify(val)}</td></tr>\n`;
    }
    var html = `<html>\n<body>\n<table>`+contents+`</table>\n</body>\n</html>`;

    res.send(html);
});

app.get("/pokemon/image/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id)
    var result = _.findWhere(_DATA, { id: _id })
    
    if(!result){return res.send('Error: Pokemon not bot found.')}
    var contents = "http://www.serebii.net/pokemongo/pokemon/0" + req.params.pokemon_id + ".png"
    var html = `<html>\n<body>\n<img src=`+contents+`>\n</body>\n</html>`;
    res.send(html);

});

app.get("/api/id/:pokemon_id", function(req, res) {
    // This endpoint has been completed for you.  
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({});
    res.json(result);
});

app.get("/api/evochain/:pokemon_name", function(req, res) {
    var _name = req.params.pokemon_name;
    var result = _.findWhere(_DATA, {name: _name})
    if (!result) return res.json([]);
    var ret = [_name.toString()]
    var nxt = result.next_evolution
    var prv = result.prev_evolution    
    if (!_.isEmpty(nxt)) {
        for (var n in nxt) {
            if(nxt.hasOwnProperty(n)){
                ret.push(nxt[n].name)
             }
        }
    }
    if (!_.isEmpty(prv)) {
        for (var n in prv) {
            if(prv.hasOwnProperty(n)){
               ret.push(prv[n].name)
            }
        }
    }
    
    res.send(ret.sort());
});

app.get("/api/type/:type", function(req, res) {
    var tp = req.params.type
    var ret = []
    for (var n in _DATA) {
        if (_DATA.hasOwnProperty(n)) {
            if (_DATA[n].type.includes(tp)){
                ret.push(_DATA[n].name)
            }
        }
    }

    res.send(ret)
});

app.get("/api/type/:type/heaviest", function(req, res) {
    var ret = {"name": "temp", "weight": 0}
    var tp = req.params.type
    var check = 0;
    for (var n in _DATA) {
        if (_DATA.hasOwnProperty(n)) {
            if (_DATA[n].type.includes(tp)){
                var wght = _DATA[n].weight.split(" ")
                var wght = parseInt(wght)
                if ( wght > ret.weight) {
                    ret.name = _DATA[n].name
                    ret.weight = wght
                    check = check + 1
                }
            }
        }
    }
    if (check == 0) {
        ret = {}
    }
    res.send(ret);
});

app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    // HINT: 
    // Use `pokeDataUtil.saveData(_DATA);`
    var _name = req.params.pokemon_name
    var weakness = req.params.weakness_name
    var result = _.findWhere(_DATA, {name: _name})
    var ret = {}

    if (!result) {return res.send(ret)}
    if (!result.weaknesses.includes(weakness)) {
        result.weaknesses.push(weakness)
    }
    ret = {"name": _name, "weaknesses": result.weaknesses}

    pokeDataUtil.saveData(_DATA)
   
    res.send(ret)

});

app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {

    var _name = req.params.pokemon_name
    var weakness = req.params.weakness_name
    var result = _.findWhere(_DATA, {name: _name})
    var ret = {}

    if (!result) {return res.send(ret)}

    if (result.weaknesses.includes(weakness)) {
        for (i = 0; i < result.weaknesses.length; i++) {
            if (result.weaknesses[i] == weakness){
                result.weaknesses.splice(i,1)
            }
        }   
    }
    ret = {"name": _name, "weaknesses": result.weaknesses}

    pokeDataUtil.saveData(_DATA)
    result = _.findWhere(_DATA, {name: _name})
    res.send(ret)

});


// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});9

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
