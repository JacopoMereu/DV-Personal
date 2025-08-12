window.onload = main;

function main() {
    // This message is shown in the Browser console. Use the shortcut
    console.log("You can read the console.log(...) from the browser's developer tools!")

    // This is a comment. Comments are ignored by the JavaScript interpreter.
    console
        .log("An instruction can be written on a single line, " +
            "or it can be split into multiple lines. " +
            "The semicolon at the end is optional (;).");


    // variablesDeclaration()
    // dataTypes()
    // operators()
    // controlStructures()
    // callbacks()
    // DOM()
}

function variablesDeclaration() {
    // Variables can be declared using the var, let, or const keywords.
    // var is the old way of declaring variables, and it's not recommended to use it anymore.
    // let and const are the new ways of declaring variables, and they are recommended to use.

    // let is used to declare a variable that can be reassigned.
    let x = 5;
    console.log("\nlet x = 5 ==> x now is:", x); // This will print "5" to the console.
    x = 6;
    console.log("x = 6 ==> x now is:", x); // This will print "6" to the console.
    x = 10 / 3;
    console.log("x = 10/3 ==> x now is:", x); // This will print "3.3333333333333335" to the console.
    x = "Hello";
    console.log(`x = \"Hello\" ==> x now is: ${x}`); // This will print "Hello" to the console.
    x = true;
    console.log(`x = true ==> x now is: ${x}`); // This will print "true" to the console.

    // const is used to declare a variable that cannot be reassigned.
    const y = 5;
    console.log("\nconst y = 5 ==> y now is:", y); // This will print "5" to the console.
    // y = 6; // This will cause an error.

    // Variables can be declared without being assigned a value.
    let z;
    console.log("\nlet z; ==> z now is ", z); // This will print "undefined" to the console.
}

function dataTypes() {
    // JavaScript is a loosely typed language, meaning that you don't have to declare the type of a variable when you declare it.
    // The type of a variable is determined when the variable is assigned a value.

    // There are 7 data types in JavaScript:
    // - Number
    // - String
    // - Boolean
    // - Object
    // - Function
    // - Symbol // SKIP
    // - Undefined
    // - Null

    // Number (there is no distinction between integers and floats in js... they are all "Number")
    let x = 5;
    console.log("\nlet x = 5 ==> x is a", typeof x); // This will print "number" to the console.
    x = 5.5;
    console.log("x = 5.5 ==> x is a", typeof x); // This will print "number" to the console.

    // String
    let y = "Hello";
    console.log(`\nlet y = "Hello" ==> y is a ${typeof y}`); // This will print "string" to the console.
    y += ' World';
    console.log(`y += ' World' ==> y is a ${typeof y}`); // This will print "string" to the console.

    // Boolean
    let z = true;
    console.log(`\nlet z = true ==> z is a ${typeof z}`); // This will print "boolean" to the console.
    z = false;
    console.log(`z = false ==> z is a ${typeof z}`); // This will print "boolean" to the console.

    // Array
    let arr = [1, 2, 3, 4, 5];
    console.log(`\nlet arr = [1, 2, 3, 4, 5] ==> arr is an ${typeof arr}`); // This will print "object" to the console.

    // Function
    let func = function () {
        console.log("Hello")
    };

    function func2() {
        console.log("Hello");
        console.log("Hello again")
    }

    console.log(`\nlet func = function() {console.log("Hello")} ==> func is a ${typeof func}`); // This will print "function" to the console.
    console.log(`\nfunction func2() {console.log("Hello")} ==> func2 is a ${typeof func2}`); // This will print "function" to the console.
    // Side note about arrow functions:
    // let sum = (a, b) => {console.log(a,b); return a + b};
    // If the function has only one line, you can omit the curly braces and the return statement:
    // let sum = (a, b) => {return a + b};
    // let sum = (a, b) => a + b;

    // Undefined
    let undef;
    console.log(`\nlet undef; ==> undef is ${typeof undef}`); // This will print "undefined" to the console.

    // Object (it's like a dictionary in Python, or a map in Java)
    let obj = {
        name: "John",
        age: 30,
        "salary": 1234.56,
        "isMarried": true,
        "address": {street: "123 Main St", city: "New York"},
        childrenAges: [5, 7, 9]
    };
    console.log(`\nlet obj = {
        name: "John",
        age: 30,
        "salary":1234.56,
        "isMarried": true,
        "address": {street: "123 Main St", city: "New York"},
        childrenAges: [5, 7, 9]
    }; ==> obj is an ${typeof obj}`); // This will print "object" to the console.
}

