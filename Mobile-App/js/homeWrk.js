/**
 * Created by areynolds on 6/2/2014.
 */
//var myList = null;
/*
 * Fetches the lists associated with the org
 */
function fetchHomeList(){
    //ajax call to get lists 
    restAPI.getLists(function() {} , setList);
    requireRESTfulService = false;
}
/*
function getList(data,textStatus,response){
    console.log(response.status);
    if( response.status == 200 || response.status == 201 ||
        response.status == 202 ){
        var req = JSON.stringify(response.responseJSON);
        console.log("# of lists: " + JSON.parse(req).resultInfo.count);
        myList = JSON.parse(req).result;
        console.log(myList);
    }
    else{
        ajaxResponseErrorHandle(response.status);
    }
}
*/
/*
 * Method takes response body and parses the body for all of the lists
 * available to the user org. The lists are added to a listview and
 * displayed on page. Each list item has an event handler for click
 * and swipe left that changes pages to on each event to the correlated
 * list of tasks
 */
function setList(response){
    if( response.status == 200 || response.status == 201 ||
        response.status == 202 ){
        var req = JSON.stringify(response.responseJSON);
        console.log("# of lists: " + JSON.parse(req).resultInfo.count);
        myList = JSON.parse(req).result;
        $("#homeList").empty();
        if(myList){
            for( var i = 0; i < myList.length; i++ ){
                var singleList = myList[i];
                console.log(singleList.title);
                var title = singleList.title;
                if( !title ){title = "undefined";}
                var $temp = $('<li> <a href="#tasklist">' + title + '</a></li>');
                $temp.attr("id", singleList.uid);
                $temp.click( function() {
                    if( $('body').data('listuid') != $(this).attr('id') ) {
                        requireRESTfulService = true;
                        initialHistory = true;
                    }
                    setListUid( $(this).attr('id'));
                });
                $temp.on("swipeleft", function(){
                    console.log("recognize swipe right");
                    if( $('body').data('listuid') != $(this).attr('id') ) {
                        requireRESTfulService = true;
                        initialHistory = true;
                        $.mobile.changePage("#tasklist", {transition:"slide"} );
                    }
                    setListUid( $(this).attr('id'));
                });
                /*
                $temp.on("swiperight", function(){
                   console.log("recognize swipe left");
                    setListUid( $(this).attr('id'));
                    //Show panel to delete this list !
                });
                */
                console.log("adding this uid: "+ singleList.uid);
                $("#homeList").append($temp);
            }
            $('#homeList').listview('refresh');
        }
        else{
            $("#home .ui-content").append("<h4> No Lists </h4>");
        }
    }
    else{
        ajaxResponseErrorHandle(response.status);
    }
    customHideLoading();
}


