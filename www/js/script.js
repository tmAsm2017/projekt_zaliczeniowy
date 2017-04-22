var myApp = new Framework7({
    swipePanel: 'left'
});

let localStorageDate = false;

document.addEventListener("deviceready", onDeviceReady, false);



function onDeviceReady() {
    pageLoaded();

    let gpsButton = document.getElementById("gps");
    let photoButton = document.getElementById('photo');
    //  gpsButton.addEventListener("click", gpsOn);
    photoButton.addEventListener("click", getPhoto);
//  localStorage.clear();
     if(!localStorageDate){
        
       gpsOn();

         if(document.getElementById('add_info').classList.contains('hide')){
            document.getElementById('add_info').classList.remove('hide');
        }
         if(document.getElementById('save').classList.contains('hide')){
            document.getElementById('save').classList.remove('hide');
        }
    }

            
}
//GPS --------------------------------------------------------------------
function onRequestSuccess(success){
    console.log("Successfully requested accuracy: "+success.message);
    getMapLocation();
}

function onRequestFailure(error){
    console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
    if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
        if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
            cordova.plugins.diagnostic.switchToLocationSettings();
        }
    }
}

function gpsOn() {
    cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);  
}



let Latitude = undefined;
let Longitude = undefined;

// Get geo coordinates

function getMapLocation() {
    //alert('get');
    navigator.geolocation.getCurrentPosition
    (onMapSuccess, onMapError, { enableHighAccuracy: true });
}

// Success callback for get geo coordinates

var onMapSuccess = function (position) {

    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    //  alert(Latitude +  " " + Longitude )

    // Latitude = 50
    // Longitude = 40;
    setTimeout(function(){  getMap(Latitude, Longitude,'map'); }, 300);
   

}

// Get map by using coordinates

function getMap(latitude, longitude,id) {

    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        zoomControl: false
    };
//  alert('GET: '+latitude + ' ' +longitude);
    let map = new google.maps.Map
    (document.getElementById(id), mapOptions);


    var latLong = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        position: latLong
    });

    marker.setMap(map);
    map.setZoom(15);
    map.setCenter(marker.getPosition());
    // map.getUiSettings().setZoomControlsEnabled(false);
    // map.getUiSettings().setMapToolbarEnabled(true);

    if(document.getElementById(id).classList.contains('hide')){
        document.getElementById(id).classList.remove('hide')
    }
}

// Success callback for watching your changing position

var onMapWatchSuccess = function (position) {

    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        getMap(updatedLatitude, updatedLongitude,'map');
    }
}

// Error callback

function onMapError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

// Watch your changing position

function watchMapPosition() {

    return navigator.geolocation.watchPosition
    (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });
}

//GPS END =====================================================================
function getPhoto() {
    navigator.camera.getPicture(function (imageURI) { // onSuccess
        localStorage.setItem('photo', imageURI);
        location.reload(true);
    }, function (ex) { // onError
        navigator.notification.alert('Nie udało się zrobić zdjęcia');
    }, { // options
        quality: 70,
        destinationType: Camera.DestinationType.FILE_URI
    });
}

document.getElementById('clear').addEventListener('click', function (ev) {
    localStorage.clear();
    location.reload(false);
    let savedInfo = document.getElementById('saved_info');
    if(!savedInfo.classList.contains('hide')){
        savedInfo.classList.add('hide');
    }
});




document.getElementById('save').addEventListener('click', function (ev) {
    let colorOptions = document.getElementById('colors');
    let fruitOptions = document.getElementById('fruits');
    let parkNumber = document.getElementById('park_number');
    let parkLevel = document.getElementById('park_level');

    let colorIndex = colorOptions.selectedIndex;
    if (colorIndex !== 0) {
        localStorage.setItem('color', colorOptions.options[colorIndex].text);
    }

    let fruitIndex = fruitOptions.selectedIndex;
    if (fruitIndex !== 0) {
        localStorage.setItem('fruit', fruitOptions.value);
    }

    if (parkNumber.value !== '') {
        localStorage.setItem('number', parkNumber.value);
    }

    if (parkLevel.value !== '') {
        localStorage.setItem('level', parkLevel.value);
    }

    if(Latitude) {
         localStorage.setItem('map_Latitude', Latitude);
         localStorage.setItem('map_Longitude', Longitude)
    }

    location.reload(false);
});

function pageLoaded() {
    let storedColor = localStorage.getItem('color');
    let storedFruit = localStorage.getItem('fruit');
    let storedNumber = localStorage.getItem('number');
    let storedLevel = localStorage.getItem('level');
    let storedPhoto = localStorage.getItem('photo');
    let storedMap_Latitude = localStorage.getItem('map_Latitude');
    let storedMap_Longitude = localStorage.getItem('map_Longitude');

    if (storedPhoto !== null) {
        addPhoto(storedPhoto);
    }
    if (storedNumber !== null) {
        addInfo('Numer: <b>' + storedNumber + '</b>')
    }
    if (storedLevel !== null) {
        addInfo('Poziom: <b>' + storedLevel + '</b>')
    }
    if (storedColor !== null) {
        addInfo('Kolor: <b>' + storedColor + '</b>');
    }
    if (storedFruit !== null) {
        addInfo('Znak: <b>' + storedFruit + '</b>')
    }
     if (storedMap_Latitude !== null) {
        addMap(storedMap_Latitude,storedMap_Longitude)
    }

    function addMap(latitude,longitude){
        //  alert(latitude + ' ' +longitude);
        let tmpNode = '<div id="saved_map"></div><p><a href="#" class="button button-big button-fill button-raised color-purple" id="nav">Nawiguj</a></p>';
        //  let tmpNode = '<div id="saved_map"></div>';
        // append(tmpNode);
        document.getElementById('saved_info').getElementsByTagName("ul")[0].innerHTML +=tmpNode;

         getMap(latitude, longitude,'saved_map');

        document.getElementById('nav').addEventListener('click', function (ev) {
            //  alert('aaaa');
            // launchnavigator.navigate([latitude, longitude])
            //launchnavigator.navigate("London, UK");
            launchnavigator.isAppAvailable(launchnavigator.APP.GOOGLE_MAPS, function(isAvailable){
                var app;
                if(isAvailable){
                    app = launchnavigator.APP.GOOGLE_MAPS;
                }else{
                    console.warn("Google Maps not available - falling back to user selection");
                    app = launchnavigator.APP.USER_SELECT;
                }
                launchnavigator.navigate([latitude, longitude], {
                    app: app
                });
            });
           
        });

       

    }

    function addInfo(text) {
        // let tmpNode = document.createElement('p');
        let tmpNode = '<li class="item-content"><div class="item-inner"><div class="item-title">'+text+'</div></div></li>';
        // tmpNode.innerHTML = text;
        append(tmpNode);
    }

    function addPhoto(imageURI) {
        // let tmpNode = document.createElement('img');
        // tmpNode.src = imageURI;
        let tmpNode = '<li class="item-content"><div class="item-inner"><div class="item-title"><img src="'+imageURI+'"></div></div></li>';
        append(tmpNode);
    }

    function append(node) {
        localStorageDate=true;
        let savedInfo = document.getElementById('saved_info');
        savedInfo.getElementsByTagName("ul")[0].innerHTML +=node;
        if(savedInfo.classList.contains('hide')){
            savedInfo.classList.remove('hide');
        }

        // document.getElementById('add_info').classList.add('hide');
        // savedInfo.appendChild(node);
        // savedInfo.style.display = 'block';
    }
}
