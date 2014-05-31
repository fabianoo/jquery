/**
 * String Validation - Luan Nico
 * github.com/luanpotter/jquery
 * Version: 0.1
 * Dependencies: cursor_position.js
 *
 * Tutorial:
 *
 * If null or '', allow anything
 * Otherwise, parse per word; each word can be:
 * * A pre-def, including: down_letters, up_letters, letters, digits, ponctuations, invalids, space
 * * An array of chars: [aeiou], [13579] (Except spaces and brackets, see below!)
 * * Any of the previus preceded with ^ (not) symbol
 * So for example:
 * * letters ^[aeiouAEIOU]: any consonant
 * * letters digits ^[0kyx]: any letter or digit, except 0, k, y and x
 * * ^invalids: any characters, except invalid characters
 * IMPORTANT NOTE: The array notation cannot contain the characters space and brackets ([, ])! Use the space, brl, brr, brackets pre-def if you want; e.g.:
 * * [abc ] -> [abc] space
 * * ^[xyz ] -> ^[xyz] ^space
 * * [abc]] -> [abc] brr
 */

(function ($) {
    "use strict";

    $.fn.validateString = function (words) {
        var allow_array = function(field, array, allow) {
            var i;
            for (i = 0; i < field.val().length; i++) {
                if(($.inArray(field.val()[i], array) != -1) != allow) {
                    field.stripOut(i);
                    i--;
                }
            }
        };

        var add_to_array = function (word, array) {
            if (word[0] === '[') {
                if (word[word.length - 1] !== ']')
                    throw new Error("Invalid set notation word: missing closing bracket.");
                jQuery.merge(array, word.substring(1, word.length - 1).split(''));
            } else if (word in PREDEF) {
                jQuery.merge(array, PREDEF[word]);
            } else {
                throw new Error("Invalid pre-def word: " + word);
            }
        };

        var PREDEF = {
            letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            down_letters: 'abcdefghijklmnopqrstuvwxyz'.split(''),
            up_letters:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            digits: '0123456789'.split(''),
            ponctuations: '.,:;!?()-'.split(''),
            invalids: '\\/<>\'"'.split(''),
            space: [' '],
            brl: ['['],
            brr: [']'],
            brackets: ['[', ']']
        };

        var add = [], remove = [];
        $.each(words.split(" "), function (index, word) {
            if (word[0] === '^') {
                add_to_array(word.substring(1), remove);
            } else {
                add_to_array(word, add);
            }
        });

        var diff = $(add).not(remove).get();

        this.bind('input keyup keydown', function () {
            if (diff.length === 0) {
                allow_array($(this), remove, false);
            } else {
                allow_array($(this), diff, true);
            }
        });

        return this;
    };
}(jQuery));
