import BeatSaverAPI from "../index.mjs";
import assert from "assert";
import nock from "nock";

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
    tooLongPageNumber: 9999999999999999999,
};

const getCollaborationMapsFromUserIDValues = {
    validID: 58338,
    invalidID: 999999999,
    invalidStringID: "dfgdfgdfgdfg",
    tooLongID: 9999999999,
    validDate: "2021-10-20T15:30:00+00:00",
    invalidDate: "1969-12-31T23:59:59+00:00",
    tooLongPageSize: 9999999999,
};

const getLatestMapsValues = {
    validDate: "2021-10-20T15:30:00+00:00",
    invalidDate: "1969-12-31T23:59:59+00:00",
    noMapsDate: "2001-10-20T15:30:00+00:00",
    validSort: "CURATED",
    tooLongPageSize: 9999999999,
};

const getMapsByPlayCountValues = {
    tooLongPageNumber: 9999999999999999999,
    noMapsPage: 999999999,
};

/*
userID 58338: Joetastic (https://beatsaver.com/profile/58338)
*/
const getUserByIDValues = {
    validID: 58338,
    invalidID: 999999999,
    invalidStringID: "dfgdfgdfgdfg",
    tooLongID: 9999999999,
};

/*
Joetastic (https://beatsaver.com/profile/58338)
*/
const getUserByNameValues = {
    validName: "Joetastic",
    invalidName: "fsdfsdfsdfsdfsdf",
};

const searchMapsValues = {
    validDate: "2021-10-20T15:30:00+00:00",
    invalidDate: "1969-12-31T23:59:59+00:00",
    validPageLength: 99999999999999999,
    invalidPageLength: 9999999999999999999,
    validMaxDurationLength: 999999999,
    invalidMaxDurationLength: 9999999999,
    validMinDurationLength: 999999999,
    invalidMinDurationLength: 9999999999,
    validSortOrder: "Rating",
    invalidSortOrder: "notarealsortorder",
    validTags: {
        or: [
            ["tech", "pop"],
            ["anime", "balanced"],
        ],
        tags: ["speed", "speedcore"],
        excluded: ["dance-style", "rock"],
    },
    invalidORTags: {
        insufficientData: {
            or: [["tech"]],
        },
        string: {
            or: [[false, "tech"]],
        },
        emptystring: {
            or: [["", ""]],
        },
    },
    invalidTags: {
        string: {
            tags: [false],
        },
        emptystring: {
            tags: [""],
        },
    },
    invalidExcludedTags: {
        string: {
            excluded: [false],
        },
        emptystring: {
            excluded: [""],
        },
    },
    noMapsTags: {
        or: [
            ["tech", "pop"],
            ["anime", "balanced"],
        ],
        tags: ["speed", "accuracy"],
        excluded: ["dance-style", "rock"],
    },
};

afterEach(function () {
    nock.enableNetConnect();
});

