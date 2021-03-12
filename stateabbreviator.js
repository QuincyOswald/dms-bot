const stateMap = {
  "ALABAMA":"AL",
  "ALASKA":"AK",
  "AMERICAN SAMOA":"AS",
  "ARIZONA":"AZ",
  "ARKANSAS":"AR",
  "CALIFORNIA":"CA",
  "CALI":"CA",
  "COLORADO":"CO",
  "CONNECTICUT":"CT",
  "DELAWARE":"DE",
  "DISTRICT OF COLUMBIA":"DC",
  "WASHINGTON DC":"DC",
  "FLORIDA":"FL",
  "GEORGIA":"GA",
  "GUAM":"GU",
  "HAWAII":"HI",
  "HAWAI'I":"HI",
  "HAWAIʻI":"HI",
  "IDAHO":"ID",
  "ILLINOIS":"IL",
  "INDIANA":"IN",
  "IOWA":"IA",
  "KANSAS":"KS",
  "KENTUCKY":"KY",
  "LOUISIANA":"LA",
  "MAINE":"ME",
  "MARYLAND":"MD",
  "MASSACHUSETTS":"MA",
  "MICHIGAN":"MI",
  "MINNESOTA":"MN",
  "MISSISSIPPI":"MS",
  "MISSOURI":"MO",
  "MONTANA":"MT",
  "NEBRASKA":"NE",
  "NEVADA":"NV",
  "NEW HAMPSHIRE":"NH",
  "NEW JERSEY":"NJ",
  "NEW MEXICO":"NM",
  "NEW YORK":"NY",
  "NORTH CAROLINA":"NC",
  "NORTH DAKOTA":"ND",
  "NORTHERN MARIANA IS":"MP",
  "NORTHERN MARIANA ISLANDS":"MP",
  "OHIO":"OH",
  "OKLAHOMA":"OK",
  "OREGON":"OR",
  "PENNSYLVANIA":"PA",
  "PUERTO RICO":"PR",
  "RHODE ISLAND":"RI",
  "RHODE ISLAND AND PROVIDENCE PLANTATIONS":"RI",
  "SOUTH CAROLINA":"SC",
  "SOUTH DAKOTA":"SD",
  "TENNESSEE":"TN",
  "TEXAS":"TX",
  "UTAH":"UT",
  "VERMONT":"VT",
  "VIRGINIA":"VA",
  "VIRGIN ISLANDS":"VI",
  "WASHINGTON":"WA",
  "WEST VIRGINIA":"WV",
  "WISCONSIN":"WI",
  "WYOMING":"WY",
  // keep things already abbreviated
  "AL":"AL", 
  "AK":"AK", 
  "AS":"AS", 
  "AZ":"AZ", 
  "AR":"AR", 
  "CA":"CA", 
  "CO":"CO", 
  "CT":"CT", 
  "DE":"DE", 
  "DC":"DC", 
  "FL":"FL", 
  "GA":"GA", 
  "GU":"GU", 
  "HI":"HI", 
  "ID":"ID", 
  "IL":"IL", 
  "IN":"IN", 
  "IA":"IA", 
  "KS":"KS", 
  "KY":"KY", 
  "LA":"LA", 
  "ME":"ME", 
  "MD":"MD", 
  "MA":"MA", 
  "MI":"MI", 
  "MN":"MN", 
  "MS":"MS", 
  "MO":"MO", 
  "MT":"MT", 
  "NE":"NE", 
  "NV":"NV", 
  "NH":"NH", 
  "NJ":"NJ", 
  "NM":"NM", 
  "NY":"NY", 
  "NC":"NC", 
  "ND":"ND", 
  "MP":"MP", 
  "OH":"OH", 
  "OK":"OK", 
  "OR":"OR", 
  "PA":"PA", 
  "PR":"PR", 
  "RI":"RI", 
  "SC":"SC", 
  "SD":"SD", 
  "TN":"TN", 
  "TX":"TX", 
  "UT":"UT", 
  "VT":"VT", 
  "VA":"VA", 
  "VI":"VI", 
  "WA":"WA", 
  "WV":"WV", 
  "WI":"WI", 
  "WY":"WY",
  "":""
}

function convert() {
    var inputBox = document.getElementById("input");
    var outputBox = document.getElementById("output");
    var input = inputBox.value;
    var abbreviations = input.split("\n")
        .map(convertState);

    var errorCount = abbreviations.filter(abbr => abbr == "ERROR").length
    alert(`There were ${errorCount} errors`);

    outputBox.value = abbreviations.join("\n");
    syncScroll();
}

function convertState(input) {
    var stateOut = stateMap[input.trim().toUpperCase()];
    return stateOut == undefined ? "ERROR": stateOut;
}

function copy() {
    var copyText = document.getElementById("output");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function syncScroll() {
    var input = document.getElementById("input");
    var output = document.getElementById("output");
    output.scrollTop = input.scrollTop;
}

function syncScrollReverse() {
    var input = document.getElementById("input");
    var output = document.getElementById("output");
    input.scrollTop = output.scrollTop;
}

function clearBoxes() {
    document.getElementById("input").value = "";
    document.getElementById("output").value = "";
}
