/**
 * Masked Field - Luan Nico
 * Strongly based upon Igor Escobar's jquery.mask.js
 * Copyright (c) 2012 Igor Escobar http://blog.igorescobar.com [The MIT License]
 * Link to original plugin: https://github.com/igorescobar/jQuery-Mask-Plugin
 * github.com/luanpotter/jquery
 * Version: 0.2
 * Dependencies: cursor_position.js
 *
 * Changes to original version:
 *
 * Added maskCompleted function to tell whether the mask is complete or not.
 * Added on('input') handler along with on('keyup') to speed up process in newer browsers
 * Extracted carret position functions to use those of cursor_position.js
 */

(function ($) {
    "use strict";
    var Mask = function (el, mask, options) {
        var jMask = this, old_value;
        el = $(el);

        mask = typeof mask === "function" ? mask(el.val(), undefined, el,  options) : mask;

        jMask.init = function() {
            options = options || {};

            jMask.byPassKeys = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91];
            jMask.translation = {
                '0': {pattern: /\d/},
                '9': {pattern: /\d/, optional: true},
                '#': {pattern: /\d/, recursive: true},
                'A': {pattern: /[a-zA-Z0-9]/},
                'S': {pattern: /[a-zA-Z]/}
            };

            jMask.translation = $.extend({}, jMask.translation, options.translation);
            jMask = $.extend(true, {}, jMask, options);

            el.each(function() {
                if (options.maxlength !== false) {
                    el.attr('maxlength', mask.length);
                }

                el.attr('autocomplete', 'off');
                p.destroyEvents();
                p.events();
                p.val(p.getMasked());
            });
        };

        var p = {
            events: function() {
                el.on('keydown.mask', function() {
                    old_value = p.val();
                });
                el.on('input.mask keyup.mask', p.behaviour);
                el.on("paste.mask", function() {
                    setTimeout(function() {
                        el.keydown().keyup();
                    }, 100);
                });
            },
            destroyEvents: function() {
                el.off('keydown.mask input.mask keyup.mask paste.mask');
            },
            completed: function() {
            	return p.val().length === mask.length;
            },
            val: function(v) {
                var isInput = el.is('input');
                return arguments.length > 0 
                    ? (isInput ? el.val(v) : el.text(v)) 
                    : (isInput ? el.val() : el.text());
            },
            behaviour: function(e) {
                e = e || window.event;
                var keyCode = e.keyCode || e.which;
                if ($.inArray(keyCode, jMask.byPassKeys) === -1) {

                    var changeCaret, caretPos = el.getCursorPosition();
                    if (caretPos < p.val().length) {
                        changeCaret = true;
                    }

                    var new_val = p.getMasked();
                    if (new_val !== p.val())               
                        p.val(new_val);

                    // change caret but avoid CTRL+A
                    if (changeCaret && !(keyCode === 65 && e.ctrlKey)) {
                        el.setCursorPosition(caretPos);     
                    }

                    return p.callbacks(e);
                }
            },
            getMasked: function (skipMaskChars) {
                var buf = [],
                    value = p.val(),
                    m = 0, maskLen = mask.length,
                    v = 0, valLen = value.length,
                    offset = 1, addMethod = "push",
                    resetPos = -1,
                    lastMaskChar,
                    check;

                if (options.reverse) {
                    addMethod = "unshift";
                    offset = -1;
                    lastMaskChar = 0;
                    m = maskLen - 1;
                    v = valLen - 1;
                    check = function () {
                        return m > -1 && v > -1;
                    };
                } else {
                    lastMaskChar = maskLen - 1;
                    check = function () {
                        return m < maskLen && v < valLen;
                    };
                }

                while (check()) {
                    var maskDigit = mask.charAt(m),
                        valDigit = value.charAt(v),
                        translation = jMask.translation[maskDigit];

                    if (translation) {
                        if (valDigit.match(translation.pattern)) {
                            buf[addMethod](valDigit);
                             if (translation.recursive) {
                                if (resetPos === -1) {
                                    resetPos = m;
                                } else if (m === lastMaskChar) {
                                    m = resetPos - offset;
                                }

                                if (lastMaskChar === resetPos) {
                                    m -= offset;
                                }
                            }
                            m += offset;
                        } else if (translation.optional) {
                            m += offset;
                            v -= offset;
                        }
                        v += offset;
                    } else {
                        if (!skipMaskChars) {
                            buf[addMethod](maskDigit);
                        }
                        
                        if (valDigit === maskDigit) {
                            v += offset;
                        }

                        m += offset;
                    }
                }
                
                var lastMaskCharDigit = mask.charAt(lastMaskChar);
                if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
                    buf.push(lastMaskCharDigit);
                }
                
                return buf.join("");
            },
            callbacks: function (e) {
                var val = p.val(),
                    changed = p.val() !== old_value;
                if (changed === true) {
                    if (typeof options.onChange === "function") {
                        options.onChange(val, e, el, options);
                    }
                }

                if (changed === true && typeof options.onKeyPress === "function") {
                    options.onKeyPress(val, e, el, options);
                }

                if (typeof options.onComplete === "function" && val.length === mask.length) {
                    options.onComplete(val, e, el, options);
                }
            }
        };

        // public methods
        jMask.remove = function() {
          p.destroyEvents();
          p.val(jMask.getCleanVal()).removeAttr('maxlength');
        };

        // get value without mask
        jMask.getCleanVal = function() {
           return p.getMasked(true);
        };

        jMask.completed = function() {
        	return p.completed();
        }

        jMask.init();
    };

    $.fn.mask = function(mask, options) {
        return this.each(function() {
            $(this).data('mask', new Mask(this, mask, options));
        });
    };

    $.fn.unmask = function() {
        return this.each(function() {
            try {
                $(this).data('mask').remove();
            } catch (e) {}
        });
    };

    $.fn.cleanVal = function() { //override default val() function
        return $(this).data('mask').getCleanVal();
    };

    $.fn.maskCompleted = function() {
    	return $(this).data('mask').completed();
    };

    // looking for inputs with data-mask attribute
    $('*[data-mask]').each(function() {
        var input = $(this),
            options = {};

        if (input.attr('data-mask-reverse') === 'true') {
            options.reverse = true;
        }

        if (input.attr('data-mask-maxlength') === 'false') {
            options.maxlength = false;
        }

        input.mask(input.attr('data-mask'), options);
    });

})(window.jQuery || window.Zepto);