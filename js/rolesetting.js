/*
 * Sets specific seller display settings
 */
function setSellerSettings(){
	$('#tasklist a[name="backbtn"]').hide();
	$('#beforeAddPg').hide();
	setLogoutPopup();
	$('.actionMsg').text('');
	$.mobile.changePage("#tasklist", { transition: "pop" });
}
/*
 * Sets specific buyer display settings
 */
function setBuyerSettings(){
	setLogoutPopup();
	$('#tasklist a[name="backbtn"]').show();
	$('#beforeAddPg').show();
	$('.actionMsg').text('');
	$.mobile.changePage("#home", { transition: "pop" });
}
/*
 * Sets up a logout popup screen that will display when the
 * menu button is pressed. Logout screen also shows specific
 * information pertaining to the user of the app
 */
function setLogoutPopup(){
	$('.logoutpopup').children('h4, h5').empty();
	var $alpha = $('<h4> ' + localStorage.getItem('orgName') + ' </h4>');
	var $beta = $('<h5> ' + localStorage.getItem('userId') + ' </h5> ');
	var $gamma = $('<h5> Role : ' + localStorage.getItem('partyRole') + ' </h5>');
	$('.logoutpopup').prepend($gamma);
	$('.logoutpopup').prepend($beta);
	$('.logoutpopup').prepend($alpha);
}
