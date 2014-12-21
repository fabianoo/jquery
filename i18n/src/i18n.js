/**
 * i18n - Luan Nico
 * github.com/luanpotter/jquery
 * Version: 0.1
 */

(function ($) {
    "use strict";

    var map;

    var parseKey = function (rawKey) {
      var current = "", parts = [], escaping = false;
      for (var i = 0; i < rawKey.length; i++) {
        var char = rawKey.charAt(i);
        if (!escaping && char == ':') {
          parts.push(current);
          current = "";
        } else if (!escaping && char == '\\') {
          escaping = true;
          continue;
        } else {
          current += char;
        }
        escaping = false;
      }
      parts.push(current);

      var text = parts[0];
      parts.shift();

      return {
        text : text,
        args : parts
      };
    };

    var parseValue = function (rawValue, parsedKeyArgs) {
      var text = "", insertions = [], escaping = false;
      var currentInsertion = null, currentInsertionStart = null;
      var addChar = function (c) {
        if (currentInsertion === null) {
          text += c;
        } else {
          currentInsertion += c;
        }
      };
      var getArgIndex = function (insertion) {
        var index = parsedKeyArgs.indexOf(insertion);
        if (index == -1) {
          throw new Error("Used parameter " + insertion + " that was not found in the defined argument list.");
        }
        return index;
      };
      var assertInsideInsertion = function () {
        if (currentInsertion === null) {
          throw new Error("Malformed expression! Closed '}' without opening it.");
        }
      };
      var assertOutsideInsertion = function () {
        if (currentInsertion !== null) {
          throw new Error("Malformed expression! Opened '{' but it was already inside.");
        }
      };
      for (var i = 0; i < rawValue.length; i++) {
        var char = rawValue.charAt(i);
        if (escaping) {
          addChar(char);
          escaping = false;
          continue;
        }

        if (char == '\\') {
          escaping = true;
        } else if (char == '{') {
          assertOutsideInsertion();
          currentInsertion = "";
          currentInsertionStart = i;
        } else if (char == '}') {
          assertInsideInsertion();
          insertions.push({ location : currentInsertionStart, argIndex : getArgIndex(currentInsertion) });
          currentInsertion = null;
          currentInsertionStart = null;
        } else {
          addChar(char);
        }
      }
      assertOutsideInsertion();

      return {
        text : text,
        args : insertions
      };
    };

    var parsePattern = function (pattern, params) {
      var result = pattern.value;

      var insert = function (index, string) {
        if (index > 0)
          result = result.substring(0, index) + string + result.substring(index, result.length);
        else
          result = string + result;
      };

      $.each(pattern.args, function (i, arg) {
        insert(arg.location, params[arg.argIndex]);
      });

      return result;
    };

    var setup = function(rawMap) {
      map = {};
      $.each(rawMap, function (rawKey, rawValue) {
        var key = parseKey(rawKey);
        if (map[key.text] !== undefined) {
          throw new Error("You can't override keys just via parameters, you must change names. Two '" + key.text + "' keys found.");
        }

        var value = parseValue(rawValue, key.args);

        map[key.text] = {
          value : value.text,
          args : value.args,
          originalArgs : key.args
        };
      });
    };

    var t = function (rawKey) {
        var key = parseKey(rawKey);
        var pattern = map[key.text];
        if (pattern.originalArgs.length != key.args.length) {
          throw new Error("Invalid amount of arguments, expected " + pattern.originalArgs.length + " got " + key.args.length);
        }
        if (pattern) {
          return parsePattern(pattern, key.args);
        }
        return "## missing translation for " + rawKey + " ##";
    };

    $.i18n = {
      t : t,
      setup : setup
    };
}(jQuery));