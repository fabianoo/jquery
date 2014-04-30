// - Numeric Field - Luan Nico
// - github.com/luanpotter/jquery
// - Version: 0.2

(function( $ ) {

    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    };

    $.fn.setCursorPosition = function(pos) {
        this.each(function(index, elem) {
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        });
        return this;
    };

    $.fn.stripOut = function(pos) {
        var a = this.getCursorPosition();
        this.val(this.val().substring(0, pos) + this.val().substring(pos + 1));
        this.setCursorPosition(a - 1);

        return this;
    };

    $.fn.numericField = function(options) {
        var settings = $.extend({
            integer: true, //If it has to be an integer or can be a rational
            min: null, //The minimum value, inclusive
            max: null, //The maxmum value, inclusive
            decimal: '.', //The decimal separator
            auto_update: false //If the field should auto update to fit min and max on blur
        }, options);

        var NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        if (settings['auto_update'] && (settings['min'] != null || settings['max'] != null)) {
            this.bind('blur', function() {
                var num = parseFloat($(this).val());
                if (settings['min'] != null && num < settings['min'])
                    $(this).val(settings['min']);
                else if (settings['max'] != null && num > settings['max'])
                    $(this).val(settings['max']);
            });
        }

        this.bind('input keyup keydown', function() {
            //strip invalid characters
            i = 0;

            //check for negative sign
            if ($(this).val()[0] == '-') {
                if (settings['min'] != null && settings['min'] >= 0)
                    $(this).stripOut(0);
                else
                    i++;
            }

            dotAlready = false;
            for (; i < $(this).val().length; i++) {
                if ($(this).val()[i] in NUMBERS)
                    continue;
                if ($(this).val()[i] == settings['decimal']) {
                    if (settings['integer'] || dotAlready) {
                        $(this).stripOut(i);
                        i--;
                    } else
                        dotAlready = true;
                } else {
                    $(this).stripOut(i); //anything else
                    i--;
                }
            }
        });

        return this;
    };
}( jQuery ));
