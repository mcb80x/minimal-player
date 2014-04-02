/**
 * Demo - This file generates custom data for the demo
 * @author  Lee Le
 * @website http://www.melonhtml5.com
 * @email   lee@melonhtml5.com
 */

/**
 ******************************
 Chart
 ******************************
 */
var getRandomData = function(start, min, max, total, offset, reverse, time, force_direction, is_half) {
    var start     = start           !== undefined ? start           : 0;
    var min       = min             !== undefined ? min             : 0;
    var max       = max             !== undefined ? max             : 100;
    var total     = total           !== undefined ? total           : 50;
    var offset    = offset          !== undefined ? offset          : (max - min) / total;
    var reverse   = reverse         !== undefined ? reverse         : false;
    var time      = time            !== undefined ? time            : false;
    var direction = force_direction !== undefined ? force_direction : 'up';
    var is_half   = is_half         === undefined ? false           : true;

    var _getRandomNumber = function() {
        var number = Math.random() * max;
        number = Math.min(number, max);
        number = Math.max(number, min);

        return number;
    };

    var data    = [];
    var counter = 1;
    var number  = force_direction ? min : _getRandomNumber();

    while (counter <= total) {
        var draw = true;
        if (is_half && counter % 2 === 0) {
            draw = false;
        }

        if (counter % 2 === 0) {
            if (number === max) {
                direction = 'down';
            } else if (number === min) {
                direction = 'up';
            } else {
                if (force_direction === undefined) {
                    direction = Math.random() > 0.5 ? 'up' : 'down';
                }
            }
        }

        var unit = offset * Math.random() * (direction ==='up' ? 1 : -1);
        number += unit;

        number = Math.min(number, max);
        number = Math.max(number, min);

        if (draw) {
            if (reverse) {
                data.push([number, start]);
            } else  {
                data.push([start, number]);
            }
        }

        if (time) {
            start += 20000000;
        } else {
            start++;
        }

        counter++;
    }

    return data;
};

var realTimeChart = function(plot, update_inverval) {
    var placeholder = plot.getPlaceholder();

    var real_time_data = getRandomData(0, 10, 20, 2000, 1, false, true);
    var xaxis_labels = [];
    for (var i = 0; i < real_time_data.length; i++) {
        xaxis_labels.push(real_time_data[i][0]);
    }

    var start  = 0;
    var amount = 500;
    var _update = function() {
        if (!placeholder.is(':visible')) {
            return;
        }

        clearTimeout(placeholder.data('timeout_id'));

        var new_data = real_time_data.slice(start, start + amount);
        for (var i = 0; i < amount; i++) {
            new_data[i][0] = xaxis_labels[i];
        }

        plot.setData([new_data]);
        plot.draw();

        if (start + amount >= real_time_data.length - 1) {
            start = 0;
        } else {
            start++;
        }

        var timeout_id = setTimeout(_update, update_inverval);
        placeholder.data('timeout_id', timeout_id);
    }
    _update();
};

// Flot
var area_chart = {
    data: [{color:'#F3DEA8', label:'Active Users', data:getRandomData(0, 10, 28, 500, 2, false, true)}],
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            clickable: true,
            hoverable: false
        },
        xaxis: {
            show: false
        },
        yaxis: {
            min: 0,
            max: 30
        },
        series: {
            lines: {
                show: true
            },
            points: {
                show: false
            }
        },
        lines: {
            lineWidth: 2,
            fill:      true,
            fillColor: {
                colors: [{opacity:0.4}, {opacity:0.9}]
            }
        },
        shadowSize: 2
    }
};

var trend_chart = {
    data: [{color:'#F3DEA8', label:'Active Users', data:getRandomData(0, 10, 28, 50, 2, false, true)}],
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            clickable:   true,
            hoverable:   true,
            margin:      20
        },
        tooltip: true,
        tooltipOpts: {
            content:      '%x: %y',
            defaultTheme: false
        },
        legend: {
            show: false
        },
        xaxis: {
            show: true,
            mode: 'time'
        },
        series: {
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        points: {
            radius: 2
        },
        lines: {
            lineWidth: 2,
            fill:      true,
            fillColor: {
                colors: [{opacity:0.4}, {opacity:0.9}]
            }
        },
        shadowSize: 2
    }
};

var project_chart = {
    data: [
        {color:'#44A340', label:'GitHub',    data:getRandomData((new Date(2010, 0, 1)).getTime(), 100, 500, 30, 40, false, true, 'up')},
        {color:'#418A94', label:'Bitbucket', data:getRandomData((new Date(2010, 0, 1)).getTime(), 200, 400, 30, 20, false, true)}
    ],
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            clickable: true,
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content:      '%x: %y',
            defaultTheme: false
        },
        crosshair: {
            mode: 'x'
        },
        xaxis: {
            tickLength: 0,
            mode: 'time'
        },
        yaxis: {
            min: 100
        },
        series: {
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        lines: {
            lineWidth: 1
        },
        shadowSize: 2
    }
};

var line_chart = {
    data: [
        {color:'#FFB848', label:'CPU Usage',    data:getRandomData((new Date(2010, 0, 1)).getTime(), 100, 500, 30, 40, false, true, 'up')},
        {color:'#5FC2EF', label:'Memory Usage', data:getRandomData((new Date(2010, 0, 1)).getTime(), 100, 400, 30, 20, false, true, 'up')},
        {color:'#D04432', label:'Disk Usage',   data:getRandomData((new Date(2010, 0, 1)).getTime(), 100, 300, 30, 10, false, true, 'up')}
    ],
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            clickable: true,
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content:      '%x: %y',
            defaultTheme: false
        },
        xaxis: {
            tickLength: 0,
            mode: 'time'
        },
        yaxis: {
            min: 100
        },
        series: {
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        lines: {
            lineWidth: 1
        },
        shadowSize: 2
    }
};

