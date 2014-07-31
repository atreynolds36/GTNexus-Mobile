/**
 * Created by areynolds on 6/2/2014.
 */

//authCookie = null
function setHeader(xhr) {

    //Set header not using cookies
    var authCookie = $('body').data('authenticate');
    xhr.setRequestHeader('Authorization',authCookie);


    //Set header with cookies
    //console.log("SET HEADER");
    //xhr.setRequestHeader('Authorization',readCookie(applicationAuthCookieName));
    var getCookie = readCookie(applicationAuthCookieName);
    console.log("AUTH : "+ authCookie);
    console.log("AUTHcook : "+ getCookie);
    xhr.setRequestHeader('Content-Type', "application/json");
    var eTag = $('body').data('eTag');
    if (eTag) {
        console.log("Etag : " + eTag);
        xhr.setRequestHeader('If-Match', eTag);
    }
}

function isLoggedIn() {
    var authKey = $('body').data('authenticate');

    //if cookies work
    //var authKey = readCookie(applicationAuthCookieName);
    if (authKey == undefined) {
        return false;
    } else {
        return true;
    }
}


function connectionError() {
//exit("Cannot connect to the system, Please check your connection");
//showNoConnectionError();
}

function displayLoginProgressSuccess(errorMessage) {
    //$('#login-error-message').html(errorMessage);
    showDelayedMessage("S", errorMessage, 3000, 2000);
}

function checkLoggedIn() {
    if (!isLoggedIn()) {
        exit();
    } else {
        loginCallback();
    }
}

function exit(message) {
// document.location.href="#launch";
// displayPageLoading();

    if (!message) {
        message = "You have logged out from the system. Please enter username and password to login again";
    }

    resetLogin();

// $('body').removeData('Authorization');
    eraseCookie(applicationAuthCookieName);
    $('body').removeData('eTag');
    $('body').removeData('uid');

    document.location.href = "#login";
    $.mobile.changePage("#login", "fade");
}

function showNoConnectionError() {
    showMessage("W", "Please check your internet connection.", 8000);
    $('#showPullDown').delay(2000).slideDown();
    hidePageLoading();
}

function showServerError() {
    hidePageLoading();
    var alertTitle = "Connection Error";
    var alertMsg = "Please try again later.";
    window.navigator.notification.alert(alertMsg, null, alertTitle, "OK");
}

function customShowLoading(msg){
    console.log("custom load : " + msg);
    if(!msg){
        msg = "no msg";
    }
    var interval = setInterval(function () {
        $.mobile.loading( 'show', {
            text: msg,
            textVisible: true,
            theme: 'e',
            html: ''
        });
        clearInterval(interval);
    }, 5);
}
function customHideLoading(){
    return $.mobile.loading( 'hide');
}

function setListUid( uid ){
    console.log("set data to : " + uid);
    $('body').data("listuid" , uid);
}

function setTaskUid( uid){
    console.log("set data to : " + uid);
    $('body').data("taskuid" , uid);
}

function ajaxResponseErrorHandle(statusCode){
    statusCode = parseInt(statusCode);
    if(statusCode == 0){
        alert("No Connection!");
        //showNoConnection();
    }
    else if(statusCode == 304)
        alert("Modify error, check eTag");
    else if(statusCode == 400){
        //alert("Invalid syntax");
        console.log("INVALID SYNTAX!!");
    }
    else if(statusCode == 401){
    	showIncorrectLogin(); 
    }
    else if(statusCode == 403)
        alert("Authentication failed");
    else if(statusCode == 404)
        alert("Response not found");
    else if(statusCode == 406)
        alert("Response Type(JSON) incompatible");
    else if(statusCode == 500)
        alert("Server 500 error");
    else if(statusCode == 503)
        alert("Service temporary unavailable");
    else 
        alert("Unrecognized response-status : " + statusCode);
    customHideLoading();
}

function refreshPage()
{
    console.log('refreshed');
    nav_stack.push( window.location.href );
    requireRESTfulService = true;
    $.mobile.changePage(window.location.href, {
        allowSamePageTransition: true,
        transition: 'none'
    });
}

function clearSearchPanel(){
    $("#searchTaskName").val('');
    $("#searchTaskAssignee").val('');
    $("#searchState").val('');
}

function addOQLURLParam( variable , condition ){

}

function addTryAgainBtn(){
    console.log( $('#searchagain').length );
    if( $('#searchagain').length != 0 )
        $('#searchagain').show();
    else {
        console.log('in here');
        var $btn = $('<a>', {
            class: "ui-btn",
            text: "Revise Search",
            id: "searchagain",
            click: function () {
                $.mobile.changePage('#home');
                setTimeout(function() {
                    $('#searchpanel').panel('open');
                } , 1000);

            }
        });

        $('#msgList').append($btn);
    }
}
function isNetworkAvailable() {
	var networkState = navigator.connection.type;
	setTimeout( function(){
		networkState = navigator.connection.type; } 
	, 500);
	console.log('nework here ' + networkState);
    //No connection
	if (networkState == Connection.NONE) {
		return false;
	}
    
	return window.navigator.onLine;
}
function showNoConnection(){
	$('#noConnection').toggleClass('noConnectionHide noConnectionShow');
	customHideLoading();
	window.setTimeout( function(){
		$('#noConnection').toggleClass('noConnectionHide noConnectionShow');
	}, 5000);
}
function showIncorrectLogin(){
	$('#noConnection').eq(0).text(' Incorrect Credentials !');
	$('#noConnection').toggleClass('noConnectionHide noConnectionShow');
	customHideLoading();
	window.setTimeout( function(){
		if( $('#noConnection').attr('class') == "noConnectionShow")
			$('#noConnection').toggleClass('noConnectionHide noConnectionShow');
	}, 5000);
}
