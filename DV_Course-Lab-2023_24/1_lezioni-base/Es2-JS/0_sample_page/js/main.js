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
    x = 6;

    x = 10 / 3; // TODO Secondo voi quanto fa?

    x = "Hello";

    x = true;

    // const is used to declare a variable that cannot be reassigned.
    const y = 5;
    // y = 6; // This will cause an error.

    // Variables can be declared without being assigned a value. In this case, the value of the variable is "undefined".
    let z;
    // TODO Cosa stampa z?
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
    const func = function () {
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
    //TODO +, -, *, /, %, **

    // Assignment operators
    //TODO =, +=, -=, *=, /=, %=, **=


    // Comparison operators
    //TODO ==, ===, !=, !==

    //TODO  >, <, >=, <=,

    // Logical operators
    //TODO  &&, ||, !
}

function controlStructures() {
    //TODO if

    //TODO if-else

    //TODO if-else if-else (giorno della settimana)

    //TODO switch (giorno della settimana)

    //TODO for


    //TODO Giusto per dire che esistono anche while, do-while, for-in, for-of
    // while
    console.log("\nlet i = 0; while (i < 5) {console.log(i); i++}");
    let i = 0;
    while (i < 5) {
        console.log(i);
        i++;
    }

    // do-while
    console.log("\nlet j = 0; do {console.log(j); j++} while (j < 5)");
    let j = 0;
    do {
        console.log(j);
        j++;
    } while (j < 5);

    // for .... in ....
    const myObj = { a: 1, b: 2, c: 3 };
    for (const key in myObj) {
        console.log(`${key}: ${myObj[key]}`);
    }

    // for .... of ....
    const array1 = [10, 20, 30];
    for (const element of array1) {
        console.log(element);
    }

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
    //TODO Creare un'altra callback e passarla a IWantACallback (senza creare una variabile)


    function IWantACallbackWithNumberArgument(callback) {
        console.log("\nI want a callback that takes a Number as argument!");
        const number_before_callback = JLib.get_random_int_between_A_and_B(1, 10, true);
        console.log("(before calling the callback) The number is", number_before_callback)
        const number_after_callback = callback(number_before_callback);
        console.log("(after calling the callback) The callback returned", number_after_callback)
    }

    // E' equivlaente: function add5(number) {return number + 5;}
    const add5 = number => number + 5
    IWantACallbackWithNumberArgument(add5);

    //TODO Creare un'altra callback che restituisce il doppio del numero passato
}

function DOM() {
    // The Document Object Model (DOM) is a programming interface for web documents.
    // It represents the page so that programs can change the document structure, style, and content.
    // The DOM represents the document as nodes and objects.
    // This allows programming languages to connect to the page.


    //TODO Trova il PRIMO elemento con TAG "text" e stampalo a console
    const first_text = null; // TODO Edit this line
    console.log("The first text:", first_text);


    //TODO Trova TUTTI gli elementi con TAG "text"
    const all_texts = null; // TODO Edit this line
    console.log("All texts:", all_texts);

    //TODO Spiegare:
    // 1) classe,
    // 2) id
    // 3) operatore discendente

    //TODO Ottieni il PRIMO elemento con CLASSE "small"
    const first_classed_small = null; // TODO Edit this line
    console.log("The first .small:", first_classed_small);


    //TODO Ottieni TUTTI gli elementi con classe "small"
    const all_classed_small = document.querySelectorAll(".small");
    console.log("All .small:", all_classed_small);


    //TODO Ottieni il PRIMO "text" contenuto dentro ad un gruppo "g"
    const first_text_inside_group = null; // TODO Edit this line
    console.log("first \"g text\":", first_text_inside_group);


    //TODO Ottieni TUTTI i text contenuti dentro ad un gruppo "g"
    const all_text_inside_groups =  null; // TODO Edit this line
    console.log("all \"g text\":", all_text_inside_groups);


    //TODO Cambia il contenuto (textContent) del primo text (salvato in first_text) in "Non sono più \"My\"";
    //TODO Write here


    // Create a new element with the tag "rect" and append it to the first group (you have to select it).
    //TODO Giusto per dire che esistono anche createElementNS. In d3.js si usa sempre .append("rect")
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

