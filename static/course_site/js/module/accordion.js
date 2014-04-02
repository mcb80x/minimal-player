/**
 * Accordion Module
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */
var Accordion = function (undefined) {
    var SELF = this;
    var animation_speed = 200;

    // Main
    this.init = function() {
        _cacheElements();
        _bindEvents();
    };

    this.update = function() {
        _openDefault();
    };

    // Cache Dom Elements
    var _cacheElements = function() {
    };

    // Attach Events
    var _bindEvents = function() {
        $(document).on('click', '.accordion-menu', _accordionMenuClick);
    };

    var _accordionMenuClick = function(evt) {
        var menu        = $(this).parent();
        var active_menu = menu.parent().children('div.active');

        if (menu.hasClass('active')) {
            menu.removeClass('active');
            menu.children('.accordion-content').slideUp(animation_speed);
        } else {
            menu.addClass('active');
            menu.children('.accordion-content').slideDown(animation_speed);

            active_menu.removeClass('active');
            active_menu.children('.accordion-content').slideUp(animation_speed);
        }
    };

    // open default menu
    var _openDefault = function() {
        $('div.accordion').children('div.open').removeClass('open').children().click();
    };
};