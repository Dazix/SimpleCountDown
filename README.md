# Simple countdown

Just another web countdown. The code is written in Vanilla JS & CSS without any other dependency. 
[Live DEMO](https://codepen.io/DazixCZ/pen/BZqjZV)

## Compatibility
### Compiled state
- IE 10+
- Firefox 32+ (maybe lower)
- Chrome 32+ (maybe lower)
- Chromium 43+ (I think it will be same like Chrome but I don't have chance to test lower versions)
- Opera 30+ (maybe lower)
- Edge 14+
- Safari 9+ (awful browser it's like new IE)

### Uncompiled state
- ~~IE~~
- Firefox 45+
- Chrome 49+
- Opera 36+
- Edge 14+
- Safari 9+ (awful browser it's like new IE)

## Usage
There is more ways how to write the final date. You can pass it as object (as bellow) or 
as string in one of JS standard `Date` format or as milliseconds timestamp or as instance 
of `Date`. 

Output order/format is set by key `outputFormat`. Possible values are `year`, `week`, `day`, 
`hour`, `minute` and `second` each separate by pipe char `|`. Unfortunately there is no option 
for month because count months is little bit hard-work maybe sometimes in future.

Option `countdown` is there for toggling countdown and countup modes. For both modes is posible define date, 
for `countdown: true` it means end date and for `countdown: false` it means start date.

```javascript
let cd = new Countdown({
    cont: document.querySelector('.container'),
    countdown: true, // true for classic countdown, false for countup
    date: {
        day: 9,
        month: 8,
        year: 2017,
        hour: 20,
        minute: 5,
        second: 0,
    },
    /*
    date: "Wednesday March 25 2019",
    // or
    date: 1553468400000,
    // or
    date: new Date(1553468400000),
    // or
    date: null, == for now
    // or
    missing date key, == for now too
     */
    outputTranslation: {
        year: 'Years',
        week: 'Weeks',
        day: 'Days',
        hour: 'Hours',
        minute: 'Minutes',
        second: 'Seconds'
    },
    endCallback: function() {
        // do something awesome
    },
    outputFormat: 'week|day|hour|minute|second',
});

cd.start();
// or
cd.stop();
```

## Style
Every element has his own class with `countDown_` prefix for non-conflict usage. 
And also there are some style configuration variables at the beginning of 
non-compiled `style.less` file. 