var line_chart_small = {
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            clickable: true,
            hoverable: true,
            show: false
        },
        xaxis: {
            tickLength: 0,
            show: false
        },
        yaxis: {
            min: 100,
            show: false
        },
        series: {
            lines: {
                show: true
            },
            points: {
                show: false
            }
        },
        lines: {
            lineWidth: 1
        },
        shadowSize: 1
    }
};

var font_colour = [];
font_colour['#F3DEA8'] = '#C58909';
font_colour['#CAE1CA'] = '#005314';
font_colour['#D5D3E8'] = '#53059B';
font_colour['#B2D6F8'] = '#034D94';
var pie_chart = {
    data: [
        {color: '#F3DEA8', label: 'Android',       data: 30},
        {color: '#CAE1CA', label: 'iOS',           data: 50},
        {color: '#D5D3E8', label: 'Windows Phone', data: 8},
        {color: '#B2D6F8', label: 'Other',         data: 12}
    ],
    options: {
        series: {
            pie: {
                show: true,
                tilt: 0.5,
                label: {
                    show: true,
                    radius: 1,
                    formatter: function(label, series) {
                        return '<div style="text-align:center;padding:10px;color:' + font_colour[series.color] + ';">' + label + ': ' + Math.round(series.percent) + '%</div>';
                    },
                    background: {
                        opacity: 0.8
                    }
                }
            }
        },
        legend: {
            show: false
        }
    }
};

var combination_chart = {
    data: [
        {color:'#008E53', label:'Network',      data:getRandomData(0, 1000, 6000, 20, 500), lines: {show:false}, points: {show:true}},
        {color:'#FFB848', label:'CPU Usage',    data:getRandomData(0, 3000, 5000, 20, 500), lines: {show:true},  points: {show:true}},
        {color:'#5FC2EF', label:'Memory Usage', data:getRandomData(0, 2000, 3500, 20, 500), lines: {show:true},  points: {show:false}},
        {color:'#D04432', label:'Disk Usage',   data:getRandomData(0, 1000, 1500, 20, 500), lines: {show:true, fill:true}}
    ],
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            clickable: true,
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content:      '%s: %y',
            defaultTheme: false
        },
        legend: {
            show: false
        },
        series: {
            lines: {
                show: true
            },
            points: {
                show: false
            }
        },
        lines: {
            lineWidth: 1
        },
        shadowSize: 2
    }
};

var zoom_chart = {
    data: [
        {color:'#FFB848', label:'CPU Usage',    data:getRandomData(0, 4000, 5000, 200, 200)},
        {color:'#5FC2EF', label:'Memory Usage', data:getRandomData(0, 2000, 3500, 200, 200)},
        {color:'#D04432', label:'Disk Usage',   data:getRandomData(0, 1000, 1500, 200, 200)}
    ],
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            clickable: true,
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content:      '%s: %y',
            defaultTheme: false
        },
        legend: {
            show: false
        },
        series: {
            lines: {
                show: true
            },
            points: {
                show: false
            }
        },
        lines: {
            lineWidth: 1,
            fill: true
        },
        points: {
            radius: 1
        },
        shadowSize: 2,
        selection: {
            mode: 'xy'
        }
    }
};

var tribble_area_chart = {
    data: [
        {color:'#FFB848', label:'CPU Usage',    data:getRandomData((new Date(2010, 0, 1)).getTime(), 100, 500, 30, 40, false, true, 'up')},
        {color:'#5FC2EF', label:'Memory Usage', data:getRandomData((new Date(2010, 0, 1)).getTime(), 100, 400, 30, 20, false, true, 'up')},
        {color:'#D04432', label:'Disk Usage',   data:getRandomData((new Date(2010, 0, 1)).getTime(), 100, 300, 30, 10, false, true, 'up')}
    ],
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            clickable: true,
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content:      '%s: %y',
            defaultTheme: false
        },
        xaxis: {
            mode: 'time'
        },
        legend: {
            show: false
        },
        series: {
            lines: {
                show: true
            },
            points: {
                show: false
            }
        },
        lines: {
            lineWidth: 1,
            fill: true
        },
        points: {
            radius: 3
        },
        shadowSize: 2
    }
};

var bar_chart = {
    data: [
        {color:'#B2D6F8', data:getRandomData(200, 3300, 5000, 15, 600, false, false, false, true)},
        {color:'#D04432', data:getRandomData(200, 1700, 3000, 15, 200, false, false, false, true)},
        {color:'#F3DEA8', data:getRandomData(200, 100,  1500, 15, 200, false, false, false, true)}
    ],
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC'
        },
        xaxis: {
            tickLength: 0
        },
        yaxis: {
            max: 5500
        },
        series: {
            lines: {
                show: false
            },
            points: {
                show: false
            },
            bars: {
                show: true,
                barWidth: 1,
                fill: true,
                fillColor: {
                    colors: [{opacity:0.8}, {opacity:1}]
                }
            }
        },
        shadowSize: 0
    }
};

var bar_chart_small = {
    data: [
        {color:'#F3DEA8', data:getRandomData(0, 1000, 3000, 40, 250, false, false, 'up')}
    ],
    options: {
        grid: {
            show: false
        },
        xaxis: {
            show: false,
            tickLength: 0
        },
        yaxis: {
            show: false,
            max: 3000
        },
        legend: {
            show: false
        },
        series: {
            lines: {
                show: false
            },
            points: {
                show: false
            },
            bars: {
                show: true,
                barWidth: 0.5,
                fill: true,
                fillColor: {
                    colors: [{opacity:0.8}, {opacity:1}]
                }
            }
        },
        shadowSize: 0
    }
};

