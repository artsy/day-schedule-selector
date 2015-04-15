(function ($) {
  'use strict';

  var DayScheduleSelector = function (el, options) {
    this.$el = $(el);
    this.options = $.extend({}, DayScheduleSelector.DEFAULTS, options);
    this.render(this.$el, this.options);
    this.attachEvents(this.options);
    this.$selected = undefined;
    this.selections = {};
  }

  DayScheduleSelector.VERSION = '0.0.1';

  DayScheduleSelector.DEFAULTS = {
    days: [0, 1, 2, 3, 4, 5, 6],  // Sun - Sat
    startTime: '08:00',           // HH:mm format
    endTime: '20:00',             // HH:mm format
    interval: 30,                 // minutes
    template: '<div class="day-schedule-selector">'         +
                '<table class="schedule-table">'            +
                  '<thead class="schedule-header"></thead>' +
                  '<tbody class="schedule-rows"></tbody>'   +
                '</table>'                                  +
              '<div>'
  };

  DayScheduleSelector.prototype.render = function ($el, options) {
    $el.html(options.template);
    this.renderHeader($el.find('.schedule-header'), options);
    this.renderRows($el.find('.schedule-rows'), options);
  };

  DayScheduleSelector.prototype.attachEvents = function (options) {
    var plugin = this, $slots;
    this.$el.on('click', 'td', function () {
      var day;
      if (!plugin.$selected && $(this).hasClass('selected')) { $(this).removeClass('selected'); return; }
      if (!plugin.$selected) {  // then start selecting
        plugin.$selected = $(this);
        $(this).addClass('to-be-selected');
        plugin.$el.find('.time-slot').addClass('disabled');
        plugin.$el.find('.time-slot[data-day="' + $(this).data('day') + '"]').removeClass('disabled');
      } else {                  // then end of selection
        day = plugin.$selected.data('day');
        if ($(this).data('day') == day) {  // if clicking on the same day column
          plugin.$selected = undefined;
          $slots = plugin.$el.find('.time-slot[data-day="' + day + '"]');
          $slots.filter('.to-be-selected').addClass('selected').removeClass('to-be-selected');
          plugin.$el.find('.time-slot').removeClass('disabled');
        }
      }
    });
    this.$el.on('mouseover', 'td', function () {
      var $slots, day, start, end, temp;
      if (!!plugin.$selected) {
        day = plugin.$selected.data('day');
        $slots = plugin.$el.find('.time-slot[data-day="' + day + '"]');
        $slots.removeClass('to-be-selected');
        start = $slots.index(plugin.$selected);
        end = $slots.index(this);
        if (end < 0) return;  // not hovering on the same column
        if (start > end) { temp = start; start = end; end = temp; }
        $slots.slice(start, end + 1).addClass('to-be-selected');
        console.log(start + ',' + end);
      }
    });
  };

  DayScheduleSelector.prototype.serialize = function () {
    var plugin = this
      , selections = {};

    $.each(this.options.days, function (i, v) {
      var start, end;
      start = end = false; selections[v] = [];
      plugin.$el.find(".time-slot[data-day='" + v + "']").each(function () {
        if ($(this).hasClass('selected') && !start) { start = $(this).data('time'); }
        if (!$(this).hasClass('selected') && !!start) {
          end = $(this).data('time');
          selections[v].push([start, end]);
          start = end = false;
        }
      });
    })
    return selections;
  }

  DayScheduleSelector.prototype.renderHeader = function ($el, options) {
    var stringDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      , days = options.days
      , html = '';

    $.each(days, function (_, v) { html += '<th>' + stringDays[v] + '</th>'; });
    $el.html('<tr><th></th>' + html + '</tr>');
  };

  DayScheduleSelector.prototype.renderRows = function ($el, options) {
    var dummy = '2000-01-01 '
      , interval = options.interval
      , days = options.days;

    $.each(generateDates(options.startTime, options.endTime, interval), function (i, d) {
      var daysInARow = $.map(new Array(days.length), function(_, i) {
        return '<td class="time-slot" data-time="' + d.toTimeString() + '" data-day="' + days[i] + '"></td>'
      }).join();

      $el.append('<tr><td>' + getAPTime(d) + '</td>' + daysInARow + '</tr>');
    });

    // Return time diff in mins
    function timeDiff(start, end) {   // time in HH:mm format
      var dummy = '2000-01-01 ';
      return (Date.parse(dummy + options.endTime) -
              Date.parse(dummy + options.startTime)) / 60000;
    }
    // Generate Date objects for each time slot
    function generateDates(start, end, interval) {
      var numOfRows = Math.ceil(timeDiff(start, end) / interval);
      return $.map(new Array(numOfRows), function (_, i) {
        return new Date(Date.parse('2000-01-01 ' + start) + i * interval * 60000);
      });
    }
    // Convert a Date object to time in AM/PM format (ignore its date)
    function getAPTime(date) {
      var hours = date.getHours()
        , minutes = date.getMinutes()
        , ampm = hours >= 12 ? 'pm' : 'am'

      return hours + ':' + ('0' + minutes).slice(-2) + ampm;
    }
  };

  DayScheduleSelector.prototype.getScheduleOfDay = function (day) {
  };

  // DayScheduleSelector Plugin Definition
  // =====================================

  function Plugin(option) {
    return this.each(function (){
      var $this   = $(this)
        , data    = $this.data('artsy.dayScheduleSelector')
        , options = typeof option == 'object' && option;

      if (!data) {
        $this.data('artsy.dayScheduleSelector', (data = new DayScheduleSelector(this, options)));
      }
    })
  }

  $.fn.dayScheduleSelector = Plugin;

})(jQuery);
