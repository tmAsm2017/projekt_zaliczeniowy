document.addEventListener("deviceready", onDeviceReady, false);

pageLoaded();

function onDeviceReady() {
    let gpsButton = document.getElementById("gps");
    let photoButton = document.getElementById('photo');
    gpsButton.addEventListener("click", getPostition);
    photoButton.addEventListener("click", getPhoto);
}

function getPostition() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

var onSuccess = function (position) {
    document.getElementById("gps_info").innerHTML =
        '<b>Latitude:</b> ' + position.coords.latitude + '<br>' +
        '<b>Longitude:</b> ' + position.coords.longitude;
};

function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

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
        localStorage.setItem('fruit', fruitOptions.options[fruitIndex].text);
    }

    if (parkNumber.value !== '') {
        localStorage.setItem('number', parkNumber.value);
    }

    if (parkLevel.value !== '') {
        localStorage.setItem('level', parkLevel.value);
    }

    location.reload(false);
});

function pageLoaded() {
    let storedColor = localStorage.getItem('color');
    let storedFruit = localStorage.getItem('fruit');
    let storedNumber = localStorage.getItem('number');
    let storedLevel = localStorage.getItem('level');
    let storedPhoto = localStorage.getItem('photo');

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
        addInfo('Owoc: <b>' + storedFruit + '</b>')
    }

    function addInfo(text) {
        let tmpNode = document.createElement('p');
        tmpNode.innerHTML = text;
        append(tmpNode);
    }

    function addPhoto(imageURI) {
        let tmpNode = document.createElement('img');
        tmpNode.src = imageURI;
        append(tmpNode);
    }

    function append(node) {
        let savedInfo = document.getElementById('saved_info');
        savedInfo.appendChild(node);
        savedInfo.style.display = 'block';
    }
}