var horizontal_bar_chart = {
    data: [
        {color:'#CAE1CA', data:getRandomData(200, 1000, 4000, 20, 500, true, false, false, true)},
        {color:'#F3DEA8', data:getRandomData(201, 100,  4000, 20, 500, true, false, false, true)}
    ],
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            clickable: true,
            hoverable: true
        },
        xaxis: {
            max: 4500
        },
        yaxis: {
            min: 199,
            tickLength: 0
        },
        series: {
            lines: {
                show: false
            },
            points: {
                show: false
            },
            bars: {
                show: true,
                barWidth: 0.5,
                horizontal: true,
                fill: true,
                fillColor: {
                    colors: [{opacity:0.8}, {opacity:1}]
                }
            }
        },
        shadowSize: 2
    }
};

var social_tracking_chart = {
    data: [
        {label:'Facebook', color:'#B2D6F8', data:getRandomData(1, 330, 500, 15, 60)},
        {label:'Twitter',  color:'#D04432', data:getRandomData(1, 170, 300, 15, 20)},
        {label:'Google+',  color:'#F3DEA8', data:getRandomData(1, 10,  150, 15, 20)}
    ],
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content:      '%s: %y shares',
            defaultTheme: false
        },
        legend: {
            show: false
        },
        xaxis: {
            min: 1,
            tickLength: 0,
            tickFormatter: function(number) {
                return 'Day ' + number;
            }
        },
        yaxis: {
            max: 550
        },
        series: {
            lines: {
                show: false
            },
            points: {
                show: false
            },
            bars: {
                show: true,
                barWidth: 0.5,
                fill: true,
                fillColor: {
                    colors: [{opacity:0.8}, {opacity:1}]
                }
            }
        },
        shadowSize: 0
    }
};

var point_chart = {
    data:  [
        {color:'#5FC2EF', label: 'Android', data:getRandomData(100, 100, 1000, 20, 300)},
        {color:'#D04432', label: 'iOS',     data:getRandomData(100, 500, 700,  20, 100)}
    ],
    options: {
        grid: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            clickable: true,
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content:      '%s: %y',
            defaultTheme: false
        },
        series: {
            lines: {
                show: false
            },
            points: {
                show: true
            }
        },
        points: {
            radius: 4
        },
        shadowSize: 2
    }
};

// ChartJS
var doughnut_chartjs = [
    {
        value: 30,
        color: '#F3DEA8'
    },
    {
        value: 50,
        color: '#CAE1CA'
    },
    {
        value: 100,
        color: '#D5D3E8'
    },
    {
        value: 40,
        color: '#B2D6F8'
    },
    {
        value: 120,
        color: '#EEEEEE'
    }
];

var doughnut_chart_sidebar = [
    {
        value: 30,
        color: '#F3DEA8'
    },
    {
        value: 50,
        color: '#CAE1CA'
    },
    {
        value: 100,
        color: '#D5D3E8'
    },
    {
        value: 60,
        color: '#B2D6F8'
    }
];

var radar_chartjs = {
    labels : ['Eating','Drinking','Sleeping','Designing','Coding','Partying','Running'],
    datasets : [
        {
            fillColor :   'rgba(220,220,220,0.5)',
            strokeColor : 'rgba(220,220,220,1)',
            pointColor :  'rgba(220,220,220,1)',
            pointStrokeColor : '#FFFFFF',
            data : [65,59,90,81,56,55,40]
        },
        {
            fillColor :   'rgba(151,187,205,0.5)',
            strokeColor : 'rgba(151,187,205,1)',
            pointColor :  'rgba(151,187,205,1)',
            pointStrokeColor : '#FFFFFF',
            data : [28,48,40,19,96,27,100]
        }
    ]
};

var polar_area_chartjs = [
    {
        value: Math.random(),
        color: '#F3DEA8'
    },
    {
        value: Math.random(),
        color: '#CAE1CA'
    },
    {
        value: Math.random(),
        color: '#D5D3E8'
    },
    {
        value: Math.random(),
        color: '#B2D6F8'
    },
    {
        value: Math.random(),
        color: '#EEEEEE'
    },
    {
        value: Math.random(),
        color: '#FFCBCB'
    }
];

var pie_chartjs = [
    {
        value: 30,
        color: '#F3DEA8'
    },
    {
        value: 50,
        color: '#CAE1CA'
    },
    {
        value: 100,
        color: '#D5D3E8'
    },
    {
        value: 200,
        color: '#B2D6F8'
    },
    {
        value: 130,
        color: '#EEEEEE'
    }
];

var easy_pie_chart = {
    size:      110,
    animate:   App.is_old_ie ? false : 2000,
    lineWidth: 6,
    lineCap:   'square'
};

/**
 ******************************
 Calendar
 ******************************
 */
