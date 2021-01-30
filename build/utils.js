"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearches = getSearches;
exports.trackSearch = trackSearch;
exports.removeSearch = removeSearch;
exports.doSearch = doSearch;

var _firebase = require("./firebase");

var _amazonApi = require("./amazonApi");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('telegram-keyboard'),
    Keyboard = _require.Keyboard,
    Key = _require.Key;

function getSearches(_ref) {
  var ctx = _ref.ctx,
      userId = _ref.userId;
  (0, _firebase.listUserSearch)(userId).then(function (res) {
    if (res.length > 0) {
      var keyboard = Keyboard.make([res, ['Annulla']]).inline();
      ctx.reply('Clicca sulla parola chiave che desideri smettere di monitorare:', keyboard);
    } else {
      ctx.reply('Non hai ricerche attive');
    }
  });
}

function trackSearch(_ref2) {
  var search = _ref2.search,
      userId = _ref2.userId,
      ctx = _ref2.ctx;
  var keyword = search.getKeyword();

  if (keyword !== '') {
    (0, _firebase.saveUserSearch)(search.getKeyword(), userId);
    search.setKeyword('');
    return ctx.reply('Perfetto! Riceverai un aggiornamento quotidiano su questa ricerca! 💪🏻');
  } else {
    return ctx.reply('👻  Questa chiave di ricerca non è più disponibile.');
  }
}

function removeSearch(_ref3) {
  var ctx = _ref3.ctx,
      userId = _ref3.userId;
  (0, _firebase.removeUserSearch)(ctx.callbackQuery.data, userId);
  return ctx.replyWithMarkdown("\uD83D\uDC7B  Ho eliminato la ricerca *".concat(ctx.callbackQuery.data, "*"));
}

function doSearch(_x, _x2) {
  return _doSearch.apply(this, arguments);
}

function _doSearch() {
  _doSearch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx, search) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve) {
                var results, promises, keyboard;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        search.setKeyword(ctx.message.text);
                        _context.next = 3;
                        return ctx.replyWithMarkdown("\u2705 Ecco i risultati della ricerca *".concat(ctx.message.text, "*"));

                      case 3:
                        _context.next = 5;
                        return (0, _amazonApi.searchItems)({
                          keywords: ctx.message.text
                        });

                      case 5:
                        results = _context.sent;
                        console.log(results);

                        if (!(!results || results.length === 0)) {
                          _context.next = 9;
                          break;
                        }

                        return _context.abrupt("return", resolve(true));

                      case 9:
                        promises = results.map(function (item) {
                          if (item['Offers'] !== undefined && item['Offers']['Listings'] !== undefined) {
                            var prices = item['Offers']['Listings'].reduce(function (previousValue, currentValue) {
                              previousValue = previousValue + "\n\uD83D\uDCB6 <b>".concat(currentValue.Price.DisplayAmount, "</b> ").concat(currentValue.SavingBasis ? "<strike> ".concat(currentValue.SavingBasis.DisplayAmount, " </strike>") : '', " ").concat(currentValue.Price.Savings ? "Sconto di ".concat(currentValue.Price.Savings.DisplayAmount) : '', "\n                    ");
                              return previousValue;
                            }, '');
                            return ctx.replyWithPhoto({
                              url: item['Images']['Primary']['Large']['URL']
                            }, {
                              caption: "<b>".concat(item['ItemInfo']['Title']['DisplayValue'], "</b>\n").concat(prices, "\n\uD83D\uDC49\uD83C\uDFFB ").concat(item['DetailPageURL']),
                              parse_mode: 'HTML'
                            });
                          }
                        });
                        keyboard = Keyboard.make([['Monitora Ricerca', 'Nuova Ricerca']]).inline();
                        Promise.all(promises).then(function () {
                          ctx.reply('✅ La ricerca è completata, cosa vuoi fare adesso?', keyboard);
                          resolve(true);
                        });

                      case 12:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _doSearch.apply(this, arguments);
}
//# sourceMappingURL=utils.js.map