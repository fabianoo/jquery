/**
 * Cursor Position - Luan Nico
 * github.com/luanpotter/jquery
 * Version: 0.1
 */

(function ($) {
    "use strict";

    const normalize = (e, pos, len) => {
        return e < pos ? e : e + len;
    };

    $.fn.getCursorPosition = function () {
        var el = $(this).get(0);
        return el.selectionStart;
    };

    $.fn.getCursorRange = function () {
        var el = $(this).get(0);
        return [ el.selectionStart, el.selectionEnd ];
    };

    $.fn.setCursorPosition = function (posParam) {
        var pos = !Array.isArray(posParam) ? [posParam, posParam] : posParam;
        this.each(function (index, elem) {
            elem.setSelectionRange(pos[0], pos[1]);
        });
        return this;
    };

    $.fn.setCursorRange = $.fn.setCursorPosition;

    $.fn.stripOut = function (pos) {
        var a = this.getCursorRange();
        this.val(this.val().substring(0, pos) + this.val().substring(pos + 1));
        var newPos = a.map(e => normalize(e, pos, -1));
        this.setCursorRange(newPos);

        return this;
    };

    $.fn.appendIn = function (pos, text) {
        var a = this.getCursorRange();
        this.val(this.val().substring(0, pos) + text + this.val().substring(pos));
        var newPos = a.map(e => normalize(e, pos, text.length));
        this.setCursorRange(newPos);

        return this;
    };
}(jQuery));