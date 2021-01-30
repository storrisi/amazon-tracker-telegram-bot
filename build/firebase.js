"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticate = authenticate;
exports.saveUserSearch = saveUserSearch;
exports.removeUserSearch = removeUserSearch;
exports.getSearches = getSearches;
exports.getListSearches = getListSearches;
exports.listUserSearch = listUserSearch;
exports.deleteSearch = deleteSearch;

var _firebaseConfig = require("./firebaseConfig");

var _amazonApi = require("./amazonApi");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function authenticate() {
  _firebaseConfig.admin.auth().getUser(process.env.USER_ID).then(function (userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully fetched user data");
  })["catch"](function (error) {
    console.log('Error fetching user data:', error);
  });
}

function saveUserSearch(keyword, userId) {
  var db = _firebaseConfig.admin.database();

  var ref = db.ref("searches/".concat(keyword, "/").concat(userId));
  ref.set(1);
  var userRef = db.ref("users/".concat(userId, "/").concat(keyword));
  userRef.set(1);
  return Promise.resolve(true);
}

function removeUserSearch(keyword, userId) {
  var db = _firebaseConfig.admin.database();

  var ref = db.ref("searches/".concat(keyword, "/").concat(userId));
  ref.remove();
  var userRef = db.ref("users/".concat(userId, "/").concat(keyword));
  userRef.remove();
  return Promise.resolve(true);
}

function getSearches(telegram) {
  console.log("getSearches");
  return new Promise(function (resolve) {
    var searchesRef = _firebaseConfig.admin.database().ref("searches");

    searchesRef.once("value", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(snapshot) {
        var values;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                values = snapshot.val(); //console.log(values)
                //console.log(Object.keys(values))

                Object.keys(values).forEach( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(key) {
                    var results, users;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return (0, _amazonApi.searchItems)({
                              keywords: key
                            });

                          case 2:
                            results = _context.sent;
                            console.log("keyword", key);
                            users = Object.keys(values[key]);
                            console.log(users);
                            users.forEach(function (chatId) {
                              console.log("chatId", chatId);
                              var promises = results.map(function (item) {
                                if (item['Offers'] !== undefined && item['Offers']['Listings'] !== undefined) {
                                  var prices = item['Offers']['Listings'].reduce(function (previousValue, currentValue) {
                                    previousValue = previousValue + "\n\uD83D\uDCB6 <b>".concat(currentValue.Price.DisplayAmount, "</b> ").concat(currentValue.SavingBasis ? "<strike> ".concat(currentValue.SavingBasis.DisplayAmount, " </strike>") : '', " ").concat(currentValue.Price.Savings ? "Sconto di ".concat(currentValue.Price.Savings.DisplayAmount) : '', "\n                                ");
                                    return previousValue;
                                  }, '');
                                  return telegram.sendPhoto(chatId, {
                                    url: item['Images']['Primary']['Large']['URL']
                                  }, {
                                    caption: "<b>".concat(item['ItemInfo']['Title']['DisplayValue'], "</b>\n").concat(prices, "\n\uD83D\uDC49\uD83C\uDFFB ").concat(item['DetailPageURL']),
                                    parse_mode: 'HTML'
                                  });
                                }
                              });
                              Promise.all(promises).then(function () {});
                            });

                          case 7:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x2) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }(), function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    resolve(true);
  });
}

function getListSearches() {
  return _getListSearches.apply(this, arguments);
}

function _getListSearches() {
  _getListSearches = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", new Promise(function (resolve) {
              var usersRef = _firebaseConfig.admin.database().ref("users");

              usersRef.once("value", function (snapshot) {
                var values = snapshot.val();
                if (!values) return resolve([]);
                var users = Object.keys(values).map(function (key) {
                  var keys = Object.keys(values[key]);
                  return _defineProperty({}, key, keys);
                });
                resolve(users);
              });
            }));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getListSearches.apply(this, arguments);
}

function listUserSearch(_x3) {
  return _listUserSearch.apply(this, arguments);
}

function _listUserSearch() {
  _listUserSearch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(userId) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", new Promise(function (resolve) {
              var usersRef = _firebaseConfig.admin.database().ref("users/".concat(userId));

              usersRef.once("value", function (snapshot) {
                var values = snapshot.val();
                if (!values) return resolve([]);
                var keys = Object.keys(values);
                resolve(keys);
              });
            }));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _listUserSearch.apply(this, arguments);
}

function deleteSearch() {
  return _deleteSearch.apply(this, arguments);
}

function _deleteSearch() {
  _deleteSearch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", new Promise(function (resolve) {
              resolve(true);
            }));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _deleteSearch.apply(this, arguments);
}
//# sourceMappingURL=firebase.js.map