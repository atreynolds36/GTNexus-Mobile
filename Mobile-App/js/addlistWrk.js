/**
 * Created by areynolds on 6/2/2014.
 */
/*
 * Makes a RESTful service call to create a new list on the GTNexus
 * platform. Title is extracted from user enter textfield
 */
function initList(){
    try{
        var title = $('#listTitle').val().trim();
        customShowLoading('Create list...');
        var url = "$TodoListQ1/?dataKey=" + softwareProviderDataKey;
        url += "&action=create";
        var rawData = {
            type : '$TodoListQ1',
            title : title
        };
        //Converts the javascript array to JSON format
        var jsonStr = JSON.stringify(rawData);
        ajaxConnectPost(applicationHostName, url, jsonStr, true, 'json', createListSuccess,
            backToHome, setHeader, connectionError);

    }catch(e){
        alert(e);
    }
}
/*
 * Sends the mobile page back to the apps homepage and
 * indicates that said page needs to be updated
 */
function backToHome(response){
    customHideLoading();
    requireRESTfulService = true;
    $.mobile.changePage("#home");
}

function createListSuccess(response){
    //Do on successful creation of list
}