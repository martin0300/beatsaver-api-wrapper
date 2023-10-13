import BeatSaverAPI from "../index.mjs";

var bsApi = new BeatSaverAPI("mapFetchTest/1.0");

const getMapInfo = {
    validID: "9e11",
    invalidID: "gfdfsfsd",
};

function runMapInfoTests() {
    //valid
    bsApi
        .getMapInfo(getMapInfo.validID)
        .then(function (data) {
            if (data.status == true) {
                console.log("getMapInfo validID test passed.");
            }
        })
        .catch(function (error) {
            console.log(`getMapInfo validID test failed. Status: ${error.status}`);
        });

    //invalid
    bsApi
        .getMapInfo(getMapInfo.invalidID)
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfo invalidID test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == "invalidid") {
                console.log(`getMapInfo invalidID test passed.`);
            } else {
                console.log(`getMapInfo invalidID test failed. Status: ${error.status}`);
            }
        });
}

function runTests() {
    runMapInfoTests();
}

runTests();
