"use strict";

require("core-js/stable");

require("regenerator-runtime/runtime");

var _cron = require("./cron");

var _firebase = require("./firebase");

var _utils = require("./utils");

var _searchClass = require("./searchClass");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require('dotenv').config();

var _require = require('telegraf'),
    Telegraf = _require.Telegraf;

var session = require('telegraf/session');

var Stage = require('telegraf/stage');

var Scene = require('telegraf/scenes/base');

var leave = Stage.leave;

var _require2 = require('telegram-keyboard'),
    Keyboard = _require2.Keyboard,
    Key = _require2.Key;

var fastify = require('fastify')();

var PORT = process.env.PORT || 3000;
console.log(PORT);
var search = new _searchClass.Search();
var mainKeyboard = Keyboard.make([['Avvia nuova ricerca', 'Lista delle ricerche']]);
(0, _firebase.authenticate)();
var greeter = new Scene('greeter');
greeter.enter(function (ctx) {
  return ctx.reply("\uD83D\uDCAA\uD83C\uDFFB Sono pronto. Dimmi il nome del prodotto che vuoi cercare.\n\n/cancel");
});
greeter.command('cancel', function () {
  console.log("leave");
  leave();
});
greeter.on('message', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _utils.doSearch)(ctx, search).then(function () {
              console.log("leave");
              ctx.scene.leave('greeter');
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()); // Create scene manager

var stage = new Stage();
stage.command('cancel', leave()); // Scene registration

stage.register(greeter);
var bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());
bot.use(stage.middleware());
bot.start( /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return ctx.reply('Usa i tasti funzione o digita / per visualizzare i comandi', mainKeyboard.reply());

          case 3:
            _context2.next = 8;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 5]]);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());
bot.command('avvia', function (ctx) {
  return ctx.scene.enter('greeter');
});
bot.command('lista', function (ctx) {
  var userId = ctx.update.message.chat.id;
  (0, _utils.getSearches)({
    ctx: ctx,
    userId: userId
  });
});
bot.hears('Avvia nuova ricerca', function (ctx) {
  return ctx.scene.enter('greeter');
});
bot.hears('Lista delle ricerche', function (ctx) {
  var userId = ctx.update.message.chat.id;
  (0, _utils.getSearches)({
    ctx: ctx,
    userId: userId
  });
});
bot.on('callback_query', function (ctx) {
  var userId = ctx.callbackQuery.message.chat.id;

  switch (ctx.callbackQuery.data) {
    case 'Monitora Ricerca':
      return (0, _utils.trackSearch)({
        search: search,
        userId: userId,
        ctx: ctx
      });

    case 'Nuova Ricerca':
      return ctx.scene.enter('greeter');

    case 'Smetti di Monitorare':
      return (0, _utils.getSearches)({
        ctx: ctx,
        userId: userId
      });

    case 'Continua a Monitorare':
      return ctx.reply('Perfetto! Riceverai un aggiornamento quotidiano su questa ricerca! 💪🏻');

    case 'Annulla':
      break;

    default:
      return (0, _utils.removeSearch)({
        ctx: ctx,
        userId: userId
      });
  }
});
bot.launch();
fastify.get('/', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, reply) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", {
              hello: 'world'
            });

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}());
/*fastify.get('/search', async (request, reply) => {
    return testSearches()
})

fastify.get('/list-search', async (request, reply) => {
    listSearches()
    return { hello: 'world' }
})*/
// Run the server!

var start = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("start");
            _context4.prev = 1;
            _context4.next = 4;
            return fastify.listen(PORT, '0.0.0.0');

          case 4:
            fastify.log.info("server listening on ".concat(fastify.server.address().port));
            _context4.next = 11;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](1);
            fastify.log.error(_context4.t0);
            process.exit(1);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 7]]);
  }));

  return function start() {
    return _ref4.apply(this, arguments);
  };
}();

start();
//# sourceMappingURL=index.js.map