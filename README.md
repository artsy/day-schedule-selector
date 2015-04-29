# day-schedule-selector [![Build Status](https://travis-ci.org/starsirius/day-schedule-selector.svg)](https://travis-ci.org/starsirius/day-schedule-selector)

A jQuery plugin to render a weekly schedule and allow selecting time slots in each day.

![demo](https://cloud.githubusercontent.com/assets/796573/7264504/23c2109a-e85a-11e4-9c26-19358686cbb0.gif)

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

## Installation

### Install as a Ruby gem

Add this line to your application's Gemfile:

```ruby
gem 'day_schedule_selector', '0.1.0', { git: 'https://github.com/starsirius/day-schedule-selector.git', branch: 'master' }
```

And then execute:

    $ bundle

## Usage

TODO: Write usage instructions here

## Development

### Ruby gem

After checking out the repo, run `bin/setup` to install dependencies. Then, run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release` to create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

1. Fork it ( https://github.com/starsirius/day-schedule-selector/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
