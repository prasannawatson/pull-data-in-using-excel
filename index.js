//To delete a row in a table
function deleteRow(i){
    var r = i.parentNode.parentNode.rowIndex;
    document.getElementById("myTable").deleteRow(r);
}

//To edit a row in a table
function editRow(i){
    var r = i.parentNode.parentNode.rowIndex;
    document.getElementById("myTable").rows[r].contentEditable = "true";
    //console.log(r);
    //console.log(table);
}

//To create table for mapping
function insertValues(id, note){
    for(var i = 0; i < id.length; i++){
        var icon = document.createElement("i");
        icon.setAttribute("class" , "fal fa-edit");
        icon.setAttribute("onClick" , "editRow(this);")
        var icon1 = document.createElement("i");
        icon1.setAttribute("class" , "fal fa-trash-alt");
        icon1.setAttribute("onClick" , "deleteRow(this);")
        var table = document.getElementById("myTable");
        var row = table.insertRow(i+1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = id[i];
        cell2.innerHTML = note[i];
        cell3.innerHTML = "Excel Header";
        cell4.appendChild(icon);
        cell4.appendChild(icon1);
    }
}

//To store QuestionId and note in an array using our API
function getQuestionId(location,auth_token){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.getcloudcherry.com/api/Questions/Active",
        "method": "GET",
        "headers": {
            "Accept" : "*/*",
            "contentType" : 'application/x-www-form-urlencoded; charset=UTF-8',
            "Authorization": auth_token
        },
        error: function(xhr, error) {
            alert("Questions API failed");
        }
    };
    //To store question IDs and notes
    var id = [];
    var note = [];
    var i = 0;
    $.ajax(settings).done(function(oResponse) {
        if (oResponse) {
            //console.log(oResponse);
            for (var j = 0; j < oResponse.length; j++){
                for (var index = 0; index < oResponse[j].displayLocation.length; index++){
                    if(oResponse[j].displayLocation[index] == location){
                        id[i] = oResponse[j].id;
                        note[i] = oResponse[j].note;
                        i++;
                    }
                }
            }
        }
        //console.log(id);
        //console.log(note);
        document.querySelector('.create-table').style.display = "block";
        document.querySelector('.get-questions').style.display = "none"
        insertValues(id,note);
    })
}

//To get selected question
function selectQuestionairre(auth_token){
    document.querySelector('.select-text').addEventListener("change", function(){
        var location = document.querySelector('.select-text').value;
        getQuestionId(location,auth_token);
    });
}

//Calling settings API to get questionairres 
function getQuestionairreName(auth_token){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.getcloudcherry.com/api/Settings",
        "method": "GET",
        "headers": {
            "Accept" : "*/*",
            "contentType" : 'application/x-www-form-urlencoded; charset=UTF-8',
            "Authorization": auth_token
        },
        error: function(xhr, error) {
            alert("Settings API failed");
        }
    };
    var questionairres;
    $.ajax(settings).done(function(oResponse) {
        if (oResponse) {
            questionairres = oResponse.locations;
            document.querySelector('.get-questions').style.display = "block"
            //console.log(oResponse.locations);

            //To make a drop down of questionairres
            var select = document.querySelector('.select-text');
            for (var i = 0; i< questionairres.length; i++){
                var question = questionairres[i];
                var option = document.createElement("option");
                option.textContent = question;
                option.value = question;
                select.appendChild(option);
            }
            selectQuestionairre(auth_token);
        }
    });
}

//To get bearer-token using our Login API
function getAuthenticationToken(user){
    var body = {
        grant_type: 'password',
        username: user.username,
        password: user.password
    };

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.getcloudcherry.com/api/LoginToken",
        "method": "POST",
        "headers": {
            "Accept" : "*/*",
            "contentType" : 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        "data": body,
        error: function(xhr, error) {
            alert("Login API failed");
        }
    };
    $.ajax(settings).done(function(oResponse) {
        if (oResponse) {
            auth_token = oResponse.token_type + ' ' + oResponse.access_token;
            document.querySelector('.button-submit').style.display = "none";
            //Calling settings API to get questionairres 
            getQuestionairreName(auth_token);
        }
    });
}

var user;

//To get details from Login Page
function getDetails(){
    user = {
        "username"   : document.getElementById("username").value,
        "password"   : document.getElementById("password").value
    };
    if(user.username == '' || user.password == ''){
        alert("Please provide username and password");
    }
    else{
        //To get bearer-token using our Login API
        getAuthenticationToken(user);
    } 
}