/**
 * Created by areynolds on 6/2/2014.
 */
var community = null;
/*
 * Gathers information that has been entered into the apps GUI
 * to create a new task. A new custom object Task is created
 * with a POST ajax call
 */
function initTask(){
    var description = $('#taskDescription').val().trim();
    var title = $('#taskTitle').val().trim();

    var assigneeVal = $("#assignTask").val();
    var assigneeObj;
    var boolUnassign = "false";
    if( $('#boolUnassigned').is(':checked') ||
        assigneeVal == "Choose Task Assignee"){
        boolUnassign = "true";
    }
    else {
        for (var i = 0; i < community.length; i++) {
            if (community[i].memberId == assigneeVal) {
                assigneeObj = community[i];
            }
        }
    }
    restAPI.addTask( callSuccessTask , backToViewTask , title, description , assigneeObj,
    	boolUnassign);
}
/*
 * Cleans up after the task has been successfully created.
 * Taskuid and currently CO fingerprint are added to the body
 * data for quick retrieval and the app is sent back to the
 * list of tasks page
 */
function backToViewTask(response) {
    if (response.status == 200 || response.status == 201 ||
        response.status == 202) {
        var res = JSON.stringify(response.responseJSON);
        var eTag = JSON.parse(res).create.result.fingerprint;
        console.log(eTag);
        var taskUID = JSON.parse(res).create.result.uid;
        var jsonStr = JSON.parse(res).create.result;
        var isNotAssigned = JSON.parse(res).create.result.boolUnassigned;
        console.log(taskUID);
        $('body').data('eTag', "\""+eTag+"\"");
        $('body').data('taskuid', taskUID);
        //Transition Task to the 2nd state - the Assigned but Uncompleted State
        //Ignore if still not assigned to any party
        if( isNotAssigned != "true")
        	restAPI.transitionTask( function() {} , function() {} , jsonStr , "assign");

        customHideLoading();
        action = 'Task Addition Complete!';
        $('body').removeData('eTag');
        requireRESTfulService = true;
        $.mobile.changePage("#tasklist");
    }
    else{
        ajaxResponseErrorHandle(response.status);
    }
}

function callSuccessTask(response){
    console.log("task successfully created");
}
/*
 * Intialiazes the add new task page and if there is the array
 * that is set to the GTNexus community ( community ) is not set
 * a rest call is executed to set the community so the user can
 * the ability to assign the newly created task to a party
 */
function initLookupForm(){
    $('#taskDescription').val('');
    $('#taskTitle').val('');
    $('#boolUnassigned').attr("checked", false);

    if(!community)
        restAPI.getCommunity(function(){} , completeLookupForm, "Locating community...");
}
/*
 * Talks a response from the rest call that retrieves the GTNexus
 * community and adds each party into an easy to navigate dropdown
 * menu. Afterwards, the menu is refreshed so it will display on the
 * page once the dropdown menu is pressed
 */
function completeLookupForm(response){
    var res = JSON.stringify(response.responseJSON);
    community = JSON.parse(res).result;

    //Add parties to drop down select box
    for( var i = 0; i < community.length; i++){
        var party = community[i];
        var $option = $('<option> ' + party.name + ' </option>');
        $option.prop('value', party.memberId);
        console.log(party.name);
        var tp = -1;
        switch(party.partyRoleCode){
            case 'Consignee' :
                tp = 0;   break;
            case 'NotifyParty' :
                tp = 1;   break;
            case 'Licensee' :
                tp = 2;   break;
            case 'Seller' :
                tp = 3;   break;
            case 'LogisticsProvider' :
                tp = 4;   break;
            case 'FinanceProvider' :
                tp = 5;   break;
            case 'InspectionCompany' :
                tp = 6;   break;
            case 'SoftwareProvider' :
                tp = 7;  break;
            case 'Buyer' :
                tp = 8;  break;
        }
        console.log(tp);
        if( tp != -1)
            $("#assignTask optgroup").eq(tp).append($option);
    }
    customHideLoading();
    $('#assignTask').selectmenu('refresh');
}