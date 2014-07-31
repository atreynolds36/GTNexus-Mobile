/**
 * Created by areynolds on 6/2/2014.
 */
var oqlOriginSearch = false;
var initialHistory = true;
var emptyList;
/*
 * Fetches a list of task based on a couple of conditions. Based on whether
 * the fetch is coming from a search, it will fetch a list of task based
 * on a generated OQL command. The next condition is whether the user org
 * is a buyer or a seller. If the org is a buyer, it will fetch all the tasks
 * associated with a list UID. If the org is a seller, it will fetch all the
 * tasks associated with the party.
 */
function fetchTaskList(){
    //If searching tasks for oql
    if( oqlOriginSearch){
        restAPI.getTasksBySearch(fetchListSuccess, setTaskList,"Searching");
        $('#taskPanel').hide();  
    }
    //For buyer - get tasks associated with certain list
    else if ( PARTY_ROLE == "buyer" ){
        restAPI.getTasksInList(fetchListSuccess, setTaskList, "Fetching tasks...");
        $('#taskPanel').show();
    }
    //If party role is seller, show all tasks assigned
    else
    	restAPI.getSellerTasks(fetchListSuccess, setTaskList, "Searching");
    requireRESTfulService = false;
}

function fetchListSuccess(response){
    console.log("list found");
}

function setTaskList(response){
    if( response.status == 200 || response.status == 201 ||
        response.status == 202 ){

        var req = JSON.stringify(response.responseJSON);
        console.log("taskarray: " + JSON.parse(req));
        var taskList = JSON.parse(req).result;
        $("#tasklistTasks").empty();
        $('#msgList').empty();
        //variable for oql searches...if there is no incomplete task it will be true
        emptyList = true;
        if(taskList){
            for( var i = 0; i < taskList.length; i++ ){
                var tempTask = taskList[i];
                if(tempTask.complete != "true"){
                	emptyList = false;
                    console.log(tempTask.title);
                    var title = tempTask.title;
                    if( !title ){title = "Undefined";}
                    var $tempList = $('<tr></tr>');
                    var $colOne = $('<td></td>');
                    var $colTwo = $('<td></td>');
                    var $tempCheck = $('<input type="checkbox" class="taskCheckClass">');
                    $tempCheck.attr("id", tempTask.uid);
                    $tempCheck.change( function() {
                        $('#completeStatus').prop('value', 'open');
                        setTaskUid( $(this).attr('id') );
                        taskComplete();
                    });
                    console.log(tempTask.complete);
                    var $tsk = $('<a href="#viewtask" class="ui-btn"></a>');
                    $tsk.append(title);
                    $colOne.append($tempCheck);
                    $colTwo.append($tsk);
                    $tempList.append( $colOne , $colTwo);
                    $tempList.attr("id", tempTask.uid);
                    $tempList.click( function() {
                      setTaskUid( $(this).attr('id') );
                    });
                    console.log("adding this uid: "+ tempTask.uid);
                    $("#tasklistTasks").append($tempList);
                }}
        }
        else{
                $("#msgList").append('<h2 align="center"> No Tasks </h2>');
        }
        
        if( emptyList && $('#msgList').text() == '')
        	displayEmptyTaskList();	
    }
    else{
        ajaxResponseErrorHandle(response.status);
    }
    customHideLoading();
}

function getHistory(){
	if( PARTY_ROLE == "buyer" )
	    restAPI.getTasksInList(function() {} , displayHistory, "Fetching History...");
	else	
		restAPI.getSellerTasks(function() {} , displayHistory, "Fetching History...");
}
function displayHistory(response){
    if( response.status == 200 || response.status == 201 ||
        response.status == 202 ){

        var req = JSON.stringify(response.responseJSON);
        console.log("taskarray: " + JSON.parse(req));
        var taskList = JSON.parse(req).result;
        $("#historyList").empty();
        if(taskList){
            for( var i = 0; i < taskList.length; i++ ){
                var tempTask = taskList[i];
                if(tempTask.complete == "true") {
                    console.log(tempTask.title);
                    var title = tempTask.title;
                    if (!title) {
                        title = "Undefined";
                    }
                    var $tsk = $('<a href="#viewtask"></a>');
                    $tsk.append(title);
                    var $item = $('<li></li>');
                    $item.append($tsk);
                    $item.attr('id', tempTask.uid);
                    $item.click(function () {
                        setTaskUid($(this).attr('id'));
                    });
                    console.log("adding this uid: " + tempTask.uid);
                    $("#historyList").append($item);
                }
            }
            $('#historyList').listview('refresh');
        }
        else{
            $("#historyList").append('<h2 align="center"> No Completed Tasks <h2>');
        }

    }
    else{
        ajaxResponseErrorHandle(response.status);
    }
    customHideLoading();
}
function saveEditChanges(){
	restAPI.getTaskByUid(function() {}, saveTask , "Saving changes...");
}
function saveTask(response){
    if( response.status == 200 || response.status == 201 ||
        response.status == 202 ){
        var json = JSON.stringify(response.responseJSON);
        var js = JSON.parse(json);
        var eTag = js.fingerprint;
        //$('body').data('eTag', "\"" + eTag + "\"");
        js.title = $('#editableTitle').val();
        js.description = $('#editableDesc').val();
        js.notes = $('#addnotes').val();
        restAPI.updateTask(function() {} , completeSave , js, "Updating...");
    }
    else{
        ajaxResponseErrorHandle(response.status);
    }
}

function completeSave(response){
    if( response.status == 200 || response.status == 201 ||
        response.status == 202 ){
        customHideLoading();
        showDefined();
    }
    else
        ajaxResponseErrorHandle(response.status);
}

function displayEmptyTaskList(){
	var last = nav_stack[nav_stack.length-2];
	var prevPage = String(last);
	console.log(nav_stack);
	console.log('prevPage : ' + prevPage);
	console.log( prevPage == "#home" );
	//On oql search and no tasks are incomplete
    if( oqlOriginSearch) {
    	$("#msgList").append('<h2> No Search Results </h2>');
        addTryAgainBtn();
    }
    else if( PARTY_ROLE == "seller")
    	$('#msgList').append('<h2> No Incomplete Tasks </h2>');
    else{
    	if( prevPage == "#home" || prevPage == "#history")
       		$('#msgList').append('<h2> No Incomplete Tasks </h2>');
       	else{
        	$.mobile.changePage("#home");
        	$('.actionMsg').text('All Tasks in List Complete');
        }
    }        	
}
