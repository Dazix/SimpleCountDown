export default class Countdown {

    get TIMESTAMP_SECOND() { return 1000; }
    get TIMESTAMP_MINUTE() { return 60 * this.TIMESTAMP_SECOND; }
    get TIMESTAMP_HOUR() { return 60 * this.TIMESTAMP_MINUTE; }
    get TIMESTAMP_DAY() { return 24 * this.TIMESTAMP_HOUR; }
    get TIMESTAMP_WEEK() { return 7 * this.TIMESTAMP_DAY; }
    get TIMESTAMP_YEAR() { return 365 * this.TIMESTAMP_DAY; }

    /**
     * @param {{}} userOptions structure like this.options below
     */
    constructor(userOptions) {
        this.options = {
            cont: null,
            countdown: true,
            date: {
                year: 0,
                month: 0,
                day: 0,
                hour: 0,
                minute: 0,
                second: 0,
            },
            endCallback: null,
            outputFormat: 'year|week|day|hour|minute|second',
            outputTranslation: {
                year: 'Years',
                week: 'Weeks',
                day: 'Days',
                hour: 'Hours',
                minute: 'Minutes',
                second: 'Seconds',
            }
        };

        this.lastTick = null;
        this.intervalsBySize = [
            'year', 'week', 'day', 'hour', 'minute', 'second',
        ];
        this.elementClassPrefix = 'countDown__';
        this.interval = null;
        this.digitConts = {};

        this._assignOptions(this.options, userOptions);
    }

    start() {
        let date,
            dateData;

        this._fixCompatibility();

        date = this._getDate(this.options.date);

        dateData = this._prepareTimeByOutputFormat(date);

        this._writeData(dateData);

        this.lastTick = dateData;

        if (this.options.countdown && date.getTime() <= Date.now()) {
            this.stop();
            if (typeof this.options.endCallback === 'function') {
                this.options.endCallback();
            }
        } else {
            this.interval = setInterval(
                () => {
                    if (this.options.countdown && date.getTime() <= Date.now()) {
                        this.stop();
                        if (typeof this.options.endCallback === 'function') {
                            this.options.endCallback();
                        }
                    } else {
                        this._updateView(
                            this._prepareTimeByOutputFormat(date)
                        );
                    }
                },
                this.TIMESTAMP_SECOND
            );
        }
    }

    stop() {
        if (this.interval !== null) {
            clearInterval(this.interval);
        }
    }

    /**
     * @param {Date|Object|String|Number} date
     * 
     * @returns {Date}
     * @private
     */
    _getDate(date) {
        if (typeof date === 'object') {
            if (date instanceof Date) {
                return date;
            } else {
                let expectedValues = {
                    day: 0,
                    month: 0,
                    year: 0,
                    hour: 0,
                    minute: 0,
                    second: 0,
                };

                for (let i in expectedValues) {
                    if (expectedValues.hasOwnProperty(i) && date.hasOwnProperty(i)) {
                        expectedValues[i] = date[i];
                    }
                }

                return new Date(
                    expectedValues.year,
                    expectedValues.month > 0 ? expectedValues.month - 1 : expectedValues.month,
                    expectedValues.day,
                    expectedValues.hour,
                    expectedValues.minute,
                    expectedValues.second
                );
            }
        } else if (typeof date === 'number' || typeof date === 'string') {
            return new Date(date);
        } else {
            return new Date();
        }
    }

    /**
     * @param {Date} dateObj
     * 
     * @return {{}}
     * @private
     */
    _prepareTimeByOutputFormat(dateObj) {
        let usedIntervals, output = {}, timeDiff;

        usedIntervals = this.intervalsBySize.filter(item => {
            return this.options.outputFormat.split('|').indexOf(item) !== -1;
        });

        timeDiff = this.options.countdown ? dateObj.getTime() - Date.now() : Date.now() - dateObj.getTime();

        usedIntervals.forEach(item => {
            let value;
            if (timeDiff > 0) {
                switch (item) {
                    case 'year':
                        value = Math.trunc(timeDiff / this.TIMESTAMP_YEAR);
                        timeDiff -= value * this.TIMESTAMP_YEAR;
                        break;
                    case 'week':
                        value = Math.trunc(timeDiff / this.TIMESTAMP_WEEK);
                        timeDiff -= value * this.TIMESTAMP_WEEK;
                        break;
                    case 'day':
                        value = Math.trunc(timeDiff / this.TIMESTAMP_DAY);
                        timeDiff -= value * this.TIMESTAMP_DAY;
                        break;
                    case 'hour':
                        value = Math.trunc(timeDiff / this.TIMESTAMP_HOUR);
                        timeDiff -= value * this.TIMESTAMP_HOUR;
                        break;
                    case 'minute':
                        value = Math.trunc(timeDiff / this.TIMESTAMP_MINUTE);
                        timeDiff -= value * this.TIMESTAMP_MINUTE;
                        break;
                    case 'second':
                        value = Math.trunc(timeDiff / this.TIMESTAMP_SECOND);
                        timeDiff -= value * this.TIMESTAMP_SECOND;
                        break;
                }
            } else {
                value = '00';
            }
            output[item] = (('' + value).length < 2 ? '0' + value : '' + value).split('');
        });

        return output;
    }

    _fixCompatibility() {
        Math.trunc = Math.trunc || function (x) {
            if (isNaN(x)) {
                return NaN;
            }
            if (x > 0) {
                return Math.floor(x);
            }
            return Math.ceil(x);
        };
    }

    /**
     * @param {{}} data
     * @private 
     */
    _writeData(data) {
        let code = `<div class="${this.elementClassPrefix}cont">`,
            intervalName;

        for (intervalName in data) {
            if (data.hasOwnProperty(intervalName)) {
                let element = `<div class="${this.elementClassPrefix}interval_basic_cont">
                                       <div class="${this._getIntervalContCommonClassName()} ${this._getIntervalContClassName(intervalName)}">`,
                    intervalDescription = `<div class="${this.elementClassPrefix}interval_basic_cont_description">
                                                   ${this.options.outputTranslation[intervalName]}
                                               </div>`;
                data[intervalName].forEach((digit, index) => {
                    element += `<div class="${this._getDigitContCommonClassName()} ${this._getDigitContClassName(index)}">
                                        ${this._getDigitElementString(digit, 0)}
                                    </div>`;
                });

                code += element + '</div>' + intervalDescription + '</div>';
            }
        }

        this.options.cont.innerHTML = code + '</div>';
        this.lastTick = data;
    }

    /**
     * @param {Number} newDigit 
     * @param {Number} lastDigit
     * 
     * @returns {String}
     * @private 
     */
    _getDigitElementString(newDigit, lastDigit) {
        return `<div class="${this.elementClassPrefix}digit_last_placeholder">
                        <div class="${this.elementClassPrefix}digit_last_placeholder_inner">
                            ${lastDigit}
                        </div>
                    </div>
                    <div class="${this.elementClassPrefix}digit_new_placeholder">${newDigit}</div>
                    <div class="${this.elementClassPrefix}digit_last_rotate">${lastDigit}</div>
                    <div class="${this.elementClassPrefix}digit_new_rotate">
                        <div class="${this.elementClassPrefix}digit_new_rotated">
                            <div class="${this.elementClassPrefix}digit_new_rotated_inner">
                                ${newDigit}
                            </div>
                        </div>
                    </div>`;
    }

    /**
     * @param {{}} data
     * @private 
     */
    _updateView(data) {
        for (let intervalName in data) {
            if (data.hasOwnProperty(intervalName)) {
                data[intervalName].forEach((digit, index) => {
                    if (this.lastTick !== null && this.lastTick[intervalName][index] !== data[intervalName][index]) {
                        this._getDigitCont(intervalName, index).innerHTML =
                            this._getDigitElementString(data[intervalName][index], this.lastTick[intervalName][index]);
                    }
                });
            }
        }

        this.lastTick = data;
    }

    /**
     * @param {String} intervalName 
     * @param {String} index
     * 
     * @returns {HTMLElement}
     * @private
     */
    _getDigitCont(intervalName, index) {
        if (!this.digitConts[`${intervalName}_${index}`]) {
            this.digitConts[`${intervalName}_${index}`] =
                this.options.cont.querySelector(
                    `.${this._getIntervalContClassName(intervalName)} .${this._getDigitContClassName(index)}`
                );
        }

        return this.digitConts[`${intervalName}_${index}`];
    }

    /**
     * @param {String} intervalName
     * 
     * @returns {String}
     * @private
     */
    _getIntervalContClassName(intervalName) {
        return `${this.elementClassPrefix}interval_cont_${intervalName}`;
    }

    /**
     * @returns {String}
     * @private
     */
    _getIntervalContCommonClassName() {
        return `${this.elementClassPrefix}interval_cont`;
    }

    /**
     * @param {String} index
     * 
     * @returns {String}
     * @private
     */
    _getDigitContClassName(index) {
        return `${this.elementClassPrefix}digit_cont_${index}`;
    }

    /**
     * @returns {String}
     * @private
     */
    _getDigitContCommonClassName() {
        return `${this.elementClassPrefix}digit_cont`;
    }

    /**
     * @param {{}} options
     * @param {{}} userOptions
     */
    _assignOptions(options, userOptions) {
        for (let i in options) {
            if (options.hasOwnProperty(i) && userOptions.hasOwnProperty(i)) {
                if (options[i] !== null && typeof options[i] === 'object' && typeof userOptions[i] === 'object') {
                    this._assignOptions(options[i], userOptions[i]);
                } else {
                    options[i] = userOptions[i];
                }
            }
        }
    }
}

if (typeof(window) !== 'undefined') {
    window.Countdown = Countdown;
}

