/*
MIT License

Copyright (c) 2023 martin0300

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import axios from "axios";

const beatSaverAPIVersion = "1.0-Beta";
const debug = true;
const apiURLs = {
    mainAPIURL: "https://api.beatsaver.com",
    getMapInfoID: "/maps/id/",
    getMapInfoIDs: "/maps/ids/",
    getMapInfoHashes: "/maps/hash/",
    getMapsFromUserID: "/maps/uploader/",
};

function isnullorempty(string) {
    if (string == null) {
        return true;
    }
    var string2 = string.split(" ").join("");
    if (string2.length == 0) {
        return true;
    } else {
        if (!string2) {
            return true;
        } else {
            return false;
        }
    }
}

class BeatSaverAPI {
    constructor(customUserAgent = null) {
        this.userAgent = `beatsaver-api-wrapper/${beatSaverAPIVersion}${customUserAgent !== null ? ` ${customUserAgent}` : ""}`;
    }

    /*
    Returns false if no id is specified.
    Returns an object with data and status.
    Status can be: "invalidid" (data is null), true (api response will be returned as data), "fetcherror" (axios error will be returned as data)
    */
    getMapInfo(id) {
        return new Promise(function (resolve, reject) {
            var apiResponse = {
                status: "",
                data: null,
            };
            if (isnullorempty(id)) {
                apiResponse.status = false;
                reject(apiResponse);
            }
            axios({
                url: `${apiURLs.mainAPIURL}${apiURLs.getMapInfoID}${id}`,
                method: "GET",
            })
                .then(function (response) {
                    switch (response.status) {
                        case 200:
                            apiResponse.status = true;
                            apiResponse.data = response.data;
                            break;
                        default:
                            if (debug) {
                                throw new Error(`Unhandled status code! (${response.status})`);
                            }
                            break;
                    }
                    resolve(apiResponse);
                })
                .catch(function (error) {
                    switch (error.code) {
                        case "ERR_BAD_REQUEST":
                            apiResponse.status = "invalidid";
                            break;

                        case "ENOTFOUND":
                            apiResponse.status = "fetcherror";
                            apiResponse.data = error;
                            break;

                        default:
                            if (debug) {
                                throw new Error(`Unhandled error code! (${error.code})`);
                            }
                            break;
                    }
                    reject(apiResponse);
                });
        });
    }

    /*
    Returns "notanarray" if the passed argument is not an array.
    Returns "emptyarray" if the passed array is empty.
    Returns "toolargearray" if the passed array has more elements than 50.
    Returns "fetcherror" in case of any errors. (404, ENOTFOUND)
    Returns false if no maps could be found. (Data is null)
    Returns true if maps had been found.
    */
    getMapInfoFromList(idList) {
        return new Promise(function (resolve, reject) {
            var apiResponse = {
                status: "",
                data: null,
            };
            if (!Array.isArray(idList)) {
                apiResponse.status = "notanarray";
                reject(apiResponse);
            }
            if (idList.length == 0) {
                apiResponse.status = "emptyarray";
                reject(apiResponse);
            }
            if (idList.length > 50) {
                apiResponse.status = "toolargearray";
                reject(apiResponse);
            }
            axios({
                url: `${apiURLs.mainAPIURL}${apiURLs.getMapInfoIDs}${idList.join(",")}`,
                method: "GET",
            })
                .then(function (response) {
                    switch (response.status) {
                        case 200:
                            apiResponse.status = Object.keys(response.data).length == 0 ? false : true;
                            apiResponse.data = Object.keys(response.data).length == 0 ? null : response.data;
                            Object.keys(response.data).length == 0 ? reject(apiResponse) : resolve(apiResponse);
                            break;
                        default:
                            if (debug) {
                                throw new Error(`Unhandled status code! (${response.status})`);
                            }
                            break;
                    }
                    resolve(apiResponse);
                })
                .catch(function (error) {
                    switch (error.code) {
                        case "ERR_BAD_REQUEST":
                            apiResponse.status = "fetcherror";
                            break;

                        case "ENOTFOUND":
                            apiResponse.status = "fetcherror";
                            apiResponse.data = error;
                            break;

                        default:
                            if (debug) {
                                throw new Error(`Unhandled error code! (${error.code})`);
                            }
                            break;
                    }
                    reject(apiResponse);
                });
        });
    }

    /*
    Returns "notanarray" if the passed argument is not an array.
    Returns "emptyarray" if the passed array is empty.
    Returns "toolargearray" if the passed array has more elements than 50.
    Returns "fetcherror" in case of any errors. (404, ENOTFOUND)
    Returns false if no maps could be found. (Data is null)
    Returns true if maps had been found.
    */
    getMapInfoFromHashList(idList) {
        return new Promise(function (resolve, reject) {
            var apiResponse = {
                status: "",
                data: null,
            };
            if (!Array.isArray(idList)) {
                apiResponse.status = "notanarray";
                reject(apiResponse);
            }
            if (idList.length == 0) {
                apiResponse.status = "emptyarray";
                reject(apiResponse);
            }
            if (idList.length > 50) {
                apiResponse.status = "toolargearray";
                reject(apiResponse);
            }
            axios({
                url: `${apiURLs.mainAPIURL}${apiURLs.getMapInfoHashes}${idList.join(",")}`,
                method: "GET",
            })
                .then(function (response) {
                    switch (response.status) {
                        case 200:
                            apiResponse.status = Object.keys(response.data).length == 0 ? false : true;
                            apiResponse.data = Object.keys(response.data).length == 0 ? null : response.data;
                            Object.keys(response.data).length == 0 ? reject(apiResponse) : resolve(apiResponse);
                            break;
                        default:
                            if (debug) {
                                throw new Error(`Unhandled status code! (${response.status})`);
                            }
                            break;
                    }
                    resolve(apiResponse);
                })
                .catch(function (error) {
                    switch (error.code) {
                        case "ERR_BAD_REQUEST":
                            apiResponse.status = false;
                            break;

                        case "ENOTFOUND":
                            apiResponse.status = "fetcherror";
                            apiResponse.data = error;
                            break;

                        default:
                            if (debug) {
                                throw new Error(`Unhandled error code! (${error.code})`);
                            }
                            break;
                    }
                    reject(apiResponse);
                });
        });
    }

    /*
    Returns "fetcherror" in case of any errors. (404, ENOTFOUND)
    Returns "invalidid" if userID isn't a number.
    Returns "invalidpage" if page isn't a number.
    Returns false if user's maps couldn't be found. (Data is null)
    Returns true if user's maps had been found.
    */
    getMapsFromUserID(userID, page = 0) {
        return new Promise(function (resolve, reject) {
            var apiResponse = {
                status: "",
                data: null,
            };
            if (isNaN(userID)) {
                apiResponse.status = "invalidid";
                reject(apiResponse);
            }
            if (isNaN(page)) {
                apiResponse.status = "invalidpage";
                reject(apiResponse);
            }
            axios({
                url: `${apiURLs.mainAPIURL}${apiURLs.getMapsFromUserID}${userID}/${page}`,
                method: "GET",
            })
                .then(function (response) {
                    switch (response.status) {
                        case 200:
                            apiResponse.status = response.data.docs.length == 0 ? false : true;
                            apiResponse.data = response.data.docs.length == 0 ? null : response.data;
                            response.data.docs.length == 0 ? reject(apiResponse) : resolve(apiResponse);
                            break;
                        default:
                            if (debug) {
                                throw new Error(`Unhandled status code! (${response.status})`);
                            }
                            break;
                    }
                    resolve(apiResponse);
                })
                .catch(function (error) {
                    switch (error.code) {
                        case "ERR_BAD_REQUEST":
                            apiResponse.status = "fetcherror";
                            break;

                        case "ENOTFOUND":
                            apiResponse.status = "fetcherror";
                            apiResponse.data = error;
                            break;

                        default:
                            if (debug) {
                                throw new Error(`Unhandled error code! (${error.code})`);
                            }
                            break;
                    }
                    reject(apiResponse);
                });
        });
    }
}

export default BeatSaverAPI;
