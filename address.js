var errorCount = 0;

var geocoder;

async function mapAddress(addressText) {
    var add = parseAddress.parseLocation(addressText);
    var street1 = myJoin([add.number, add.prefix, add.street, add.type, add.suffix], " ");
    var street2 = myJoin([add.sec_unit_type, add.sec_unit_num], " ");
    var city = add.city;
    var state = add.state;
    var zip = myJoin([add.zip, add.plus4], "-");

    // console.log("Street1: " + street1);
    // console.log("Street2: " + street2);
    // console.log("City: " + city);
    // console.log("State: " + state);
    // console.log("Zip: " + zip);

    if (isBlank(street1)) {
        street1 = street2;
        street2 = "";
    }

    if (isBlank(street1) || isBlank(city) || isBlank(state)) {
        errorCount++;
        return addressText;
    }

    if (isBlank(zip)) {
        zip = await getZip(addressText);
    }

    return `\t${street1}\t${street2}\t${city}\t${state}\t${zip}`;
}

function isBlank(str) {
    if (str == undefined || str == null) {
        return true;
    } else if (str.trim() == "") {
        return true;
    } else {
        return false;
    }
}

function myJoin(elems, joiner) {
    return elems.filter((it) => it != undefined)
        .filter((it) => it != null)
        .join(joiner)
}

function initMap() {
    geocoder = new google.maps.Geocoder();
}

async function getZip(address) {
    return new Promise((res, rej) => {
        geocoder.geocode({address: address}, (result, status) => {
            if (status != "OK" || result.length < 1) {
                res("99999");
            } else {
                var addr = result[0];
                var zips = addr.address_components.filter((comp) => comp.types.includes("postal_code"));
                if (zips.length < 1) {
                    res("99999");
                } else {
                    res(zips[0].short_name);
                }
            }
        })
    })
}

async function getConvertedAddresses(input) {
    var lines = input.split("\n"); 
    var promises = [];
    var result = [];
    for (var i=0; i<lines.length; i++) {
        promises.push(mapAddress(lines[i]));
    }

    for (var i=0; i<lines.length; i++) {
        result.push(await promises[i]);
    }
    return result.join("\n");
}

function convertAddresses() {
    errorCount = 0;
    var textBox = document.getElementById("input");

    getConvertedAddresses(textBox.value)
            .then((result) => {
                console.log("test")
                document.getElementById("output").value = result;

                if (errorCount == 1) {
                    alert(`There was 1 error`);
                } else if (errorCount > 0) {
                    alert(`There were ${errorCount} errors`);
                }
            
                syncScroll();
            })
}


function clearTextboxes() {
    document.getElementById("input").value = "";
    document.getElementById("output").value = "";
}

function copyResults() {
    var copyText = document.getElementById("output");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function syncScroll() {
    var input = document.getElementById("input");
    var output = document.getElementById("output");
    output.scrollTop = input.scrollTop
}

function syncScrollReverse() {
    var input = document.getElementById("input");
    var output = document.getElementById("output");
    input.scrollTop = output.scrollTop
}

async function getTest() {
    return "test";
}
