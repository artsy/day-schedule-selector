(function ($) {
  'use strict';

  var DayScheduleSelector = function (el, options) {
    this.$el = $(el);
    this.options = $.extend({}, DayScheduleSelector.DEFAULTS, options);
    this.render();
    this.attachEvents(this.options);
    this.$selectingStart = null;
    this.selections = {};
  }

  DayScheduleSelector.DEFAULTS = {
    days        : [0, 1, 2, 3, 4, 5, 6],  // Sun - Sat
    startTime   : '08:00',                // HH:mm format
    endTime     : '20:00',                // HH:mm format
    interval    : 30,                     // minutes
    template    : '<div class="day-schedule-selector">'         +
                    '<table class="schedule-table">'            +
                      '<thead class="schedule-header"></thead>' +
                      '<tbody class="schedule-rows"></tbody>'   +
                    '</table>'                                  +
                  '<div>'
  };

  /**
   * Generate Date objects for each time slot in a day
   * @private
   * @param {String} start Start time in HH:mm format, e.g. "08:00"
   * @param {String} end End time in HH:mm format, e.g. "21:00"
   * @param {Number} interval Interval of each time slot in minutes, e.g. 30 (minutes)
   * @returns {Array} An array of Date objects representing the start time of the time slots
   */
  function generateDates(start, end, interval) {
    var numOfRows = Math.ceil(timeDiff(start, end) / interval);
    return $.map(new Array(numOfRows), function (_, i) {
      return new Date(Date.parse('2000-01-01 ' + start) + i * interval * 60000);
    });
  }

  /**
   * Return time difference in minutes
   * @private
   */
  function timeDiff(start, end) {   // time in HH:mm format
    var dummy = '2000-01-01 '; // need a dummy date to utilize the Date object
    return (Date.parse(dummy + end) -
            Date.parse(dummy + start)) / 60000;
  }

  /**
   * Convert a Date object to time in AM/PM format (ignore its date)
   * @private
   */
  function getAPTime(date) {
    var hours = date.getHours()
      , minutes = date.getMinutes()
      , ampm = hours >= 12 ? 'pm' : 'am'

    return hours + ':' + ('0' + minutes).slice(-2) + ampm;
  }

  /**
   * Render the calendar UI
   * @public
   */
  DayScheduleSelector.prototype.render = function () {
    this.$el.html(this.options.template);
    this.renderHeader();
    this.renderRows();
  };

  /**
   * Render the calendar header
   * @public
   */
  DayScheduleSelector.prototype.renderHeader = function () {
    var stringDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      , days = this.options.days
      , html = '';

    $.each(days, function (_, v) { html += '<th>' + stringDays[v] + '</th>'; });
    this.$el.find('.schedule-header').html('<tr><th></th>' + html + '</tr>');
  };

  /**
   * Render the calendar rows, including the time slots and the label
   * @public
   */
  DayScheduleSelector.prototype.renderRows = function () {
    var start = this.options.startTime
      , end = this.options.endTime
      , interval = this.options.interval
      , days = this.options.days
      , $el = this.$el.find('.schedule-rows');

    $.each(generateDates(start, end, interval), function (i, d) {
      var daysInARow = $.map(new Array(days.length), function (_, i) {
        return '<td class="time-slot" data-time="' + d.toTimeString() + '" data-day="' + days[i] + '"></td>'
      }).join();

      $el.append('<tr><td class="time-label">' + getAPTime(d) + '</td>' + daysInARow + '</tr>');
    });
  };

  /**
   * Is the day schedule selector in selecting mode?
   * @public
   */
  DayScheduleSelector.prototype.isSelecting = function () {
    return !!this.$selectingStart;
  }

  DayScheduleSelector.prototype.select = function ($slot) { $slot.attr('data-selected', 'selected'); }
  DayScheduleSelector.prototype.deselect = function ($slot) { $slot.removeAttr('data-selected'); }

  function isSlotSelected($slot) { return $slot.is('[data-selected]'); }
  function isSlotSelecting($slot) { return $slot.is('[data-selecting]'); }

  DayScheduleSelector.prototype.attachEvents = function () {
    var plugin = this
      , options = this.options
      , $slots;

    this.$el.on('click', 'td', function () {
      var day = $(this).data('day');
      if (!plugin.isSelecting()) {  // if we are not in selecting mode
        if (isSlotSelected($(this))) { plugin.deselect($(this)); }
        else {  // then start selecting
          plugin.$selectingStart = $(this);
          $(this).attr('data-selecting', 'selecting');
          plugin.$el.find('.time-slot').attr('data-disabled', 'disabled');
          plugin.$el.find('.time-slot[data-day="' + day + '"]').removeAttr('data-disabled');
        }
      } else {  // if we are in selecting mode
        if (day == plugin.$selectingStart.data('day')) {  // if clicking on the same day column
          // then end of selection
          plugin.$el.find('.time-slot[data-day="' + day + '"]').filter('[data-selecting]')
            .attr('data-selected', 'selected').removeAttr('data-selecting');
          plugin.$el.find('.time-slot').removeAttr('data-disabled');
          plugin.$selectingStart = null;
        }
      }
    });

    this.$el.on('mouseover', 'td', function () {
      var $slots, day, start, end, temp;
      if (plugin.isSelecting()) {  // if we are in selecting mode
        day = plugin.$selectingStart.data('day');
        $slots = plugin.$el.find('.time-slot[data-day="' + day + '"]');
        $slots.filter('[data-selecting]').removeAttr('data-selecting');
        start = $slots.index(plugin.$selectingStart);
        end = $slots.index(this);
        if (end < 0) return;  // not hovering on the same column
        if (start > end) { temp = start; start = end; end = temp; }
        $slots.slice(start, end + 1).attr('data-selecting', 'selecting');
      }
    });
  };

  /**
   * Serialize the selections
   * @public
   * @returns {Object} An object containing the selections of each day, e.g.
   *    {
   *      0: [],
   *      1: [["15:00:00 GMT-0500 (EST)", "16:30:00 GMT-0500 (EST)"]],
   *      2: [],
   *      3: [],
   *      5: [["09:00:00 GMT-0500 (EST)", "12:30:00 GMT-0500 (EST)"], ["15:00:00 GMT-0500 (EST)", "16:30:00 GMT-0500 (EST)"]],
   *      6: []
   *    }
   */
  DayScheduleSelector.prototype.serialize = function () {
    var plugin = this
      , selections = {};

    $.each(this.options.days, function (_, v) {
      var start, end;
      start = end = false; selections[v] = [];
      plugin.$el.find(".time-slot[data-day='" + v + "']").each(function () {
        if (isSlotSelected($(this)) && !start) { start = $(this).data('time'); }
        else if (!isSlotSelected($(this)) && !!start) {
          end = $(this).data('time');
          selections[v].push([start, end]);
          start = end = false;
        }
      });
    })
    return selections;
  }

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
