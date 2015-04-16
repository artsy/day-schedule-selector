# day-schedule-selector

A jQuery plugin to render a weekly schedule and allow selecting time slots in each day.

## Getting Started
```javascript
$('#weekly-schedule').dayScheduleSelector({
  /* options */
});
```
## Options

```
$("#weekly-schedule").dayScheduleSelector({
  days: [1, 2, 3, 5, 6],
  startTime: '09:50',
  endTime: '21:06',
  interval: 15
});
```

#### days
default: `[0, 1, 2, 3, 4, 5, 6]`

An integer array of days included in the calendar with Sunday being `0` and Saturday being `6`.

#### startTime
default: `'08:00'`

Start time of each day on the calendar, in `HH:mm` format.

#### endTime
default: `'20:00'`

End time of each day on the calendar, in `HH:mm` format.

#### interval
default: `30`

An integer value representing length of each time slot, in minutes.

## Events
The following custom events are triggered on the element.

#### selected.artsy.dayScheduleSelector
Triggered when a selection is made. Passes the event and an array of selected time slots to the event handler.
```javascript
$("#weekly-schedule").on('selected.artsy.dayScheduleSelector', function (e, selected) {
  /* selected is an array of time slots selected this time. */
}
```
