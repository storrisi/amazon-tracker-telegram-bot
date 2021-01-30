"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeCron = initializeCron;
exports.testSearches = testSearches;
exports.listSearches = listSearches;
exports.Cron = void 0;

var _firebase = require("./firebase");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var cron = require('node-cron');

var _require = require('telegram-keyboard'),
    Keyboard = _require.Keyboard,
    Key = _require.Key;

var Telegram = require('telegraf/telegram');

var telegram = new Telegram(process.env.BOT_TOKEN);

var Cron = /*#__PURE__*/function () {
  function Cron(ctx) {
    _classCallCheck(this, Cron);

    this.ctx = ctx;
    this.user = ctx.callbackQuery.message.chat.id;
  }

  _createClass(Cron, [{
    key: "initialize",
    value: function initialize() {
      this.ctx.telegram.sendMessage(this.user, "Riceverai un messaggio ogni giorno alle 6 di mattina");
    }
  }]);

  return Cron;
}();

exports.Cron = Cron;

function initializeCron() {
  console.log("initializeCron");
  cron.schedule('0 7 * * *', function () {
    (0, _firebase.getSearches)(telegram);
  });
  cron.schedule('0 15 * * *', function () {
    listSearches();
  });
}

function testSearches() {
  listSearches();
}

function listSearches() {
  var keyboard = Keyboard.make([['Continua a Monitorare', 'Smetti di Monitorare']]).inline();
  (0, _firebase.getListSearches)().then(function (res) {
    res.forEach(function (item) {
      Object.keys(item).forEach(function (userId) {
        telegram.sendMessage(userId, "Al momento hai ".concat(item[userId].length, " ricerc").concat(item[userId].length > 1 ? 'he' : 'a', " attiv").concat(item[userId].length > 1 ? 'e' : 'a', ", vuoi continuare a monitorarl").concat(item[userId].length > 1 ? 'e' : 'a', "?"), keyboard);
      });
    });
  });
}

initializeCron();
//# sourceMappingURL=cron.js.map