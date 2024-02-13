// Convert roman numbers to arabic numbers
function convertToRoman(num) {
    if (num < 1 || num > 3999) {
        return num;
    }
    const romans = ["I", "IV", "V", "IX", "X", "XL", "L", "XC", "C", "CD", "D", "CM", "M"];
    const values = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000];
    let romanNumeral = '';
    for (let i = 12; i >= 0; i--) {
        while (num >= values[i]) {
        num -= values[i];
        romanNumeral += romans[i];
        }
    }
    return romanNumeral;
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
    const regex = /\d+/g;
    const span_style = 'font-family: cursive;';
    const begin_span = '<span style="' + span_style + '">';
    const end_span = '</span>';
    const replaceFunction = function(match) {
        return begin_span + memoize(convertToRoman)(parseInt(match)) + end_span;
    };
    return string.replace(regex, replaceFunction);
}

function convertTextToNode(textNode, parentNode) {
    // Convert the text node to a span node
    const span = document.createElement('span');
    const new_html_content = checkStringAndReplace(textNode.textContent);

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

// Remplacer tous les nombres sur la page par des chiffres romains
function replaceNumbersWithRoman(begin_time = Date.now()) {
    const max_execution_time = 1000; // Maximum execution time in milliseconds
    const end_execution_time = begin_time + max_execution_time; // Maximum execution time in milliseconds
    console.log('The page is being processed');
    replaceNumbersRec(document.body, null, end_execution_time);
}

console.log('The page has been loaded');
replaceNumbersWithRoman(begin_time = Date.now());
  