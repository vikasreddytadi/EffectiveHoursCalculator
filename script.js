var input = document.getElementById("logs");
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("logButton").click();
    }
});

if (!localStorage.effectiveHours) {
    window.localStorage.effectiveHours = "00:00:00";
}


document.getElementById('effectiveTime').value = window.localStorage.effectiveHours;

function TimeAdder(t1, t2) {
    t1 = t1.split(":");
    t2 = t2.split(":");
    let sec = parseInt(t1[2]) + parseInt(t2[2]);
    let mint = parseInt(t1[1]) + parseInt(t2[1]);
    let hrs = parseInt(t1[0]) + parseInt(t2[0]);
    if (sec >= 60) {
        sec -= 60;
        mint += 1;
    }
    if (mint >= 60) {
        mint -= 60;
        hrs += 1;
    }
    return hrs.toString() + ':' + mint.toString() + ':' + sec.toString();
}


function getDate() {
    const now = new Date();
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: 'Asia/Kolkata'
    };
    const time24hrs = now.toLocaleTimeString('en-IN', options);
    return (time24hrs);
}


function TimeValidation(t1, t2, format) {
    t1 = t1.split(":");
    t2 = t2.split(":");
    for (let i = 0; i < 3; i++) {
        if (t2[i] == "MISSING") {
            break;
        }
        else if (format == 24) {
            if (i == 0) {
                if (parseInt(t1[i]) > 23 || parseInt(t2[i]) > 23 || parseInt(t1[i]) < 0 || parseInt(t2[i]) < 0) {
                    return 404;
                }
            }
            else if (isNaN(t1[i]) == true || isNaN(t2[i]) == true || parseInt(t1[i]) > 59 || parseInt(t2[i]) > 59 || parseInt(t1[i]) < 0 || parseInt(t2[i]) < 0) {
                return 404;
            }
        }
        else if (format == 12) {
            if (i == 0) {
                if (parseInt(t1[i]) > 12 || parseInt(t2[i]) > 12 || parseInt(t1[i]) <= 0 || parseInt(t2[i]) <= 0) {
                    return 404;
                }
            }
            else if (isNaN(t1[i]) == true || isNaN(t2[i]) == true || parseInt(t1[i]) > 59 || parseInt(t2[i]) > 59 || parseInt(t1[i]) < 0 || parseInt(t2[i]) < 0) {
                return 404;
            }
        }
    }
}

function TimeDiff(t1, t2, flag = 0, hours1 = 0, hours2 = 0) {
    if (t2 == "MISSING") {
        t2 = getDate();
    }
    t1 = t1.split(":");
    t2 = t2.split(":");
    if (hours1 == 1) {
        t1[0] = parseInt(t1[0]) + 12;
        if (t1[0] == 24) {
            t1[0] = 0;
        }
    }
    if (hours2 == 1) {
        t2[0] = parseInt(t2[0]) + 12;
        if (t2[0] == 24) {
            t2[0] = 0;
        }
    }
    let sec = 60 - parseInt(t1[2]);
    let mint = 0;
    if (sec != 60) {
        mint += 1;
    }
    mint = 60 - (parseInt(t1[1]) + mint);
    let hrs = parseInt(t1[0]);
    if (mint != 60) {
        hrs += 1;
    }
    if (sec == 60) {
        sec = 0;
    }
    if (mint == 60) {
        mint = 0;
    }
    sec += parseInt(t2[2]);
    if (sec >= 60) {
        sec -= 60;
        mint += 1;
    }
    mint += parseInt(t2[1]);
    if (parseInt(t1[0]) > parseInt(t2[0]) && flag == 0) {
        hrs = 24 - hrs;
        hrs += parseInt(t2[0]);
    }
    else {
        hrs = parseInt(t2[0]) - hrs;
    }
    if (mint >= 60) {
        mint -= 60;
        hrs += 1;
    }
    return hrs.toString() + ':' + mint.toString() + ':' + sec.toString();
}


