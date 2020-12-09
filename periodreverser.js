var Month = /** @class */ (function () {
    function Month(month, year) {
        this.month = month;
        this.year = year;
    }
    Month.of = function (input) {
        var match = Month.PATTERN.exec(input);
        var monthAbbr = match[1].toUpperCase();
        var month = Month.monthMap[monthAbbr];
        if (month == undefined) {
            throw new Error("Unrecognized month \"" + monthAbbr + "\"");
        }
        var year = parseInt(match[2]);
        return new Month(month, year);
    };
    Month.prototype.getExactDay = function (dayOfMonth, monthOfPeriod) {
        if (monthOfPeriod > 1) {
            throw new Error("You can only select days in the first month if period is a month");
        }
        return this.getFirstDay().withDayOfMonth(dayOfMonth);
    };
    Month.prototype.getNextPeriod = function () {
        var yearMonth = JSJoda.YearMonth.of(this.year, this.month).plusMonths(1);
        return new Month(yearMonth.month(), yearMonth.year());
    };
    Month.prototype.getFirstDay = function () {
        return JSJoda.LocalDate.of(this.year, this.month, 1);
    };
    Month.prototype.getLastDay = function () {
        return this.getFirstDay()["with"](JSJoda.TemporalAdjusters.lastDayOfMonth());
    };
    Month.PATTERN = /^(\w{3}) (\d{4})$/;
    Month.monthMap = {
        "JAN": JSJoda.Month.JANUARY,
        "FEB": JSJoda.Month.FEBRUARY,
        "MAR": JSJoda.Month.MARCH,
        "APR": JSJoda.Month.APRIL,
        "MAY": JSJoda.Month.MAY,
        "JUN": JSJoda.Month.JUNE,
        "JUL": JSJoda.Month.JULY,
        "AUG": JSJoda.Month.AUGUST,
        "SEP": JSJoda.Month.SEPTEMBER,
        "OCT": JSJoda.Month.OCTOBER,
        "NOV": JSJoda.Month.NOVEMBER,
        "DEC": JSJoda.Month.DECEMBER
    };
    return Month;
}());
var Quarter = /** @class */ (function () {
    function Quarter(quarter, year) {
        if (quarter > 4) {
            throw new Error("Quarter number must be 1, 2, 3 or 4");
        }
        this.quarter = quarter;
        this.year = year;
    }
    Quarter.of = function (input) {
        var match = Quarter.PATTERN.exec(input);
        var quarter = parseInt(match[1]);
        var year = parseInt(match[2]);
        return new Quarter(quarter, year);
    };
    Quarter.prototype.getExactDay = function (dayOfMonth, monthOfPeriod) {
        if (monthOfPeriod > 3) {
            throw new Error("A quarter can only have 3 months");
        }
        return this.getFirstDay().plusMonths(monthOfPeriod - 1).withDayOfMonth(dayOfMonth);
    };
    Quarter.prototype.getNextPeriod = function () {
        if (this.quarter == 4) {
            return new Quarter(1, this.year + 1);
        }
        else {
            return new Quarter(this.quarter + 1, this.year);
        }
    };
    Quarter.prototype.getFirstDay = function () {
        return JSJoda.LocalDate.of(this.year, this.getStartMonth(this.quarter), 1);
    };
    Quarter.prototype.getLastDay = function () {
        return this.getFirstDay().plusMonths(2)["with"](JSJoda.TemporalAdjusters.lastDayOfMonth());
    };
    Quarter.prototype.getStartMonth = function (quarterNumber) {
        switch (quarterNumber) {
            case 1: return JSJoda.Month.JANUARY;
            case 2: return JSJoda.Month.APRIL;
            case 3: return JSJoda.Month.JULY;
            case 4: return JSJoda.Month.OCTOBER;
            default: throw new Error("Quarter number must be 1, 2, 3 or 4");
        }
    };
    Quarter.PATTERN = /^Q(\d) (\d{4})$/;
    return Quarter;
}());
var Semiannual = /** @class */ (function () {
    function Semiannual(half, year) {
        if (half > 2) {
            throw new Error("Half must be 1 or 2");
        }
        this.half = half;
        this.year = year;
    }
    Semiannual.of = function (input) {
        var match = Semiannual.PATTERN.exec(input);
        var months = match[1];
        var half = months == "Jan-Jun" ? 1 : 2;
        var year = parseInt(match[2]);
        return new Semiannual(half, year);
    };
    Semiannual.prototype.getExactDay = function (dayOfMonth, monthOfPeriod) {
        if (monthOfPeriod > 6) {
            throw new Error("A semiannual can only have 6 months");
        }
        return this.getFirstDay().plusMonths(monthOfPeriod - 1).withDayOfMonth(dayOfMonth);
    };
    Semiannual.prototype.getNextPeriod = function () {
        if (this.half == 2) {
            return new Semiannual(1, this.year + 1);
        }
        else {
            return new Semiannual(this.half + 1, this.year);
        }
    };
    Semiannual.prototype.getFirstDay = function () {
        return JSJoda.LocalDate.of(this.year, this.getStartMonth(), 1);
    };
    Semiannual.prototype.getLastDay = function () {
        return this.getFirstDay().plusMonths(5)["with"](JSJoda.TemporalAdjusters.lastDayOfMonth());
    };
    Semiannual.prototype.getStartMonth = function () {
        switch (this.half) {
            case 1: return JSJoda.Month.JANUARY;
            case 2: return JSJoda.Month.JULY;
        }
    };
    Semiannual.PATTERN = /^(Jan-Jun|Jul-Dec) (\d{4})$/;
    return Semiannual;
}());
var Year = /** @class */ (function () {
    function Year(year) {
        this.year = year;
    }
    Year.of = function (input) {
        var match = Year.PATTERN.exec(input);
        var year = parseInt(match[1]);
        return new Year(year);
    };
    Year.prototype.getExactDay = function (dayOfMonth, monthOfPeriod) {
        if (monthOfPeriod > 12) {
            throw new Error("A year can only have 12 months");
        }
        return this.getFirstDay().plusMonths(monthOfPeriod - 1).withDayOfMonth(dayOfMonth);
    };
    Year.prototype.getNextPeriod = function () {
        return new Year(this.year + 1);
    };
    Year.prototype.getFirstDay = function () {
        return JSJoda.Year.of(this.year).atDay(1);
    };
    Year.prototype.getLastDay = function () {
        return this.getFirstDay().plusMonths(11)["with"](JSJoda.TemporalAdjusters.lastDayOfMonth());
    };
    Year.PATTERN = /^(\d{4})$/;
    return Year;
}());
function convert() {
    var inputBox = document.getElementById("input");
    var outputBox = document.getElementById("output");
    var input = inputBox.value;
    outputBox.value = input.split("\n")
        .map(convertPeriod)
        .join("\n");
}
function convertPeriod(periodStr) {
    var period;
    try {
        period = stringToPeriod(periodStr);
    }
    catch (e) {
        return e.message;
    }
    return periodToDay(period).format(JSJoda.DateTimeFormatter.ISO_LOCAL_DATE);
}
function periodToDay(period) {
    var dayOfPeriod = document.getElementById("dayOfPeriod");
    var providedOrFollowing = document.getElementById("providedOrFollowing");
    if (providedOrFollowing.value == "following") {
        period = period.getNextPeriod();
    }
    if (dayOfPeriod.value == "first") {
        return period.getFirstDay();
    }
    else if (dayOfPeriod.value == "last") {
        return period.getLastDay();
    }
    else {
        // exact
        var dayOfMonth = document.getElementById("dayOfMonth");
        var monthOfPeriod = document.getElementById("monthOfPeriod");
        return period.getExactDay(parseInt(dayOfMonth.value), parseInt(monthOfPeriod.value));
    }
}
function stringToPeriod(periodStr) {
    if (Month.PATTERN.test(periodStr)) {
        return Month.of(periodStr);
    }
    else if (Quarter.PATTERN.test(periodStr)) {
        return Quarter.of(periodStr);
    }
    else if (Semiannual.PATTERN.test(periodStr)) {
        return Semiannual.of(periodStr);
    }
    else if (Year.PATTERN.test(periodStr)) {
        return Year.of(periodStr);
    }
    else {
        throw new Error("Period \"" + periodStr + "\" could not be parsed");
    }
}
function copy() {
    var copyText = document.getElementById("output");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}
