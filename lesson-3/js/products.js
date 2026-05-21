// STEP 1: Declare and initialize variables

// STEP 1a: Grab the parts of the DOM that we need to build the invoice
const productList = document.querySelector("#product-list");
const totalData = document.querySelector("#total-data");

// STEP 1b: Build the products array in the format 'Product Name:0.00'
let products = [
    "Frozen Pizza: 5.99",
    "Orange Juice: 4.99",
    "Milk: 6.95",
    "Dozen Eggs: 5.95",
    "Bacon: 7.49",
    "Apples: 4.99"
];

// STEP 1c: Set up invoiceTotal variable - start at zero
let invoiceTotal = 0;

// STEP 1d: Declare the itemRow and the itemDetail array
let itemRow = [];
let itemDetail = [];
let itemDesc;
let itemPrice;
let counter = 0;

// STEP 2: Build a loop to iterate through the products array
products.forEach((product) => {

    // STEP 3: Break apart the product name from the price for each item with split()
    product = product.split(": ");

    // STEP 4: Convert price to number
    product[1] = Number(product[1]);

    // STEP 5: Add the price of this product to the invoice total
    invoiceTotal += product[1];

    // STEP 6: Capture each product name and price as variables
    itemDesc = product[0];
    itemPrice = product[1];

    // STEP 7: Create a TR element for this product and price in the invoice table
    itemRow[counter] = document.createElement("tr");

    // STEP 8: Build the string that contains two TD elements
    itemDetail[counter] = `<td>${itemDesc}</td><td>$${itemPrice.toFixed(2)}</td>`;

    // STEP 9: Set innerHTML and append to table body
    itemRow[counter].innerHTML = itemDetail[counter];
    productList.appendChild(itemRow[counter]);

    counter++;
});

// STEP 10: Set the total cost of the invoice
totalData.textContent = "$" + invoiceTotal.toFixed(2);
