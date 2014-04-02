/**
 * MelonHTML5 Admin
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */

var Application = function(undefined) {
    var SELF    = this;

    // App Config
    var config = {
        version:        '1.00',           // APP Version
        page_dir:       '/',    // page dir (setting to empty string to be able to use absolute URls)
        spa:            true,             // is Single Page App?
        portrait_width: 768               // device width
    };

    // DOM
    var _header                   = null;
    var _nav                      = null;
    var _nav_menu                 = null;
    var _main_content             = null; // page content
    var _portrait_mode_detector   = null; // detect if media query for phone is appied or not
    var _overlay                  = null; // overlay element
    var _lock                     = null; // lock screen

    // Flag
    var _ui_mode                  = null; // portrait?

    var _app_start_time           = (new Date()).getTime();
    var _loading_delay            = 2000; // 2000 ms: loading screen stays for at least 2000 ms
    var _default_page_open        = false;

    var _page_cache               = {};   // cache page contents

    var ie6                       = (navigator.appVersion.indexOf('MSIE 6.') != -1)  ? true : false;
    var ie7                       = (navigator.appVersion.indexOf('MSIE 7.') != -1)  ? true : false;
    var ie8                       = (navigator.appVersion.indexOf('MSIE 8.') != -1)  ? true : false;

    // init all modules
    var _initModules = function() {
        SELF.ui = new UI();
        SELF.ui.init();

        SELF.tooltip = new Tooltip();
        SELF.tooltip .init();

        SELF.widget = new Widget();
        SELF.widget.init();

        SELF.tab = new Tab();
        SELF.tab.init();

        SELF.accordion = new Accordion();
        SELF.accordion.init();

        SELF.form = new Form();
        SELF.form.init();

        SELF.dialog = new Dialog();
        SELF.dialog.init();

        SELF.button = new Button();
        SELF.button.init();

        SELF.notification = new Notification();
        SELF.notification.init();

        SELF.table = new Table();
        SELF.table.init();

        if (!config.spa) {
            _updateModules();
        }
    };

    // update js modules after ajax page load
    var _updateModules = function() {
        SELF.ui.update();
        SELF.tooltip.update();
        SELF.widget.update();
        SELF.tab.update();
        SELF.accordion.update();
        SELF.form.update();
    };

    // Cache Dom Elements
    var _cacheElements = function() {
        _header                 = $('#header');
        _nav                    = $('#nav');
        _nav_menu               = $('ul.navigation a');
        _main_content           = $('#main');
        _portrait_mode_detector = $('#portrait_mode_detector');
    };

    // Attach Events
    var _bindEvents = function() {
        _nav_menu.on('click',                   Events.navMenuClick);
        $(document).on('click', '.menu-switch', Events.navSwitchClick);
        $(window).on('resize',     Events.windowResize);

        if (config.spa) {
            $(window).on('hashchange', Events.hashChange);
        }
    };

    // build menu scrolling
    var _buildMenuScrolling = function() {
        // touch devices don't need nice scrolling
        if (Modernizr.touch) {
            return;
        }

        // webkit browsers on Mac have hidden scrollbars, so use it
        if (navigator.userAgent.indexOf('Mac OS') !== -1 && navigator.userAgent.indexOf('AppleWebKit') !== -1) {
            _nav.css('overflow', 'auto');
            return;
        }

        _nav.on('mousewheel DOMMouseScroll', Events.navScroll);
    };

    // open a page on init load
    var _openDefaultPage = function() {
            var active_page = _nav_menu.filter('.active:first');
            if (!active_page.length) {
                if (Events.hashChange()) {
                    return;
                } else {
                    active_page = _nav_menu.first();
                }
            }

            active_page.trigger('click');
    };

    // set UI mode
    var _setMode = function() {
        if (SELF.isPortraitMode()) {
            $(document.body).addClass('nav-closed');
            $(document.body).addClass('portrait');
            _ui_mode = 'portrait';
        } else {
            $(document.body).removeClass('nav-closed');
            $(document.body).removeClass('portrait');
            _ui_mode = null;
        }
    };

    // Event Handlers
    var Events = {
        // mouse scroll handler of the navigation menu
        navScroll: function(evt) {
            if (SELF.isPortraitMode()) {
                evt.preventDefault();
            }

            if (evt.originalEvent.wheelDelta !== undefined) {
                var scroll_direction = evt.originalEvent.wheelDelta <  0 ? 'down' : 'up';
            } else {
                var scroll_direction = evt.originalEvent.detail >  0 ? 'down' : 'up';
            }

            if (scroll_direction === 'up') {
                var scroll_top = _nav.scrollTop() - 20;
            } else {
                var scroll_top = _nav.scrollTop() + 20;
            }

            _nav.scrollTop(scroll_top);
        },

        // click handler of the navigation menu
        navMenuClick: function(evt) {
            evt.preventDefault(); // no hash change

            var menu     = $(this);
            var sub_menu = menu.parent().children('ul.navigation-sub');

            if (sub_menu.length) {
                // clicked top level menu
                if (sub_menu.is(':visible')) {
                    menu.parent().removeClass('open').addClass('close');
                } else {
                    menu.parent().removeClass('close').addClass('open');
                }
            } else {
                _nav_menu.removeClass('active');
                menu.addClass('active');

                if($('.livicon').updateLivicon != undefined){
                    $('.livicon').updateLivicon();
                }

                // clicked a sub menu
                var parent_menu = menu.parents('ul.navigation-sub');
                if (parent_menu.length) {
                    parent_menu.parent()
                        .addClass('open').removeClass('close')
                        .children('a').addClass('active');
                }

                SELF.openPage(menu.attr('href'), menu);


            }
        },

        // click handler of the toggle button
        navSwitchClick: function(evt) {
            SELF.toggleNav();
        },

        // hash change
        // handles back/forward button
        hashChange: function() {
            var found = false;

            _nav_menu.each(function(index) {
                var menu = $(this);

                trimmedHash = window.location.hash.split('/')[1];
                console.log('=============')
                console.log(trimmedHash)

                if (menu.attr('href').replace(/#/, '').replace(/\.(html|php|asp|jsp)/, '') === trimmedHash) {
                    if (!menu.hasClass('active')) {
                        menu.trigger('click');
                        found = true;
                        return false;
                    }
                }
            });

            return found;
        },

        // window resize handler
        // toggle portrai mode
        windowResize: function(evt) {
            var mode = SELF.isPortraitMode() ? 'portrait' : null;

            if (mode !== _ui_mode) {
                _main_content.width('');
                _setMode();
            }
        }
    };

    // modules
    this.ui             = null;
    this.tooltip        = null;
    this.widget         = null;
    this.tab            = null;
    this.accordion      = null;
    this.form           = null;
    this.dialog         = null;
    this.button         = null;
    this.notification   = null;
    this.table          = null;

    this.is_old_ie      = ie6 || ie7 || ie8;

    // main
    this.init = function() {
        _cacheElements();
        _bindEvents();
        _initModules();
        _setMode();

        if (config.spa) {
            _openDefaultPage();
        }
    };

    /*
    ======================================
    API
    ======================================
    */

    // set app configs
    this.setOptions = function(options) {
        if (options.page_dir !== undefined) {
            config.page_dir = options.page_dir;
        }

        if (options.spa !== undefined) {
            config.spa = options.spa;
        }
    };

    // get app configs
    this.getOptions = function() {
        return config;
    };

    this.isPortraitMode = function() {
        if (SELF.is_old_ie) {
            return $(window).width() < config.portrait_width;
        } else {
            return _portrait_mode_detector.is(':visible');
        }
    };

    // toggle navigation bar
    this.toggleNav = function() {
        if ($(document.body).hasClass('nav-closed')) {
            SELF.openNav();
        } else {
            SELF.closeNav();
        }
    };

    // open navigation bar
    this.openNav = function() {
        if (SELF.isPortraitMode()) {
            _main_content.width(_main_content.width());
        }

        $(document.body).removeClass('nav-closed');
    };

    // close navigation bar
    this.closeNav = function() {
        if ($(document.body).hasClass('nav-closed')) {
            return;
        }

        $(document.body).addClass('nav-closed');

        if (SELF.isPortraitMode()) {
            _main_content.width('');
        }
    };

    // set page title
    this.setPageTitle = function(title) {
        document.title = 'MCB80x - ' + title;
    };

    // open a page
    this.openPage = function(page_url, menu) {

        // grab the args, if there are any
        args = window.location.hash.split('?')[1];
        trimmedHash = window.location.hash.split('/')[1];

        if (page_url.indexOf('#') === 0) {
            page_url = page_url.replace(/#/, '');
            proposed_hash = '!/' + page_url.replace(/\.(html|php|asp|jsp)/, '');

            if(proposed_hash.split('/')[1] != trimmedHash){
                window.location.hash = proposed_hash;
            }

            var _updatePage = function(content) {
                _main_content.html(content);
                $(document).scrollTop(0);

                // update modules
                _updateModules();
            };

            fullUrl = config.page_dir + page_url;

            if (args){
                fullUrl += '?' + args;
            }

            console.log('======');
            console.log(fullUrl);

            // DDC: don't cache
            if (false){//_page_cache[page_url] !== undefined) {
                // used the cached content
                _updatePage(_page_cache[page_url]);
            } else {
                // fetch content via AJAX
                $.ajax({
                    type:        'GET',
                    dataType:    'text',
                    url:         fullUrl,
                    cache:       false,
                    beforeSend: function() {
                    },
                    success: function(data, textStatus, jqXHR) {
                        _updatePage(data);

                        // cache page data
                        //_page_cache[page_url] = data;
                        _page_cache[page_url] = undefined;
                    },
                    complete: function(data, textStatus, jqXHR) {
                        if (!_default_page_open) {
                            setTimeout(function() {
                                SELF.transitionEnd($('#loading'), function(evt, element) {
                                    element.remove();
                                }).addClass('closing');
                            }, _loading_delay - ((new Date()).getTime() - _app_start_time));

                            _default_page_open = true;
                        }

                        if(typeof twttr !== 'undefined'){
                            twttr.widgets.load();
                        }
                    }
                });
            }

            // always close menu in portrait mode
            if (SELF.isPortraitMode()) {
                SELF.closeNav();
            }
        } else {
            window.location = page_url;
        }
    };


    // open the overlay
    this.showOverlay = function() {
        if (!_overlay) {
            _overlay = $('<div>').addClass('overlay').appendTo($(document.body));

            return _overlay;
        }
    };

    // close the overlay
    this.hideOverlay = function() {
        if (_overlay) {
            _overlay.remove();
            _overlay = null;
        }
    };

    // lock screen
    this.lock = function() {
        if (!_lock) {
            var html = '<img class="avatar" src="images/profile/profile.png" />' +
                       '<div class="name">Lee Le</div>' +
                       '<div class="input">' +
                           '<input type="text" placeholder="password" utofocus="autofocus" />' +
                           '<button class="btn btn-mini btn-error" onclick="App.unlock();">Login</button>' +
                       '</div>' +
                       '<a href="login.html"><i class="icon-power-off"></i></a>';

            _lock = $('<div>').addClass('lock');

            _lock.html(html);

            _lock.appendTo($(document.body));
        }

        return _lock;
    };

    this.unlock = function() {
        if (_lock) {
            _lock.remove();
            _lock = null;
        }
    };

    // Cross browser transitionEnd event
    this.transitionEnd = function(element, event_handler) {
        if (Modernizr.csstransitions) {
            var transEndEventNames = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd',
                'msTransition'     : 'MSTransitionEnd',
                'transition'       : 'transitionend'
            };
            transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

            element.on(transEndEventName, function (event) {
                element.off(transEndEventName);
                event_handler(event, element);
            });
        } else {
            event_handler(null, element);
        }

        // return element so that we can chain methods
        return element;
    };
};

function break_iframe() {
    if ( window.location != window.parent.location ) {
        top.location = self.location.href;
    }
 }

var App = new Application();

window.app = App;

$(document).ready(function() {
    App.init();
    break_iframe();
});