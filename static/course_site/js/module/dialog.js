/**
 * Dialog Module
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */
var Dialog = function (undefined) {
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
        $(document).on('click', 'div.dialog > div.title button', SELF.close)
    };

    var _updateCountDown = function(button) {
        var countdown = button.data('countdown');

        if (countdown <= 1 ) {
            button.data('countdown', false);
            button.find('span.countdown').remove();
        } else {
            countdown--;

            button.data('countdown', countdown)
            button.find('span.countdown').text('(' + countdown + ')');

            setTimeout(function() {
                _updateCountDown(button);
            }, 1000);
        }
    };

    /*
    ======================================
    API
    ======================================
    */

    /* Open a dialog */
    this.open = function(opts) {
        App.showOverlay();

        var dialog_width     = opts.width   === undefined ? 400      : parseInt(opts.width, 10);
        var dialog_title     = opts.title   === undefined ? ''       : opts.title;
        var dialog_content   = opts.content === undefined ? ''       : opts.content;
        var dialog_theme     = opts.theme   === undefined ? 'normal' : opts.theme;
        var dialog_draggable = opts.theme   === undefined ? false    : opts.draggable;

        var dialog      = $('<div>').addClass('dialog dialog-' + dialog_theme);
        var dialog_html = '<div class="title text-overflow">' + dialog_title + '<button title="Close"><i class="icon-remove"></i></button></div>' +
                          '<div class="content"><div>' + dialog_content + '</div></div>' +
                          '<div class="button">';

        if (opts.buttons !== undefined) {
            $(opts.buttons).each(function() {
                dialog_html += '<button class="btn btn-small btn-' + dialog_theme + '">' + (this.icon ? '<i class="' + this.icon + '"></i> ' : '') + this.text + (this.countdown ? '<span class="countdown">(' + this.countdown + ')</span>' : '') + '</button>';
            });
        }

        dialog_html +=    '</div>';

        dialog.css({
            'width':       dialog_width,
            'margin-left': dialog_width / 2 * -1
        });

        dialog.html(dialog_html);

        // set click handlers for buttons
        if (opts.buttons !== undefined) {
            $(opts.buttons).each(function(index) {
                var click_handler = this.click;
                var button        = dialog.children('div.button').children('button').eq(index);

                button.on('click', function(evt) {
                    if (button.data('countdown')) {
                        // do nothing
                    } else {
                        click_handler(evt, button, dialog);
                    }
                });

                if (this.countdown) {
                    button.data('countdown', parseInt(this.countdown, 10));

                    setTimeout(function() {
                        _updateCountDown(button);
                    }, 1000);
                }
            });
        }

        // add to the document
        dialog.appendTo($(document.body));

        if (dialog_draggable) {
            dialog
                .addClass('dialog-draggable')
                .draggable({
                    handle: dialog.children('.title'),
                    containment: $(document.body),
                    start:  function(evt, ui) {
                        dialog.addClass('dialog-dragging');
                    },
                    stop:   function(evt, ui) {
                        dialog.removeClass('dialog-dragging');
                    }
                });
        }
    };

    // close all active dialogs
    this.close = function() {
        App.transitionEnd($('div.dialog'), function(evt, element) {
            App.hideOverlay();
            $('div.dialog').remove();
        }).addClass('dialog-closing');
    };
};