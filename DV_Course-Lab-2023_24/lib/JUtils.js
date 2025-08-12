////////////////////////////////////////
function are_arrays_equal_shallow(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
}
function are_objects_equal_shallow(a, b) {
    if (typeof a !== 'object' || typeof b !== 'object') return false;
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    return Object.keys(a).every(k => a[k] === b[k]);
}
function are_equal_shallow(a, b) {
    if (typeof a !== typeof b) return false;
    if (Array.isArray(a)) return are_arrays_equal_shallow(a, b);
    if (typeof a === 'object') return are_objects_equal_shallow(a, b);
    return a === b;
}
function max_of_object(obj, filter_keys = []) {
    // if obj is not an object or is an empty object
    if (typeof obj !== 'object' || Object.keys(obj).length === 0) {
        return undefined;
    }

    // if filter_keys is an empty array
    if (filter_keys instanceof Array) {
        // default behavior
        if (filter_keys.length === 0) {
            return Math.max(...Object.keys(obj).map(k => obj[k]));
        }
        // else if check that all the values in filter_keys are string and are keys of obj
        if (filter_keys.every(k => typeof k === 'string' && k in obj)) {
            return Math.max(...filter_keys.map(k => obj[k]));
        }
    }
}
function min_of_object(obj, filter_keys = []) {
    // if obj is not an object or is an empty object
    if (typeof obj !== 'object' || Object.keys(obj).length === 0) {
        return undefined;
    }

    // if filter_keys is an empty array
    if (filter_keys instanceof Array) {
        // default behavior
        if (filter_keys.length === 0) {
            return Math.min(...Object.keys(obj).map(k => obj[k]));
        }
        // else if check that all the values in filter_keys are string and are keys of obj
        if (filter_keys.every(k => typeof k === 'string' && k in obj)) {
            return Math.min(...filter_keys.map(k => obj[k]));
        }
    }
}
function extent_of_object(obj, filter_keys = []) {
    const min = min_of_object(obj, filter_keys);
    const max = max_of_object(obj, filter_keys);
    return [min, max];
}
function sort_object_by_values(obj, reverse = false) {
    return Object.fromEntries(
        Object.entries(obj).sort((a, b) => reverse ? b[1] - a[1] : a[1] - b[1])
    );
}

////////////////////////////////////////


////////////////////////////////////////
/**
 * Convert a char to a number
 * (A -> 0, B -> 1, ..., Z -> 25)
 * (a -> 0, b -> 1, ..., z -> 25)
 * (other -> undefined)
 * @param char
 * @return {number}
 */
function char2num(char) {
    const isChar = typeof char === 'string' && char.length === 1 && char.match(/[a-zA-Z]/);
    if (!isChar) return undefined;

    const isLower = char === char.toLowerCase();
    const base = isLower ? 'a' : 'A';
    return char.charCodeAt(0) - base.charCodeAt(0) ;
}

/**
 * Convert a number to a char
 * (0 -> A, 1 -> B, ..., 25 -> Z) if isLower is false
 * (0 -> a, 1 -> b, ..., 25 -> z) if isLower is true
 * (other -> undefined)
 * @param num
 * @param isLower
 * @return {undefined|string}
 */
function num2char(num, isLower = true) {
    const isNum = typeof num === 'number' && num >= 0 && num <= 25;
    if (!isNum) return undefined;

    const base = isLower ? 'a' : 'A';
    return String.fromCharCode(base.charCodeAt(0) + num);
}

/** Convert a number to a date
 * (0 -> today, 1 -> tomorrow, -1 -> yesterday, ...)
 * @param n
 * @return {undefined|Date}
 */
function int2date(n) {
    if (typeof n !== 'number') return undefined;
    const date = new Date();
    date.setDate(date.getDate() + n);
    return date;
}
////////////////////////////////////////


////////////////////////////////////////
/**
 * Create an array of numbers in the range [start, end] with a step.
 * @param start
 * @param end
 * @param step
 * @return {undefined|*[]}
 */
function range(start, end, step = 1) {
    const isNum = typeof start === 'number' && typeof end === 'number' && typeof step === 'number';
    if (!isNum) return undefined;

    const isPositive = step > 0;
    if (!isPositive) return undefined;

    const isIncreasing = start < end;
    if (!isIncreasing) return undefined;

    let data = [];
    for (let i = start; i <= end; i += step) {
        data.push(i);
    }
    return data;

}
/**
 * Get a random integer between a and b
 * @param a
 * @param b
 * @param b_inclusive - if true, the result is in [a, b], otherwise in [a, b)
 * @return {number}
 */
function get_random_int_between_A_and_B(a, b, b_inclusive = true) {
    // Math.random() -> [0, 1)
    // [0, 1) * (b - a + 1) -> [0, b - a + 1)
    // [0, b - a + 1) + a -> [a, b + 1) == [a, b] if b_inclusive == true
    const inc = b_inclusive ? 1 : 0;
    return Math.floor(Math.random() * (b - a + inc) + a);
}

/**
 * Get N random numbers in the range [min, max]. If sort is true, sort the array
 * @param N
 * @param min
 * @param max
 * @param sort - if true, sort the array
 * @return {*[]}
 */
