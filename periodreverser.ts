interface Period {

    getFirstDay(): JSJoda.LocalDate;
    getLastDay(): JSJoda.LocalDate;
    getExactDay(dayOfMonth: number, monthOfPeriod: number): JSJoda.LocalDate;
    getNextPeriod(): Period;
    
}

class Month implements Period {

    public static PATTERN = /^(\w{3}) (\d{4})$/;

    private static monthMap = {
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
    }

    private month: JSJoda.Month;
    private year: number;

    static of(input: string): Month {
        var match = Month.PATTERN.exec(input);
        var monthAbbr = match[1].toUpperCase();
        var month = Month.monthMap[monthAbbr];
        if (month == undefined) {
            throw new Error(`Unrecognized month "${monthAbbr}"`);
        }
        var year = parseInt(match[2]);
        return new Month(month, year);
    }

    constructor(month: JSJoda.Month, year: number) {
        this.month = month;
        this.year = year;
    }

    getExactDay(dayOfMonth: number, monthOfPeriod: number): JSJoda.LocalDate {
        if (monthOfPeriod > 1) {
            throw new Error("You can only select days in the first month if period is a month");
        }

        return this.getFirstDay().withDayOfMonth(dayOfMonth);
    }

    getNextPeriod(): Period {
        var yearMonth = JSJoda.YearMonth.of(this.year, this.month).plusMonths(1);
        return new Month(yearMonth.month(), yearMonth.year())
    }

    getFirstDay(): JSJoda.LocalDate {
        return JSJoda.LocalDate.of(this.year, this.month, 1);
    }

    getLastDay(): JSJoda.LocalDate {
        return this.getFirstDay().with(JSJoda.TemporalAdjusters.lastDayOfMonth());
    }
}

class Quarter implements Period {

    public static PATTERN = /^Q(\d) (\d{4})$/;

    private quarter: number;
    private year: number;

    static of(input: string): Quarter {
        var match = Quarter.PATTERN.exec(input);
        var quarter = parseInt(match[1]);
        var year = parseInt(match[2]);
        return new Quarter(quarter, year);
    }

    constructor(quarter: number, year: number) {
        if (quarter > 4) {
            throw new Error("Quarter number must be 1, 2, 3 or 4");
        }
        this.quarter = quarter;
        this.year = year;
    }

    getExactDay(dayOfMonth: number, monthOfPeriod: number): JSJoda.LocalDate {
        if (monthOfPeriod > 3) {
            throw new Error("A quarter can only have 3 months");
        }

        return this.getFirstDay().plusMonths(monthOfPeriod - 1).withDayOfMonth(dayOfMonth);
    }

    getNextPeriod(): Period {
        if (this.quarter == 4) {
            return new Quarter(1, this.year + 1);
        } else {
            return new Quarter(this.quarter + 1, this.year);
        }
    }

    getFirstDay(): JSJoda.LocalDate {
        return JSJoda.LocalDate.of(this.year, this.getStartMonth(this.quarter), 1);
    }

    getLastDay(): JSJoda.LocalDate {
        return this.getFirstDay().plusMonths(2).with(JSJoda.TemporalAdjusters.lastDayOfMonth());
    }

    private getStartMonth(quarterNumber: number): JSJoda.Month {
        switch (quarterNumber) {
            case 1: return JSJoda.Month.JANUARY;
            case 2: return JSJoda.Month.APRIL;
            case 3: return JSJoda.Month.JULY;
            case 4: return JSJoda.Month.OCTOBER;
            default: throw new Error("Quarter number must be 1, 2, 3 or 4");
        }
    }
}

class Semiannual implements Period {

    public static PATTERN = /^(Jan-Jun|Jul-Dec) (\d{4})$/;

    private half: number;
    private year: number;

    static of(input: string): Semiannual {
        var match = Semiannual.PATTERN.exec(input);
        var months = match[1];
        var half = months == "Jan-Jun" ? 1 : 2;
        var year = parseInt(match[2]);
        return new Semiannual(half, year);
    }

    constructor(half: number, year: number) {
        if (half > 2) {
            throw new Error("Half must be 1 or 2");
        }
        this.half = half;
        this.year = year;
    }

    getExactDay(dayOfMonth: number, monthOfPeriod: number): JSJoda.LocalDate {
        if (monthOfPeriod > 6) {
            throw new Error("A semiannual can only have 6 months");
        }

        return this.getFirstDay().plusMonths(monthOfPeriod - 1).withDayOfMonth(dayOfMonth);
    }

    getNextPeriod(): Period {
        if (this.half == 2) {
            return new Semiannual(1, this.year + 1);
        } else {
            return new Semiannual(this.half + 1, this.year);
        }
    }

    getFirstDay(): JSJoda.LocalDate {
        return JSJoda.LocalDate.of(this.year, this.getStartMonth(), 1);
    }

