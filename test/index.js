"use strict";

describe ("DayScheduleSelector", function () {
  beforeEach (function () {
    document.body.innerHTML = '<div id="schedule-selector"></div>';
  });

  describe ("initialization", function () {
    describe ("with default options", function () {
      beforeEach (function () {
        $("#schedule-selector").dayScheduleSelector();
      });

      it ("initializes the day labels properly", function() {
        var stringDays = $("#schedule-selector").data('artsy.dayScheduleSelector').options.stringDays
          , days = $("#schedule-selector").data('artsy.dayScheduleSelector').options.days;

        $(".schedule-header th").length.should.eq(days.length + 1);
        $.each(days, function(index, day) {
          $(".schedule-header th").eq(index + 1).text().should.eq(stringDays[index] || "");
        });
      });

      it ("initializes the time labels properly");

      it ("initializes the time slots properly", function () {
        $("#schedule-selector .time-slot").length.should.eq(24 * 7);
      });
    });

    describe ("with custom options", function () {
      beforeEach (function () {
        $("#schedule-selector").dayScheduleSelector({
          days: [1, 3, 5, 6],
          stringDays: ['星期一', '星期三', '星期五'],
          startTime: '12:00',
          endTime: '17:00',
          interval: 20
        });
      })

      it ("initializes the day labels properly", function() {
        var stringDays = $("#schedule-selector").data('artsy.dayScheduleSelector').options.stringDays
          , days = $("#schedule-selector").data('artsy.dayScheduleSelector').options.days;

        $(".schedule-header th").length.should.eq(days.length + 1);
        $.each(days, function(index, day) {
          $(".schedule-header th").eq(index + 1).text().should.eq(stringDays[index] || "");
        });
      });

      it ("initializes the time labels properly");

      it ("initializes the time slots properly");
    });
  });

  describe ("selection", function () {
    beforeEach (function () {
      $("#schedule-selector").dayScheduleSelector();
    });

    describe ("clicking on the time slots", function () {
      it ("selects the time slot after the first click", function () {
        var $slot = $("#schedule-selector .time-slot").first();

        $slot.click()
        $slot.is("[data-selecting='selecting']").should.be.ok;
        $("#schedule-selector").data('artsy.dayScheduleSelector').isSelecting().should.be.ok;
      });

      it ("disables other days after the first click");
    });

    $.each([".time-label", "th"], function (i, s) {
      describe ("clicking on " + s, function () {
        it ("does not select anything", function() {
          $("#schedule-selector").find(s).length.should.be.above(0);
          $("#schedule-selector").find(s).click();
          $("#schedule-selector").data('artsy.dayScheduleSelector').isSelecting().should.not.be.ok
          $("#schedule-selector").find(s).each(function (_, el) {
            $(el).is("[data-selecting], [data-selected]").should.not.be.ok
          });
        });
      });
    });
  });

  describe ("events", function () {
    beforeEach (function () {
      $("#schedule-selector").dayScheduleSelector();
    });

    describe ("selected", function () {
      it ("receives the selected event properly with correct data", function (done) {
        $("#schedule-selector").on('selected.artsy.dayScheduleSelector', function  (e, $selected) {
          $selected.length.should.eq(5);
          done();
        });
        $("#schedule-selector .time-slot[data-time='08:30'][data-day='3']").click();
        $("#schedule-selector .time-slot[data-time='10:30'][data-day='3']").click();
      });
    })
  });

  describe ("#serialize", function() {
    beforeEach (function() {
      var selections = [
        [0, '08:00'], [0, '19:30'], // first one and last one
        [1, '08:00'], [1, '08:30'], [1, '19:00'], [1, '19:30'], // first two and last two
        [2, '19:30'], // only last one
        // all day for 3 (Wednesday),
        [4, '08:00'], [4, '09:00'], [4, '10:00'], [4, '11:00'], [4, '12:00'], // every other slots in the morning
        [5, '13:00'], [5, '14:00'], [5, '15:00'], [5, '16:00'], [5, '17:00'], // every other slots in the afternoon
        [6, '08:00'], [6, '08:30'], [6, '09:00'], [6, '11:30'], [6, '12:00'], [6, '18:30'], [6, '19:00'], [6, '19:30']
      ]
      $("#schedule-selector").dayScheduleSelector();
      for (var i = 0; i < selections.length; i++) {
        $("#schedule-selector .time-slot[data-day='" + selections[i][0] +"'][data-time='" + selections[i][1] + "']").attr('data-selected', 'selected');
      }
      // Select all day for Wednesday
      $("#schedule-selector .time-slot[data-day='3']").attr('data-selected', 'selected');
    });

    it ("serializes the selected time slots correctly", function () {
      var selected = $("#schedule-selector").data('artsy.dayScheduleSelector').serialize()
      selected.should.eql({
        0: [['08:00', '08:30'], ['19:30', '20:00']],
        1: [['08:00', '09:00'], ['19:00', '20:00']],
        2: [['19:30', '20:00']],
        3: [['08:00', '20:00']],
        4: [['08:00', '08:30'], ['09:00', '09:30'], ['10:00', '10:30'], ['11:00', '11:30'], ['12:00', '12:30']],
        5: [['13:00', '13:30'], ['14:00', '14:30'], ['15:00', '15:30'], ['16:00', '16:30'], ['17:00', '17:30']],
        6: [['08:00', '09:30'], ['11:30', '12:30'], ['18:30', '20:00']]
      });
    });
  });
});
