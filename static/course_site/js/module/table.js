/**
 * Table Module
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */
var Table = function (undefined) {
    var SELF = this;

    // Main
    this.init = function() {
        _cacheElements();
        _bindEvents();
    };

    // Cache Dom Elements
    var _cacheElements = function() {
    };

    // Attach Events
    var _bindEvents = function() {
        $(document).on('mouseenter', 'div.data-table > table tbody th', _mouseEnter);
        $(document).on('mouseleave', 'div.data-table > table tbody th', _mouseLeave);
        $(document).on('click',      'div.data-table > table tbody th input:checkbox', _selectAll);
    };

    var _mouseEnter = function(evt) {
        var cell = $(this);

        if (!cell.children('.icon-sort').length) {
            return;
        }

        if (!cell.data('columns')) {
            var index = cell.index();
            cell.data('columns', cell.parents('table:first').find('tbody td:nth-child(' + (index + 1) + ')'));
        }

        cell.addClass('hover');
        cell.data('columns').addClass('hover');
    };

    var _mouseLeave = function(evt) {
        var cell  = $(this);

        if (!cell.children('.icon-sort').length) {
            return;
        }

        if (!cell.data('columns')) {
            var index = cell.index();
            cell.data('columns', cell.parents('table:first').find('tbody td:nth-child(' + (index + 1) + ')'));
        }

        cell.removeClass('hover');
        cell.data('columns').removeClass('hover');
    };

    var _selectAll = function(evt) {
        var checkbox_all = $(this);

        if (!checkbox_all.data('checkboxes')) {
            var index = checkbox_all.index();
            checkbox_all.data('checkboxes', checkbox_all.parents('table:first').find('tbody td:nth-child(' + (index + 1) + ')').children('input:checkbox'));
        }

        checkbox_all.data('checkboxes').prop('checked', checkbox_all.prop('checked'));
    };
};