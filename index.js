/*function setCookies(body1){
    Cookies.set('jsondata', JSON.stringify(body1));
    console.log(Cookies.get('jsondata'));
    postJson();
}*/

function getQuestionairreName(auth_token){
    var response = $.ajax({
        url: 'https://api.getcloudcherry.com/api/Settings',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization : auth_token
    });
    console.log(response);
}

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
            console.log(xhr.statusText);
        }
    };
    $.ajax(settings).done(function(oResponse) {
        if (oResponse) {
            console.log(oResponse.access_token);
            }
    });
}

var user;

function getDetails(){
   user = {
        "username"   : document.getElementById("username").value,
        "password"   : document.getElementById("password").value
    };
    getAuthenticationToken(user);
}