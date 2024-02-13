const roman_dict = {
    1: "I",
    4: "IV",
    5: "V",
    9: "IX",
    10: "X",
    40: "XL",
    50: "L",
    90: "XC",
    100: "C",
    400: "CD",
    500: "D",
    900: "CM",
    1000: "M",
    4000: "<span style='text-decoration: overline;'>IV</span>",
    5000: "<span style='text-decoration: overline;'>V</span>",
    9000: "<span style='text-decoration: overline;'>IX</span>",
    10000: "<span style='text-decoration: overline;'>X</span>",
    40000: "<span style='text-decoration: overline;'>XL</span>",
    50000: "<span style='text-decoration: overline;'>L</span>",
    90000: "<span style='text-decoration: overline;'>XC</span>",
    100000: "<span style='text-decoration: overline;'>C</span>",
    400000: "<span style='text-decoration: overline;'>CD</span>",
    500000: "<span style='text-decoration: overline;'>D</span>",
    900000: "<span style='text-decoration: overline;'>DM</span>",
    1000000: "<span style='text-decoration: overline;'>M</span>",
}

const roman_keys = Object.keys(roman_dict);
const roman_values = Object.values(roman_dict);
const roman_length = roman_keys.length;

const tooltip_style = `
<style>
    .tooltip {
        font-family: Allerta Stencil;
        font-style: italic;
        position: relative;
        display: inline-block;
    }

    .tooltip .tooltiptext {
        font-style: normal;

        visibility: hidden;
        width: 50px;
        background-color: black;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;

        /* Position the tooltip */
        position: absolute;
        z-index: 1;
        bottom: 100%;
        left: 50%;
    margin-left: -60px;
    }

    .tooltip:hover .tooltiptext {
        visibility: visible;
    }
</style>`

const html_font = `
<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Allerta+Stencil" />
`
// Add the font to the head of the document
document.head.insertAdjacentHTML('beforeend', html_font);

// Add the tooltip style to the head of the document
document.head.insertAdjacentHTML('beforeend', tooltip_style);

// Convert roman numbers to arabic numbers
function convertToRoman(num) {
    let old_num = num;
    if (num < 1 || num > 3999999) {
        return num;
    }

    let romanNumeral = '';
    for (let i = roman_length-1; i >= 0; i--) {
        while (num >= roman_keys[i]) {
            num -= roman_keys[i];
            romanNumeral += roman_values[i];
        }
    }
    let romanNumeralSpan = '<span class="tooltip">' + romanNumeral + '<span class="tooltiptext">' + old_num + '</span></span>';

    return romanNumeralSpan;
}

// Memoization function wrapper
function memoize(func) {
    const cache = {}; // Cache object to store results
    return function(...args) {
        const key = JSON.stringify(args); // Generate a unique key for the arguments

        if (!cache[key]) { // If the result is not already cached
        cache[key] = func.apply(this, args); // Calculate and store the result
        }

        return cache[key]; // Return the cached result
    };
}

function checkStringAndReplace(string) {
    // Return false if the string does not contain a number
    // else return the new string with the numbers replaced by their roman equivalent
    const regex = /\d+/g;
    const replaceFunction = function(match) {
        return memoize(convertToRoman)(parseInt(match));
    };

    let new_string = string.replace(regex, replaceFunction);
    if (new_string !== string) {
        return new_string;
    } else {
        return false;
    }
}

function convertTextToNode(textNode, parentNode) {
    // Convert the text node to a span node
    const new_html_content = checkStringAndReplace(textNode.textContent);
    if (new_html_content === false) {
        return; // If the text node does not contain a number, do not replace it
    }
    const span = document.createElement('span');
    span.innerHTML = new_html_content;
    parentNode.replaceChild(span, textNode);
}

// Reccursive function to replace all numbers in the text content of the node and its children
function replaceNumbersRec(node, parentNode, end_execution_time) {
    if (Date.now() > end_execution_time) {
        console.log("The execution time has been exceeded, the function will stop");
        // If the execution time is exceeded, stop the function
        return;
    }
    if (node.nodeType === Node.TEXT_NODE && parentNode !== null) {
        convertTextToNode(node, parentNode);
    } else {
        node.childNodes.forEach((child) => {
            replaceNumbersRec(child, node);
        });
    }
}

// Function to replace all numbers in the text content of the page
function replaceNumbersWithRoman(target=document.body, target_parent=null, max_execution_time=2500) { // Maximum execution time in milliseconds
    const begin_time = Date.now(); // Start time in milliseconds
    const end_execution_time = begin_time + max_execution_time; // Maximum execution time in milliseconds
    console.log('The page is being processed');
    replaceNumbersRec(target, target_parent, end_execution_time);
}

// Execute when the page is loaded
replaceNumbersWithRoman();
