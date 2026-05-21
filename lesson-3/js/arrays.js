// STEP 1: Declare and initialize variables
// STEP 1a: Grab the parts of the DOM that we need to build the invoice
const productList = document.querySelector("tbody");
const totalData = document.querySelector("tfoot td:first-of-type");
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
// STEP 1d: Declare the itemRow and the itemDetail array;
let itemRow = new Array();
let itemDetail = new Array();
let itemDesc;
let itemPrice;
let counter = 0;
// STEP 2: Build a loop to iterate through the products array
products.forEach((product) => {
	// STEP 3: Break apart the product name from the price for each item with split()
	product = product.split(": ");
	// console.log(product);
	// STEP 4: Now we have an array as an element of an array - set the second array element to the product price (as type number)
	product[1] = Number(product[1]);
	// console.log(product[1]);
	// STEP 5: Add the price of this product to the invoice total
	invoiceTotal += product[1];
	// console.log(invoiceTotal);
	// STEP 6: Capture each product name and price as variables 
	itemDesc = product[0];
	itemPrice = product[1];
	// STEP 7: Create a TR element for this product and price in the invoice table
	itemRow[counter] = document.createElement("tr");
	// STEP 8: Build the string that contains two TD elements each containing one of the item description, and the item price
	itemDetail[counter] = `<td>${itemDesc}</td><td>$ ${itemPrice}</td>`;
	// STEP 9: Set the above string as the innerHTML of the new TR element, and then append the new element to the table body (var productList)
	itemRow[counter].innerHTML = itemDetail[counter];
	// console.log(itemRow);
	productList.append(itemRow[counter]);
	counter ++;
});
// STEP 10: Set the total cost of the invoice as the textContent of the TD in the TFOOT (var totalData), rounding the number to two decimal places
totalData.textContent = "$ " + invoiceTotal.toFixed(2);