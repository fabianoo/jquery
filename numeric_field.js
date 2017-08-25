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
            maxDec: null, // The maximum amount of decimal places, if any
            decimal: '.', //The decimal separator
            thousands: null, //Thousands separator, if desired
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

        var everyThree = function (x, c) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, c);
        };

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
            var dotPosition;
            for (; i < $(this).val().length; i++) {
                if ($(this).val()[i] in NUMBERS) {
                    if (settings.maxDec && dotAlready && (i - dotPosition) > settings.maxDec) {
                        $(this).stripOut(i);
                    }
                    continue;
                }
                if ($(this).val()[i] === settings.thousands) {
                    $(this).stripOut(i);
                    continue;
                }
                if ($(this).val()[i] === settings.decimal) {
                    if (settings.integer || dotAlready) {
                        $(this).stripOut(i);
                        i--;
                    } else {
                        dotAlready = true;
                        dotPosition = i;
                    }
                } else {
                    $(this).stripOut(i); //anything else
                    i--;
                }
            }

            var endIntegerPart = $(this).val().indexOf(settings.decimal);
            if (endIntegerPart === -1) {
                endIntegerPart = $(this).val().length;
            }

            for (i = endIntegerPart - 3; i > 0; i -= 3) {
                $(this).appendIn(i, settings.thousands);
            }
        });

        return this;
    };
}(jQuery));