function Error(output1, time1, displayEffectiveHours1) {
    displayEffectiveHours1.innerHTML = " "
    output1.innerHTML = " ";
    time1.innerHTML = "";
    output1.className = 'fadeOut ';
    output1.focus();
    output1.className = 'fadeIn output';
    time1.className = 'fadeOut ';
    time1.focus();
    time1.className = 'fadeIn output';
    output1.innerHTML = "Please Enter Logs in <br> Correct Format ";
    time1.innerHTML = "";
    return;
}

function TwentyFourHrsConverter(time) {
    t = time.split(":");
    hrs = parseInt(t[0]);
    temp = "";
    if (hrs < 12 || (hrs >= 24 && hrs < 36)) {
        temp = "AM";
    }
    else if ((hrs >= 12 && hrs < 24) || (hrs >= 36 && hrs < 48)) {
        temp = "PM";
    }
    else {
        return "404";
    }
    hrs = hrs % 12;
    if (hrs == 0) {
        hrs = 12;
    }
    t[0] = hrs.toString();
    t = t.join(":") + " " + temp;
    return t
}

var effectiveCompletedFlag = 0;
var items = new Array();
function evaluator() {
    effectiveCompletedFlag = 0;
    var remainingEffectiveHours1 = document.getElementById('displayRemainingEffectiveHours');
    var showHours = document.getElementById('hoursHolder');
    showHours.style.display = "none";
    var output1 = document.getElementById('output');
    var time1 = document.getElementById('time');
    displayEffectiveHours1 = document.getElementById('displayEffectiveHours');
    var requiredEffectiveHours = document.getElementById('effectiveTime').value;
    requiredEffectiveHours = requiredEffectiveHours.trim();
    window.localStorage.effectiveHours = requiredEffectiveHours;
    var effectiveHours = "00:00:00";
    var flag = 0;
    var endTime = "";
    var a = document.getElementById('logs').value;
    a = a.trim();
    let b = a.split(/(\s)/).filter((x) => x.trim().length > 0);
    var TwelveHours = 0;
    if (a.includes("AM") || a.includes("PM")) {
        TwelveHours = 1;
    }
    if (TwelveHours == 1) {
        if (a.length == 0 || !b || !a || !requiredEffectiveHours) {
            Error(output1, time1, displayEffectiveHours1);
            return;
        }
        if (a.includes("MISSING")) {
            if (b.length % 4 != 3) {
                Error(output1, time1, displayEffectiveHours1);
                return;
            }
        }
        else {
            if (b.length % 4 != 0) {
                Error(output1, time1, displayEffectiveHours1);
                return;
            }
        }
        for (let i = 0; i < b.length; i += 4) {
            var left = 0;
            var right = 0
            var ResponseOfTimeValidation = TimeValidation(b[i], b[i + 2], 12);
            if (ResponseOfTimeValidation == 404) {
                Error(output1, time1, displayEffectiveHours1);
                return;
            }
            if (b[i + 1] == "AM" && parseInt(b[i]) == 12) {
                left = 1;
            }
            else if (b[i + 1] == "PM" && parseInt(b[i]) != 12) {
                left = 1;
            }
            else if (b[i + 1] != "PM" && b[i + 1] != "AM" && b[i + 1] != "MISSING") {
                Error(output1, time1, displayEffectiveHours1);
                return;
            }
            if (b[i + 3] == "AM" && parseInt(b[i + 2]) == 12) {
                right = 1;
            }
            else if (b[i + 3] == "PM" && parseInt(b[i + 2]) != 12) {
                right = 1;
            }
            else if (b[i + 3] != "PM" && b[i + 3] != "AM" && b[i + 3] != "MISSING" && b[i + 3] != undefined) {
                Error(output1, time1, displayEffectiveHours1);
                return;
            }
            let diff = TimeDiff(b[i], b[i + 2], 0, left, right);
            if (diff == 404) {
                Error(output1, time1, displayEffectiveHours1);
                return;
            }
            effectiveHours = TimeAdder(effectiveHours, diff);
        }
    }
    else {
        if (b.length % 2 != 0 || a.length == 0 || !b || !a || !requiredEffectiveHours) {
            Error(output1, time1, displayEffectiveHours1);
            return;
        }
        for (let i = 0; i < b.length; i += 2) {
            var ResponseOfTimeValidation = TimeValidation(b[i], b[i + 1], 24);
            if (ResponseOfTimeValidation == 404) {
                Error(output1, time1, displayEffectiveHours1);
                return;
            }
            let diff = TimeDiff(b[i], b[i + 1]);
            if (diff == 404) {
                Error(output1, time1, displayEffectiveHours1);
                return;
            }
            effectiveHours = TimeAdder(effectiveHours, diff);
        }
    }
    if (effectiveHours.includes("NaN")) {
        Error(output1, time1, displayEffectiveHours1);
        return;
    }
    var balancedEffectiveHours = TimeDiff(effectiveHours, requiredEffectiveHours, 1);
    if (balancedEffectiveHours[0] == '-') {
        flag = 1;
    }
    else {
        endTime = TimeAdder(balancedEffectiveHours, getDate());
        endTime = TwentyFourHrsConverter(endTime);
        if (endTime == "404") {
            Error(output1, time1, displayEffectiveHours1);
            output1.innerHTML = "log out time <br>crossing two days";
            return;
        }
    }

    if (flag == 1) {
        showHours.style.display = "flex";
        output1.innerHTML = " ";
        time1.innerHTML = "";
        output1.className = 'fadeOut ';
        output1.focus();
        output1.className = 'fadeIn output';
        time1.className = 'fadeOut ';
        time1.focus();
        time1.className = 'fadeIn output';
        output1.innerHTML = "You can Leave Thank You";
        time1.innerHTML = "";
        remainingEffectiveHours1.innerHTML = "00:00:00";
    }
    else {
        if (endTime.includes('NaN')) {
            Error(output1, time1, displayEffectiveHours1);
            return;
        }
        showHours.style.display = "flex";
        output1.innerHTML = " ";
        time1.innerHTML = "";
        output1.className = 'fadeOut ';
        output1.focus();
        output1.className = 'fadeIn output';
        time1.className = 'fadeOut ';
        time1.focus();
        time1.className = 'fadeIn time';
        output1.innerHTML = "You can Leave at";
        time1.innerHTML = endTime;
        remainingEffectiveHours1.innerHTML = balancedEffectiveHours;
    }
    displayEffectiveHours1.innerHTML = effectiveHours;
    var time = getDate();
    items.forEach(x => clearInterval(x));
    items.push(setInterval(function () {
        DisplayEffectiveRemaining(time, effectiveHours, balancedEffectiveHours, remainingEffectiveHours1, displayEffectiveHours1, output1, time1);
    }, 1000));
}
// for realtime effective time
function DisplayEffectiveRemaining(callTime, effectiveHours, balancedEffectiveHours, remainingEffectiveHours1, displayEffectiveHours1, output1, time1) {
    var realtimeTimeDifference = TimeDiff(callTime, getDate(), 1)
    var realtimeEffective = TimeAdder(effectiveHours, realtimeTimeDifference);
    if (effectiveCompletedFlag == 0) {
        var realtimeRemaining = TimeDiff(realtimeTimeDifference, balancedEffectiveHours, 1);
    }
    if (effectiveCompletedFlag == 0 && realtimeRemaining[0] == '-') {
        effectiveCompletedFlag = 1;
        output1.innerHTML = "You can Leave Thank You";
        time1.innerHTML = "";
        remainingEffectiveHours1.innerHTML = "00:00:00";
    }
    if (effectiveCompletedFlag == 0) {
        remainingEffectiveHours1.innerHTML = realtimeRemaining;
    }
    displayEffectiveHours1.innerHTML = realtimeEffective;
}
