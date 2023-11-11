# beatsaver-api-wrapper

An api wrapper for Beatsaver.

# Info

Documentation is coming soon. For now you can use the comments in `main.mjs`.\
The api wrapper will be released on npm after stable release.\
Currently supports all get api endpoints specified by the Beatsaver api docs. (https://api.beatsaver.com/docs/index.html?url=./swagger.json)\
OAuth/post endpoints will be coming soon.

# Tests and test dependencies

Run `npm i` and `npm test` to run all tests.\
Uses mocha and nock for testing.

-   [mocha](https://github.com/mochajs/mocha) - API wrapper tests
-   [nock](https://github.com/nock/nock) - Test network errors

# Dependencies

Only uses axios for http requests so it should work in the browser. (not tested yet)

-   [axios](https://github.com/axios/axios) - Make http requests
-   [Beatsaver API](https://api.beatsaver.com/docs/index.html?url=./swagger.json) - Beatsaver API Documentation
