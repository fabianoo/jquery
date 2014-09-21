/**
 * Collapsable Elements - Luan Nico
 * github.com/luanpotter/jquery
 * Version: 0.1
 */

(function ($) {
    "use strict";

    $.setupCollapsables = function (options) {
        var settings = $.extend({
            labels: ['Collapse', 'Expand'],
            attr : 'collapsable-for'
        }, options);

        var selector = '[data-' + settings.attr + ']';
        var getCollapsableEl = function (el) {
          return $('#' + el.data(settings.attr));
        };
        var getLabel = function(el) {
          return settings.labels[el.is(':visible') ? 0 : 1];
        };
        $(document).ready(function () {
          $(selector).each(function() {
            var el = getCollapsableEl($(this));
            $(this).text(getLabel(el));
          });
        });
        $(document).on('click', selector, function() {
          var el = getCollapsableEl($(this));
          el.toggle();
          $(this).text(getLabel(el));
        });
    };
}(jQuery));
