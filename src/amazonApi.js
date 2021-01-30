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

var defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;

// Specify your credentials here. These are used to create and sign the request.
defaultClient.accessKey = process.env.ACCESS_KEY;
defaultClient.secretKey = process.env.SECRET_KEY;

/**
 * PAAPI Host and Region to which you want to send request.
 * For more details refer: https://webservices.amazon.com/paapi5/documentation/common-request-parameters.html#host-and-region
 */
defaultClient.host = process.env.HOST;
defaultClient.region = process.env.REGION;

var api = new ProductAdvertisingAPIv1.DefaultApi();

async function onSuccess(data) {
  console.log('API called successfully.');
  var searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);
  //console.log('Complete Response: \n' + JSON.stringify(searchItemsResponse, null, 1));
  if (searchItemsResponse['Errors'] !== undefined) {
    console.log('Errors:');
    console.log('Complete Error Response: ' + JSON.stringify(searchItemsResponse['Errors'], null, 1));
    console.log('Printing 1st Error:');
    var error_0 = searchItemsResponse['Errors'][0];
    console.log('Error Code: ' + error_0['Code']);
    console.log('Error Message: ' + error_0['Message']);
  }

  return Promise.resolve(searchItemsResponse['SearchResult']['Items']);

  if (searchItemsResponse['SearchResult'] !== undefined) {
    console.log('Printing First Item Information in SearchResult:');
    var item_0 = searchItemsResponse['SearchResult']['Items'][0];
    if (item_0 !== undefined) {
      if (item_0['ASIN'] !== undefined) {
        console.log('ASIN: ' + item_0['ASIN']);
      }
      if (item_0['DetailPageURL'] !== undefined) {
        console.log('DetailPageURL: ' + item_0['DetailPageURL']);
      }
      if (
        item_0['ItemInfo'] !== undefined &&
        item_0['ItemInfo']['Title'] !== undefined &&
        item_0['ItemInfo']['Title']['DisplayValue'] !== undefined
      ) {
        console.log('Title: ' + item_0['ItemInfo']['Title']['DisplayValue']);
      }
      if (
        item_0['Offers'] !== undefined &&
        item_0['Offers']['Listings'] !== undefined &&
        item_0['Offers']['Listings'][0]['Price'] !== undefined &&
        item_0['Offers']['Listings'][0]['Price']['DisplayAmount'] !== undefined
      ) {
        console.log('Buying Price: ' + item_0['Offers']['Listings'][0]['Price']['DisplayAmount']);
      }
    }
  }

}

function onError(error) {
  console.log('Error calling PA-API 5.0!');
  console.log('Printing Full Error Object:\n' + JSON.stringify(error, null, 1));
  console.log('Status Code: ' + error['status']);
  if (error['response'] !== undefined && error['response']['text'] !== undefined) {
    console.log('Error Object: ' + JSON.stringify(error['response']['text'], null, 1));
  }
}

async function searchItems ({keywords}) {

  // Request Initialization

  var searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();

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

  return api.searchItems(searchItemsRequest).then(
    async function(data) {
      const result = await onSuccess(data);
      return Promise.resolve(result)
    },
    function(error) {
      onError(error);
    }
  );
}

module.exports = {
  searchItems: searchItems
}