    getLastDay(): JSJoda.LocalDate {
        return this.getFirstDay().plusMonths(5).with(JSJoda.TemporalAdjusters.lastDayOfMonth());
    }

    private getStartMonth(): JSJoda.Month {
        switch (this.half) {
            case 1: return JSJoda.Month.JANUARY;
            case 2: return JSJoda.Month.JULY;
        }
    }
}

class Year implements Period {

    public static PATTERN = /^(\d{4})$/;

    private year: number;

    static of(input: string): Year {
        var match = Year.PATTERN.exec(input);
        var year = parseInt(match[1]);
        return new Year(year);
    }

    constructor(year: number) {
        this.year = year;
    }

    getExactDay(dayOfMonth: number, monthOfPeriod: number): JSJoda.LocalDate {
        if (monthOfPeriod > 12) {
            throw new Error("A year can only have 12 months");
        }

        return this.getFirstDay().plusMonths(monthOfPeriod - 1).withDayOfMonth(dayOfMonth);
    }

    getNextPeriod(): Period {
        return new Year(this.year + 1);
    }

    getFirstDay(): JSJoda.LocalDate {
        return JSJoda.Year.of(this.year).atDay(1);
    }

    getLastDay(): JSJoda.LocalDate {
        return this.getFirstDay().plusMonths(11).with(JSJoda.TemporalAdjusters.lastDayOfMonth());
    }
}

function convert(): void {
    var inputBox = document.getElementById("input") as HTMLInputElement;
    var outputBox = document.getElementById("output") as HTMLInputElement;
    var input = inputBox.value;
    outputBox.value = input.split("\n")
            .map(convertPeriod)
            .join("\n");
    syncScroll();
}

function convertPeriod(periodStr: string): string {
    var period: Period;
    try {
        period = stringToPeriod(periodStr);
    } catch(e) {
        return e.message;
    }
    return periodToDay(period).format(JSJoda.DateTimeFormatter.ofPattern("MM/dd/yyyy"));
}

function periodToDay(period: Period): JSJoda.LocalDate {
    var dayOfPeriod = document.getElementById("dayOfPeriod") as HTMLInputElement;
    var providedOrFollowing = document.getElementById("providedOrFollowing") as HTMLInputElement;

    if (providedOrFollowing.value == "following") {
        period = period.getNextPeriod();
    }

    if (dayOfPeriod.value == "first") {
        return period.getFirstDay();
    } else if (dayOfPeriod.value == "last") {
        return period.getLastDay();
    } else {
        // exact
        var dayOfMonth = document.getElementById("dayOfMonth") as HTMLInputElement;
        var monthOfPeriod = document.getElementById("monthOfPeriod") as HTMLInputElement;
        return period.getExactDay(parseInt(dayOfMonth.value), parseInt(monthOfPeriod.value));
    }
}

function stringToPeriod(periodStr: string): Period {
    if (Month.PATTERN.test(periodStr)) {
        return Month.of(periodStr);
    } else if (Quarter.PATTERN.test(periodStr)) {
        return Quarter.of(periodStr);
    } else if (Semiannual.PATTERN.test(periodStr)) {
        return Semiannual.of(periodStr);
    } else if (Year.PATTERN.test(periodStr)) {
        return Year.of(periodStr);
    } else {
        throw new Error(`Period "${periodStr}" could not be parsed`);
    }
}

function copy() {
    var copyText = document.getElementById("output") as HTMLInputElement;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function syncScroll(): void {
    var input = document.getElementById("input");
    var output = document.getElementById("output");
    output.scrollTop = input.scrollTop
}

function syncScrollReverse(): void {
    var input = document.getElementById("input");
    var output = document.getElementById("output");
    input.scrollTop = output.scrollTop
}

function clearBoxes(): void {
    (document.getElementById("input") as HTMLInputElement).value = "";
    (document.getElementById("output")  as HTMLInputElement).value = "";
}

function disableExtraOptions(): void {
    (document.getElementById("dayOfMonth") as HTMLInputElement).disabled = true;
    (document.getElementById("monthOfPeriod") as HTMLInputElement).disabled = true;
    document.getElementById("lineTwo").style.color = "grey";
}

function enableExtraOptions(): void {
    (document.getElementById("dayOfMonth") as HTMLInputElement).disabled = false;
    (document.getElementById("monthOfPeriod") as HTMLInputElement).disabled = false;
    document.getElementById("lineTwo").style.color = "black";
}

function handleDayUpdate(): void {
    var dayType = (document.getElementById("dayOfPeriod") as HTMLInputElement).value;
    if (dayType == "exact") {
        enableExtraOptions();
    } else {
        disableExtraOptions();
    }
}

document.addEventListener("readystatechange", handleDayUpdate)
