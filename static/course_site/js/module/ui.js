/**
 * Tooltip Module
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */
var UI = function (undefined) {
    var SELF = this;

    // Main
    this.init = function() {
        _cacheElements();
        _bindEvents();
    };

    this.update = function() {
        _initStartRaring();
        _initTotoList();
        _initSlider();
    };

    // Cache Dom Elements
    var _cacheElements = function() {
    };

    // Attach Events
    var _bindEvents = function() {
        // star rating
        $(document).on('mouseenter', 'div.star-rating i',       starRatingMouseEnter);
        $(document).on('mouseleave', 'div.star-rating',         starRatingMouseLeave);
        $(document).on('click',      'div.star-rating i',       starRatingClick);

        // todo list
        $(document).on('click',      'div.todo input:checkbox', todoListCheck);

        // Alert
        $(document).on('click',      'div.alert button.close, div.info button.close, div.note button.close', alertClose);
    };

    var starRatingMouseEnter = function(evt) {
        $(this).attr('class', 'icon-star');
        $(this).prevAll().attr('class', 'icon-star');
        $(this).nextAll().attr('class', 'icon-star-empty');
    };

    var starRatingMouseLeave = function(evt) {
        var rating = $(this).data('rating');

        if (rating > 0) {
            $(this).children(':lt(' + rating + ')').attr('class', 'icon-star');
            $(this).children(':gt(' + (rating - 1) + ')').attr('class', 'icon-star-empty');
        } else {
            $(this).children().attr('class', 'icon-star-empty');
        }
    };

    var starRatingClick = function(evt) {
        $(this).parent().data('rating', $(this).index() + 1)
    };

    var todoListCheck = function(evt) {
        if ($(this).is(':checked')) {
            $(this).parent().parent().addClass('checked');
        } else {
            $(this).parent().parent().removeClass('checked');
        }
    };

    // close alert, info bar
    var alertClose = function(evt) {
        $(this).trigger('mouseleave');
        $(this).parent().remove();
    };

    // make todo list sortable
    var _initTotoList = function() {
        $('div.todo').sortable({
            'item': '.todo-item'
        });
    };

    // set default rating
    var _initStartRaring = function() {
        $('div.star-rating').each(function() {
            var rating = $(this).children('i.icon-star:last').index() + 1;
            $(this).data('rating', rating);
        });
    };

    // jQuery UI Sliders
    var _initSlider = function() {
        $('div.slider').each(function() {
            var element = $(this);
            var helper  = null;

            // set orientation to a variable so that we dont need to query .data over and over in slider()
            var orientation = element.data('orientation');

            element.slider({
                min:         element.data('min') ? element.data('min') : 0,
                max:         element.data('max') ? element.data('max') : 100,
                range:       element.data('range') ? true : false,
                values:      element.data('values') ? element.data('values').split(',') : null,
                value:       element.data('value') ? element.data('value') : 0,
                orientation: orientation,
                stop:        function(evt, ui) {
                    helper.remove();
                    helper = null;
                },
                slide:       function(evt, ui) {
                    if (!helper) {
                        helper = $('<div>').addClass('slider-helper slider-helper-' + element.data('orientation')).appendTo(element);
                    }

                    helper.text(ui.value);
                    if (orientation === 'vertical') {
                        helper.css('top', ui.handle.offsetTop);
                    } else {
                        helper.css('left', ui.handle.offsetLeft);
                    }
                }
            });
        });
    };
};