/**
 * Form Module
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */
var Form = function (undefined) {
    var SELF = this;
    var _elements = null;

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
        $(document).on('click',   '.form-wizard-previous',       _navigate);
        $(document).on('click',   '.form-wizard-next',           _navigate);
        $(document).on('keyup',   '.form-row input.creditcard',  _creditcard_input_keyup);
    };

    // credit card input keyup
    var _creditcard_input_keyup = function(evt) {
        var input_element = $(this);
        var max_length    = parseInt(input_element.attr('maxlength'), 10);

        if (max_length && input_element.val().length >= max_length) {
            input_element.next('input.creditcard').focus();
        }
    };

    // fallbacks for HTML5 input types
    var _inputElementSupport = function() {
        if (!Modernizr.inputtypes.date) {
            // jQuery UI datepicker
            $('.form-row input[type="date"]').datepicker({
                dateFormat: 'dd/mm/yy'
            });
        }

        if (!Modernizr.inputtypes.range) {
        }
    };

    // navigate form wizard
    var _navigate = function(evt) {
        evt.preventDefault();

        var direction = $(this).hasClass('form-wizard-next') ? 'next' : 'back';

        var form  = $(this).parents('form:first');
        var step  = form.data('step');
        var total = form.data('total_steps');

        if (direction === 'back') {
            step--;
        } else {
            step++;
        }

        step = Math.min(step, total);
        step = Math.max(step, 1);

        if (step === 1) {
            form.find('.form-wizard-previous').prop('disabled', true);
        } else {
            form.find('.form-wizard-previous').prop('disabled', false);
        }

        if (step < total) {
            form.find('.form-wizard-submit').hide();
            form.find('.form-wizard-next').show();
        } else {
            form.find('.form-wizard-submit').show();
            form.find('.form-wizard-next').hide();
        }

        form.find('.form-wizard').removeClass('active');
        form.find('.form-wizard').eq(step-1).addClass('active');

        form.find('.form-wizard-indicator').removeClass('completed current');
        form.find('.form-wizard-indicator').eq(step-1).addClass('current');
        form.find('.form-wizard-indicator:lt(' + (step - 1) +')').addClass('completed');


        // update current step
        form.data('step', step);
    };

    this.update = function() {
        _inputElementSupport();

        $('form.wizard').each(function() {
            var form = $(this);

            form.data('step', 1);
            form.data('total_steps', form.find('.form-wizard').length);

            form.find('.form-wizard:first').addClass('active');
            form.find('.form-wizard-indicator:first').addClass('current');
            form.find('.form-wizard-previous').prop('disabled', true);
        });

    };
};