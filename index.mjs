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
    getCollaborationMapsFromUserID: "/maps/collaborations/",
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
        this.axiosInstance = axios.create({
            baseURL: apiURLs.mainAPIURL,
            headers: { "User-Agent": this.userAgent },
        });
    }

    apiResponse(status, data = null) {
        return { status: status, data: data };
    }

    checkDate(date) {
        return /^(197[0-9]|198[0-9]|199[0-9]|[2-9][0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\+00:00$/.test(date);
    }

    /*
    Returns false if no id is specified.
    Returns an object with data and status.
    Status can be: "invalidid" (data is null), true (api response will be returned as data), "fetcherror" (axios error will be returned as data)
    */
    async getMapInfo(id) {
        if (isnullorempty(id)) {
            return this.apiResponse(false);
        }
        try {
            var response = await this.axiosInstance.get(`${apiURLs.getMapInfoID}${id}`);
            switch (response.status) {
                case 200:
                    return this.apiResponse(true, response.data);
                default:
                    if (debug) {
                        throw new Error(`Unhandled status code! (${response.status})`);
                    }
                    break;
            }
            return apiResponse;
        } catch (error) {
            switch (error.code) {
                case "ERR_BAD_REQUEST":
                    return this.apiResponse("invalidid");

                case "ENOTFOUND":
                    return this.apiResponse("fetcherror", error);

                default:
                    if (debug) {
                        throw new Error(`Unhandled error code! (${error.code})`);
                    }
                    break;
            }
            return apiResponse;
        }
    }

    /*
    Returns "notanarray" if the passed argument is not an array.
    Returns "emptyarray" if the passed array is empty.
    Returns "toolargearray" if the passed array has more elements than 50.
    Returns "fetcherror" in case of any errors. (404, ENOTFOUND)
    Returns false if no maps could be found. (Data is null)
    Returns true if maps had been found.
    */
    async getMapInfoFromList(idList) {
        if (!Array.isArray(idList)) {
            return this.apiResponse("notanarray");
        }
        if (idList.length == 0) {
            return this.apiResponse("emptyarray");
        }
        if (idList.length > 50) {
            return this.apiResponse("toolargearray");
        }
        try {
            var response = await this.axiosInstance.get(`${apiURLs.getMapInfoIDs}${idList.join(",")}`);
            switch (response.status) {
                case 200:
                    return this.apiResponse(Object.keys(response.data).length == 0 ? false : true, Object.keys(response.data).length == 0 ? null : response.data);
                default:
                    if (debug) {
                        throw new Error(`Unhandled status code! (${response.status})`);
                    }
                    break;
            }
        } catch (error) {
            switch (error.code) {
                case "ERR_BAD_REQUEST":
                    return this.apiResponse("fetcherror");

                case "ENOTFOUND":
                    return this.apiResponse("fetcherror", error);

                default:
                    if (debug) {
                        throw new Error(`Unhandled error code! (${error.code})`);
                    }
                    break;
            }
        }
    }

    /*
    Returns "notanarray" if the passed argument is not an array.
    Returns "emptyarray" if the passed array is empty.
    Returns "toolargearray" if the passed array has more elements than 50.
    Returns "fetcherror" in case of any errors. (404, ENOTFOUND)
    Returns false if no maps could be found. (Data is null)
    Returns true if maps had been found.
    */
    async getMapInfoFromHashList(idList) {
        if (!Array.isArray(idList)) {
            return this.apiResponse("notanarray");
        }
        if (idList.length == 0) {
            return this.apiResponse("emptyarray");
        }
        if (idList.length > 50) {
            return this.apiResponse("toolargearray");
        }
        try {
            var response = await this.axiosInstance.get(`${apiURLs.getMapInfoHashes}${idList.join(",")}`);
            switch (response.status) {
                case 200:
                    return this.apiResponse(Object.keys(response.data).length == 0 ? false : true, Object.keys(response.data).length == 0 ? null : response.data);
                default:
                    if (debug) {
                        throw new Error(`Unhandled status code! (${response.status})`);
                    }
                    break;
            }
        } catch (error) {
            switch (error.code) {
                case "ERR_BAD_REQUEST":
                    return this.apiResponse(false);

                case "ENOTFOUND":
                    return this.apiResponse("fetcherror", error);

                default:
                    if (debug) {
                        throw new Error(`Unhandled error code! (${error.code})`);
                    }
                    break;
            }
        }
    }

    /*
    Returns "fetcherror" in case of any errors. (404, ENOTFOUND)
    Returns "invalidid" if userID isn't a number.
    Returns "toolongid" if userID is too long.
    Returns "invalidpage" if page isn't a number.
    Returns false if user's maps couldn't be found. (Data is null)
    Returns true if user's maps had been found.
    */
    async getMapsFromUserID(userID, page = 0) {
        if (isNaN(userID)) {
            return this.apiResponse("invalidid");
        }
        if (isNaN(page)) {
            return this.apiResponse("invalidpage");
        }
        userID = Number(userID);
        if (userID > 999999999) {
            return this.apiResponse("toolongid");
        }
        try {
            var response = await this.axiosInstance.get(`${apiURLs.getMapsFromUserID}${userID}/${page}`);
            switch (response.status) {
                case 200:
                    return this.apiResponse(response.data.docs.length == 0 ? false : true, response.data.docs.length == 0 ? null : response.data);
                default:
                    if (debug) {
                        throw new Error(`Unhandled status code! (${response.status})`);
                    }
                    break;
            }
        } catch (error) {
            switch (error.code) {
                case "ERR_BAD_REQUEST":
                    return this.apiResponse("fetcherror");

                case "ENOTFOUND":
                    return this.apiResponse("fetcherror", error);

                default:
                    if (debug) {
                        throw new Error(`Unhandled error code! (${error.code})`);
                    }
                    break;
            }
        }
    }

    /*
    Returns "fetcherror" in case of any errors. (404, ENOTFOUND)
    Returns "invalidid" if userID isn't a number.
    Returns "toolongid" if userID is too long.
    Returns "invalidpagesize" if page isn't a number.
    Returns "invaliddate" if the date isn't in the correct format. (YYYY-MM-DDTHH:MM:SS+00:00) (Minimum year is 1970, Maximum is 9999)
    Returns false if user's maps couldn't be found. (Data is null)
    Returns true if user's maps had been found.
    */
    async getCollaborationMapsFromUserID(userID, pageSize = 20, before = null) {
        if (isNaN(userID)) {
            return this.apiResponse("invalidid");
        }
        if (isNaN(pageSize)) {
            return this.apiResponse("invalidpagesize");
        }
        pageSize = Number(pageSize);
        userID = Number(userID);
        if (userID > 999999999) {
            return this.apiResponse("toolongid");
        }
        if (before != null) {
            if (!this.checkDate(before)) {
                return this.apiResponse("invaliddate");
            }
        }
        try {
            var response = await this.axiosInstance.get(`${apiURLs.getCollaborationMapsFromUserID}${userID}`, {
                pageSize: pageSize,
                ...(before != null ? { before } : {}),
            });
            switch (response.status) {
                case 200:
                    return this.apiResponse(response.data.docs.length == 0 ? false : true, response.data.docs.length == 0 ? null : response.data);
                default:
                    if (debug) {
                        throw new Error(`Unhandled status code! (${response.status})`);
                    }
                    break;
            }
        } catch (error) {
            switch (error.code) {
                case "ERR_BAD_REQUEST":
                    return this.apiResponse("fetcherror");

                case "ENOTFOUND":
                    return this.apiResponse("fetcherror", error);

                default:
                    if (debug) {
                        throw new Error(`Unhandled error code! (${error.code})`);
                    }
                    break;
            }
        }
    }
}

export default BeatSaverAPI;