var getCalendarOptions = function() {
    var this_month = (new Date()).getMonth() + 1;
    var next_month = this_month + 1;
    var this_year  = (new Date()).getFullYear();

    if (this_month < 10) {
        this_month = '0' + this_month;
    }

    if (next_month < 10) {
        next_month = '0' + next_month;
    }

    return {
        selectable:  true,
        weekends:    true,
        defaultView: 'month',
        header: {
            left:   'prev, next, today',
            center: 'title',
            right:  'month, agendaWeek, agendaDay' // 'month, basicWeek, basicDay, agendaWeek, agendaDay'
        },
        select: function(start, end, allDay) {
            App.dialog.open({
                width:     500,
                title:     'New Event',
                content:   '<form>' +
                               '<div class="form-row">' +
                                   '<div class="label">Event Title:</div>' +
                                   '<div class="input">' +
                                       '<i class="icon-calendar"></i><input type="text" class="icon large" placeholder="event title" autofocus="autofocus" />' +
                                   '</div>' +
                               '</div>' +
                            '</form>',
                theme:     'info',
                draggable: true,
                buttons:   [
                    {
                        text:  'Cancel',
                        icon:  'icon-remove',
                        click: function(evt, btn, dialog) {
                            App.dialog.close();
                        }
                    },
                    {
                        text:  'Add',
                        icon:  'icon-save',
                        click: function(evt, btn,  dialog) {
                            var title = dialog.find('input:text').val();
                            if (title) {
                                console.log(start, end);
                                $('#calendar').fullCalendar('renderEvent', {
                                    title:  title,
                                    start:  start,
                                    end:    end,
                                    allDay: allDay
                                }, true);
                            }

                            $('#calendar').fullCalendar('unselect');
                            App.dialog.close();
                        }
                    }
                ]
            });
        },
        eventSources: [{
            events: [
                {
                    title  : 'Kay\'s Bday',
                    start  : this_year + '-' + this_month + '-01 08:30:00',
                    end    : this_year + '-' + this_month + '-01 17:00:00',
                    allDay : false
                },
                {
                    title  : 'World Cup Final',
                    start  : this_year + '-' + this_month + '-07 23:00:00',
                    end    : this_year + '-' + this_month + '-08 01:00:00',
                    allDay : false
                },
                {
                    title  : 'Car Wash',
                    start  : this_year + '-' + this_month + '-07 08:30:00',
                    end    : this_year + '-' + this_month + '-07 16:00:00',
                    allDay : false
                },
                {
                    title  : 'Soccer',
                    start  : this_year + '-' + next_month + '-06 15:00:00',
                    end    : this_year + '-' + next_month + '-06 17:00:00',
                    allDay : false
                }
            ],
            color: '#365D95',
            textColor: '#FFFFFF'
        },
        {
            events: [
                {
                    title  : 'School',
                    start  : this_year + '-' + this_month + '-03 07:00:00',
                    end    : this_year + '-' + this_month + '-03 17:00:00',
                    allDay : false
                },
                {
                    title  : 'Beach Day',
                    start  : this_year + '-' + this_month + '-12',
                    end    : this_year + '-' + this_month + '-14',
                    allDay : true
                },
                {
                    title  : 'Meeting',
                    start  : this_year + '-' + this_month + '-24 08:00:00',
                    end    : this_year + '-' + this_month + '-24 09:00:00',
                    allDay : false
                },
                {
                    title  : 'Web Training',
                    start  : this_year + '-' + next_month + '-08 15:00:00',
                    end    : this_year + '-' + next_month + '-10 17:00:00',
                    allDay : true
                }
            ],
            color: '#C9282D',
            textColor: '#FFFFFF'
        },
        {
            events: [
                {
                    title  : 'Collect Mail',
                    start  : this_year + '-' + this_month + '-13 14:00:00',
                    end    : this_year + '-' + this_month + '-13 16:00:00',
                    allDay : false
                },
                {
                    title  : 'Fitness',
                    start  : this_year + '-' + this_month + '-27',
                    end    : this_year + '-' + this_month + '-29',
                    allDay : true
                },
                {
                    title  : 'Soccer',
                    start  : this_year + '-' + next_month + '-13 15:00:00',
                    end    : this_year + '-' + next_month + '-13 17:00:00',
                    allDay : false
                }
            ],
            color: '#91A244',
            textColor: '#FFFFFF'
        },
        {
            events: [
                {
                    title  : 'Web Conference in SA',
                    start  : this_year + '-' + this_month + '-16 09:00:00',
                    end    : this_year + '-' + this_month + '-18 17:00:00',
                    allDay : false
                },
                {
                    title  : 'Soccer',
                    start  : this_year + '-' + next_month + '-20 09:30:00',
                    end    : this_year + '-' + next_month + '-20 12:00:00',
                    allDay : false
                }
            ],
            color: '#FAB542',
            textColor: '#FFFFFF'
        }]
    };
};


/**
 ******************************
 Theme Change
 ******************************
 */
$(document).ready(function() {
    var key = (new Date()).getTime();

    $('#theme-selector div.theme').on('click', function(evt) {
        var colour = $(this).data('theme');

        $('<link>').attr({
            rel:  'stylesheet',
            href: (!App.getOptions().spa ? '../single_page_app/' : '') + 'css/theme/default/' + colour + '.css?k=' + key
        }).on('load', function() {
            $('link.theme-colour').remove();
            $(this).addClass('theme-colour');
        }).appendTo($('head'));
    });
});


/**
 ******************************
 Form
 ******************************
 */
$(document).ready(function() {
    $(document).on('click', 'button.form-submit-ajax', function(evt) {
        evt.preventDefault();

        var button     = $(this);
        var class_name = button.children('i').attr('class');

        button.prop('disabled', true);
        button.children('i').attr('class', 'icon-refresh icon-spin');

        setTimeout(function() {
            button.prop('disabled', false);
            button.children('i').attr('class', class_name);
        }, 2000);
    });

    $(document).on('click', '#calendar-event-create', function(evt) {
        evt.preventDefault();

        var button = $(this);

        button.prop('disabled', true).addClass('btn-loading').removeClass('btn-error').text('Please Wait ...');

        setTimeout(function() {
            button.prop('disabled', false).removeClass('btn-loading').addClass('btn-error').text('Create');
        }, 2000);
    });
});

/**
 ******************************
 Widget
 ******************************
 */
$(document).ready(function() {
    $(document).on('click', 'div.dashboard-widget button.setting', function(evt) {
        App.dialog.open({
            width:     500,
            title:     'Widget Settings',
            content:   'add a form here',
            theme:     'info',
            draggable: true,
            buttons:   []
        });
    });
});

/**
 ******************************
 Map
 ******************************
 */

