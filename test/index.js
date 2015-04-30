"use strict";

describe ("DayScheduleSelector", function () {
  beforeEach (function () {
    document.body.innerHTML = '<div id="schedule-selector"></div>';
  });

  describe ("initialization", function () {
    describe ("with default options", function () {
      beforeEach (function () {
        $ ("#schedule-selector").dayScheduleSelector ();
      });

      it ("initializes the day labels properly");

      it ("initializes the time labels properly");

      it ("initializes the time slots properly", function () {
        $("#schedule-selector .time-slot").length.should.eq(24 * 7);
      });
    });

    describe ("with custom options", function () {
      beforeEach (function () {
        $("#schedule-selector").dayScheduleSelector({
          days: [1, 3, 5, 6],
          startTime: '12:00',
          endTime: '17:00',
          interval: 20
        });
      })

      it ("initializes the day labels properly");

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
});
