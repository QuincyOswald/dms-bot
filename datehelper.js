var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]

var errorCount = 0;

function createMonthlyPeriod(date) {
    if (shouldOffset()) {
        date.setUTCMonth(date.getUTCMonth() - 1, 15);
    }
    return months[date.getUTCMonth()] + " " + date.getUTCFullYear();
}

function createQuarterlyPeriod(date) {
    if (shouldOffset()) {
        date.setUTCMonth(date.getUTCMonth() - 3, 15);
    }
    var quarter = Math.floor(date.getUTCMonth() / 3) + 1;
    return `Q${quarter} ${date.getUTCFullYear()}`;
}

function createSemiannuallyPeriod(date) {
    if (shouldOffset()) {
        date.setUTCMonth(date.getUTCMonth() - 6, 15);
    }
    var half = Math.floor(date.getUTCMonth() / 6);
    var display = half == 0 ? "Jan-Jun" : "Jul-Dec";
    return `${display} ${date.getUTCFullYear()}`;
}

function createYearlyPeriod(date) {
    if (shouldOffset()) {
        return date.getUTCFullYear() - 1;
    } else {
        return date.getUTCFullYear();
    }
}

var periodTypeToFunction = {
    monthly: createMonthlyPeriod,
    quarterly: createQuarterlyPeriod,
    semiannually: createSemiannuallyPeriod,
    yearly: createYearlyPeriod
};

function mapPeriod(dateText) {
    if (dateText.trim() == "") {
        return "";
    }

    var date = new Date(dateText);
    if (isNaN(date.getTime())) {
        errorCount++;
        return "ERROR";
    }

    var periodRadio = document.getElementById("periodRadio");
    var selectedPeriod = periodRadio.elements.period.value;
    var periodMapper = periodTypeToFunction[selectedPeriod];
    return periodMapper(date);
}

function createPeriods() {
    errorCount = 0;
    var textBox = document.getElementById("dateTextbox");
    var result = textBox.value
            .split("\n")
            .map(mapPeriod)
            .join("\n");
    document.getElementById("output").value = result;

    if (errorCount == 1) {
        alert(`There was 1 error`);
    } else if (errorCount > 0) {
        alert(`There were ${errorCount} errors`);
    }

    syncScroll();
}

function shouldOffset() {
    return !document.getElementById("io").checked;
}

function clearTextboxes() {
    document.getElementById("dateTextbox").value = "";
    document.getElementById("output").value = "";
}

function copyDates() {
    var copyText = document.getElementById("output");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function syncScroll() {
    var input = document.getElementById("dateTextbox");
    var output = document.getElementById("output");
    output.scrollTop = input.scrollTop
}

function syncScrollReverse() {
    var input = document.getElementById("dateTextbox");
    var output = document.getElementById("output");
    input.scrollTop = output.scrollTop
}

var timeOffset = new Date().getTimezoneOffset();
if (timeOffset < 0) {
    alert("Sorry, this app doesn't work if you are east of England. Too bad!");
    window.close();
}