var au_cities    = ['Sydney', 'Albury', 'Armidale', 'Bathurst', 'BlueMountains', 'BrokenHill', 'Campbelltown', 'Cessnock', 'Dubbo', 'Goulburn', 'Grafton', 'Lithgow', 'Liverpool', 'Newcastle', 'Orange', 'Parramatta', 'Penrith', 'Queanbeyan', 'Tamworth', 'WaggaWagga', 'Wollongong', 'Bankstown', 'Blacktown', 'BotanyBay', 'CanadaBay', 'Canterbury', 'CoffsHarbour', 'Fairfield', 'Gosford', 'GreaterTaree', 'Griffith', 'Hawkesbury', 'Holroyd', 'Hurstville', 'LakeMacquarie', 'Lismore', 'Lithgow', 'Maitland', 'Randwick', 'Rockdale', 'Ryde', 'Shellharbour', 'Shoalhaven', 'Willoughby', 'Brisbane', 'Bundaberg', 'Cairns', 'Caloundra', 'Gladstone', 'GoldCoast', 'Gympie', 'HerveyBay', 'Ipswich', 'LoganCity', 'Mackay', 'Maryborough', 'MountIsa', 'Rockhampton', 'SunshineCoast', 'SurfersParadise', 'Toowoomba', 'Townsville', 'ChartersTowers', 'RedcliffeCity', 'RedlandCity', 'Thuringowa', 'Warwick', 'Adelaide', 'MountBarker', 'MountGambier', 'MurrayBridge', 'PortAdelaide', 'PortAugusta', 'PortPirie', 'PortLincoln', 'VictorHarbor', 'Whyalla', 'Melbourne', 'Ararat', 'Bairnsdale', 'Benalla', 'Ballarat', 'Bendigo', 'Dandenong', 'Frankston', 'Geelong', 'Hamilton', 'Horsham', 'Melton', 'Moe', 'Morwell', 'Mildura', 'Sale', 'Shepparton', 'SwanHill', 'Traralgon', 'Wangaratta', 'Warrnambool', 'Wodonga', 'Perth', 'Albany', 'Bunbury', 'Busselton', 'Fremantle', 'Geraldton', 'Joondalup', 'Kalgoorlie', 'Mandurah', 'Rockingham', 'Armadale', 'Bayswater', 'Canning', 'Cockburn', 'Gosnells', 'Kwinana', 'Melville', 'Nedlands', 'SouthPerth', 'Stirling', 'Subiaco', 'Swan', 'Wanneroo'];
var marker_icons = [
    {
        visible:   'images/marker/marker_green.png',
        invisible: 'images/marker/marker_green_invisible.png'
    },
    {
        visible:   'images/marker/marker_blue.png',
        invisible: 'images/marker/marker_blue_invisible.png'
    },
    {
        visible:   'images/marker/marker_red.png',
        invisible: 'images/marker/marker_red_invisible.png'
    }
];

var initMap = function(map_element) {
    var mapOptions = {
        center:    new google.maps.LatLng(-26.477, 135.033),
        zoom:      4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles:    [
            {
                stylers: [
                    { hue: '#0B879E' },
                    { saturation: -20 }
                ]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [
                    { lightness: 100 },
                    { visibility: 'simplified' }
                ]
            },
            {
                featureType: 'road',
                elementType: 'labels',
                stylers: [
                    { visibility: 'off' }
                ]
            }
        ]
    };

    var map = new google.maps.Map(map_element.get(0), mapOptions);
    var infowindow = false;

    var markers = [];
    markers.push([]); // facebook
    markers.push([]); // twitter
    markers.push([]); // google+

    var current_marker_type = false;
    var addmarker_timeout   = false;

    var addMarker = function(init) {
        var total = markers[0].length + markers[1].length + markers[2].length;

        if (!map_element.is(':visible')) {
            return;
        }

        if (total > 50) {
            return;
        }

        var types       = [0, 0, 0, 0, 1, 1, 1, 2, 2];
        var city_name   = au_cities[Math.floor(Math.random() * au_cities.length)] + ', Australia';
        var type        = types[Math.floor(Math.random() * types.length)];

        var geocoder  = new google.maps.Geocoder();
        geocoder.geocode({address:city_name}, function(result, status) {
            if (status === 'OK') {
                var marker = new google.maps.Marker({
                    map:       map,
                    position:  new google.maps.LatLng(result[0].geometry.location.mb, result[0].geometry.location.nb),
                    animation: init === undefined ?  google.maps.Animation.BOUNCE : null,
                    icon:      (current_marker_type === false || current_marker_type === type) ? marker_icons[type].visible : marker_icons[type].invisible
                });

                if (result[0].formatted_address) {
                    google.maps.event.addListener(marker, 'click', function() {
                        if (infowindow) {
                            infowindow.close();
                            Infowindow = false;
                        };

                        var msg = '<strong>Location:</strong> ' + result[0].formatted_address;

                        infowindow = new google.maps.InfoWindow({content: msg});
                        infowindow.open(map, marker);
                    });
                }

                markers[type].push(marker);

                // facebook
                var percent = (markers[0].length / total * 100).toFixed(2);
                $('#facebook-count').html('<b>' + markers[0].length + '</b> (' + percent + '%)');

                // twitter
                var percent = (markers[1].length / total * 100).toFixed(2);
                $('#twitter-count').html('<b>' + markers[1].length + '</b> (' + percent + '%)');

                // google
                var percent = (markers[2].length / total * 100).toFixed(2);
                $('#google-count').html('<b>' + markers[2].length + '</b> (' + percent + '%)');

                if (init !== true) {
                    // facebook
                    var percent = parseInt((markers[0].length / total * 100));
                    $('#facebook-fan').data('easyPieChart').update(percent);
                    $('#facebook-fan-count').text('12,' + (markers[0].length * 8 + 400));

                    // twitter
                    var percent = parseInt((markers[1].length / total * 100));
                    $('#twitter-follower').data('easyPieChart').update(percent);
                    $('#twitter-follower-count').text('5,' + (markers[1].length * 4 + 300));

                    // google
                    var percent = parseInt((markers[2].length / total * 100));
                    $('#google-friend').data('easyPieChart').update(percent);
                    $('#google-friend-count').text('3,' + (markers[2].length * 6 + 200));
                }

                setTimeout(function() {
                    marker.setAnimation(null);
                }, 2850);
            }
        });

        if (init === undefined) {
            clearTimeout(addmarker_timeout);
            addmarker_timeout = setTimeout(addMarker, 3000);
        }
    };

    var hideMarker = function(type) {
        for (var i = 0; i < markers[type].length; i++) {
            markers[type][i].setIcon(marker_icons[type].invisible);
        }
    };
    var showMarker = function(type) {
        for (var i = 0; i < markers[type].length; i++) {
            markers[type][i].setIcon(marker_icons[type].visible);
        }
    };

    $('div.social-bar-facebook').on('mouseenter', function(evt) {
        hideMarker(1);
        hideMarker(2);

        current_marker_type = 0;
    });
    $('div.social-bar-twitter').on('mouseenter', function(evt) {
        hideMarker(0);
        hideMarker(2);

        current_marker_type = 1;
    });
    $('div.social-bar-google').on('mouseenter', function(evt) {
        hideMarker(0);
        hideMarker(1);

        current_marker_type = 2;
    });
    $('div.social-bar').on('mouseleave', function(evt) {
        showMarker(0);
        showMarker(1);
        showMarker(2);

        current_marker_type = false;
    });

    // give map some init data
    setTimeout(addMarker, 3000);
    for (var i = 0; i <= 10; i++) {
        addMarker(true);
    }
}


