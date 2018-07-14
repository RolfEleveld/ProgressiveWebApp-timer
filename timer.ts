var stopTrigger = false;
function timer(goalTime) {
    var now = Date.now();
    var timeleft = goalTime - now;
    showTimeLeft(timeleft);
    if (timeleft >= 0) {
        setTimeout(function () {
            if (!stopTrigger) {
                timer(goalTime);
            }
        }, 1000);
    } else {
        stopTrigger = true;
        showEnded();
    }
}
function showTimeLeft(timeleft) {
    var s = Math.floor(timeleft / 1000);
    var m = Math.floor(s / 60);
    var h = Math.floor(m / 60);
    var d = Math.floor(h / 24);

    s = s % 60;
    m = m % 60;
    h = h % 24;

    if (d <= 0) {
        hideField(".clock > .days");
    } else {
        showField(".clock > .days");
        setFieldText(".clock > .days > h2", d);
    }
    if (h <= 0 && d <= 0) {
        hideField(".clock > .hours");
        hideField(".clock > .hourseparator")
    } else {
        showField(".clock > .hours");
        showField(".clock > .hourseparator")
        setFieldText(".clock > .hours > h2", h);
    }
    if (m <= 0 && h <= 0 && d <= 0) {
        hideField(".clock > .minutes");
        hideField(".clock > .minuteseparator")
    } else {
        showField(".clock > .minutes");
        showField(".clock > .minuteseparator")
        setFieldText(".clock > .minutes > h2", m);
    }
    if (s <= 0 && m <= 0 && h <= 0 && d <= 0) {
        hideField(".clock > .seconds");
    } else {
        showField(".clock > .seconds");
        setFieldText(".clock > .seconds > h2", s);
    }
}
function setFieldText(cssSelection, value) {
    var cssElements = document.querySelectorAll(cssSelection);
    for (var i = 0; i < cssElements.length; i++) {
        cssElements[i].textContent = value;
    }
}
function hideField(cssSelection) {
    var cssElements = document.querySelectorAll(cssSelection);
    for (var i = 0; i < cssElements.length; i++) {
        cssElements[i].classList.add("hidden");
    }
}
function showField(cssSelection) {
    var cssElements = document.querySelectorAll(cssSelection);
    for (var i = 0; i < cssElements.length; i++) {
        cssElements[i].classList.remove("hidden");
    }
}
function showEnded() {
    var cssElements = document.querySelectorAll(".clock > .expiration");
    for (var i = 0; i < cssElements.length; i++) {
        cssElements[i].classList.remove("hidden");
        cssElements[i].classList.add("expired");
    }
    setTimeout(function () {
        hideEnded();
    }, 60000);
}
function hideEnded(){
    var cssElements = document.querySelectorAll(".clock > .expiration");
    for (var i = 0; i < cssElements.length; i++) {
        cssElements[i].classList.remove("expired");
        cssElements[i].classList.add("hidden");
    }
}
function setTimer() {
    stopTrigger = false;
    var settingsForm = (<HTMLFormElement>document.getElementById("timerForm")).elements;
    var d = settingsForm["days"].value;
    var h = settingsForm["hours"].value;
    var m = settingsForm["minutes"].value;
    var s = settingsForm["seconds"].value;
    var offsetTime = d * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000 + m * 60 * 1000 + s * 1000;
    var destinationTime = (new Date()).getTime() + offsetTime;
    localStorage.timer = destinationTime;
    timer(new Date(destinationTime).getTime()); //10 minutes
    hideEnded();
    hideField("nav");
}
function showMenu() {
    showField("nav");
}
function stopTimer() {
    stopTrigger = true;
}
function loadTimer(){
    hideEnded();
    var endTime = localStorage.timer;
    if (!stopTrigger){
        timer(endTime);     
    }
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
}
loadTimer();