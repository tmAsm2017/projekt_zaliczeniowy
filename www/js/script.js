document.addEventListener("deviceready", onDeviceReady, false);

pageLoaded();

function onDeviceReady() {
    let gpsButton = document.getElementById("gps");
    gpsButton.addEventListener("click", getPostition);
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

document.getElementById('clear').addEventListener('click', function (ev) {
    localStorage.clear();
});

document.getElementById('save').addEventListener('click', function (ev) {
    let colorOptions = document.getElementById('colors');
    let fruitOptions = document.getElementById('fruits');
    let parkNumber = document.getElementById('park_number');

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

    location.reload(false);
});

function pageLoaded() {
    let storedColor = localStorage.getItem('color');
    let storedFruit = localStorage.getItem('fruit');
    let storedNumber = localStorage.getItem('number');

    if (storedColor !== null) {
        addInfo('Kolor jest <b>' + storedColor + '</b>');
    }

    if (storedFruit !== null) {
        addInfo('Owoc to <b>' + storedFruit + '</b>')
    }

    if (storedNumber !== null) {
        addInfo('O numerze <b>' + storedNumber + '</b>')
    }

    function addInfo(text) {
        let savedInfo = document.getElementById('saved_info');
        let tmpNode = document.createElement('p');
        tmpNode.innerHTML = text;
        savedInfo.appendChild(tmpNode);
        savedInfo.style.display = 'block';
    }
}