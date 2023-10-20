import BeatSaverAPI from "../index.mjs";
import assert from "assert";

var bsApi = new BeatSaverAPI("mapFetchTest/1.0");

/*
The vaild ID is: PhaseOne - Digital (ft. Periphery) mapped by nitronik.exe (https://beatsaver.com/maps/9e11)
*/
const getMapInfo = {
    validID: "9e11",
    invalidID: "gfdfsfsd",
};

/*
ID 9e11: PhaseOne - Digital (ft. Periphery) mapped by nitronik.exe (https://beatsaver.com/maps/9e11)
ID 36693: Aweminus - ClublandLV mapped by spinposts (https://beatsaver.com/maps/36693) //just found this randomly lol
*/
const getMapInfoFromListList = {
    validList: ["9e11", "36693"],
    invalidList: ["fdfsd", "t43rte"],
    halfInvalidList: ["9e11", "fdgdfgdfg"],
    limitList: new Array(50).fill(null),
    tooLargeList: new Array(51).fill(null),
};

/*
Hash 60BD62BD5F0D2555BB001D5EA3D8E28FEC6F07CE: PhaseOne - Digital (ft. Periphery) mapped by nitronik.exe (https://beatsaver.com/maps/9e11)
Hash 585302A75BA65628296B3029705A76DEC4D5A02B: Venjent - Create Machines mapped by Tsunami_Pro (https://beatsaver.com/maps/311cf)
*/
const getMapInfoFromHashListList = {
    validList: ["60BD62BD5F0D2555BB001D5EA3D8E28FEC6F07CE", "585302A75BA65628296B3029705A76DEC4D5A02B"],
    invalidList: ["fgdgdf", "t43rte"],
    halfInvalidList: ["60BD62BD5F0D2555BB001D5EA3D8E28FEC6F07CE", "fdgdfgdfg"],
    limitList: new Array(50).fill(null),
    tooLargeList: new Array(51).fill(null),
};

/*
userID 58338: Joetastic (https://beatsaver.com/profile/58338)
*/
const getMapsFromUserIDValues = {
    validID: 58338,
    invalidID: 999999999,
    invalidStringID: "dfgdfgdfgdfg",
    tooLongID: 9999999999,
};

console.log("You can find the test IDs/hashes on the top of the file.");
describe("MapInfo", async function () {
    describe("valid getMapInfo()", async function () {
        it("should return true and level data when ID is valid and found", async function () {
            var response = await bsApi.getMapInfo(getMapInfo.validID);
            assert.equal(response.status, true);
        });
    });

    describe("invalid getMapInfo()", async function () {
        it("should return 'invalidid' when ID is invalid or level isn't found", async function () {
            var response = await bsApi.getMapInfo(getMapInfo.invalidID);
            assert.equal(response.status, "invalidid");
        });
    });

    describe("no ID getMapInfo()", async function () {
        it("should return false if ID is an empty string", async function () {
            var response = await bsApi.getMapInfo("");
            assert.equal(response.status, false);
        });
    });
});

//nah
/*
//wait
before(function (done) {
    setTimeout(function () {
        done();
    }, 1000);
});*/

describe("MapInfoFromList", async function () {
    describe("valid getMapInfoFromList()", async function () {
        it("should return true and level data in a list when ID is valid and found", async function () {
            var response = await bsApi.getMapInfoFromList(getMapInfoFromListList.validList);
            assert.equal(response.status, true);
        });
    });
    describe("invalid getMapInfoFromList()", async function () {
        it("should return false when the IDs are invalid and none of them are found", async function () {
            var response = await bsApi.getMapInfoFromList(getMapInfoFromListList.invalidList);
            assert.equal(response.status, false);
        });
    });
    describe("half invalid getMapInfoFromList()", async function () {
        it("should return true when atleast one of the IDs is valid and found", async function () {
            var response = await bsApi.getMapInfoFromList(getMapInfoFromListList.halfInvalidList);
            assert.equal(response.status, true);
        });
    });
    describe("empty list getMapInfoFromList()", async function () {
        it("should return 'emptyarray' when list is empty", async function () {
            var response = await bsApi.getMapInfoFromList([]);
            assert.equal(response.status, "emptyarray");
        });
    });
    describe("not an array getMapInfoFromList()", async function () {
        it("should return 'notanarray' when the passed argument is not an array", async function () {
            var response = await bsApi.getMapInfoFromList(null);
            assert.equal(response.status, "notanarray");
        });
    });
    describe("list max limit getMapInfoFromList()", async function () {
        it("should succeed when the passed list is not larger than the max limit (50) and atleast one of the IDs are valid", async function () {
            //if it's false it succeeded because my test array is 50 numbers (those are not valid IDs but that's not what i'm testing for)
            var response = await bsApi.getMapInfoFromList(getMapInfoFromListList.limitList);
            assert.equal(response.status, false);
        });
    });
    describe("too large list getMapInfoFromList()", async function () {
        it("should return 'toolargearray' when the passed list is larger than the max limit (50)", async function () {
            var response = await bsApi.getMapInfoFromList(getMapInfoFromListList.tooLargeList);
            assert.equal(response.status, "toolargearray");
        });
    });
});

