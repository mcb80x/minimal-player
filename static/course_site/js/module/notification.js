/**
 * Notification Module
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */
var Notification = function (undefined) {
    var SELF = this;

    var container = null;  // notification container
    var notification_count = 0;

    // Attach Events
    var _bindEvents = function() {
        $(document).on('click', 'div.notification div.close', closeNotification);
    };

    // build a notification element and add it to the document
    var buildNotification = function(notification) {
        // build container
        if (!container) {
            container = $('<div>').addClass('notification-container').appendTo($(document.body));
        }

        var notification_html = '<div class="close"><i class="icon-remove"></i></div>';

        // title is optional
        if (notification.title) {
            notification_html += '<div class="title">' + notification.title + '</div>';
        }

        // content is mandatory
        notification_html += '<div class="content">' + notification.content + '</div>';

        var notification_element = $('<div>').html(notification_html).addClass('notification').prependTo(container);

        // close notification automatically after xx secnods
        if (notification.countdown > 0) {
            var timeout_id = setTimeout(function() {
                notification_element.children('div.close').trigger('click');
            }, notification.countdown);

            notification_element.data('timeout_id', timeout_id);
        }

        notification_count++;
    };

    // close a notification
    var closeNotification = function(evt) {
        notification_count--;

        var notification = $(this).parent();

        App.transitionEnd(notification, function(evt, element) {
            element.remove();

            if (notification_count <= 0) {
                container.remove();
                container = null;
            }
        }).addClass('closing');

        // clear countdown timeout
        if (notification.data('timeout_id')) {
            clearTimeout(notification.data('timeout_id'));
        }
    };

    // Main
    this.init = function() {
        _bindEvents();
    };

    /*
    ======================================
    API
    ======================================
    */

    // add a notification
    this.add = function(title, content, countdown) {
        if (countdown === undefined) {
            countdown = -1;
        }

        buildNotification({
            title:     title,
            content:   content,
            countdown: parseInt(countdown, 10)
        });
    };

    // remove all notifications
    this.removeAll = function() {
        if (!container) {
            return;
        }

        container.find('div.notification > div.close').trigger('click');
    };

    // remove the last notification
    this.removeLast = function() {
        if (!container) {
            return;
        }

        container.find('div.notification:first > div.close').trigger('click');
    };

    // remove the first notification
    this.removeFirst = function() {
        if (!container) {
            return;
        }

        container.find('div.notification:last > div.close').trigger('click');
    };

    // remove a specific notification
    this.removeAt = function(index) {
        if (!container) {
            return;
        }

        var total = container.children('div.notification').length;
        container.find('div.notification:nth-child(' + (total - index) + ') > div.close').trigger('click');
    };
};