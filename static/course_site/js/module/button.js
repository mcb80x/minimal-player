/**
 * Button Module
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */
var Button = function (undefined) {
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
        $(document).on('click', 'button.btn-dropdown', _toggleButtonDropdown);
        $(document).on('click', 'button.btn-split',    _toggleButtonDropdown);
        $(document).on('click', _documentClick)
    };

    // Close All Dropdowns
    var _closeAll = function() {
        var all_active_dropdown_buttons = $('button.btn-dropdown.active, button.btn-split.active');
        if (all_active_dropdown_buttons.length) {
            all_active_dropdown_buttons.removeClass('active');
            all_active_dropdown_buttons.next('ul').hide();
        }
    };


    // toggle dropdown menu
    var _toggleButtonDropdown = function(evt) {
        evt.stopPropagation();

        var button = $(this);

        if (button.hasClass('active')) {
            button.removeClass('active');
            button.next('ul').hide();
        } else {
            _closeAll();

            button.addClass('active');
            button.next('ul').show();
        }
    };

    // document click
    var _documentClick = function(evt) {
        _closeAll();
    }
};