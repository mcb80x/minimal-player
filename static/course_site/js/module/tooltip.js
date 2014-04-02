/**
 * Tooltip Module
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */
var Tooltip = function (undefined) {
    var SELF = this;
    var _elements = null;

    // Main
    this.init = function() {
    };

    this.update = function() {
        _cacheElements();
        _bindEvents();
        _buildTooltip();
    };

    // Cache Dom Elements
    var _cacheElements = function() {
        _elements = $('[title]');
    };

    // Attach Events
    var _bindEvents = function() {
        _elements.on('mouseenter', _mouseEnter);
        _elements.on('mouseleave', _mouseLeave);
    };

    var _buildTooltip = function() {
        _elements.each(function() {
            var tooltip  = $(this).attr('title').split('||');
            var position = 'top';
            if (tooltip.length === 2) {
                position = tooltip[1];
                tooltip = tooltip[0];
            }

            $(this).data('tooltip', tooltip).data('tooltipPosition', position).removeAttr('title');
        });
    };

    var _mouseEnter = function(evt) {
        var target_element  = $(this);
        var tooltip_element = $('<div>').addClass('tooltip tooltip-' + target_element.data('tooltipPosition')).text(target_element.data('tooltip')).appendTo($(document.body));
        var tooltip_arrow   = $('<div>').addClass('tooltip-arrow').appendTo(tooltip_element);
        target_element.data('tooltip_element', tooltip_element);

        var main  = {
            my: 'center bottom-12',
            at: 'center top'
        };

        switch (target_element.data('tooltipPosition')) {
            case 'bottom':
                main  = {
                    my: 'center top+12',
                    at: 'center bottom'
                };
                break;
            case 'left':
                main  = {
                    my: 'right-12 center',
                    at: 'left  center'
                };
                break;
            case 'right':
                main  = {
                    my: 'left+12 center',
                    at: 'right  center'
                };
                break;
        }

        tooltip_element.position({
            of:        target_element,
            my:        main.my,
            at:        main.at,
            collision: 'none'
        });
    };

    var _mouseLeave = function(evt) {
        var tooltip_element = $(this).data('tooltip_element');
        if (tooltip_element) {
            tooltip_element.remove();
            $(this).data('tooltip_element', false);
        }
    };
};