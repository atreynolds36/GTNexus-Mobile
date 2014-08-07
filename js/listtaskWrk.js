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
/*
 * Runs on success action of ajax call
 */
function fetchListSuccess(response){
    console.log("list found");
}
/*
 * Sets up the task list page based on response body form POST 
 * restful service call. Tasks are displayed in a table with two
 * columns: one for a checkbox and another for a clickable button
 * that navigates the user to the view task page
 */
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
/*
 * Executes a restful call based on whether the org is a buyer or a seller.
 * For a buyer, rest call fetches all tasks associated with the list. For a 
 * seller, rest call fetches all tasks associated with organization.
 */
function getHistory(){
	if( PARTY_ROLE == "buyer" )
	    restAPI.getTasksInList(function() {} , displayHistory, "Fetching History...");
	else	
		restAPI.getSellerTasks(function() {} , displayHistory, "Fetching History...");
}
/*
 * Similar to setTaskList. Only difference is tasks are displayed in
 * a list rather than a table. A table is not needed because there
 * would only be one column so a list is used.
 */
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
/*
 * Gets a specific task via restful service
 */
function saveEditChanges(){
	restAPI.getTaskByUid(function() {}, saveTask , "Saving changes...");
}
/*
 * Response is body of restful service call of a task CO. Method
 * edits fields of the custom object and sends out a POST rest call
 * to change the fields on of the CO on the GTNexus platform
 */
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
/*
 * Callback from POST request. Returns the fields to defined if the
 * call was successful or handles an error if the call was not
 * successful
 */
function completeSave(response){
    if( response.status == 200 || response.status == 201 ||
        response.status == 202 ){
        customHideLoading();
        showDefined();
    }
    else
        ajaxResponseErrorHandle(response.status);
}
/*
 * Called when there are no tasks to be displayed. Displays
 * a logical message to the user indicating this.
 */
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
