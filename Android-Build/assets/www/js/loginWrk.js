/**
 * Created by areynolds on 6/2/2014.
 */
var applicationHostName = "QA2";
var applicationAuthCookieName = "gtnexus-todo";
var usernameCookieName = "gtnexus-todo-username";
var passwordCookieName = "gtnexus-todo-password";
var username = null;
var password = null;
var authToken = null;
var softwareProviderDataKey = "ecc1b12ce5f5e2aa173648a03d7aa4607d52e847";
var orgMemberId = null;
var PARTY_ROLE;

$(document).on("pagebeforeshow","#login",function(){


    var credStorage = localStorage.getItem("gtnx-creds");

    if(credStorage == "on"){
        var uname = localStorage.getItem("gtnx-uname");
        var pwd = localStorage.getItem("gtnx-pwd");

        $("#username").val(uname);$("#password").val(pwd);
    }

});

function login() {
    username = $('#username').val().trim();
    password = $('#password').val().trim();

    if ((!username) || (!password)) {
        alert("Login Attempt not valid");
        return;
    }
    //If username is changed, remove username specific data
    if( username != localStorage.getItem('gtnx-uname') ){
        localStorage.removeItem('orgName');
        localStorage.removeItem('partyRole');
    }

    authToken = encodeHeader(username, password);

    //set body date authentication when cookies isnt working
    $('body').data('authenticate', authToken);

    createCookie(passwordCookieName, password);
    createCookie(applicationAuthCookieName, authToken);
    createCookie(usernameCookieName, username);
    try{
        var url = "?dataKey=" + softwareProviderDataKey;
        if( isNetworkAvailable() ){
        	customShowLoading("Logging in...");
        	ajaxConnect(applicationHostName, url, 'GET', true, 'json', loginSuccess,
            	completeCallback, setHeader, connectionError);
        }
        else
        	showNoConnection();
    }catch(e){
        alert(e);
    }

    event.preventDefault();
    return false;

}

function loginSuccess(response) {

    //for testing
    localStorage.setItem("gtnx-creds","on");
    //save credentials
    var credStorage = localStorage.getItem("gtnx-creds");
    //if(credStorage == "on"){
        //localStorage.setItem("gtnx-uname", readCookie(usernameCookieName));
        //localStorage.setItem("gtnx-pwd", readCookie(passwordCookieName));
        //localStorage.setItem("gtnx-uname", "andrew@buy");
        //localStorage.setItem("gtnx-pwd", "tradecard");
        
    //}
    //else{
        localStorage.setItem("gtnx-uname", username);
        localStorage.setItem("gtnx-pwd", password);
    //}

    // show inbox
    //loginCallback(response);
}

function loginCallback() {
    // setTimeout(function() {
    if (isLoggedIn()) {
        getUserDetails();//set current user org name
    }
    // }, 0);

}

function completeCallback(response) {
    if (response.status == 200 || response.status == 201
        || response.status == 202) {
            //var eTag = response.getResponseHeader('Etag');
            customHideLoading();
            requireRESTfulService = true;
            getUserDetails();
    }
    else {
        ajaxResponseErrorHandle(response.status);
    }
}
function initSettings(){
	////alert(PARTY_ROLE);
	//Buyer Side
    if(PARTY_ROLE == "buyer")
    	setBuyerSettings();
    //Seller Side
    else
    	setSellerSettings();               
}
/*
    NOTE - This will all be changed once 'who-am-i' rest call is in place
     -Work around that depends on partyRoleCode in community list-
 */
function getUserDetails(){
    //var oqlStr = "username='"+readCookie(usernameCookieName)+"'";
    if( localStorage.getItem('partyRole') != null ){
        	PARTY_ROLE = localStorage.getItem('partyRole');
        	initSettings();
        }
    //Figure out party role
    else {
        var oqlStr = "current_username='" + username + "'";
        restAPI.getOrgInformation(oqlStr, function () {}, setUserDetails);
    }
}

function setUserDetails(response){
    //set orgName for app here
    //alert(js.result[0]);
    console.log(response);
    if(response.status == 200 || response.status == 201 ||
        response.status == 202 ){
        var json = JSON.stringify(response.responseJSON);
        var js = JSON.parse(json);
        if(js.create != null){
            orgMemberId = js.create.result.current_party.memberId;
            var orgName = js.create.result.current_party.name;
            var orgUserId = js.create.result.current_username;
            localStorage.setItem('orgName', orgName);
            localStorage.setItem('userId' , orgUserId);
            restAPI.getCommunity(function () {
            }, dictateRole, 'Init App Comm');
        }
        else if(js.resultInfo.count > 0) {
            console.log(js.result[0].current_party);
            orgMemberId = js.result[0].current_party.memberId;
            var orgName = js.result[0].current_party.name;
            var orgUserId = js.result[0].current_username;
            localStorage.setItem('orgName', orgName);
            localStorage.setItem('userId' , orgUserId);
            restAPI.getCommunity(function () {
            }, dictateRole, 'Init App Comm');
        }
        //If no co corresponding to this username exists, must create new one
        else{
            restAPI.createCurrentUser( setUserDetails );
        }
    }
    else{
        ajaxResponseErrorHandle(response.status);
    }
}

function dictateRole(response){
    if(response.status == 200 || response.status == 201 ||
        response.status == 202 ){
        var json = JSON.stringify(response.responseJSON);
        var js = JSON.parse(json);
        community = js.result;
        for( var i = 0; i < community.length; i++){
            var party = community[i];
            if( party.memberId == orgMemberId) {
                if (party.partyRoleCode == "Buyer") {
                    PARTY_ROLE = "buyer";
                    break;
                }
                if (party.partyRoleCode == "Seller") {
                    PARTY_ROLE = "seller";
                    break;
                }
            }
        }
        localStorage.setItem('partyRole', PARTY_ROLE);
        initSettings();
    }
    else{
        ajaxResponseErrorHandle(response.status);
    }
}

function resetLogin() {
    $("#username").val("");
    $("#password").val("");
}