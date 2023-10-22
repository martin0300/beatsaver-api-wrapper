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
    getLatestMaps: "/maps/latest",
    getMapsByPlayCount: "/maps/plays/",
    getUserByID: "/users/id/",
};
const sortOptions = ["FIRST_PUBLISHED", "UPDATED", "LAST_PUBLISHED", "CREATED", "CURATED"];

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
    It was duplicated too many times.
    Also good for catching edge cases.
    */
    unhandledError(errorCode) {
        if (debug) {
            throw new Error(`Unhandled error code! (${errorCode})`);
        } else {
            return this.apiResponse("unhandlederror", errorCode);
        }
    }

    /*
    Used when errors doesn't mean anything to the result of the call.
    Like in getMapInfo() the 404 means that the map doesn't exist. You can't use this there.
    In any other case the 404 or 'ENOTFOUND' means there is something wrong with the network or an undocumented API error (like too long userID).
    */
    handleGenericErrors(error) {
        switch (error.code) {
            case "ERR_BAD_REQUEST":
                return this.apiResponse("fetcherror");

            case "ENOTFOUND":
            case "ECONNREFUSED":
            case "ETIMEDOUT":
            case "ECONNRESET":
            case "ENETUNREACH":
                return this.apiResponse("fetcherror", error);

            default:
                return this.unhandledError(error.code);
        }
    }

    /*
    Returns false if no id is specified.
    Returns true and user data.
    Returns "invalidid" if id is null or an empty string.
    Returns "fetcherror" if there are any network errors.
    */
    async getMapInfo(id) {
        //check if id isn't null or an empty string
        if (isnullorempty(id)) {
            return this.apiResponse("invalidid");
        }
        try {
            var response = await this.axiosInstance.get(`${apiURLs.getMapInfoID}${id}`);
            switch (response.status) {
                case 200:
                    return this.apiResponse(true, response.data);
                default:
                    return this.unhandledError(response.status);
            }
        } catch (error) {
            switch (error.code) {
                case "ERR_BAD_REQUEST":
                    return this.apiResponse(false);

                default:
                    return this.handleGenericErrors(error);
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
    async getMapInfoFromList(idList) {
        //check if idList is an array
        if (!Array.isArray(idList)) {
            return this.apiResponse("notanarray");
        }
        //check if idList is empty
        if (idList.length == 0) {
            return this.apiResponse("emptyarray");
        }
        //check if idList doesn't have more than 50 elements
        if (idList.length > 50) {
            return this.apiResponse("toolargearray");
        }
        try {
            var response = await this.axiosInstance.get(`${apiURLs.getMapInfoIDs}${idList.join(",")}`);
            switch (response.status) {
                case 200:
                    return this.apiResponse(Object.keys(response.data).length == 0 ? false : true, Object.keys(response.data).length == 0 ? null : response.data);
                default:
                    return this.unhandledError(response.status);
            }
        } catch (error) {
            return this.handleGenericErrors(error);
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
    async getMapInfoFromHashList(hashList) {
        //check if hashList is an array
        if (!Array.isArray(hashList)) {
            return this.apiResponse("notanarray");
        }
        //check if hashList is empty
        if (hashList.length == 0) {
            return this.apiResponse("emptyarray");
        }
        //check if hashList doesn't have more than 50 elements
        if (hashList.length > 50) {
            return this.apiResponse("toolargearray");
        }
        try {
            var response = await this.axiosInstance.get(`${apiURLs.getMapInfoHashes}${hashList.join(",")}`);
            switch (response.status) {
                case 200:
                    return this.apiResponse(Object.keys(response.data).length == 0 ? false : true, Object.keys(response.data).length == 0 ? null : response.data);
                default:
                    return this.unhandledError(response.status);
            }
        } catch (error) {
            switch (error.code) {
                case "ERR_BAD_REQUEST":
                    return this.apiResponse(false);

                default:
                    return this.handleGenericErrors(error);
            }
        }
    }

    /*
    Returns "fetcherror" in case of any errors. (404, ENOTFOUND)
    Returns "invalidid" if userID isn't a number.
    Returns "toolongid" if userID is too long.
    Returns "toolongpage" if page is higher than 999999999999999999 or longer than 18 characters.
    Returns "invalidpage" if page isn't a number.
    Returns false if user's maps couldn't be found. (Data is null)
    Returns true if user's maps had been found.
    */
    async getMapsFromUserID(userID, page = 0) {
        //check if userID is a number
        if (isNaN(userID)) {
            return this.apiResponse("invalidid");
        }
        //check if page is a number
        if (isNaN(page)) {
            return this.apiResponse("invalidpage");
        }
        //ensures that if it's null or a string it will be 0 or the string in numbers
        userID = Number(userID);
        page = Number(page);
        //check if userID is not longer than 9 characters
        if (userID > 999999999) {
            return this.apiResponse("toolongid");
        }
        //check if page is not longer than 18 characters
        if (page > 999999999999999999) {
            return this.apiResponse("toolongpage");
        }
        try {
            var response = await this.axiosInstance.get(`${apiURLs.getMapsFromUserID}${userID}/${page}`);
            switch (response.status) {
                case 200:
                    return this.apiResponse(response.data.docs.length == 0 ? false : true, response.data.docs.length == 0 ? null : response.data);
                default:
                    return this.unhandledError(response.status);
            }
        } catch (error) {
            return this.handleGenericErrors(error);
        }
    }

    /*
    Returns "fetcherror" in case of any errors. (404, ENOTFOUND)
    Returns "invalidid" if userID isn't a number.
    Returns "toolongid" if userID is too long.
    Returns "toolongpagesize" if pageSize is higher than 999999999 or longer than 9 characters.
    Returns "invalidpagesize" if pageSize isn't a number.
    Returns "invaliddate" if the date isn't in the correct format. (YYYY-MM-DDTHH:MM:SS+00:00) (Minimum year is 1970, Maximum is 9999)
    Returns false if user's maps couldn't be found. (Data is null)
    Returns true if user's maps had been found.
    */
    async getCollaborationMapsFromUserID(userID, pageSize = 20, before = null) {
        //check if userID is a number
        if (isNaN(userID)) {
            return this.apiResponse("invalidid");
        }
        //check if pageSize is a number
        if (isNaN(pageSize)) {
            return this.apiResponse("invalidpagesize");
        }
        //ensures that if it's null or a string it will be 0 or the string in numbers
        pageSize = Number(pageSize);
        userID = Number(userID);
        //check if userID is not longer than 9 characters
        if (userID > 999999999) {
            return this.apiResponse("toolongid");
        }
        //check if pageSize is not longer than 9 characters
        if (pageSize > 999999999) {
            return this.apiResponse("toolongpagesize");
        }
        //check before date
        if (before != null) {
            if (!this.checkDate(before)) {
                return this.apiResponse("invaliddate");
            }
        }
        try {
            var response = await this.axiosInstance.get(`${apiURLs.getCollaborationMapsFromUserID}${userID}`, {
                params: {
                    pageSize: pageSize,
                    ...(before != null ? { before } : {}),
                },
            });
            switch (response.status) {
                case 200:
                    return this.apiResponse(response.data.docs.length == 0 ? false : true, response.data.docs.length == 0 ? null : response.data);
                default:
                    return this.unhandledError(response.status);
            }
        } catch (error) {
            return this.handleGenericErrors(error);
        }
    }

    /*
    Returns "fetcherror" in case of any network errors.
    Returns "invalidautomapper" if automapper is not a boolean.
    Returns "invalidbeforedate" if before date is not in the correct format. (YYYY-MM-DDTHH:MM:SS+00:00) (Minimum year is 1970, Maximum is 9999)
    Returns "invalidafterdate" if after date is not in the correct format. (YYYY-MM-DDTHH:MM:SS+00:00) (Minimum year is 1970, Maximum is 9999)
    Returns "invalidpagesize" if pageSize isn't a number.
    Returns "toolongpagesize" if pageSize is higher than 999999999 or longer than 9 characters. (also undocumented)
    Returns "invalidsort" if sort option is invalid. (Valid: FIRST_PUBLISHED, UPDATED, LAST_PUBLISHED, CREATED, CURATED)
    Returns true if the maps are found.
    Returns false if no maps are found.
    */
    async getLatestMaps(after = null, automapper = null, before = null, pageSize = 20, sort = null) {
        //check after date
        if (after != null) {
            if (!this.checkDate(after)) {
                return this.apiResponse("invalidafterdate");
            }
        }
        //check before date
        if (before != null) {
            if (!this.checkDate(before)) {
                return this.apiResponse("invalidbeforedate");
            }
        }
        //check if pageSize is a number
        if (isNaN(pageSize)) {
            return this.apiResponse("invalidpagesize");
        }
        //ensures that if it's null or a string it will be 0 or the string in numbers
        pageSize = Number(pageSize);
        //check if pageSize is not longer than 9 characters
        if (pageSize > 999999999) {
            return this.apiResponse("toolongpagesize");
        }
        //check if automapper is a boolean
        if (automapper != null) {
            if (typeof automapper != "boolean") {
                return this.apiResponse("invalidautomapper");
            }
        }
        //check if sort is a valid sort option (Valid: FIRST_PUBLISHED, UPDATED, LAST_PUBLISHED, CREATED, CURATED)
        if (sort != null) {
            if (!sortOptions.includes(sort)) {
                return this.apiResponse("invalidsort");
            }
        }
        try {
            var response = await this.axiosInstance.get(apiURLs.getLatestMaps, {
                params: {
                    pageSize: pageSize,
                    ...(after != null ? { after } : {}),
                    ...(automapper != null ? { automapper } : {}),
                    ...(before != null ? { before } : {}),
                    ...(sort != null ? { sort } : {}),
                },
            });
            switch (response.status) {
                case 200:
                    return this.apiResponse(response.data.docs.length == 0 ? false : true, response.data.docs.length == 0 ? null : response.data);
                default:
                    return this.unhandledError(response.status);
            }
        } catch (error) {
            return this.handleGenericErrors(error);
        }
    }

    /*
    Returns "fetcherror" in case of any network errors.
    Returns true if the maps on the page are found.
    Returns false if no maps are found.
    Returns "invalidpage" if the page is not a number.
    Returns "toolongpage" if the page number is higher than 999999999999999999 or longer than 18 characters. (also undocumented)
    */
    async getMapsByPlayCount(page = 0) {
        //check if page is a number
        if (isNaN(page)) {
            return this.apiResponse("invalidpage");
        }
        //ensures that if it's null or a string it will be 0 or the string in numbers
        page = Number(page);
        //check if page number isn't longer than 18 characters
        if (page > 999999999999999999) {
            return this.apiResponse("toolongpage");
        }
        try {
            var response = await this.axiosInstance(`${apiURLs.getMapsByPlayCount}${page}`);
            switch (response.status) {
                case 200:
                    return this.apiResponse(response.data.docs.length == 0 ? false : true, response.data.docs.length == 0 ? null : response.data);
                default:
                    return this.unhandledError(response.status);
            }
        } catch (error) {
            return this.handleGenericErrors(error);
        }
    }

    /*
    Returns "fetcherror" in case of any network errors.
    Returns false if user isn't found.
    Returns true and user data if user is found.
    Returns "invalidid" if userID is not a number.
    Returns "toolongid" if userID is higher than 999999999 or longer than 9 characters.
    */
    async getUserByID(userID) {
        if (isNaN(userID)) {
            return this.apiResponse("invalidid");
        }
        //ensures that if it's null or a string it will be 0 or the string in numbers
        userID = Number(userID);
        //check if userID is not longer than 9 characters
        if (userID > 999999999) {
            return this.apiResponse("toolongid");
        }
        try {
            var response = await this.axiosInstance.get(`${apiURLs.getUserByID}/${userID}`);
            switch (response.status) {
                case 200:
                    return this.apiResponse(true, response.data);
                default:
                    return this.unhandledError(response.status);
            }
        } catch (error) {
            switch (error.code) {
                case "ERR_BAD_REQUEST":
                    return this.apiResponse(false);

                default:
                    return this.handleGenericErrors(error);
            }
        }
    }
}

export default BeatSaverAPI;
