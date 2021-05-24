// This is a subset of the states.
// Use this to actually run the game
// (assume this is the full set of states.
// This will make it easier to test.
var states = ["Idaho", "South Dakota", "Hawaii", "Alaska", "Alabama", "New York"];

// These are all the states. It maps the state name to the number which you'll
// want to use in your API call.
var abvMap = {
    "Alabama": "01",
    "Alaska": "02",
    "Arizona": "04",
    "Arkansas": "05",
    "California": "06",
    "Colorado": "08",
    "Connecticut": "09",
    "Delaware": "10",
    "District Of Columbia": "11",
    "Florida": "12",
    "Georgia": "13",
    "Hawaii": "15",
    "Idaho": "16",
    "Illinois": "17",
    "Indiana": "18",
    "Iowa": "19",
    "Kansas": "20",
    "Kentucky": "21",
    "Louisiana": "22",
    "Maine": "23",
    "Maryland": "24",
    "Massachusetts": "25",
    "Michigan": "26",
    "Minnesota": "27",
    "Mississippi": "28",
    "Missouri": "29",
    "Montana": "30",
    "Nebraska": "31",
    "Nevada": "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    "Ohio": "39",
    "Oklahoma": "40",
    "Oregon": "41",
    "Pennsylvania": "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    "Tennessee": "47",
    "Texas": "48",
    "Utah": "49",
    "Vermont": "50",
    "Virginia": "51",
    "Washington": "53",
    "West Virginia": "54",
    "Wisconsin": "55",
    "Wyoming": "56",
}


/*
 * The majority of this project is done in JavaScript.
 *
 * 1. Start the timer when the click button is hit. Also, you must worry about
 *    how it will decrement (hint: setInterval).
 * 2. Check the input text with the group of states that has not already been
 *    entered. Note that this should only work if the game is currently in
 * 3. Realize when the user has entered all of the states, and let him/her know
 *    that he/she has won (also must handle the lose scenario). The timer must
 *    be stopped as well.
 *
 * There may be other tasks that must be completed, and everyone's implementation
 * will be different. Make sure you Google! We urge you to post in Piazza if
 * you are stuck.
 */
var countDown = 20;
var arraySize = states.length;


document.getElementById("timer").innerHTML = countDown;


$("#inp").on("keyup", function() { 
    var checker = $("#inp").val();
    if (states.length > 0) {
        for (var y of states) {
            if (checker.toUpperCase() == y.toUpperCase()) {
                    $("#inp").val('');
                    $("#container").append("<li class='state'>" + checker.toUpperCase()+ "</li>");
                    var pop = states.indexOf(y);
                    states.splice(pop,1);
                    break;
            }
        }
    }
})

$(document).on("mouseover","li.state", function () {
    var value = $(this).text();
    var sts = Object.keys(abvMap).find(key => key.toUpperCase() === value);
    var stateID = abvMap[sts];
    $.get("https://api.census.gov/data/2013/language?get=EST&for=state:"+stateID+"&LAN=625", function(data) {  
        const frm = new Intl.NumberFormat();
        var est = parseInt(data[1][0]);
        document.getElementById("value").innerHTML = "State Population: " + frm.format(est);
    })  
})
 



$("#start").on("click", function (){
    $("#inp").prop("disabled", false);
    var time = setInterval(function() {
        if (states.length > 0) {
            countDown = countDown - 1;
            document.getElementById("timer").innerHTML = countDown;

            if (countDown == 0) {
                clearInterval(time);
                var scr = arraySize - states.length;
                document.getElementById("score").innerHTML =  scr +"/"+ arraySize;
                document.getElementById("timer").innerHTML = "OVER";
                $("#inp").prop("disabled", true);
                document.getElementById("list").innerHTML = "REST of STATES";
                for(var st of states){
                   $("#restList").append("<li class='state'>" + st.toUpperCase()+ "</li>");
                }

            }
        } else if (states.length == 0) {

            $("#inp").prop("disabled", true);
            document.getElementById("score").innerHTML = "WINNER!!!!!";
        }
    },1000);
})
