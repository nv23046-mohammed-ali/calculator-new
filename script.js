// Basic calculator functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Error: Division by zero";
    }
    return a / b;
}

// Operate function that calls the appropriate math function
function operate(operator, a, b) {
    switch(operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '×':
            return multiply(a, b);
        case '÷':
            return divide(a, b);
        default:
            return null;
    }
}

// Calculator state variables
let firstNumber = null;
let operator = null;
let secondNumber = null;
let displayValue = '0';
let resetDisplay = false;
let decimalAdded = false;

// DOM elements
const display = document.getElementById('display');
const digitButtons = document.querySelectorAll('.digit');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const backspaceButton = document.getElementById('backspace');
const decimalButton = document.getElementById('decimal');

// Update display function
function updateDisplay() {
    // Round long numbers to prevent overflow
    if (displayValue.toString().length > 10 && !isNaN(displayValue)) {
        displayValue = parseFloat(displayValue).toFixed(8);
        // Remove trailing zeros
        displayValue = parseFloat(displayValue).toString();
    }
    display.textContent = displayValue;
}

// Add event listeners to digit buttons
digitButtons.forEach(button => {
    button.addEventListener('click', () => {
        // If we just had a result, start a new calculation
        if (resetDisplay) {
            displayValue = '';
            resetDisplay = false;
        }
        
        // Handle decimal button
        if (button.id === 'decimal') {
            if (!decimalAdded) {
                displayValue = displayValue === '0' ? '0.' : displayValue + '.';
                decimalAdded = true;
            }
        } else {
            // For other digits
            displayValue = displayValue === '0' ? button.textContent : displayValue + button.textContent;
        }
        
        updateDisplay();
    });
});

// Add event listeners to operator buttons
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        // If we already have an operator and both numbers, evaluate the expression
        if (firstNumber !== null && operator !== null && !resetDisplay) {
            secondNumber = parseFloat(displayValue);
            const result = operate(operator, firstNumber, secondNumber);
            
            if (typeof result === 'string' && result.includes('Error')) {
                displayValue = result;
            } else {
                displayValue = result;
                firstNumber = result;
            }
            
            updateDisplay();
        } else if (firstNumber === null) {
            // If this is the first number, save it
            firstNumber = parseFloat(displayValue);
        }
        
        // Set the new operator
        operator = button.textContent;
        resetDisplay = true;
        decimalAdded = false;
    });
});

// Equals button functionality
equalsButton.addEventListener('click', () => {
    if (firstNumber === null || operator === null) {
        return; // Do nothing if we don't have the full equation
    }
    
    secondNumber = parseFloat(displayValue);
    const result = operate(operator, firstNumber, secondNumber);
    
    if (typeof result === 'string' && result.includes('Error')) {
        displayValue = result;
    } else {
        displayValue = result;
    }
    
    updateDisplay();
    
    // Reset for a new calculation but keep the result as firstNumber
    firstNumber = result;
    operator = null;
    secondNumber = null;
    resetDisplay = true;
    decimalAdded = false;
});

// Clear button functionality
clearButton.addEventListener('click', () => {
    displayValue = '0';
    firstNumber = null;
    operator = null;
    secondNumber = null;
    resetDisplay = false;
    decimalAdded = false;
    updateDisplay();
});

// Backspace button functionality
backspaceButton.addEventListener('click', () => {
    if (resetDisplay) return; // Don't allow backspace after computation
    
    displayValue = displayValue.toString().slice(0, -1);
    if (displayValue === '' || displayValue === '-') {
        displayValue = '0';
    }
    
    // Check if we removed a decimal point
    decimalAdded = displayValue.includes('.');
    
    updateDisplay();
});

// Initialize display
updateDisplay();

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Digits
    if (/^\d$/.test(key)) {
        document.getElementById(key).click();
    }
    // Operators
    else if (key === '+') {
        document.getElementById('add').click();
    }
    else if (key === '-') {
        document.getElementById('subtract').click();
    }
    else if (key === '*') {
        document.getElementById('multiply').click();
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser's quick find
        document.getElementById('divide').click();
    }
    // Equals (Enter or =)
    else if (key === 'Enter' || key === '=') {
        document.getElementById('equals').click();
    }
    // Decimal
    else if (key === '.') {
        document.getElementById('decimal').click();
    }
    // Backspace
    else if (key === 'Backspace') {
        document.getElementById('backspace').click();
    }
    // Clear (Escape)
    else if (key === 'Escape') {
        document.getElementById('clear').click();
    }
});
