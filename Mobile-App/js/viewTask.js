/**
 * Created by areynolds on 6/13/2014.
 */
var setComplete;
var action = null;
function showTask(){
    try{
        var url = "$TaskQ3/?dataKey=" + softwareProviderDataKey;
        console.log("click list uid " + $('body').data("listuid"));

        //Get uid of task clicked on
        url += "&id=" + $('body').data("taskuid");
        customShowLoading("Fetching task...");
        console.log(url);
        ajaxConnect(applicationHostName, url, 'GET', true, 'json', fetchListSuccess,
            displayTask, setHeader, connectionError);
    }catch(e){
        alert(e);
    }
}


function displayTask(response){
    if( response.status == 200 || response.status == 201 ||
        response.status == 202 ){

        emptyTaskScreen();
        var req = JSON.stringify(response.responseJSON);
        var myTask = JSON.parse(req);
        
        $('#editable input').val( myTask.title);
        $('#editable textarea').val(myTask.description);
        $('#addnotes').val( myTask.notes);
        showDefined();
        
        /*Different Types of Tasks - 
         * 		Buyer Side - Completed, Incompleted
         * 		Seller Side - Completed, Incompleted
         */
        console.log(myTask);
        
        if( PARTY_ROLE == "buyer" ){
        	var assignTxt;
        	if(myTask.boolUnassigned == "true") {
            	assignTxt = $('<a href="#popupAssign" data-rel="popup"> Assign Task </a>');
            	if(!community)
                	restAPI.getCommunity(function(){} , initAssignPopup, "Locating community...");
            	else
                	initAssignPopup();
        	}
       		else
            	assignTxt = $('<h3> Task Assigned to : ' + myTask.assignee.name + '</h3>');
            $("#showIndivTask").append(assignTxt);
        	//Buyer Complete
        	if( myTask.complete == "true" ){
        		setBuyerCompleteTask();
        		$('#topeditbtn').text('').hide();
        		$('.display20').hide();
        		appendCompleteTimeStamp( myTask.__metadata.modifyTimestamp );
        	}
        	//Buyer incomplete
        	else{
        		$('#editbtn').text('Save Changes');
        		$('.display20').show();
        		setBuyerIncompleteTask( myTask.state );
        		$('#topeditbtn').text('Edit').show();
        	}
        	
        }
        else{
        	$('.display20').hide();
        	$('#topeditbtn').text('').hide();
        	//Seller complete
        	if( myTask.complete == "true"){
        		setSellerCompleteTask();
        		appendCompleteTimeStamp( myTask.__metadata.modifyTimestamp );
        	}
        	//Seller incomplete
        	else{
        		setSellerIncompleteTask();
        	}
        }   
 
        $('#completeStatus').checkboxradio('refresh');
    }
    else{
        ajaxResponseErrorHandle(response.status);
    }
    customHideLoading();
}

function emptyTaskScreen(){
    $('#showIndivTask').children('p, h1, a, h3, h4').empty();
    $('#addnotes').empty();
}

function setBuyerCompleteTask(){
	$('.display20').hide();
    $('#noteCollapsible').hide();
    $("#completeStatus").prop("value", "complete");
    $("#completeStatus").prop("checked", true);
    $("#completelbl").text("Reopen Task");
    console.log("complete log");
}
function setBuyerIncompleteTask( state ){
	if( state == "tasked"){
			console.log('tasked');
    	    $("#taskbtn").addClass('ui-disabled');
        	$("#taskbtn").text("Tasked");
    } else if( state == "assigned"){
    		console.log('assigned');
        	$("#taskbtn").text("Task it");
        	$('#taskbtn').removeClass('ui-disabled');
    	//task must be completed or unassigned
    } else {
        	console.log('in here');
        	$('.display20').hide();
        	$('#noteCollapsible').hide();
    }
    $('.taskBusiness').show();
    $("#completeStatus").prop("value", "open");
    $("#completelbl").text("Complete Task");
    $("#completeStatus").prop('checked', false);
}
function setSellerCompleteTask(){
	$('.taskBusiness').hide();
    $('#noteCollapsible').hide();
}
function setSellerIncompleteTask(){
	$('.taskBusiness').show();
    $("#completeStatus").prop("value", "open");
    $("#completelbl").text("Complete Task");
    $("#completeStatus").prop('checked', false);
}

function taskComplete(){
    var msg;
    if( $('#completeStatus').val() == "complete")
        msg = "Re opening task";
    else
        msg = "Moving Task to History...";

    restAPI.getTaskByUid(function(){} , changeTaskStatus, msg);
}

function changeTaskStatus(response){
    if( response.status == 200 || response.status == 201 ||
        response.status == 202 ){

        var getData = JSON.stringify(response.responseJSON);
        console.log("get data here : " + getData);
        changeTask(JSON.parse(getData));
    }
    else{
        ajaxResponseErrorHandle(response.status);
    }
    customHideLoading();
}

function changeTask(rtnJSON){
    try{
        var set = $('#completeStatus').val();
        rtnJSON.complete = ( set == "open") ? "true" : "false";
        console.log( "rtn Complete " + rtnJSON.complete);
        //If complete, transition to completed. If incomplete, transition to assigned
        if( set == "open")
            restAPI.updateTask(callSuccessTask, transitWorkflowComplete,rtnJSON,"Saving changes...");
        else
            restAPI.updateTask(callSuccessTask, transitWorkflowReopen,rtnJSON,"Saving changes...");

    }catch(e){
        alert(e);
    }
}

