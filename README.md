# Simple countdown

Just another web countdown. Code is written in "pure" JS & CSS without any other dependency. 
[Live DEMO](https://codepen.io/DazixCZ/pen/BZqjZV)

## Usage:
There is more ways how to write the final date. You can pass it as object (as bellow) or 
as string in one of JS standard `Date` format or as milliseconds timestamp or as instance 
of `Date`. 
Output order/format is set by key `outputFormat`. Possible values are `year`, `week`, `day`, 
`hour`, `minute` and `second` each separate by pipe char `|`. Unfortunately there is no option 
for month because count months is little bit hard-work maybe sometimes in future.
```javascript
let cd = new Countdown({
    cont: document.querySelector('.container'),
    endDate: {
        day: 9,
        month: 8,
        year: 2017,
        hour: 20,
        minute: 5,
        second: 0,
    },
    /*
    endDate: "Wednesday March 25 2019",
    // or
    endDate: 1553468400000,
    // or
    endDate: new Date(1553468400000),
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