function operators() {
    // Arithmetic operators
    let x = 5;
    let y = 2;
    console.log(`\nlet x = 5; let y = 2; ==> x + y = ${x + y}`); // This will print "7" to the console.
    console.log(`x - y = ${x - y}`); // This will print "3" to the console.
    console.log(`x * y = ${x * y}`); // This will print "10" to the console.
    console.log(`x / y = ${x / y}`); // This will print "2.5" to the console.
    console.log(`x % y = ${x % y}`); // This will print "1" to the console.
    console.log(`x ** y = ${x ** y}`); // This will print "25" to the console.

    // Assignment operators
    x = 5;
    console.log(`\nlet x = 5; ==> x = ${x}`); // This will print "5" to the console.
    x += 3;
    console.log(`x += 3; ==> x = ${x}`); // This will print "8" to the console.
    x -= 3;
    console.log(`x -= 3; ==> x = ${x}`); // This will print "5" to the console.
    x *= 3;
    console.log(`x *= 3; ==> x = ${x}`); // This will print "15" to the console.
    x /= 3;
    console.log(`x /= 3; ==> x = ${x}`); // This will print "5" to the console.
    x %= 3;
    console.log(`x %= 3; ==> x = ${x}`); // This will print "2" to the console.
    x **= 3;
    console.log(`x **= 3; ==> x = ${x}`); // This will print "8" to the console.

    // Comparison operators

    // The == operator compares the values of the variables ignoring their types.
    console.log(`AVOID USING THE == OPERATOR!`);
    console.log(`\n5 == \"5\" ==> ${5 == "5"}. DON'T USE THIS OPERATOR`); // This will print "true" to the console.
    console.log(`5 == 5 ==> ${5 == 5}. DON'T USE THIS OPERATOR`); // This will print "true" to the console.

    // The === operator compares the values and the types of the variables.
    console.log("\nALWAYS USE THE === OPERATOR!")
    console.log(`\n5 === \"5\" ==> ${5 === "5"}`); // This will print "true" to the console.
    console.log(`5 === 5 ==> ${5 === 5}`); // This will print "true" to the console.

    // >, <, >=, <=, !=, !==
    console.log(`\n5 > 3 ==> ${5 > 3}`); // This will print "true" to the console.
    console.log(`5 < 3 ==> ${5 < 3}`); // This will print "false" to the console.
    console.log(`5 >= 3 ==> ${5 >= 3}`); // This will print "true" to the console.
    console.log(`5 <= 3 ==> ${5 <= 3}`); // This will print "false" to the console.
    console.log(`5 != 3 ==> ${5 != 3}. DON'T USE THIS OPERATOR`); // This will print "true" to the console.
    console.log(`5 !== 3 ==> ${5 !== 3}`); // This will print "true" to the console.

    // Logical operators
    // &&, ||, !
    console.log(`\ntrue && (and) true ==> ${true && true}`); // This will print "true" to the console.
    console.log(`true && (and) false ==> ${true && false}`); // This will print "false" to the console.
    console.log(`true || (or) true ==> ${true || true}`); // This will print "true" to the console.
    console.log(`true || (or) false ==> ${true || false}`); // This will print "true" to the console.
    console.log(`false || (or) false ==> ${false || false}`); // This will print "false" to the console.

    // The ! operator negates the value of a boolean variable.
    console.log(`!true ==> ${!true}`); // This will print "false" to the console.
    console.log(`!false ==> ${!false}`); // This will print "true" to the console.
}

function controlStructures() {
    // If statement
    let x = 5;
    if (x > 3) {
        console.log(`\nif (x > 3) {console.log("x is greater than 3")}`); // This will print "x is greater than 3" to the console.
    }

    // If-else statement
    if (x > 3) {
        console.log(`\nif (x > 3) {console.log("x is greater than 3")} else {console.log("x is less than or equal to 3")}`); // This will print "x is greater than 3" to the console.
    } else {
        console.log("x is less than or equal to 3");
    }

    // If-else if-else statement
    if (x > 3) {
        console.log(`\nif (x > 3) {console.log("x is greater than 3")}`); // This will print "x is greater than 3" to the console.
    } else if (x < 3) {
        console.log("x is less than 3");
    } else if (x === 3) {
        console.log("x is equal to 3");
    } else {
        console.log("x is not a number");
    }

    // if(day==="Monday"){}
    // else if (day==="Tuesday"){}
    // else if (day==="Wednesday"){}
    // else if (day==="Thursday"){}
    // else if (day==="Friday"){}
    // else if (day==="Saturday"){}
    // else if (day==="Sunday"){}
    // else{}
    // can be converted in a switch statement as follows:
    let day = "Monday";
    switch (day) {
        case "Monday":
            console.log("Today is Monday");
            break;
        case "Tuesday":
            console.log("Today is Tuesday");
            break;
        case "Wednesday":
            console.log("Today is Wednesday");
            break;
        case "Thursday":
            console.log("Today is Thursday");
            break;
        case "Friday":
            console.log("Today is Friday");
            break;
        case "Saturday":
            console.log("Today is Saturday");
            break;
        case "Sunday":
            console.log("Today is Sunday");
            break;
        default:
            console.log("Today is not a day of the week");
    }

    // For loop
    console.log("\nfor (let i = 0; i < 5; i+=2) {console.log(i)}");
    for (let i = 0; i < 5; i += 2) {
        console.log(i);
    }
    // end for loop

    // While loop
    console.log("\nlet i = 0; while (i < 5) {console.log(i); i++}");
    let i = 0;
    while (i < 5) {
        console.log(i);
        i++;
    }
}

