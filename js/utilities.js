/**
 * Created by areynolds on 6/2/2014.
 */

/*
 * Sets the header of a http request object before the
 * ajax call is made. Import to note that content-type is 
 * set to application/json to indicate that the ajax call
 * will return this type of response. Also, the authentication
 * is set to data stored associated with the DOM body that indicates
 * that the ajax call has the proper authentication to return a response
 * Thirdly, important to note that the eTag is set each time to the data
 * stored in body under 'eTag'. Each time a POST request method is used
 * it is essential to add the correct header the indicates the update-to-date
 * eTag of the object being updated in the system
 */
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
/*
 * Sets the correct authetication key for the user of the
 * app. The authentication key is stored associated with the
 * body so that it can be easily accessed for rest calls
 * If there is no authentication set, then the user must
 * not be logged in
 */
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

function checkLoggedIn() {
    if (!isLoggedIn()) {
        exit();
    } else {
        loginCallback();
    }
}
/*
 * Clears data out of the html body element and sends
 * the document back to the login page. This method is not
 * called in this app
 */
function exit(message) {
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
/*
 * Shows a custom loading message that indicates that
 * passed in msg variable. It is import to set a timeout
 * function such as setInterval to allow the screen time
 * to display the loading message.
 */
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
/*
 * Hides the loading message from the screen
 */
function customHideLoading(){
    return $.mobile.loading( 'hide');
}
/*
 * Sets body data 'listuid' to the passed
 * in uid variable so that it can be easily accessed
 * anywhere in the code
 */
function setListUid( uid ){
    console.log("set data to : " + uid);
    $('body').data("listuid" , uid);
}
/*
 * Sets body data 'taskuid' to the passed in
 * uid variable so that it can be easily accessed
 * anywhere in the code
 */
function setTaskUid( uid){
    console.log("set data to : " + uid);
    $('body').data("taskuid" , uid);
}
/*
 * Method called if the ajax call is not successful.
 * Difference codes indicate different reason why 
 * the call might have been not successful. Most of
 * these are mainly for debugging.
 */
function ajaxResponseErrorHandle(statusCode){
    statusCode = parseInt(statusCode);
    console.log("error code -> " + statusCode);
    if(statusCode == 0){
        alertPopup("No Connection!");
        //showNoConnection();
    }
    else if(statusCode == 304)
        alertPopup("Modify error, check eTag");
    else if(statusCode == 400){
        //alertPopup("Invalid syntax");
        console.log("INVALID SYNTAX!!");
        showIncorrectLogin();
    }
    else if(statusCode == 401){
    	showIncorrectLogin(); 
    }
    else if(statusCode == 403)
        alertPopup("Authentication failed");
    else if(statusCode == 404)
        alertPopup("Response not found");
    else if(statusCode == 406)
        alertPopup("Response Type(JSON) incompatible");
    else if(statusCode == 500)
        alertPopup("Server 500 error");
    else if(statusCode == 503)
        alertPopup("Service temporary unavailable");
    else 
        alertPopup("Unrecognized response-status : " + statusCode);
    customHideLoading();
}
/*
 * Refreshes the page using jQuery Mobiles changePage 
 * to the same page functionality
 */
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
/*
 * Clears search panel when the 'clear search' button
 * is clicked on
 */
function clearSearchPanel(){
    $("#searchTaskName").val('');
    $("#searchTaskAssignee").val('');
    $("#searchState").val('');
}

function addOQLURLParam( variable , condition ){

}
/*
 * Adds a try again button at the end of a search
 * result list
 */
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
/*
 * Determines if a network is available by using the
 * phonegap native native connection type functionality
 */
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
/*
 * Displays a method showing no connection. The message will go
 * away after 5 seconds
 */
function showNoConnection(){
	$('#noConnection').toggleClass('noConnectionHide noConnectionShow');
	customHideLoading();
	window.setTimeout( function(){
		$('#noConnection').toggleClass('noConnectionHide noConnectionShow');
	}, 5000);
}
/*
 * Indicates that the entered username and password are not correct according
 * to the GTNexus system. Shows a message indicating this that goes away
 * after 8 seconds
 */
function showIncorrectLogin(){
	$('#noConnection').eq(0).text(' Incorrect Credentials !');
	$('#noConnection').toggleClass('noConnectionHide noConnectionShow');
	customHideLoading();
	window.setTimeout( function(){
		if( $('#noConnection').attr('class') == "noConnectionShow")
			$('#noConnection').toggleClass('noConnectionHide noConnectionShow');
	}, 8000);
}

function alertPopup(msg){
	$('.alertPopup').empty();
	$('.alertPopup').text(msg);
	$(".alertPopup").popup("open");
}