/**
 ******************************
 Project Contribution
 ******************************
 */
var buildContribution = function(container, total) {
    var level_numbers = [1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5];

    var html = '';
    for (var i = 0; i <= total; i++) {
        var random_level  = level_numbers[Math.floor(Math.random() * level_numbers.length)];
        var random_commit = random_level === 1 ? 'No' : Math.floor(Math.random() * 100 * random_level + 1);

        html += '<div class="level level' + random_level + '" title="' + random_commit + ' commits"></div>';
    }
    container.html(html);
};


/**
 ******************************
 Page Scripts
 ******************************
 */

var dashboardPage = function() {
    // line chart
    var plot = $.plot($('#dashboard-line-chart'), project_chart.data, project_chart.options);


    var legends = $('#dashboard-line-chart .legendLabel');

    var updateLegendTimeout = null;
    var latestPosition      = null;

    var updateLegend = function() {
        updateLegendTimeout = null;

        var pos = latestPosition;

        var axes = plot.getAxes();
        if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
            pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
            return;
        }

        var dataset = plot.getData();
        for (var i = 0; i < dataset.length; ++i) {

            var series = dataset[i];

            // Find the nearest points, x-wise
            for (var j = 0; j < series.data.length; ++j) {
                if (series.data[j][0] > pos.x) {
                    break;
                }
            }

            // Now Interpolate
            var y,
                p1 = series.data[j - 1],
                p2 = series.data[j];

            if (p1 == null) {
                y = p2[1];
            } else if (p2 == null) {
                y = p1[1];
            } else {
                y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
            }


            legends.eq(i).html('<table><tr><td width="50">' + series.label + ':</td><td>' + parseInt(y, 10) + '</td></tr></table>');
        }
    }

    $('#dashboard-line-chart').on('plothover',  function (event, pos, item) {
        latestPosition = pos;
        if (!updateLegendTimeout) {
            updateLegendTimeout = setTimeout(updateLegend, 50);
        }
    });

    // area chart
    realTimeChart($.plot($("#dashboard-area-chart"), area_chart.data, area_chart.options), 50);

    // project contribution
    buildContribution($('#github-commit > div.main'), 104);
    buildContribution($('#bitbucket-commit > div.main'), 104);
};

var statisticsPage = function() {
    ////////////////////
    //      Flot      //
    ////////////////////

    $.plot($('#statistics-chart'), tribble_area_chart.data, tribble_area_chart.options);

    $('#zooming-cpu, #zooming-memory, #zooming-disk').on('click', function() {
        var data = [];
        if ($('#zooming-cpu').prop('checked')) {
            data.push(tribble_area_chart.data[0]);
        }
        if ($('#zooming-memory').prop('checked')) {
            data.push(tribble_area_chart.data[1]);
        }
        if ($('#zooming-disk').prop('checked')) {
            data.push(tribble_area_chart.data[2]);
        }

        $.plot($('#statistics-chart'), data, tribble_area_chart.options);
    });

    $.plot($('#bar-chart-1'), [{color:'#F3DEA8', data:getRandomData(0, 1000, 3000, 40, 250, false, false, 'up')}], bar_chart_small.options);
    $.plot($('#bar-chart-2'), [{color:'#CAE1CA', data:getRandomData(0, 2000, 3000, 40, 800, false, false)}],       bar_chart_small.options);
    $.plot($('#bar-chart-3'), [{color:'#D5D3E8', data:getRandomData(0, 200,  3000, 40, 170, false, false, 'up')}], bar_chart_small.options);
    $.plot($('#bar-chart-4'), [{color:'#B2D6F8', data:getRandomData(0, 200,  3000, 40, 400, false, false, 'up')}], bar_chart_small.options);

    $.plot($('#trentline1'), [{color:'#F3DEA8', label:'Active Users', data:getRandomData(0, 10, 100, 20, 10, false, true)}], trend_chart.options);
    $.plot($('#trentline2'), [{color:'#CAE1CA', label:'Active Users', data:getRandomData(0, 10, 100, 20, 10, false, true)}], trend_chart.options);
    $.plot($('#trentline3'), [{color:'#D5D3E8', label:'Active Users', data:getRandomData(0, 10, 100, 20, 10, false, true)}], trend_chart.options);
    $.plot($('#trentline4'), [{color:'#B2D6F8', label:'Active Users', data:getRandomData(0, 10, 100, 20, 10, false, true)}], trend_chart.options);
    $.plot($('#trentline5'), [{color:'#FF9393', label:'Active Users', data:getRandomData(0, 10, 100, 20, 10, false, true)}], trend_chart.options);
    $.plot($('#trentline6'), [{color:'#AAAAAA', label:'Active Users', data:getRandomData(0, 10, 100, 20, 10, false, true)}], trend_chart.options);

    ////////////////////
    //    ChartJS     //
    ////////////////////

    var canvas = $('<canvas>').attr({
        width:  240,
        height: 240
    }).appendTo($('#doughnut-chart-container'));

    if (App.is_old_ie) {
        G_vmlCanvasManager.initElement(canvas.get(0));
    }

    new Chart(canvas.get(0).getContext('2d')).Doughnut(doughnut_chart_sidebar, {animation: (App.is_old_ie ? false : true)});

    ////////////////////
    // Easy Pie Chart //
    ////////////////////

    var circular_pies = $('div.circular-pie');
    circular_pies.each(function() {
        var chart = $(this);
        var text_span = chart.children('span');
        chart.easyPieChart($.extend(true, {}, easy_pie_chart, {
            barColor:   chart.data('color'),
            lineWidth:  15,
            trackColor: '#FFFFFF',
            scaleColor: false,
            onStep: function(value) {
                text_span.text(parseInt(value, 10) + '%');
            }
        }));
    });
};

