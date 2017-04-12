/**
 * Created by tomasz.maj on 09.04.2017.
 */

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {    
    let gpsButton = document.getElementById("gps");
    gpsButton.addEventListener("click", getPostition);
}

function getPostition(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

var onSuccess = function(position) {
    document.getElementById("gps_info").innerHTML=
        '<b>Latitude: </b>'          + position.coords.latitude + '<br>' +
        '<b>Longitude:</b> '         + position.coords.longitude ;
};

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
 