/**
 * Created by areynolds on 5/29/2014.
 */
var requireRESTfulService = false;
var taskChanged = false;
var nav_stack = [];
/*
 * Function executed once the DOM is ready
 */
$( document ).ready(function() {
    $.mobile.ajaxLinksEnabled = false;
    $.mobile.defaultPageTransition = "slide";
    $.mobile.toolbar.prototype.options.tapToggle = false;
    $(document).on('focus', 'input, textarea', function() {
        //	 $.mobile.silentScroll($('div[data-role="header"]').offset().top);
        $('.ui-header-fixed').attr('position','fixed');
        $('.ui-header-fixed').attr('top','0');
    });
    initSwipeDownEvent();
    /*
     * Keeps track of page navigation by storing page names
     * in an array when theres a page change
     */
    $( window ).hashchange(function () {
    	var hash = location.hash;
    	console.log('fire');
    	nav_stack.push(hash);
    	//console.log("nav stack : " + nav_stack);
    });
    //$( window ).on("swipedown", function(){
    	//alert('swiper');
    //});
	/*
	 * Before the home page is displayed, conditional
	 * based on whether a rest call is required to update
	 * the page
	 */
    $("#home").on("pagebeforeshow", function() {
        if( requireRESTfulService){
            fetchHomeList();
            requireRESTfulService = false;
        }
        if( oqlOriginSearch){
        	oqlOriginSearch = false;
        	requireRESTfulService = true;
    	}
    });
	/*
	 * Refreshes the tasklist page on a swipedown
	 * event
	 */
    $('#tasklist').on('swipedown', function(){
       refreshPage();
       console.log('swiper');
       requireRESTfulService = false;
    });
	/*
	 * If theres a value in action it is set to display
	 * on the page. Also decides whether to refetch the
	 * tasklist or to reuse the previously fetched tasklist
	 * for display
	 */
    $("#tasklist").on("pagebeforeshow", function() {
    	if( ! action )
    		$('.actionMsg').text('');
    	else{
    		$('.actionMsg').text(action);
    		action = null;
    	}
    	if( requireRESTfulService || taskChanged )
            fetchTaskList();
    });
	/*
	 * Refreshes the page when the refresh button
	 * is pressed
	 */
    $('.refreshbtn').click( function() {
    	$('.actionMsg').text('');
    	if( ! emptyList )
	        refreshPage();
    });
	/*
	 * Shows task on view task page
	 */
    $("#viewtask").on("pagebeforeshow", function() {
    	showTask();
    });
    /*
     * Initializes the add task page
     */
    $("#addtask").on("pagebeforeshow", function() {
        initLookupForm();
        $('#boolUnassigned').val('checked',false);
    });
    /*
     * Refetches history if neccessary
     */
    $("#viewHistory").on("pagebeforeshow", function() {
        if( requireRESTfulService || initialHistory) {
            getHistory();
            initialHistory = false;
        }
    });

    $("#loginbtn").click(function() {
        login();
    });
    $("#addlistbtn").click(function() {
        initList();
    });
    $("#addtaskbtn").click( function () {
        initTask();
    });
    $("#setCompleteStatusbtn").click( function () {
        taskComplete();
    });
    $("#taskbtn").click( function() {
    	console.log('clicked in taskbtn');
        transitionToTasked();
    });

    $('#clearsearchbtn').click( function() {
    	clearSearchPanel();
    });
    $('[data-role="panel"]').on('panelbeforeopen', function() {
    	$('.actionMsg').text('');	
    });
    
    $('#executeSearch').click( function(){
    	if( $('#searchState').val() == '' &&
    		$('#searchTaskAssignee').val() == '' &&
    		$('#searchTaskName').val() == ''){
    			alert('Invalid Search');
    			return;
    		}
        oqlOriginSearch = true;
        requireRESTfulService = true;
        $.mobile.changePage('#tasklist');
    });

    $("#completeStatus").click( function(){
        requireRESTfulService = true;
        taskComplete();
    });
    $('a[name="backbtn"]').click( function(){
       backButtonClick();
    });

    $('#showIndivTask h1').click( function(){
    	if( $('#topeditbtn').text() == "Edit")
	        showEditable();
    });
    $('#showIndivTask p').click( function(){
    	if( $('#topeditbtn').text() == "Edit")
	        showEditable();
    });
    $('#topeditbtn').click( function() {
       if( $(this).text() == "Edit")
           showEditable();
       else
           showDefined();
    });

    $("#editbtn").click(function() {
           saveEditChanges();
    });

    $("#viewtask").on('pagebeforehide', function() {
        if( requireRESTfulService )
            saveEditChanges();
    });

    $("#addnotesbtn").click(function () {
       addNotes();
       $('#noteCollapsible').collapsible('collapse');
    });

    $('#noteCollapsible').collapsible({
       expand: function(){
            $('.viewTaskBottom').hide();
            if( $('#editable').is(":visible") )
                $("#addnotesbtn").hide();
       },
       collapse: function(){
            if( $('#defined').is(":visible") )
               $('.viewTaskBottom').show();
       }
    });
    $('#logoutbtnHome').click( function(){
    	$.mobile.changePage('#login');
    });
    $('#logoutbtnTask').click( function(){
    	$.mobile.changePage('#login');
    });

});

