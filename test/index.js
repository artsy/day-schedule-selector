"use strict";

describe("DayScheduleSelector", function() {
  beforeEach(function() {
    document.body.innerHTML = '<div id="schedule-selector"></div>';
  });

  describe("initialize", function() {
    describe("with default options", function() {
      beforeEach(function() {
        $("#schedule-selector").dayScheduleSelector();
      });

      it("initializes the time slots properly", function() {
        $("#schedule-selector .time-slot").length.should.eq(24 * 7);
      });
    });
  });

  describe("events", function() {
    beforeEach(function() {
      $("#schedule-selector").dayScheduleSelector();
    });

    describe("selected", function() {
      it("receives the selected event properly with correct data", function(done) {
        $("#schedule-selector").on('selected.artsy.dayScheduleSelector', function (e, $selected) {
          $selected.length.should.eq(5);
          done();
        });
        $("#schedule-selector .time-slot[data-time='08:30'][data-day='3']").click();
        $("#schedule-selector .time-slot[data-time='10:30'][data-day='3']").click();
      });
    })
  });
});
