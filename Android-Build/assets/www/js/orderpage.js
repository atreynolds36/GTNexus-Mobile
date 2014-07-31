/**
 * Created by areynolds on 5/28/2014.
 */
//Synchronously view orders
//Make a rest call to get orders
//get 5 at a time

//put orders in orders
var orders;

var $orderList = $("<ul> </ul>");
for( var i = 0; i < orders.length; i++)
{
    var $myOrder = $("<button> </button>");
    //get order name
    //$myOrder.val( orderName);
    //set event listener to orderRest function
    // $myOrder.click( function() { orderRest($myOrder.val()) });
    $orderList.append($myOrder);
}
$("#main").empty();
$("#main").append('<h1> My Orders </h1>');
$("#main").append($orderList);
