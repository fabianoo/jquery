/**
 * Numeric Field - Luan Nico
 * github.com/luanpotter/jquery
 * Version: 0.2
 * Dependencies: cursor_position.js
 */

(function ($) {
    "use strict";

    $.fn.numericField = function (options) {
        var settings = $.extend({
            integer: true, //If it has to be an integer or can be a rational
            min: null, //The minimum value, inclusive
            max: null, //The maximum value, inclusive
            decimal: '.', //The decimal separator
            auto_update: false //If the field should auto update to fit minimum and maximum on blur
        }, options);

        var NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        if (settings.auto_update && (settings.min !== null || settings.max !== null)) {
            this.bind('blur', function () {
                var num = parseFloat($(this).val());
                if (settings.min !== null && num < settings.min) {
                    $(this).val(settings.min);
                } else if (settings.max !== null && num > settings.max) {
                    $(this).val(settings.max);
                }
            });
        }

        this.bind('input keyup keydown', function () {
            //strip invalid characters
            var i = 0;

            //check for negative sign
            if ($(this).val()[0] === '-') {
                if (settings.min !== null && settings.min >= 0) {
                    $(this).stripOut(0);
                } else {
                    i++;
                }
            }

            var dotAlready = false;
            for (; i < $(this).val().length; i++) {
                if ($(this).val()[i] in NUMBERS) {
                    continue;
                }
                if ($(this).val()[i] === settings.decimal) {
                    if (settings.integer || dotAlready) {
                        $(this).stripOut(i);
                        i--;
                    } else {
                        dotAlready = true;
                    }
                } else {
                    $(this).stripOut(i); //anything else
                    i--;
                }
            }
        });

        return this;
    };
}(jQuery));
