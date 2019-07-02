//The sample body of JSON to add response
responseJson = {
        "id": "",
        "user": "",
        "locationId": "",
        "responseDateTime": "",
        "responseDuration": 0,
        "surveyClient": "",
        "responses": [
        ],
        "archived": false,
        "notes": [],
        "openTicket": {},
        "deviceId": ""
}

var user;
var id = [];
var note = [];
var displayType = [];
var flag = [];
var final_id = [];
var final_note = [];
var final_header = [];

//To trigger the webhook
function postJson(){
    var data1 = JSON.stringify(responseJson);
    
    var xhr = new XMLHttpRequest();
    var url = "https://prod-01.southindia.logic.azure.com:443/workflows/0b35538eb7564a1d9e7bc703dc89d800/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=m66ZP7oaSrkWhBIKnGIJ_i9XnC4aM7fCxLjo0mPFknE";
    var method = "POST";
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data1);
}

//To set JSON to add response
function setJson(excelRows){
    //console.log(final_header);
    for (var index = 0; index < excelRows.length; index++){
        //console.log(responseJson)
        responseJson.responses = [ ];
        for (var i = 0; i<id.length; i++){
            if(flag[i] == 1){
                var response = {
                    "questionId" : id[i] ,
                    "questionText" : note[i],
                    "textInput" : excelRows[index][final_header[i]],
                    "numberInput" : 0
                }
                responseJson.responses.push(response);
                //console.log(response);
            }
            else if(flag[i] == 0){
                var response = {
                    "questionId" : id[i] ,
                    "questionText" : note[i],
                    "textInput" : "null",
                    "numberInput" : excelRows[index][final_header[i]]
                }
                responseJson.responses.push(response);
                //console.log(response);
            }
        }
        console.log(responseJson);
        postJson();
    }
}

//To determine whether text or number input
function setType(excelRows){
    for (var i = 0; i < displayType.length; i++){
        if(displayType[i] == "Select" || displayType[i] == "MultiSelect" || displayType[i] == "Text" || displayType[i] == "MultilineText"){
            //To represent text input
            flag[i] = 1;
        }
        else{
            flag[i] = 0;
        }
    }
    setJson(excelRows);
}

//To set mapping of excel headers and questionairres
function setMappingArrays(excelRows){
    for(var i = 1; i <= id.length; i++){
        final_id[i-1] = document.getElementById("myTable").rows[i].cells[0].innerText;
        final_note[i-1] = document.getElementById("myTable").rows[i].cells[1].innerText;
        final_header[i-1] = document.getElementById("myTable").rows[i].cells[2].innerText;
    }
    setType(excelRows);
}

//To delete a row in a table
function deleteRow(i){
    var r = i.parentNode.parentNode.rowIndex;
    document.getElementById("myTable").deleteRow(r);
}

//To edit a row in a table
function editRow(i){
    var r = i.parentNode.parentNode.rowIndex;
    document.getElementById("myTable").rows[r].cells[2].contentEditable = "true";
}

//To create table for mapping
function insertValues(header, excelRows){
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
        cell3.innerHTML = header[i];

        cell4.appendChild(icon);
        cell4.appendChild(icon1);
    }
    setMappingArrays(excelRows);
}

//To get data from excel
function ProcessExcel(data) {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    var header = Object.keys(excelRows[0]);

    document.querySelector(".create-table").style.display = "block";
    insertValues(header, excelRows);
};

//To get details from Excel
function fileUpload(filename){
    var fileUpload = document.getElementById("fileUpload");
 
    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } 
            else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        }
        else {
            alert("This browser does not support HTML5.");
        }
    } 
    else {
        alert("Please upload a valid Excel file.");
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
    var i = 0;
    $.ajax(settings).done(function(oResponse) {
        if (oResponse) {
            for (var j = 0; j < oResponse.length; j++){
                for (var index = 0; index < oResponse[j].displayLocation.length; index++){
                    if(oResponse[j].displayLocation[index] == location){
                        id[i] = oResponse[j].id;
                        note[i] = oResponse[j].note;
                        displayType[i] = oResponse[j].displayType;
                        i++;
                    }
                }
            }
        }
    })
}

//To get selected question
function selectQuestionairre(auth_token){
    document.querySelector('.select-text').addEventListener("change", function(){
        var location = document.querySelector('.select-text').value;
        responseJson.locationId = location;
        document.querySelector(".select-text").disabled = true;
        document.querySelector(".select-text").style.cursor = "no-drop";
        document.querySelector(".select-label").style.display = "none";
        document.querySelector(".excel-upload").style.display = "block";
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

//To get details from Login Page
function getDetails(){
    user = {
        "username"   : document.getElementById("username").value,
        "password"   : document.getElementById("password").value
    };
    // responseJson.id = document.getElementById("survey-token").value;
    if(user.username == '' || user.password == ''){
        alert("Please provide username and password");
    }
    else{
        //To get bearer-token using our Login API
        getAuthenticationToken(user);
    } 
}

// Span
var span = document.getElementsByClassName('upload-path');
// Button
var uploader = document.getElementsByName('upload');
// On change
for( item in uploader ) {
  // Detect changes
  uploader[item].onchange = function() {
    // Echo filename in span
    span[0].innerHTML = this.files[0].name;
  }
}