var assigneeMemId = null;
var loadedAssignPopup = false;
function initAssignPopup(response){
    //Call coming from restful service
    if(response){
        var res = JSON.stringify(response.responseJSON);
        community = JSON.parse(res).result;
    }
    if( loadedAssignPopup ){
        return;
    }
    //Community now established
    for( var i = 0; i < community.length; i++) {
        var party = community[i];
        if( party.partyRoleCode != "FinalDestination" &&
            party.partyRoleCode != "DeliverTo") {
            var showString = party.partyRoleCode + " / " + party.name;
            var $listItem = $('<li> <a href="#viewTask">' + showString + '</a>');
            $listItem.attr('id', "a" + party.memberId);
            console.log('member id is : ' + party.memberId);
            $listItem.click(function () {
                updateAssignee(this.id);
            });
            $('#popupAssignList').append($listItem);
        }
    }
    loadedAssignPopup = true;
    $('#popupAssignList').listview('refresh');
    customHideLoading();
}

function updateAssignee(memId){
    assigneeMemId = memId.substring(1);
    restAPI.getTaskByUid(function(){} , assigneeComback , "Finalizing Changes...");
}

function assigneeComback(response){
    if( response.status == 200 || response.status == 201 ||
        response.status == 202 ){

        var getData = JSON.stringify(response.responseJSON);
        console.log("get data here : " + getData);
        addAssignee(JSON.parse(getData));
    }
    else{
        ajaxResponseErrorHandle(response.status);
    }
    customHideLoading();
}


function addAssignee( rtrn ){
    var assigneeObj;
    for (var i = 0; i < community.length; i++) {
        if (community[i].memberId == assigneeMemId) {
            assigneeObj = community[i];
        }
    }
    try {
        rtrn.boolUnassigned = "false";
        rtrn.assignee = assigneeObj;
        restAPI.updateTask(callSuccessTask, firstTransitionTask, rtrn, "Saving changes...");
    }
    catch(e){
        alert(e);
    }
}

function firstTransitionTask(response){
    var res = JSON.stringify(response.responseJSON);
    var js = JSON.parse(res).data;
    var eTag = js.fingerprint;
    console.log(eTag);
    var taskUID = js.uid;
    console.log(taskUID);
    $('body').data('eTag', "\""+eTag+"\"");
    $('body').data('taskuid', taskUID);
    //Transition Task to the 2nd state - the Assigned but Uncompleted State
    restAPI.transitionTask( function() {} , completeAssignmentOfTask , js , "assign");
}
function completeAssignmentOfTask(){
	requireRESTfulService = true;
	customHideLoading();
	refreshPage();
}

function transitionToTasked(){
    restAPI.getTaskByUid(function() {} , subTasked , "Tasking...");
}

function subTasked(response){
    var json = JSON.stringify(response.responseJSON);
    var js = JSON.parse(json);
    /*
    if( js.complete == "true"){
        alert("Task already complete");
    }
    else if( js.state == "tasked"){
        alert("Task already tasked");
    }
    
    else */
   if (js.state == "unassigned")
        alert("Cannot task. Need Assignee Party");
    else
        restAPI.transitionTask( function () {} , showTask , js , "task");
    
    customHideLoading();
}

function transitWorkflowComplete(response){
        var json = JSON.stringify(response.responseJSON);
        var js = JSON.parse(json).data;
        restAPI.transitionTask(function () {}, completeCallLocate, js, "complete");
}
function transitWorkflowReopen(response){
    if( $('#completeStatus').val() == "complete") {
        var json = JSON.stringify(response.responseJSON);
        var js = JSON.parse(json).data;
        restAPI.transitionTask(function () {}, completeCallLocate, js, "reopen");
    }
}

function completeCallLocate(response){
    customHideLoading();
    if( $('#completeStatus').val() == 'complete'){
    	$('.actionMsg').text('Task ReOpened');
        $.mobile.changePage('#viewHistory');
    }
    else{
    	action = "Task Completed";
    	var activePage = $.mobile.activePage.attr('id');
    	if( activePage == "viewtask")
	        $.mobile.changePage('#tasklist');
	    else	
	    	refreshPage();
    }
}

function showEditable(){
	//If Seller, cannot edit the task
	if( PARTY_ROLE == "seller"){ return;}
    $('#topeditbtn').text('View');
    $('#defined').hide();
    $('#editable').show();
    $('#noteCollapsible').collapsible('expand');
    $('.viewTaskBottom').hide();
    requireRESTfulService = true;
}
function showDefined(){
	$('#topeditbtn').text('Edit');
    $('#defined').show();
    $('#editable').hide();
    $('#addnotesbtn').show();
    $('.viewTaskBottom').show();
    $('#noteCollapsible').collapsible('collapse');
    $('#noteCollapsible').show();
    $('#defined h1').text( $('#editableTitle').val() );
    $('#defined p').text( $('#editableDesc').val() );
}

function appendCompleteTimeStamp( ts ){
	console.log('ts = ' + ts);
	var spl = ts.split('-');
	var spl2 = spl[2].split(' ');
	var composeMsg = 'Task Completed : ';
	composeMsg += getMonth(parseInt(spl[1])) + ' '+ spl2[0] + ',';
	composeMsg += spl[0];
    $("#showIndivTask").append('<h4> ' +composeMsg + '</h4>');
	
}

function addNotes(){
    restAPI.getTaskByUid(function() {} , completeAddNotes , 'Adding notes');
}

function completeAddNotes(response){
    var json = JSON.stringify(response.responseJSON);
    var js = JSON.parse(json);
    js.notes = $('#addnotes').val();
    restAPI.updateTask( function() {} , customHideLoading , js, 'Saving...');
}