function onLoadData(){
    document.addEventListener("deviceready", onDeviceReady, false);
    $.mobile.changePage("#login");
    //should work, but does not !
   // $(":mobile-container").pagecontainer("change","#login");
    //console.log("Init fast buttons");
    //initFastButtons();


}

// PhoneGap Stuff
/*
function onDeviceReady() {
    navigator.splashscreen.show();
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 4000);


    try {
        $.mobile.page.prototype.options.domCache = false;
        $.support.cors = true; // move to device ready
        $.mobile.touchOverflowEnabled = true; // smooth
        $.mobile.allowCrossDomainPages = true;
        $.mobile.silentScroll(0);
    } catch(e) {
        navigator.notification.alert('error clearing app data');
    }
    document.addEventListener("menubutton", onMenuKeyDown, false);
}*/
/*
 * Phonegap command - run once the device is ready. Listeners
 * are added for native mobile features
 */
function onDeviceReady(){
    document.addEventListener("backbutton", backButtonClick, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("showkeyboard", onShowKybrd, false);
	document.addEventListener("hidekeyboard", onHideKybrd, false);
}
/*
 * Overrides default back button behavior to instill custom
 * back behavior to better handle app navigation
 */
function backButtonClick(){
    var activePage = $.mobile.activePage.attr('id');
    console.log("in core-ui backBclick : " + activePage);

    if(activePage == "viewtask"){
        console.log('attempted back funct viewtask');
        var last = ( nav_stack[nav_stack.length-2] == "#viewHistory" ) ? true : false;
        //If page back is history page
        if( last )
            $.mobile.changePage("#viewHistory", { reverse: "true" });
        //Else - page back must be tasklist
        else
            $.mobile.changePage("#tasklist", { reverse: "true" });
    }
    else if( activePage == "tasklist"){
        console.log('attempted back funct tasklist');
		if( PARTY_ROLE == "buyer")
	        $.mobile.changePage("#home", { reverse: "true" });
		else
			navigator.app.exitApp();
    }
    else if(activePage == "home" || activePage == "login"){
        navigator.app.exitApp();
    }
    else if(activePage == "viewHistory"){
        $.mobile.changePage('#tasklist', { reverse: "true" });
    }
    else{
        console.log('attempted back funct default');
        //history.go(-1);
        navigator.app.backHistory();
    }
}
/*
 * Overrides default menu button behavior. Adds a popup
 * to show user information and logout button
 */
function onMenuKeyDown(){
	var activePage = $.mobile.activePage.attr('id');
	//console.log('menu down ' + activePage);
	if(activePage == "home")
	    $('#logoutpopupHome').popup('open');
	if(activePage == 'tasklist')
		$('#logoutpopupTask').popup('open');
}

//function navigate(screenName){
  //  document.location.href=screenName;
//}
/*
 * Sets behavior when the keyboard is shown on the device
 */
function onShowKybrd(){
	console.log('fire show keys');
	$('[data-role="footer"]').hide();
	if( $('#noConnection').attr('class') == "noConnectionShow")
		$('#noConnection').toggleClass('noConnectionHide noConnectionShow');
}
/*
 * Sets behavior when the keyboard is hidden on the device
 */
function onHideKybrd(){
	console.log('fire remove keys');
	$('[data-role="footer"]').show();
}
