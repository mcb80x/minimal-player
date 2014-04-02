/**
 * Tab Module
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */
var Tab = function (undefined) {
    var SELF = this;

    // Main
    this.init = function() {
        _cacheElements();
        _bindEvents();
    };

    this.update = function() {
        _buildTab();
    };

    // Cache Dom Elements
    var _cacheElements = function() {
    };

    // Attach Events
    var _bindEvents = function() {
        $(document).on('click', 'div.tab-menu li', _tabMenuClick);
    };

    // build default opened tab
    var _buildTab = function() {
        $('.tab-menu > ul').each(function() {
            var default_menu = $(this).children('.active:first');
            if (!default_menu.length) {
                default_menu = $(this).children().first();
            }

            default_menu.trigger('click');
        });
    };

    // click handler for tab menu
    var _tabMenuClick = function(evt) {
        var menu_clicked   = $(this);
        var menu_index     = menu_clicked.index();
        var menu_container = menu_clicked.parents('.tab:first');

        menu_container.find('.tab-menu li.active').removeClass('active');
        menu_clicked.addClass('active');

        menu_container.find('.tab-content > div.active').removeClass('active');
        menu_container.find('.tab-content > div').eq(menu_index).addClass('active');
    };
};