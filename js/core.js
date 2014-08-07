/**
 * Created by areynolds on 5/28/2014.
 */
var restServiceURL = new Object();
restServiceURL["SF"] = "https://test.salesforce.com/services/oauth2/token";
restServiceURL["PROD"] = "../prod/rest/"; //"http://api.tradecard.com/rest/";
restServiceURL["CQA"] = "../cqa/rest/"; //"http://cqa.tradecard.com/rest/";
restServiceURL["SUPORT"] = "../support/rest/"; //"http://support.tradecard.com/rest/";
restServiceURL["TRAINING"] = "../training/rest/"; //"http://training.tradecard.com/rest/";
restServiceURL["QA"] = "http://commerce.qa.tradecard.com/rest/310/";
restServiceURL["QA2"] = "http://commerce.qa2.tradecard.com/rest/310/";


/**
 * JavaScript function to encode the HTTP Request Header
 */
function encodeHeader(username, password) {
    var separator = String.fromCharCode(0x1F);
    var authentication = username + separator + password;
    var b64 = $().crypt({
        method : "b64enc",
        source : authentication
    });
    return 'Basic ' + b64;
}
/*
 * These cookie methods are not used in this app. Android phonegap
 * built app have problems with cookies, and therefore cookies are
 * not used at all. Instead of cookies, data is attached in local storage
 * to be easily accessible and reusable for the app. 
 */
/*
 * Creates a cookie
 */
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else
        var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}
/*
 * Reads a cookie <name> if it exists
 */
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for ( var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
/*
 * Erases cookie <name>
 */
function eraseCookie(name) {
    createCookie(name, "", -1);
}
/*
 * Establishes an ajax connection to perform rest GET call
 */
function ajaxConnect(environment, url, method, isCrossDomain, dataType,
                     successFunction, completeFunction, beforeSendFunction, errorFunction) {
    console.log("ajaxconnect");    	
    jQuery.support.cors = true;
    var urlAll = restServiceURL[environment] + url;
    console.log("URL: "+urlAll );
    $.ajax({
        url : restServiceURL[environment] + url,
        type : method,
        crossDomain : isCrossDomain,
        cache : false,
        dataType : dataType,
        success : successFunction,
        complete : completeFunction,
        beforeSend : beforeSendFunction,
        error : errorFunction,
        timeout : 30000
    });
}
/*
 * Establishes an ajax connection to perform rest POST call
 */
function ajaxConnectPost(environment, url, dataVal, isCrossDomain, dataType,
                         successFunction, completeFunction, beforeSendFunction, errorFunction) {
    jQuery.support.cors = true;
    var urlAll = restServiceURL[environment] + url;
    console.log(urlAll);
    $.ajax({
        url : restServiceURL[environment] + url,
        type : 'POST',
        contentType : 'application/json',
        crossDomain : isCrossDomain,
        cache : false,
        dataType : dataType,
        data : dataVal,
        success : successFunction,
        complete : completeFunction,
        beforeSend : beforeSendFunction,
        error : errorFunction,
        timeout : 30000
    });
}

function urlParam(name) {
    var results = new RegExp('[?&]' + name + '=([^&#]*)')
        .exec(window.location.href);

    if (!results) {
        return null;
    }

    return results[1] || 0;
}

/*
 * Adds special event for Swipeup/Swipedown to the app
 */
function initSwipeDownEvent() {
    // initializes touch and scroll events
    var supportTouch = $.support.touch,
        scrollEvent = "touchmove scroll",
        touchStartEvent = supportTouch ? "touchstart" : "mousedown",
        touchStopEvent = supportTouch ? "touchend" : "mouseup",
        touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

    // handles swipeup and swipedown
    $.event.special.swipeupdown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);

            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                    start = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ],
                        origin: $(event.target)
                    },
                    stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }

                    var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };
                }

                $this
                    .bind(touchMoveEvent, moveHandler)
                    .one(touchStopEvent, function(event) {
                        $this.unbind(touchMoveEvent, moveHandler);
                        if (start && stop) {
                            if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 300) {
                                start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                            }
                        }
                        start = stop = undefined;
                    });
            });
        }
    };

    //Adds the events to the jQuery events special collection
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function(event, sourceEvent){
        $.event.special[event] = {
            setup: function(){
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

}
/*
 * Returns the month in a String that is indicated by
 * a numerical month representation
 */

function getMonth( num){
	switch(num){
		case 01: return "January";
		break;
		case 02: return "Febuary";
		break;
		case 03: return "March";
		break;
		case 04: return "April";
		break;
		case 05: return "May";
		break;
		case 06: return "June";
		break;
		case 07: return "July";
		break;
		case 08: return "August";
		break;
		case 09: return "September";
		break;
		case 10: return "October";
		break;
		case 11: return "November";
		break;
		case 12: return "December";
		break;
		default: return "null";
		break;	
	}
}

/*
 * Adds refresh button to DOM
 */
var $refreshX = $('.refreshbtn');
var width = $refreshX.width();
$refreshX.css('height', width);