var trackingPage = function() {
    // google map
    initMap($('#tracking-map'));

    // sidebar
    var circular_pies = $('div.circular-pie');
    circular_pies.each(function() {
        var chart = $(this);
        var text_span = chart.children('span');
        chart.easyPieChart($.extend(true, {}, easy_pie_chart, {
            barColor:   chart.data('color'),
            lineWidth:  15,
            trackColor: '#FFFFFF',
            scaleColor: false,
            onStep: function(value) {
                text_span.text(parseInt(value, 10) + '%');
            }
        }));
    });

    $.plot($('#line-chart-1'), [{color:'#C58909', data:getRandomData(0, 1000, 3000, 40, 500, false, false)}], line_chart_small.options);
    $.plot($('#line-chart-2'), [{color:'#005314', data:getRandomData(0, 1000, 3000, 40, 500, false, false)}], line_chart_small.options);
    $.plot($('#line-chart-3'), [{color:'#53059B', data:getRandomData(0, 1000, 3000, 40, 500, false, false)}], line_chart_small.options);
    $.plot($('#line-chart-4'), [{color:'#034D94', data:getRandomData(0, 1000, 3000, 40, 500, false, false)}], line_chart_small.options);
    $.plot($('#line-chart-5'), [{color:'#CE281C', data:getRandomData(0, 1000, 3000, 40, 500, false, false)}], line_chart_small.options);

    $.plot($('#bar-chart'), social_tracking_chart.data, social_tracking_chart.options);
};

var chartPage = function() {
    ////////////////////
    // Easy Pie Chart //
    ////////////////////

    var circular_pies = $('div.circular-pie');
    circular_pies.each(function() {
        var chart = $(this);
        var text_span = chart.children('span');
        chart.easyPieChart($.extend(true, {}, easy_pie_chart, {
            barColor:   chart.data('color'),
            lineWidth:  15,
            trackColor: '#FFFFFF',
            scaleColor: false,
            onStep: function(value) {
                text_span.text(parseInt(value, 10) + '%');
            }
        }));
    });

    if (!App.is_old_ie) {
        var update_circular_pies = function() {
            if (!window.location.href.match(/chart/)) {
                clearInterval(circular_pie_timeout_id);
            }

            circular_pies.each(function() {
                var new_value = parseInt(Math.random() * 100, 10);
                $(this).data('easyPieChart').update(new_value);
            });
        };

        var circular_pie_timeout_id = setInterval(update_circular_pies, 3000);
    }

    ////////////////////
    //    ChartJS     //
    ////////////////////

    var chartjs_destroyed = false;
    var chartjs_setup_timeout_id = null;

    // destroy all charts on window resize
    // and then rebuild them
    var destroyChartJS = function() {
        if (!window.location.href.match(/chart/)) {
            return;
        }

        if (!chartjs_destroyed) {
            chartjs_destroyed = true;
            $('#doughnut-chart-container').children('canvas').remove();
            $('#polar-area-chart-container').children('canvas').remove();
            $('#radar-chart-container').children('canvas').remove();
            $('#pie-chart-container').children('canvas').remove();
        }

        clearTimeout(chartjs_setup_timeout_id);
        chartjs_setup_timeout_id = setTimeout(setUpChartJS, 500);
    };

    var setUpChartJS = function() {
        if (!$('#doughnut-chart-container').length) {
            return;
        }

        chartjs_destroyed = false;

        var use_animation = App.is_old_ie ? false : true;

        var createCanvas = function(selector) {
            var size = $(selector).width();
            var canvas = $('<canvas>').attr({
                width:  size,
                height: size
            }).appendTo($(selector));

            if (App.is_old_ie) {
                G_vmlCanvasManager.initElement(canvas.get(0));
            }

            return canvas.get(0).getContext('2d');
        };

        // Doughnut Chart
        var canvas = createCanvas('#doughnut-chart-container');
        new Chart(canvas).Doughnut(doughnut_chartjs, {animation: use_animation});

        // Polar Area chart
        var canvas = createCanvas('#polar-area-chart-container');
        new Chart(canvas).PolarArea(polar_area_chartjs, {animation: use_animation});

        // Radar Chart
        var canvas = createCanvas('#radar-chart-container');
        new Chart(canvas).Radar(radar_chartjs, {scaleShowLabels:false, pointLabelFontSize:10, animation: use_animation});

        // Pie Chart
        var canvas = createCanvas('#pie-chart-container');
        new Chart(canvas).Pie(pie_chartjs, {scaleShowLabels:false, pointLabelFontSize:10, animation: use_animation});
    };

    setUpChartJS();

    $(document).ready(function() {
        // ChartJS doesn't reflow canvas to fit its container
        // So we do it ourselves
        $(window).off('resize', destroyChartJS);
        $(window).on('resize', destroyChartJS);
    });


    ////////////////////
    //     Flot       //
    ////////////////////

    var pie_plot            = $.plot($('#pie-chart-plot'),       pie_chart.data,            pie_chart.options);
    var bar_plot            = $.plot($('#bar-chart'),            bar_chart.data,            bar_chart.options);
    var horizontal_bar_plot = $.plot($('#horizontal-bar-chart'), horizontal_bar_chart.data, horizontal_bar_chart.options);
    var line_plot           = $.plot($('#line-chart'),           line_chart.data,           line_chart.options);
    var point_plot          = $.plot($('#point-chart'),          point_chart.data,          point_chart.options);
    var combination_plot    = $.plot($('#combination-chart'),    combination_chart.data,    combination_chart.options);
    var area_plot           = $.plot($('#area-chart'),           area_chart.data,           area_chart.options);
    var zoom_plot           = $.plot($('#zoom-chart'),           zoom_chart.data,           zoom_chart.options);

    // real time
    realTimeChart(area_plot, 50);

    // Zooming
    $('#zooming-reset').on('click', function() {
        $.plot($('#zoom-chart'), zoom_chart.data, zoom_chart.options);
    });
    $('#zooming-150').on('click', function() {
        zoom_plot = $.plot('#zoom-chart', zoom_chart.data,
            $.extend(true, {}, zoom_chart.options, {
                xaxis: {
                    min: 20,
                    max: 180
                },
                yaxis: {
                    min: 1200,
                    max: 5000
                }
            })
        );
    });
    $('#zoom-chart').bind('plotselected', function (event, ranges) {
        // clamp the zooming to prevent eternal zoom
        if (ranges.xaxis.to - ranges.xaxis.from < 0.00001) {
            ranges.xaxis.to = ranges.xaxis.from + 0.00001;
        }

        if (ranges.yaxis.to - ranges.yaxis.from < 0.00001) {
            ranges.yaxis.to = ranges.yaxis.from + 0.00001;
        }

        // do the zooming
        zoom_plot = $.plot('#zoom-chart', zoom_chart.data,
            $.extend(true, {}, zoom_chart.options, {
                xaxis: {
                    min: ranges.xaxis.from,
                    max: ranges.xaxis.to
                },
                yaxis: {
                    min: ranges.yaxis.from,
                    max: ranges.yaxis.to
                }
            })
        );
    });
};