function get_N_random_numbers_in_range(N, min, max, sort=true) {
    let data = [];
    // If the range is far greater than the number of elements, randomize N numbers in the range [min, max]
    if ((max - min) > (10 * N)) {
        // Add random numbers to the array till the length is N
        for (let i = 0; i < N; i++) {
            let number;
            do {
                number = get_random_int_between_A_and_B(min, max);
            } while (data.includes(number));
            data.push(number);
        }

    }
    // Otherwise, create an array of numbers in the range [min, max] and select N random numbers from it
    else {
        const numbers = range(min, max , 1);
        console.log("numbers", numbers)
        while (data.length < N) {
            const i = Math.floor(Math.random() * numbers.length);
            data.push(numbers[i]);
            numbers.splice(i, 1);
        }
    }
    if(sort) data.sort((a, b) => a - b);
    return data;
}
////////////////////////////////////////


////////////////////////////////////////
function call_code_after_N_seconds(wait_seconds, callback) {
    setTimeout(callback, wait_seconds * 1000);
}
function log_seconds_in_console(max_seconds) {
    let time = 0;
    console.log("BEGIN")
    const interval = setInterval( () => {
        time += 1;
        console.log(`SECOND... ${time}!!`)
        if (time >= max_seconds) {
            console.log("STOP")
            clearInterval(interval);
        }
    }, 1000);
}
////////////////////////////////////////


// Define the tests function within an IIFE to encapsulate it
(function() {
    function tests() {
        console.assert(are_arrays_equal_shallow([1, 2, 3], [1, 2, 3]) === true);
        console.assert(are_arrays_equal_shallow([1, 2, 3], [1, 2, 4]) === false);
        console.assert(are_arrays_equal_shallow([1, 2, 3], [1, 2, 3, 4]) === false);

        console.assert(are_objects_equal_shallow({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3}) === true);
        console.assert(are_objects_equal_shallow({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 4}) === false);
        console.assert(are_objects_equal_shallow({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3, d: 4}) === false);

        console.assert(max_of_object({a: 9, b: 20, c: 30, d: 8, e: 12}) === 30);
        console.assert(max_of_object({a: 9, b: 20, c: 30, d: 8, e: 12}, ['a', 'b']) === 20);
        console.assert(max_of_object({a: 9, b: 20, c: 30, d: 8, e: 12}, ['a', 'b', 'f']) === undefined);

        console.assert(min_of_object({a: 9, b: 20, c: 30, d: 8, e: 12}) === 8);
        console.assert(min_of_object({a: 9, b: 20, c: 30, d: 8, e: 12}, ['a', 'b']) === 9);
        console.assert(min_of_object({a: 9, b: 20, c: 30, d: 8, e: 12}, ['a', 'b', 'f']) === undefined);

        console.assert(are_equal_shallow(extent_of_object({a: 9, b: 20, c: 30, d: 8, e: 12}) , [8, 30]));
        console.assert(are_equal_shallow(extent_of_object({a: 9, b: 20, c: 30, d: 8, e: 12}, ['a', 'b']) , [9, 20]));
        console.assert(are_equal_shallow(extent_of_object({a: 9, b: 20, c: 30, d: 8, e: 12}, ['a', 'b', 'f']) , [undefined, undefined]));

        console.assert(char2num('A') === 0);
        console.assert(char2num('B') === 1);
        console.assert(char2num('Z') === 25);
        console.assert(char2num('a') === 0);
        console.assert(char2num('b') === 1);
        console.assert(char2num('z') === 25);
        console.assert(char2num(' ') === undefined);
        console.assert(char2num('Aa') === undefined);
        console.assert(char2num('') === undefined);

        console.assert(int2date(0).toDateString() === new Date().toDateString());
        console.assert(int2date(1).toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString());
        console.assert(int2date(-1).toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString());

        console.assert(num2char(0) === 'a');
        console.assert(num2char(1) === 'b');
        console.assert(num2char(25) === 'z');
        console.assert(num2char(0, false) === 'A');
        console.assert(num2char(1, false) === 'B');
        console.assert(num2char(25, false) === 'Z');

        console.assert(range(1, 10, 2).join(',') === '1,3,5,7,9');
        console.assert(range(3,15).join(',') === '3,4,5,6,7,8,9,10,11,12,13,14,15');
        console.assert(range(1, 10, 0) === undefined);

        console.assert(get_random_int_between_A_and_B(1, 10) >= 1 && get_random_int_between_A_and_B(1, 10) <= 10);


        console.log("All tests passed!");
    }
    tests();

    // Optionally, you can add tests to the JLib object if you need to access it internally
    // JLib.tests = tests;
})();

// Create an object and assign your functions to its properties
const JLib = {
    are_equal_shallow: are_equal_shallow,
    extent_of_object: extent_of_object,

    sort_object_by_values: sort_object_by_values,

    num2char: num2char,
    char2num: char2num,
    int2date: int2date,

    range: range,
    get_random_int_between_A_and_B: get_random_int_between_A_and_B,
    get_N_random_numbers_in_range: get_N_random_numbers_in_range,

    call_code_after_N_seconds: call_code_after_N_seconds,
    log_seconds_in_console: log_seconds_in_console
};

// Export the object
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JLib; // for Node.js
} else {
    window.JLib = JLib; // for browsers
}