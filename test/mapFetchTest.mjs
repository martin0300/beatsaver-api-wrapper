import BeatSaverAPI from "../index.mjs";

var bsApi = new BeatSaverAPI("mapFetchTest/1.0");

const getMapInfo = {
    validID: "9e11",
    invalidID: "gfdfsfsd",
};

const getMapInfoFromListList = {
    validList: ["9e11", "36693"],
    invalidList: ["fdfsd", "t43rte"],
    halfInvalidList: ["9e11", "fdgdfgdfg"],
    limitList: new Array(50).fill(null),
    tooLargeList: new Array(51).fill(null),
};

const getMapInfoFromHashListList = {
    validList: ["60BD62BD5F0D2555BB001D5EA3D8E28FEC6F07CE", "585302A75BA65628296B3029705A76DEC4D5A02B"],
    invalidList: ["fgdgdf", "t43rte"],
    halfInvalidList: ["60BD62BD5F0D2555BB001D5EA3D8E28FEC6F07CE", "fdgdfgdfg"],
    limitList: new Array(50).fill(null),
    tooLargeList: new Array(51).fill(null),
};

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//very good tests absolutely no problems lol
async function runMapInfoTests() {
    //valid
    await bsApi
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
    await bsApi
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
    //no id
    await bsApi
        .getMapInfo("")
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfo noID test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == false) {
                console.log(`getMapInfo noID test passed.`);
            } else {
                console.log(`getMapInfo noID test failed. Status: ${error.status}`);
            }
        });
}

async function runMapInfoFromListTest() {
    //validList
    await bsApi
        .getMapInfoFromList(getMapInfoFromListList.validList)
        .then(function (data) {
            if (data.status == true) {
                console.log("getMapInfoFromList validList test passed.");
            }
        })
        .catch(function (error) {
            console.log(`getMapInfoFromList validList test failed. Status: ${error.status}`);
        });
    //invalidList
    await bsApi
        .getMapInfoFromList(getMapInfoFromListList.invalidList)
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromList invalidList test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == false) {
                console.log("getMapInfoFromList invalidList test passed.");
            } else {
                console.log(`getMapInfoFromList invalidList test failed. Status: ${error.status}`);
            }
        });
    //halfInvalidList
    await bsApi
        .getMapInfoFromList(getMapInfoFromListList.halfInvalidList)
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromList halfInvalidList test passed.`);
            }
        })
        .catch(function (error) {
            console.log(`getMapInfoFromList halfInvalidList test failed. Status: ${error.status}`);
        });
    //emptyList
    await bsApi
        .getMapInfoFromList([])
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromList emptyList test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == "emptyarray") {
                console.log("getMapInfoFromList emptyList test passed.");
            } else {
                console.log(`getMapInfoFromList emptyList test failed. Status: ${error.status}`);
            }
        });
    //notAnArray
    await bsApi
        .getMapInfoFromList(null)
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromList notaList test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == "notanarray") {
                console.log("getMapInfoFromList notaList test passed.");
            } else {
                console.log(`getMapInfoFromList notaList test failed. Status: ${error.status}`);
            }
        });
    //arraySizeLimit
    await bsApi
        .getMapInfoFromList(getMapInfoFromListList.limitList)
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromList arraySizeLimit test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == false) {
                console.log("getMapInfoFromList arraySizeLimit test passed.");
            } else {
                console.log(`getMapInfoFromList arraySizeLimit test failed. Status: ${error.status}`);
            }
        });
    //tooLargeList
    await bsApi
        .getMapInfoFromList(getMapInfoFromListList.tooLargeList)
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromList tooLargeList test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == "toolargearray") {
                console.log("getMapInfoFromList tooLargeList test passed.");
            } else {
                console.log(`getMapInfoFromList tooLargeList test failed. Status: ${error.status}`);
            }
        });
}

async function runMapInfoFromHashListTest() {
    //validList
    await bsApi
        .getMapInfoFromHashList(getMapInfoFromHashListList.validList)
        .then(function (data) {
            if (data.status == true) {
                console.log("getMapInfoFromHashList validList test passed.");
            }
        })
        .catch(function (error) {
            console.log(`getMapInfoFromHashList validList test failed. Status: ${error.status}`);
        });
    //invalidList
    await bsApi
        .getMapInfoFromHashList(getMapInfoFromHashListList.invalidList)
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromHashList invalidList test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == false) {
                console.log("getMapInfoFromHashList invalidList test passed.");
            } else {
                console.log(`getMapInfoFromHashList invalidList test failed. Status: ${error.status}`);
            }
        });
    //halfInvalidList
    await bsApi
        .getMapInfoFromHashList(getMapInfoFromHashListList.halfInvalidList)
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromHashList halfInvalidList test passed.`);
            }
        })
        .catch(function (error) {
            console.log(`getMapInfoFromHashList halfInvalidList test failed. Status: ${error.status}`);
        });
    //emptyList
    await bsApi
        .getMapInfoFromHashList([])
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromHashList emptyList test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == "emptyarray") {
                console.log("getMapInfoFromHashList emptyList test passed.");
            } else {
                console.log(`getMapInfoFromHashList emptyList test failed. Status: ${error.status}`);
            }
        });
    //notAnArray
    await bsApi
        .getMapInfoFromHashList(null)
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromHashList notaList test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == "notanarray") {
                console.log("getMapInfoFromHashList notaList test passed.");
            } else {
                console.log(`getMapInfoFromHashList notaList test failed. Status: ${error.status}`);
            }
        });
    //arraySizeLimit
    await bsApi
        .getMapInfoFromHashList(getMapInfoFromHashListList.limitList)
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromHashList arraySizeLimit test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == false) {
                console.log("getMapInfoFromHashList arraySizeLimit test passed.");
            } else {
                console.log(`getMapInfoFromHashList arraySizeLimit test failed. Status: ${error.status}`);
            }
        });
    //tooLargeList
    await bsApi
        .getMapInfoFromHashList(getMapInfoFromHashListList.tooLargeList)
        .then(function (data) {
            if (data.status == true) {
                console.log(`getMapInfoFromHashList tooLargeList test failed. Status: ${data.status}`);
            }
        })
        .catch(function (error) {
            if (error.status == "toolargearray") {
                console.log("getMapInfoFromHashList tooLargeList test passed.");
            } else {
                console.log(`getMapInfoFromHashList tooLargeList test failed. Status: ${error.status}`);
            }
        });
}

async function runTests() {
    await runMapInfoTests();
    await console.log("mapInfo tests done. Waiting 2 seconds.");
    await sleep(2000);
    await console.log("Running mapInfoFromList tests.");
    await runMapInfoFromListTest();
    await console.log("mapInfoFromList tests done. Waiting 2 seconds.");
    await sleep(2000);
    await console.log("Running mapInfoFromHashList tests.");
    await runMapInfoFromHashListTest();
}

runTests();