console.log("You can find the test IDs/hashes on the top of the file.");
describe("MapInfo", async function () {
    describe("valid getMapInfo()", async function () {
        it("should return true and level data when ID is valid and found", async function () {
            var response = await bsApi.getMapInfo(getMapInfo.validID);
            assert.equal(response.status, true);
        });
    });

    describe("invalid getMapInfo()", async function () {
        it("should return false when ID is invalid or level isn't found", async function () {
            var response = await bsApi.getMapInfo(getMapInfo.invalidID);
            assert.equal(response.status, false);
        });
    });

    describe("no ID getMapInfo()", async function () {
        it("should return 'invalidid' if ID is an empty string", async function () {
            var response = await bsApi.getMapInfo("");
            assert.equal(response.status, "invalidid");
        });
    });

    describe("simulated network error getMapInfo()", async function () {
        it("should return 'fetcherror' if there is a network error", async function () {
            nock.disableNetConnect();
            var response = await bsApi.getMapInfo(getMapInfo.validID);
            assert.equal(response.status, "fetcherror");
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
    describe("simulated network error getMapInfoFromList()", async function () {
        it("should return 'fetcherror' if there is a network error", async function () {
            nock.disableNetConnect();
            var response = await bsApi.getMapInfoFromList(getMapInfoFromListList.validList);
            assert.equal(response.status, "fetcherror");
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
    describe("simulated network error getMapInfoFromHashList()", async function () {
        it("should return 'fetcherror' if there is a network error", async function () {
            nock.disableNetConnect();
            var response = await bsApi.getMapInfoFromHashList(getMapInfoFromHashListList.validList);
            assert.equal(response.status, "fetcherror");
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
    describe("too long page getMapsFromUserID()", async function () {
        it("should return 'toolongpagesize' if page is longer than 18 characters", async function () {
            var response = await bsApi.getMapsFromUserID(getMapsFromUserIDValues.validID, getMapsFromUserIDValues.tooLongPageNumber);
            assert.equal(response.status, "toolongpage");
        });
    });
    describe("too long userID getMapsFromUserID()", async function () {
        it("should return 'toolongid' if userID is longer than 9 characters (undocumented in swagger docs)", async function () {
            var response = await bsApi.getMapsFromUserID(getMapsFromUserIDValues.tooLongID, 0);
            assert.equal(response.status, "toolongid");
        });
    });
    describe("simulated network error getMapsFromUserID()", async function () {
        it("should return 'fetcherror' if there is a network error", async function () {
            nock.disableNetConnect();
            var response = await bsApi.getMapsFromUserID(getMapsFromUserIDValues.validID, 0);
            assert.equal(response.status, "fetcherror");
        });
    });
});

describe("GetCollaborationMapsFromUserID", async function () {
    describe("valid getCollaborationMapsFromUserID()", async function () {
        it("should return true and the levels if userID is valid and the user is found", async function () {
            var response = await bsApi.getCollaborationMapsFromUserID(getCollaborationMapsFromUserIDValues.validID);
            assert.equal(response.status, true);
        });
    });
    describe("invalid getCollaborationMapsFromUserID()", async function () {
        it("should return false if userID is invalid or user not found", async function () {
            var response = await bsApi.getCollaborationMapsFromUserID(getCollaborationMapsFromUserIDValues.invalidID);
            assert.equal(response.status, false);
        });
    });
    describe("invalid (not a number) getCollaborationMapsFromUserID()", async function () {
        it("should return 'invalidid' if userID is not a number", async function () {
            var response = await bsApi.getCollaborationMapsFromUserID(getCollaborationMapsFromUserIDValues.invalidStringID);
            assert.equal(response.status, "invalidid");
        });
    });
    describe("invalidPageSize getCollaborationMapsFromUserID()", async function () {
        it("should return 'invalidpagesize' if pageSize is not a number", async function () {
            var response = await bsApi.getCollaborationMapsFromUserID(getCollaborationMapsFromUserIDValues.validID, "fdfsdfsdf");
            assert.equal(response.status, "invalidpagesize");
        });
    });
    describe("too long pageSize getCollaborationMapsFromUserID()", async function () {
        it("should return 'toolongpagesize' if pageSize is longer than 9 characters", async function () {
            var response = await bsApi.getCollaborationMapsFromUserID(getCollaborationMapsFromUserIDValues.validID, getCollaborationMapsFromUserIDValues.tooLongPageSize);
            assert.equal(response.status, "toolongpagesize");
        });
    });
    describe("too long userID getCollaborationMapsFromUserID()", async function () {
        it("should return 'toolongid' if userID is longer than 9 characters (undocumented in swagger docs)", async function () {
            var response = await bsApi.getCollaborationMapsFromUserID(getCollaborationMapsFromUserIDValues.tooLongID);
            assert.equal(response.status, "toolongid");
        });
    });
    describe("valid before date getCollaborationMapsFromUserID()", async function () {
        it("should return true and levels if userID and before date is correct", async function () {
            var response = await bsApi.getCollaborationMapsFromUserID(getCollaborationMapsFromUserIDValues.validID, 20, getCollaborationMapsFromUserIDValues.validDate);
            assert.equal(response.status, true);
        });
    });
    describe("invalid before date getCollaborationMapsFromUserID()", async function () {
        it("should return 'invaliddate' if before date is invalid", async function () {
            var response = await bsApi.getCollaborationMapsFromUserID(getCollaborationMapsFromUserIDValues.validID, 20, getCollaborationMapsFromUserIDValues.invalidDate);
            assert.equal(response.status, "invaliddate");
        });
    });
    describe("simulated network error getCollaborationMapsFromUserID()", async function () {
        it("should return 'fetcherror' if there is a network error", async function () {
            nock.disableNetConnect();
            var response = await bsApi.getCollaborationMapsFromUserID(getCollaborationMapsFromUserIDValues.validID);
            assert.equal(response.status, "fetcherror");
        });
    });
});

describe("GetLatestMaps", async function () {
    describe("plain (no filters) getLatestMaps()", async function () {
        it("should return true and the maps", async function () {
            var response = await bsApi.getLatestMaps();
            assert.equal(response.status, true);
        });
    });
    describe("automapper true getLatestMaps()", async function () {
        it("should return true and the maps with automapper and other levels", async function () {
            var response = await bsApi.getLatestMaps(null, true);
            assert.equal(response.status, true);
        });
    });
    describe("automapper false getLatestMaps()", async function () {
        it("should return true and the maps without automapper and other levels", async function () {
            var response = await bsApi.getLatestMaps(null, false);
            assert.equal(response.status, true);
        });
    });
    describe("invalid automapper getLatestMaps()", async function () {
        it("should return 'invalidautomapper' if the automapper value is not a boolean", async function () {
            var response = await bsApi.getLatestMaps(null, "dsfsdfsd");
            assert.equal(response.status, "invalidautomapper");
        });
    });
    describe("valid after date getLatestMaps()", async function () {
        it("should return true and the maps uploaded after the specified date", async function () {
            var response = await bsApi.getLatestMaps(getLatestMapsValues.validDate);
            assert.equal(response.status, true);
        });
    });
    describe("invalid after date getLatestMaps()", async function () {
        it("should return 'invalidafterdate' if after date is invalid", async function () {
            var response = await bsApi.getLatestMaps(getLatestMapsValues.invalidDate);
            assert.equal(response.status, "invalidafterdate");
        });
    });
    describe("valid before date getLatestMaps()", async function () {
        it("should return true and the maps uploaded before the specified date", async function () {
            var response = await bsApi.getLatestMaps(null, null, getLatestMapsValues.validDate);
            assert.equal(response.status, true);
        });
    });
    describe("invalid before date getLatestMaps()", async function () {
        it("should return 'invalidbeforedate' if before date is invalid", async function () {
            var response = await bsApi.getLatestMaps(null, null, getLatestMapsValues.invalidDate);
            assert.equal(response.status, "invalidbeforedate");
        });
    });
    describe("valid pageSize getLatestMaps()", async function () {
        it("should return true and the maps", async function () {
            var response = await bsApi.getLatestMaps(null, null, null, 20);
            assert.equal(response.status, true);
        });
    });
    describe("invalid pageSize getLatestMaps()", async function () {
        it("should return 'invalidpagesize' if the page size is not a number", async function () {
            var response = await bsApi.getLatestMaps(null, null, null, "fdsfsd");
            assert.equal(response.status, "invalidpagesize");
        });
    });
    describe("too long pageSize getLatestMaps()", async function () {
        it("should return 'toolongpagesize' if pageSize is longer than 9 characters", async function () {
            var response = await bsApi.getLatestMaps(null, null, null, getLatestMapsValues.tooLongPageSize);
            assert.equal(response.status, "toolongpagesize");
        });
    });
    describe("valid sort option getLatestMaps()", async function () {
        it("should return true and the maps with the sort option", async function () {
            var response = await bsApi.getLatestMaps(null, null, null, 20, getLatestMapsValues.validSort);
            assert.equal(response.status, true);
        });
    });
    describe("invalid sort option getLatestMaps()", async function () {
        it("should return 'invalidsort' if the sort option is not a valid sort option", async function () {
            var response = await bsApi.getLatestMaps(null, null, null, 20, "notavalidsortoption");
            assert.equal(response.status, "invalidsort");
        });
    });
    describe("no maps getLatestMaps()", async function () {
        it("should return false if there are no maps found with the filters (simulated using the before date 2001)", async function () {
            var response = await bsApi.getLatestMaps(null, null, getLatestMapsValues.noMapsDate);
            assert.equal(response.status, false);
        });
    });
    describe("simulated network error getLatestMaps()", async function () {
        it("should return 'fetcherror' if there is a network error", async function () {
            nock.disableNetConnect();
            var response = await bsApi.getLatestMaps();
            assert.equal(response.status, "fetcherror");
        });
    });
});

describe("GetMapsByPlayCount", async function () {
    describe("plain getMapsByPlayCount()", async function () {
        it("should return true and the maps", async function () {
            var response = await bsApi.getMapsByPlayCount();
            assert.equal(response.status, true);
        });
    });
    describe("invalid page getMapsByPlayCount()", async function () {
        it("should return 'invalidpage' if page is not a number", async function () {
            var response = await bsApi.getMapsByPlayCount("fdsfsd");
            assert.equal(response.status, "invalidpage");
        });
    });
    describe("invalid page getMapsByPlayCount()", async function () {
        it("should return 'toolongpage' if page is longer than 18 characters", async function () {
            var response = await bsApi.getMapsByPlayCount(getMapsByPlayCountValues.tooLongPageNumber);
            assert.equal(response.status, "toolongpage");
        });
    });
    describe("no maps getMapsByPlayCount()", async function () {
        it("should return false if no maps are found on the page", async function () {
            var response = await bsApi.getMapsByPlayCount(getMapsByPlayCountValues.noMapsPage);
            assert.equal(response.status, false);
        });
    });
    describe("simulated network error getMapsByPlayCount()", async function () {
        it("should return 'fetcherror' if there is a network error", async function () {
            nock.disableNetConnect();
            var response = await bsApi.getMapsByPlayCount();
            assert.equal(response.status, "fetcherror");
        });
    });
});

describe("GetUserByID", async function () {
    describe("valid getUserByID()", async function () {
        it("should return true and user data if the userID is valid and the user is found", async function () {
            var response = await bsApi.getUserByID(getUserByIDValues.validID);
            assert.equal(response.status, true);
        });
    });
    describe("invalid getUserByID()", async function () {
        it("should return false if the userID is invalid or user is not found", async function () {
            var response = await bsApi.getUserByID(getUserByIDValues.invalidID);
            assert.equal(response.status, false);
        });
    });
    describe("invalid (not a number) getUserByID()", async function () {
        it("should return 'invalidid' if the userID is not a number", async function () {
            var response = await bsApi.getUserByID(getUserByIDValues.invalidStringID);
            assert.equal(response.status, "invalidid");
        });
    });
    describe("too long userID getUserByID()", async function () {
        it("should return 'toolongid' if the userID is longer than 9 characters", async function () {
            var response = await bsApi.getUserByID(getUserByIDValues.tooLongID);
            assert.equal(response.status, "toolongid");
        });
    });
    describe("simulated network error getUserByID()", async function () {
        it("should return 'fetcherror' if there is a network error", async function () {
            nock.disableNetConnect();
            var response = await bsApi.getUserByID(getUserByIDValues.validID);
            assert.equal(response.status, "fetcherror");
        });
    });
});

describe("GetUserByName", async function () {
    describe("valid getUserByName()", async function () {
        it("should return true and user data if the username is valid and the user is found", async function () {
            var response = await bsApi.getUserByName(getUserByNameValues.validName);
            assert.equal(response.status, true);
        });
    });
    describe("invalid getUserByName()", async function () {
        it("should return false if the username is invalid or user is not found", async function () {
            var response = await bsApi.getUserByName(getUserByNameValues.invalidName);
            assert.equal(response.status, false);
        });
    });
    describe("no name getUserByName()", async function () {
        it("should return 'invalidname' if the username is an empty string", async function () {
            var response = await bsApi.getUserByName("");
            assert.equal(response.status, "invalidname");
        });
    });
    describe("simulated network error getUserByName()", async function () {
        it("should return 'fetcherror' if there is a network error", async function () {
            nock.disableNetConnect();
            var response = await bsApi.getUserByName(getUserByNameValues.validName);
            assert.equal(response.status, "fetcherror");
        });
    });
});

//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
describe("SearchMaps", async function () {
    describe("Valid booleans", async function () {
        describe("valid automapper searchMaps()", async function () {
            it("should return true if automapper is a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    automapper: true,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid chroma searchMaps()", async function () {
            it("should return true if chroma is a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    chroma: true,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid cinema searchMaps()", async function () {
            it("should return true if cinema is a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    cinema: true,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid curated searchMaps()", async function () {
            it("should return true if curated is a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    curated: true,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid fullSpread searchMaps()", async function () {
            it("should return true if fullSpread is a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    fullSpread: true,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid me searchMaps()", async function () {
            it("should return true if me is a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    me: true,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid noodle searchMaps()", async function () {
            it("should return true if noodle is a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    noodle: true,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid ranked searchMaps()", async function () {
            it("should return true if ranked is a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    ranked: true,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid verified searchMaps()", async function () {
            it("should return true if verified is a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    verified: true,
                });
                assert.equal(response.status, true);
            });
        });
    });
    describe("Invalid booleans", async function () {
        describe("invalid automapper searchMaps()", async function () {
            it("should return 'invalidautomapper' if automapper isn't a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    automapper: "invalid",
                });
                assert.equal(response.status, "invalidautomapper");
            });
        });
        describe("invalid chroma searchMaps()", async function () {
            it("should return 'invalidchroma' if chroma isn't a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    chroma: "invalid",
                });
                assert.equal(response.status, "invalidchroma");
            });
        });
        describe("invalid cinema searchMaps()", async function () {
            it("should return 'invalidcinema' if cinema isn't a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    cinema: "invalid",
                });
                assert.equal(response.status, "invalidcinema");
            });
        });
        describe("invalid curated searchMaps()", async function () {
            it("should return 'invalidcurated' if curated isn't a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    curated: "invalid",
                });
                assert.equal(response.status, "invalidcurated");
            });
        });
        describe("invalid fullSpread searchMaps()", async function () {
            it("should return 'invalidfullspread' if fullSpread isn't a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    fullSpread: "invalid",
                });
                assert.equal(response.status, "invalidfullspread");
            });
        });
        describe("invalid me searchMaps()", async function () {
            it("should return 'invalidme' if me isn't a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    me: "invalid",
                });
                assert.equal(response.status, "invalidme");
            });
        });
        describe("invalid noodle searchMaps()", async function () {
            it("should return 'invalidnoodle' if noodle isn't a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    noodle: "invalid",
                });
                assert.equal(response.status, "invalidnoodle");
            });
        });
        describe("invalid ranked searchMaps()", async function () {
            it("should return 'invalidranked' if ranked isn't a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    ranked: "invalid",
                });
                assert.equal(response.status, "invalidranked");
            });
        });
        describe("invalid verified searchMaps()", async function () {
            it("should return 'invalidverified' if verified isn't a boolean", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    verified: "invalid",
                });
                assert.equal(response.status, "invalidverified");
            });
        });
    });
    describe("Valid date", async function () {
        describe("valid from date searchMaps()", async function () {
            it("should return true if the from date is valid", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    from: searchMapsValues.validDate,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid to date searchMaps()", async function () {
            it("should return true if the to date is valid", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    to: searchMapsValues.validDate,
                });
                assert.equal(response.status, true);
            });
        });
    });
    describe("Invalid date", async function () {
        describe("invalid from date searchMaps()", async function () {
            it("should return 'invalidfromdate' if from date is not in the correct format", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    from: searchMapsValues.invalidDate,
                });
                assert.equal(response.status, "invalidfromdate");
            });
        });
        describe("invalid to date searchMaps()", async function () {
            it("should return 'invalidtodate' if to date is not in the correct format", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    to: searchMapsValues.invalidDate,
                });
                assert.equal(response.status, "invalidtodate");
            });
        });
    });
    describe("Valid numbers", async function () {
        describe("valid maxBpm searchMaps()", async function () {
            it("should return true if maxBpm is a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    maxBpm: 5,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid maxNps searchMaps()", async function () {
            it("should return true if maxNps is a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    maxNps: 5,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid maxRating searchMaps()", async function () {
            it("should return true if maxRating is a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    maxRating: 5,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid minBpm searchMaps()", async function () {
            it("should return true if minBpm is a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    minBpm: 5,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid minNps searchMaps()", async function () {
            it("should return true if minNps is a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    minNps: 5,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid minRating searchMaps()", async function () {
            it("should return true if minRating is a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    minRating: 0,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid page searchMaps()", async function () {
            it("should return true if page is a number", async function () {
                var response = await bsApi.searchMaps(0);
                assert.equal(response.status, true);
            });
        });
        describe("valid minDuration searchMaps()", async function () {
            it("should return true if minDuration is a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    minDuration: 5,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid maxDuration searchMaps()", async function () {
            it("should return true if maxDuration is a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    maxDuration: 5,
                });
                assert.equal(response.status, true);
            });
        });
    });
    describe("Invalid numbers", async function () {
        describe("invalid maxBpm searchMaps()", async function () {
            it("should return 'invalidmaxbpm' if maxBpm isn't a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    maxBpm: "dfsdf",
                });
                assert.equal(response.status, "invalidmaxbpm");
            });
        });
        describe("invalid maxNps searchMaps()", async function () {
            it("should return 'invalidmaxnps' if maxNps isn't a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    maxNps: "sdfd",
                });
                assert.equal(response.status, "invalidmaxnps");
            });
        });
        describe("invalid maxRating searchMaps()", async function () {
            it("should return 'invalidmaxrating' if maxRating isn't a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    maxRating: "sdfsdf",
                });
                assert.equal(response.status, "invalidmaxrating");
            });
        });
        describe("invalid minBpm searchMaps()", async function () {
            it("should return 'invalidminbpm' if minBpm isn't a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    minBpm: "sdff",
                });
                assert.equal(response.status, "invalidminbpm");
            });
        });
        describe("invalid minNps searchMaps()", async function () {
            it("should return 'invalidminnps' if minNps isn't a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    minNps: "sdfsd",
                });
                assert.equal(response.status, "invalidminnps");
            });
        });
        describe("invalid minRating searchMaps()", async function () {
            it("should return 'invalidminrating' if minRating isn't a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    minRating: "sdfsd",
                });
                assert.equal(response.status, "invalidminrating");
            });
        });
        describe("invalid page searchMaps()", async function () {
            it("should return 'invalidpage' if page isn't a number", async function () {
                var response = await bsApi.searchMaps("sfsd");
                assert.equal(response.status, "invalidpage");
            });
        });
        describe("invalid minDuration searchMaps()", async function () {
            it("should return 'invalidminduration' if minDuration isn't a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    minDuration: "sdfsd",
                });
                assert.equal(response.status, "invalidminduration");
            });
        });
        describe("invalid maxDuration searchMaps()", async function () {
            it("should return 'invalidmaxduration' if maxDuration isn't a number", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    maxDuration: "sdfsdf",
                });
                assert.equal(response.status, "invalidmaxduration");
            });
        });
    });
    describe("Valid character lengths", async function () {
        describe("valid page character length searchMaps()", async function () {
            it("should return true if page is not longer than 18 characters", async function () {
                var response = await bsApi.searchMaps(searchMapsValues.validPageLength);
                assert.equal(response.status, false);
            });
        });
        describe("valid maxDuration character length searchMaps()", async function () {
            it("should return true if maxDuration is not longer than 9 characters", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    maxDuration: searchMapsValues.validMaxDurationLength,
                });
                assert.equal(response.status, true);
            });
        });
        describe("valid minDuration character length searchMaps()", async function () {
            it("should return true if minDuration is not longer than 9 characters (actually returns false because there isn't any level with that minDuration but still works)", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    minDuration: searchMapsValues.validMinDurationLength,
                });
                assert.equal(response.status, false);
            });
        });
    });
    describe("Invalid character lengths", async function () {
        describe("invalid page character length searchMaps()", async function () {
            it("should return 'toolongpage' if page is longer than 18 characters", async function () {
                var response = await bsApi.searchMaps(searchMapsValues.invalidPageLength);
                assert.equal(response.status, "toolongpage");
            });
        });
        describe("invalid maxDuration character length searchMaps()", async function () {
            it("should return 'toolongmaxduration' if maxDuration is longer than 9 characters", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    maxDuration: searchMapsValues.invalidMaxDurationLength,
                });
                assert.equal(response.status, "toolongmaxduration");
            });
        });
        describe("invalid minDuration character length searchMaps()", async function () {
            it("should return 'toolongminduration' if minDuration is longer than 9 characters", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    minDuration: searchMapsValues.invalidMinDurationLength,
                });
                assert.equal(response.status, "toolongminduration");
            });
        });
    });
    describe("Valid strings", async function () {
        describe("valid query searchMaps()", async function () {
            it("should return true if query is a valid string", async function () {
                var response = await bsApi.searchMaps(0, "test");
                assert.equal(response.status, true);
            });
        });
    });
    describe("Invalid strings", async function () {
        describe("invalid query not a string searchMaps()", async function () {
            it("should return 'invalidquery' if query is not a string", async function () {
                var response = await bsApi.searchMaps(0, false);
                assert.equal(response.status, "invalidquery");
            });
        });
        describe("invalid query empty string searchMaps()", async function () {
            it("should return 'invalidquery' if query is empty", async function () {
                var response = await bsApi.searchMaps(0, "");
                assert.equal(response.status, "invalidquery");
            });
        });
    });
    describe("Sort order", async function () {
        describe("valid sortOrder searchMaps()", async function () {
            it("should return true if sortOrder is a valid sort option", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    sortOrder: searchMapsValues.validSortOrder,
                });
                assert.equal(response.status, true);
            });
        });
        describe("invalid sortOrder searchMaps()", async function () {
            it("should return 'invalidsortorder' if sortOrder is an invalid sort option", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    sortOrder: searchMapsValues.invalidSortOrder,
                });
                assert.equal(response.status, "invalidsortorder");
            });
        });
    });
    describe("Valid tags", async function () {
        describe("valid full tags searchMaps()", async function () {
            it("should return true if all of the tags are in the correct format", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    tags: searchMapsValues.validTags,
                });
                assert.equal(response.status, true);
            });
        });
    });
    describe("Invalid tags", async function () {
        describe("invalid tags string searchMaps()", async function () {
            it("should return 'invalidtags' and errorType: 'string' if element in array is not a string", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    tags: searchMapsValues.invalidTags.string,
                });
                assert.equal(response.status, "invalidtags");
                assert.equal(response.data.tagType, "tag");
                assert.equal(response.data.errorType, "string");
            });
        });
        describe("invalid tags empty string searchMaps()", async function () {
            it("should return 'invalidtags' and errorType: 'emptystring' if string in array is an empty string", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    tags: searchMapsValues.invalidTags.emptystring,
                });
                assert.equal(response.status, "invalidtags");
                assert.equal(response.data.tagType, "tag");
                assert.equal(response.data.errorType, "emptystring");
            });
        });

        describe("invalid excludedTags string searchMaps()", async function () {
            it("should return 'invalidtags' and errorType: 'string' if element in array is not a string", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    tags: searchMapsValues.invalidExcludedTags.string,
                });
                assert.equal(response.status, "invalidtags");
                assert.equal(response.data.tagType, "excludedTag");
                assert.equal(response.data.errorType, "string");
            });
        });
        describe("invalid excludedTags empty string searchMaps()", async function () {
            it("should return 'invalidtags' and errorType: 'emptystring' if string in array is an empty string", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    tags: searchMapsValues.invalidExcludedTags.emptystring,
                });
                assert.equal(response.status, "invalidtags");
                assert.equal(response.data.tagType, "excludedTag");
                assert.equal(response.data.errorType, "emptystring");
            });
        });

        describe("invalid orTags string searchMaps()", async function () {
            it("should return 'invalidtags' and errorType: 'string' if one of elements in the array is not a string", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    tags: searchMapsValues.invalidORTags.string,
                });
                assert.equal(response.status, "invalidtags");
                assert.equal(response.data.tagType, "orTag");
                assert.equal(response.data.errorType, "string");
            });
        });
        describe("invalid orTags empty string searchMaps()", async function () {
            it("should return 'invalidtags' and errorType: 'emptystring' if one of the strings in an array is an empty string", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    tags: searchMapsValues.invalidORTags.emptystring,
                });
                assert.equal(response.status, "invalidtags");
                assert.equal(response.data.tagType, "orTag");
                assert.equal(response.data.errorType, "emptystring");
            });
        });
        describe("invalid orTags insufficient data searchMaps()", async function () {
            it("should return 'invalidtags' and errorType: 'insufficientdata' if there are less than two elements in the array", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    tags: searchMapsValues.invalidORTags.insufficientData,
                });
                assert.equal(response.status, "invalidtags");
                assert.equal(response.data.tagType, "orTag");
                assert.equal(response.data.errorType, "insufficientdata");
            });
        });
    });
    describe("Return values", async function () {
        describe("valid (plain) searchMaps()", async function () {
            it("should return true if maps are found", async function () {
                var response = await bsApi.searchMaps();
                assert.equal(response.status, true);
            });
        });
        describe("invalid (no maps) searchMaps()", async function () {
            it("should return false if no maps are found", async function () {
                var response = await bsApi.searchMaps(0, null, {
                    tags: searchMapsValues.noMapsTags,
                });
                assert.equal(response.status, false);
            });
        });
        describe("simulated network error searchMaps()", async function () {
            it("should return 'fetcherror' if there is a network error", async function () {
                nock.disableNetConnect();
                var response = await bsApi.searchMaps();
                assert.equal(response.status, "fetcherror");
            });
        });
    });
});