var miscPage = function() {
    $(document).ready(function() {
        var bar = $('.bar:first');

        var _animate_timeout_id = null;
        var _animateBar = function() {
            if (!bar.is(':visible')) {
                return;
            }

            if (_animate_timeout_id) {
                clearTimeout(_animate_timeout_id);
            }

            var current = parseInt(bar.text(), 10);

            if (current < 100) {
                current += parseInt(Math.random() * 5, 10);
                current = Math.min(current, 100);

                bar.width(current + '%').children().text(current + '%');
                _animate_timeout_id = setTimeout(_animateBar, 1000);
            }
        };

        _animate_timeout_id = setTimeout(_animateBar, 1000);
    });
};

var dialogPage = function() {
    $(document).ready(function() {
        var open_dialog = function(evt) {
            var theme     = $(this).attr('class').replace(/btn btn-small btn-/, '');
            var draggable = $(this).parent().hasClass('draggable');

            if ($(this).parent().hasClass('message')) {
                var buttons = [];
            } else {
                var use_countdown = $(this).parent().hasClass('countdown')

                var buttons = [
                    {
                        text:  'Cancel',
                        icon:  'icon-remove',
                        click: function(evt, btn) {
                            App.dialog.close();
                        }
                    },
                    {
                        text:      'Save',
                        icon:      'icon-save',
                        countdown: use_countdown ? 5 : 0,
                        click:     function(evt, btn) {
                            btn.children('i').attr('class', 'icon-refresh icon-spin')
                            btn.prop('disabled', true);

                            setTimeout(function() {
                                btn.children('i').attr('class', 'icon-save')
                                btn.prop('disabled', false);
                            }, 2000);
                        }
                    }
                ];
            }

            App.dialog.open({
                width:     500,
                title:     'Hello There',
                content:   '<strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                theme:     theme,
                draggable: draggable,
                buttons:   buttons
            });
        };

        $('.button-group-row button').on('click', open_dialog);

        prettyPrint();
    });
};

var notificationPage = function() {
    $(document).ready(function() {
        $('#notification-add').on('click', function(evt) {
            App.notification.add('Hello World', 'You have got a new message from John Tomason. <a href="#">Check it out</a>.');
        });

        $('#notification-close').on('click', function(evt) {
            App.notification.add('Hello World', 'This notification will be closed in 20 seconds automatically.', 20000);
        });

        $('#notification-remove-all').on('click', function(evt) {
            App.notification.removeAll();
        });

        $('#notification-remove-first').on('click', function(evt) {
            App.notification.removeFirst();
        });

        $('#notification-remove-last').on('click', function(evt) {
            App.notification.removeLast();
        });

        $('#notification-remove-2').on('click', function(evt) {
            App.notification.removeAt(1);
        });
    });

    prettyPrint();
};

var galleryPage = function() {
    // open image in a dialog
    $(document).ready(function() {
        $('div.file-gallery span.name a').on('click', function(evt) {
            evt.preventDefault();
            window.open($(this).parents('div.item:first').find('div.preview img').attr('src'), '_blank');
        });

        $('button.gallery-view').on('click', function(evt) {
            if ($(this).hasClass('active')) {
                return;
            }

            $('button.gallery-view').removeClass('active');
            $(this).addClass('active');

            $('div.file-gallery').attr('class', 'file-gallery file-gallery-' + $(this).data('view'));
        });
    });
};

var calendarPage = function() {
    $(document).ready(function() {
        $('#calendar').fullCalendar(getCalendarOptions());
    });
};

