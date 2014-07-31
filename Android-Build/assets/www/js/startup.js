var $form = $(' <form id="login"> </form> ');
$form.append('<label id="lblusername" for="username"> Enter Username');
$form.append('<input type="text" name="username" id="username"/><br>');
$form.append('<label id="lblpword" for="password"> Enter Password');
$form.append('<input type="password" name="password" id="password"/><br>');
$form.append('<label id="lbldatakey" for="datakey"> Enter Datakey');
$form.append('<input type="text" name="datakey" id="datakey"/><br>');
$form.append('<input type="submit" id="submit" value="Login In" />');
$("#main").append($form);