describe("MapInfoFromHashList", async function () {
    describe("valid getMapInfoFromHashList()", async function () {
        it("should return true and level data in a list when hash is valid and found", async function () {
            var response = await bsApi.getMapInfoFromHashList(getMapInfoFromHashListList.validList);
            assert.equal(response.status, true);
        });
    });
    describe("invalid getMapInfoFromHashList()", async function () {
        it("should return false when the hashes are invalid and none of them are found", async function () {
            var response = await bsApi.getMapInfoFromHashList(getMapInfoFromHashListList.invalidList);
            assert.equal(response.status, false);
        });
    });
    describe("half invalid getMapInfoFromHashList()", async function () {
        it("should return true when atleast one of the hashes is valid and found", async function () {
            var response = await bsApi.getMapInfoFromHashList(getMapInfoFromHashListList.halfInvalidList);
            assert.equal(response.status, true);
        });
    });
    describe("empty list getMapInfoFromHashList()", async function () {
        it("should return 'emptyarray' when list is empty", async function () {
            var response = await bsApi.getMapInfoFromHashList([]);
            assert.equal(response.status, "emptyarray");
        });
    });
    describe("not an array getMapInfoFromHashList()", async function () {
        it("should return 'notanarray' when the passed argument is not an array", async function () {
            var response = await bsApi.getMapInfoFromHashList(null);
            assert.equal(response.status, "notanarray");
        });
    });
    describe("list max limit getMapInfoFromHashList()", async function () {
        it("should succeed when the passed list is not larger than the max limit (50) and atleast one of the hashes are valid", async function () {
            //if it's false it succeeded because my test array is 50 numbers (those are not valid hashes but that's not what i'm testing for) (again)
            var response = await bsApi.getMapInfoFromHashList(getMapInfoFromHashListList.limitList);
            assert.equal(response.status, false);
        });
    });
    describe("too large list getMapInfoFromHashList()", async function () {
        it("should return 'toolargearray' when the passed list is larger than the max limit (50)", async function () {
            var response = await bsApi.getMapInfoFromHashList(getMapInfoFromHashListList.tooLargeList);
            assert.equal(response.status, "toolargearray");
        });
    });
});

describe("GetMapsFromUserID", async function () {
    describe("valid getMapsFromUserID()", async function () {
        it("should return true and the levels if userID is valid and user is found", async function () {
            var response = await bsApi.getMapsFromUserID(getMapsFromUserIDValues.validID, 0);
            assert.equal(response.status, true);
        });
    });
    describe("invalid getMapsFromUserID()", async function () {
        it("should return false if userID is invalid or user not found", async function () {
            var response = await bsApi.getMapsFromUserID(getMapsFromUserIDValues.invalidID, 0);
            assert.equal(response.status, false);
        });
    });
    describe("invalid (not a number) getMapsFromUserID()", async function () {
        it("should return 'invalidid' if userID is not a number", async function () {
            var response = await bsApi.getMapsFromUserID(getMapsFromUserIDValues.invalidStringID, 0);
            assert.equal(response.status, "invalidid");
        });
    });
    describe("invalidpage getMapsFromUserID()", async function () {
        it("should return 'invalidpage' if page is not a number", async function () {
            var response = await bsApi.getMapsFromUserID(getMapsFromUserIDValues.validID, "fgdfgdfg");
            assert.equal(response.status, "invalidpage");
        });
    });
    describe("too long userID getMapsFromUserID()", async function () {
        it("should return 'toolongid' if userID is longer than 9 characters (undocumented in swagger docs)", async function () {
            var response = await bsApi.getMapsFromUserID(getMapsFromUserIDValues.tooLongID, 0);
            assert.equal(response.status, "toolongid");
        });
    });
});
