import BeatSaverAPI from "../index.mjs";

//no reason
const testID = "9e11";
const testIDs = ["9e11", "36693"];
const testHashes = ["60BD62BD5F0D2555BB001D5EA3D8E28FEC6F07CE", "585302A75BA65628296B3029705A76DEC4D5A02B"];
const testUserID = 58338;

var bsApi = new BeatSaverAPI("beatbrowser/1.0");

bsApi
    .getMapsFromUserID(testUserID, 1000000)
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
        console.log(error);
    });
