"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
// Run `npm install` locally before executing following code with `node sampleSearchItemsApi.js`

/**
 * This sample code snippet is for ProductAdvertisingAPI 5.0's SearchItems API
 * For more details, refer:
 * https://webservices.amazon.com/paapi5/documentation/search-items.html
 */
require('dotenv').config();

var ProductAdvertisingAPIv1 = require('./AmazonApi/index');

var defaultClient = ProductAdvertisingAPIv1.ApiClient.instance; // Specify your credentials here. These are used to create and sign the request.

defaultClient.accessKey = process.env.ACCESS_KEY;
defaultClient.secretKey = process.env.SECRET_KEY;
/**
 * PAAPI Host and Region to which you want to send request.
 * For more details refer: https://webservices.amazon.com/paapi5/documentation/common-request-parameters.html#host-and-region
 */

defaultClient.host = process.env.HOST;
defaultClient.region = process.env.REGION;
var api = new ProductAdvertisingAPIv1.DefaultApi();

function onSuccess(_x) {
  return _onSuccess.apply(this, arguments);
}

function _onSuccess() {
  _onSuccess = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
    var searchItemsResponse, error_0, item_0;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('API called successfully.');
            searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data); //console.log('Complete Response: \n' + JSON.stringify(searchItemsResponse, null, 1));

            if (searchItemsResponse['Errors'] !== undefined) {
              console.log('Errors:');
              console.log('Complete Error Response: ' + JSON.stringify(searchItemsResponse['Errors'], null, 1));
              console.log('Printing 1st Error:');
              error_0 = searchItemsResponse['Errors'][0];
              console.log('Error Code: ' + error_0['Code']);
              console.log('Error Message: ' + error_0['Message']);
            }

            return _context.abrupt("return", Promise.resolve(searchItemsResponse['SearchResult']['Items']));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _onSuccess.apply(this, arguments);
}

function onError(error) {
  console.log('Error calling PA-API 5.0!');
  console.log('Printing Full Error Object:\n' + JSON.stringify(error, null, 1));
  console.log('Status Code: ' + error['status']);

  if (error['response'] !== undefined && error['response']['text'] !== undefined) {
    console.log('Error Object: ' + JSON.stringify(error['response']['text'], null, 1));
  }
}

function searchItems(_x2) {
  return _searchItems.apply(this, arguments);
}

function _searchItems() {
  _searchItems = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref) {
    var keywords, searchItemsRequest;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            keywords = _ref.keywords;
            // Request Initialization
            searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();
            /** Enter your partner tag (store/tracking id) and partner type */

            searchItemsRequest['PartnerTag'] = process.env.PARTNER_TAG;
            searchItemsRequest['PartnerType'] = 'Associates';
            /** Specify Keywords */

            searchItemsRequest['Keywords'] = keywords;
            /** Specify item count to be returned in search result */

            searchItemsRequest['ItemCount'] = 2;
            /**
             * Choose resources you want from SearchItemsResource enum
             * For more details, refer: https://webservices.amazon.com/paapi5/documentation/search-items.html#resources-parameter
             */

            searchItemsRequest['Resources'] = ['Images.Primary.Large', 'ItemInfo.Title', 'Offers.Listings.Price', 'Offers.Listings.Promotions', 'Offers.Summaries.LowestPrice', 'Offers.Listings.SavingBasis'];
            return _context3.abrupt("return", api.searchItems(searchItemsRequest).then( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
                var result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return onSuccess(data);

                      case 2:
                        result = _context2.sent;
                        return _context2.abrupt("return", Promise.resolve(result));

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }(), function (error) {
              onError(error);
            }));

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _searchItems.apply(this, arguments);
}

module.exports = {
  searchItems: searchItems
};
//# sourceMappingURL=amazonApi.js.map