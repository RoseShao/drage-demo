export const throttle = (fn, delay) => {
    var timer;
    return function () {
        var _this = this;
        var args = arguments;
        if (timer) {
            return;
        }
        timer = setTimeout(() => {
            fn.apply(_this, args);
            timer = null; 
        }, delay)
    }
}

