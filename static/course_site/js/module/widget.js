/**
 * Widget Module
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */
var Widget = function (undefined) {
    var SELF = this;

    // Main
    this.init = function() {
        _cacheElements();
        _bindEvents();
    };

    this.update = function() {
        _bindOneOffEvents();
    };

    // Cache Dom Elements
    var _cacheElements = function() {
    };

    // Attach Events
    var _bindEvents = function() {
        $(document).on('click', 'div.dashboard-widget button.setting', _settingClick);
        $(document).on('click', 'div.dashboard-widget button.refresh', _refreshClick);
        $(document).on('click', 'div.dashboard-widget button.toggle',  _toggleClick);
    };

    // bind one off events, these events need to be reattached on ajax update
    var _bindOneOffEvents = function() {
        var sortable_containers = $('.dashboard-widget-sortable');

        sortable_containers.sortable({
            'items':       '.dashboard-widget',
            'connectWith': '.dashboard-widget-sortable',
            'placeholder': 'sortable-placeholder',
            'tolerance':   'pointer',
            'handle':      '.title',
            'dropOnEmpty': true,
            'start':       function(evt, ui) {
                sortable_containers.css('min-height', 40);
            },
            'stop':        function(evt, ui) {
                sortable_containers.css('min-height', '');
            }
        });
    };

    var _settingClick = function(evt) {
    };

    var _refreshClick = function(evt) {
        var icon = $(this).children('i');
        icon.addClass('icon-spin');

        setTimeout(function() {
            icon.removeClass('icon-spin');
        }, 2000);
    };

    var _toggleClick = function(evt) {
        var button = $(this);
        var widget = button.parents('.dashboard-widget:first');
        if (widget.hasClass('dashboard-widget-closed')) {
            button.data('tooltip', 'Close');
            button.children('i').attr('class', 'icon-chevron-down');
            widget.removeClass('dashboard-widget-closed');
        } else {
            button.data('tooltip', 'Open');
            button.children('i').attr('class', 'icon-chevron-up');
            widget.addClass('dashboard-widget-closed');
        }

        button.trigger('mouseleave');
    };
};