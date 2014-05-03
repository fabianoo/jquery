/**
 * Cursor Position - Luan Nico
 * github.com/luanpotter/jquery
 * Version: 0.1
 */

(function ($) {
    "use strict";

    $.fn.getCursorPosition = function () {
        var el = $(this).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var sel = document.selection.createRange();
            var selLength = document.selection.createRange().text.length;
            sel.moveStart('character', -el.value.length);
            pos = sel.text.length - selLength;
        }
        return pos;
    };

    $.fn.setCursorPosition = function (pos) {
        this.each(function (index, elem) {
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

    $.fn.stripOut = function (pos) {
        var a = this.getCursorPosition();
        this.val(this.val().substring(0, pos) + this.val().substring(pos + 1));
        this.setCursorPosition(a - 1);

        return this;
    };
}(jQuery));