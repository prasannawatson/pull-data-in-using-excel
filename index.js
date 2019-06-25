/*function setCookies(body1){
    Cookies.set('jsondata', JSON.stringify(body1));
    console.log(Cookies.get('jsondata'));
    postJson();
}*/

function getQuestionairreName(){
    $.ajax({
        url: 'https://api.getcloudcherry.com/api/Settings',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization : 'Bearer Bi3l8iVdFEPZHcDc7R-TXlvD8nOu_nnx4sPGOYnhIRYLcB1gdNZbaeOGlvTjfQ-xJAmHVL4-ns9VthbYmHRDl9bJqAG1PyQ5FCSpaihRkFd9-1p1GNdYQN9O3Qy0wIWoTGIl5YOqnPAVL0uVd5VmgbSukEm-AlzqMxIbOg31hTmyixj6fCb_OtqKbRUg4YUBLY-8GIy2lz75aYC_79mZbGP3fa6teD2ZFDbm59jgAdO6agdOxLMRvKJMHrwUj0HX99acrVsCGdOfdzGWpdZLy1COJ6f7X511NNid9rfm7sISo_ab9eqtX71IlrvTA1PfC4lm2zKN3X2LNe5O0vDE0pJc1WGkVqxVSvcAOG4nNAVlFS5sQGztxhKOT-jxfoxAwE8Qh9xdP6s_bBdN4itTigB5SDptcndr9FzRxBlV0vJuu6sqarCP9F1yIEqsQBl9EJylDXpqeJD_YmSfDUyWZuVSf_hqGLVHhH4K4irjp_-5wsI5DGMe670DBymAGQ5b3Ensyf0YiP856fiqv3fUHY3T77ZPfTl7N3SNUnEDDJ7qzLEK'
    });
}


function getAuthenticationToken(user){
    var body = {
        grant_type: 'password',
        username: user.username,
        password: user.password
    };
    $.ajax({
        url: 'https://api.getcloudcherry.com/api/LoginToken',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: body
    });
    getQuestionairreName();
    console.log($.responseText);
}

var user;

function getDetails(){
   user = {
        "grant_type" : 'password',
        "username"   : document.getElementById("username").value,
        "password"   : document.getElementById("password").value
    };
    getAuthenticationToken(user);
}