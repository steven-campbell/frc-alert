// set up globals
    var X_TBA_App_Id = "frc1647:scouting-system:v01";
    var year = "2014";

// api request functions
// these are called by a save function that puts into local storage

    // gets all the events for the current year
    var getEvents = function(year)
    {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "http://www.thebluealliance.com/api/v2/events/" + year + "?X-TBA-App-Id=" + X_TBA_App_Id, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    // gets specific info for 1 competition
    var getEventInfo = function(event)
    {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "http://www.thebluealliance.com/api/v2/event/" + event + "?X-TBA-App-Id=" + X_TBA_App_Id, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;    
    }

    // get a list of all teams
    var getAllTeams = function()
    {
        // not sure how to do
    }

    // get info and matches for a team
    var getSpecTeam = function(number, year)
    {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "http://www.thebluealliance.com/api/v2/team/frc" + number + "/" + year + "?X-TBA-App-Id=" + X_TBA_App_Id, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;    
    }

    // get all teams in a competition
    var getEventTeams = function(event)
    {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "http://www.thebluealliance.com/api/v2/event/" + event + "/teams?X-TBA-App-Id=" + X_TBA_App_Id, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;    
    }

    // get all matches in a competition
    var getEventMatches = function(event)
    {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "http://www.thebluealliance.com/api/v2/event/" + event + "/matches?X-TBA-App-Id=" + X_TBA_App_Id, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;    
    }

// save function
    // this function calls api functions and saves to local storage

    // USE: 0 = events of a year (only type)
    //      1 = specific event info (type, event,)
    //      2 = all teams (only type) (not implemented yet)
    //      3 = specific team info (type, , number)
    //      4 = event teams (type, event)
    //      5 = event matches (type, event)
    var saveData = function (type, event, number) {
        var valid = false;
        var data;
        // validation of data inputted
        switch (type) {
            case 0:
                if (event === undefined && number === undefined) {
                    valid = true;
                }
                break;
            case 1:
                if (number === undefined) {
                    valid = true;
                }
                break;
            case 2:
                if (event === undefined && number === undefined) {
                    valid = true;
                }
                break;
            case 3:
                if (event === undefined) {
                    valid = true;
                }
                break;
            case 4:
                if (number === undefined) {
                    valid = true;
                }
                break;
            case 5:
                if (number === undefined) {
                    valid = true;
                }
                break;
            default:
                break;
        }
        if (valid) {
            // call correct method
            switch (type) {
                case 0:
                    data = getEvents(year);
                    break;
                case 1:
                    data = getEventInfo(event);
                    break;
                case 2:
                    data = getAllTeams();
                    break;
                case 3:
                    data = getSpecTeam(number, year);
                    break;
                case 4:
                    data = getEventTeams(event);
                    break;
                case 5:
                    data = getEventMatches(event);
                    break;
            }
            // actually save
            if (data != undefined && localStorage) {
                // these types are ok to be overwritten/don't need any other data
                if (type == 0 || type == 2) {
                    localStorage[type] = data;

                }
                // type 1/4/5 require an event
                // stored as type-event ie 4-2014njtab
                if (type == 1 || type == 4 || type == 5) {
                    localStorage[type + "-" + event] = data;
                }

                // type 3 needs a team number
                if (type == 3) {
                    localStorage[type + "-" + number] = data;
                }
            }
        }
    }
    var clearAll = function () {
        if(confirm("Are you sure you would like to delete all data? It will have to be re-downloaded?"))
            localStorage.clear();
    }

// init
// will only work once, use the below to do manually or when wanted
    var firstInit = function () {
        if (localStorage['firstRefresh'] === undefined) {
            saveData(0);
            var data = localStorage['0'];
            data = JSON.parse(data);
            for (var i = 0, n = data.length; i < n; i++) {
                saveData(1, data[i]);
            }
        }
        localStorage['firstRefresh'] = true;
    }

// refresh list of competitions manually
    var refreshInit = function() {
            saveData(0);
            var data = localStorage['0'];
            data = JSON.parse(data);
            for (var i = 0, n = data.length; i < n; i++) {
                saveData(1, data[i]);
            }
    }

// display functions
    // display list of competitions from localStorage
    var dispEvents = function () {
        // JSON.parse(localStorage['1-' + JSON.parse(localStorage['0'])[0]]).name
        var eventTable = document.getElementById("events");
        for (var i = 0, n = JSON.parse(localStorage['0']).length; i < n; i++) {
            var row = eventTable.insertRow(i);
            var name = row.insertCell(0);
            var date = row.insertCell(1);
            name.innerHTML = JSON.parse(localStorage['1-' + JSON.parse(localStorage['0'])[i]]).name;
            date.innerHTML = JSON.parse(localStorage['1-' + JSON.parse(localStorage['0'])[i]]).start_date;

        }
    }