//TODO Saltare questa funzione durante la lezione
function converters() {
    // Convert int to float... well, there is no need to convert an int to a float in JavaScript.
    // ...
    // Convert a float to an int using the Math.floor(...) function.
    let x = 5.5;
    console.log(`\nlet x = 5.5; Math.floor(x) = ${Math.floor(x)}`); // This will print "5" to the console.

    // int to string
    let y = 5;
    console.log(`\nlet y = 5; y.toString() = ${y.toString()} [final type is ${typeof y.toString()}]`); // This will print "5" to the console.
    // float to string
    let z = 5.5;
    console.log(`let z = 5.5; z.toString() = ${z.toString()} [final type is ${typeof z.toString()}]`); // This will print "5.5" to the console.
    // boolean to string
    let w = true;
    console.log(`let w = true; w.toString() = ${w.toString()} [final type is ${typeof w.toString()}]`); // This will print "true" to the console.

    // string to int
    let a = "5";
    console.log(`\nlet a = "5"; parseInt(a) = ${parseInt(a)} [final type is ${typeof parseInt(a)}]`); // This will print "5" to the console.
    // string to float
    let b = "5.5";
    console.log(`let b = "5.5"; parseFloat(b) = ${parseFloat(b)} [final type is ${typeof parseFloat(b)}]`); // This will print "5.5" to the console.
    // string to boolean
    let c = "true";
    console.log(`let c = "true"; JSON.parse(c) = ${JSON.parse(c)} [final type is ${typeof JSON.parse(c)}]`); // This will print "true" to the console.

    // + operator can be used to concatenate strings
    let d = "Hello";
    let e = "World";
    console.log(`\nlet d = "Hello"; let e = "World"; d + e = ${d + e}`); // This will print "HelloWorld" to the console.

    // The + operator can be used to convert a string to a number
    x = 5;
    let g = "5";
    console.log(`\nlet f = 5; let g = "5"; f + +g = ${x + +g} [final type is ${typeof (x + +g)}]`); // This will print 10 to the console.
}

function callbacks() {
    // A callback is a function that is passed as an argument to another function.
    // The callback function is called inside the function it was passed to.
    function IWantACallback(callback) {
        console.log("\nI want a callback!");
        callback();
    }

    function myCallback() {
        console.log("Here is your callback!");
    }

    console.log("\nIWantACallback(myCallback)");
    IWantACallback(myCallback);
    IWantACallback(() => {console.log("Here is another callback!")});

    // return;

    function IWantACallbackWithNumberArgument(callback) {
        console.log("\nI want a callback that takes a Number as argument!");
        const number_before_callback = JLib.get_random_int_between_A_and_B(1, 10, true);
        console.log("(before calling the callback) The number is", number_before_callback)
        const number_after_callback = callback(number_before_callback);
        console.log("(after calling the callback) The callback returned", number_after_callback)
    }

    // function add5(number) {return number + 5;}
    const add5 = number => number + 5

    IWantACallbackWithNumberArgument(add5);

    IWantACallbackWithNumberArgument( number => number + 15);

    // return;
}

function DOM() {
    // The Document Object Model (DOM) is a programming interface for web documents.
    // It represents the page so that programs can change the document structure, style, and content.
    // The DOM represents the document as nodes and objects.
    // This allows programming languages to connect to the page.


    // Get the first text element and log it to the console.
    const first_text = document.querySelector("text");
    console.log("The first text:", first_text);

    // Get all the text elements and log them to the console.
    const all_texts = document.querySelectorAll("text");
    console.log("All texts:", all_texts);

    // Get the first element with the class "small" and log it to the console.
    const first_classed_small = document.querySelector(".small");
    console.log("The first .small:", first_classed_small);

    // Get all the elements with the class "small" and log them to the console.
    const all_classed_small = document.querySelectorAll(".small");
    console.log("All .small:", all_classed_small);

    // Get the first text contained in a group and log it to the console.
    const first_text_inside_group = document.querySelector("g text");
    console.log("first \"g text\":", first_text_inside_group);

    // Get all the texts groups contained inside a group and log them to the console.
    const all_text_inside_groups = document.querySelectorAll("g text");
    console.log("all \"g text\":", all_text_inside_groups);

    // Change the text to "Hello World".
    first_text.textContent = "Hello World. I\"m not \"My\" anymore";
    // all_texts.forEach(p => p.textContent  = "Hello World");

    // Create a new element with the tag "rect" and append it to the first group (you have to select it).
    const svgNS = "http://www.w3.org/2000/svg";

    const rec = document.createElementNS(svgNS ,'rect');
    rec.setAttribute('width', "40");
    rec.setAttribute('height', "40");
    rec.setAttribute('x', "50");
    rec.setAttribute('y', "240");
    rec.setAttribute('fill', 'black');
    rec.setAttribute('id', 'niceRec');
    document.querySelector('g').appendChild(rec);

    // Add an event listener to the element with the id "newP" that when hovered changes the color of p in red.
    rec.addEventListener("mouseover", () => {
        rec.setAttribute('fill', 'red');
    });
    // Now add the event listener that restores the color to black when the mouse leaves the element.
    rec.addEventListener("mouseleave", () => {
        rec.setAttribute('fill', 'blue');
    });
}


