document.getElementById('addItem').addEventListener('click', function() {
    const itemsDiv = document.getElementById('items');
    const newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.innerHTML = `
        <input type="text" placeholder="Description" required>
        <input type="number" placeholder="Unit Price" required>
        <input type="number" placeholder="Quantity" required>
        <input type="number" placeholder="Discount" required>
        <input type="number" placeholder="Tax Rate" value="18" required>
    `;
    itemsDiv.appendChild(newItem); 
}); 

document.getElementById('invoiceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const sellerName = document.getElementById('sellerName').value;
    const sellerAddress = document.getElementById('sellerAddress').value;
    const sellerPAN = document.getElementById('sellerPAN').value;
    const sellerGST = document.getElementById('sellerGST').value;

    const placeOfSupply = document.getElementById('placeOfSupply').value;

    const billingName = document.getElementById('billingName').value;
    const billingAddress = document.getElementById('billingAddress').value;
    const billingStateCode = document.getElementById('billingStateCode').value;

    const shippingName = document.getElementById('shippingName').value;
    const shippingAddress = document.getElementById('shippingAddress').value;
    const shippingStateCode = document.getElementById('shippingStateCode').value;

    const orderNumber = document.getElementById('orderNumber').value;
    const orderDate = document.getElementById('orderDate').value;

    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const invoiceDetails = document.getElementById('invoiceDetails').value;
    const invoiceDate = document.getElementById('invoiceDate').value;

    const reverseCharge = document.getElementById('reverseCharge').value;

    const items = [];
    document.querySelectorAll('#items .item').forEach(function(item) {
        const description = item.querySelector('input[placeholder="Description"]').value;
        const unitPrice = parseFloat(item.querySelector('input[placeholder="Unit Price"]').value);
        const quantity = parseInt(item.querySelector('input[placeholder="Quantity"]').value);
        const discount = parseFloat(item.querySelector('input[placeholder="Discount"]').value);
        const taxRate = parseFloat(item.querySelector('input[placeholder="Tax Rate"]').value);

        const netAmount = unitPrice * quantity - discount;
        let taxType, taxAmount, totalAmount;
        if (placeOfSupply === shippingStateCode) {
            taxType = 'CGST/SGST';
            taxAmount = (netAmount * taxRate) / 100 / 2;
            totalAmount = netAmount + (taxAmount * 2);
        } else {
            taxType = 'IGST';
            taxAmount = (netAmount * taxRate) / 100;
            totalAmount = netAmount + taxAmount;
        }

        items.push({ description, unitPrice, quantity, discount, netAmount, taxType, taxAmount, totalAmount });
    });

    const invoiceDiv = document.getElementById('invoice');
    invoiceDiv.innerHTML = `
        <div class="invoice-header">
            <img src="logo.png" alt="Company Logo" style="width: 100px;">
            <h2>Tax Invoice/Bill of Supply/Cash Memo</h2>
            <p>(Original for Recipient)</p>
        </div>
        <div class="invoice-details">
            <h3>Sold By:</h3>
            <p>${sellerName}<br>${sellerAddress}<br>PAN No.: ${sellerPAN}<br>GST Registration No.: ${sellerGST}</p>
        </div>
        <div class="invoice-details">
            <h3>Billing Address:</h3>
            <p>${billingName}<br>${billingAddress}<br>State/UT Code: ${billingStateCode}</p>
        </div>
        <div class="invoice-details">
            <h3>Shipping Address:</h3>
            <p>${shippingName}<br>${shippingAddress}<br>State/UT Code: ${shippingStateCode}</p>
        </div>
        <div class="invoice-details">
            <p>Order Number: ${orderNumber}<br>Order Date: ${orderDate}<br>Invoice Number: ${invoiceNumber}<br>Invoice Details: ${invoiceDetails}<br>Invoice Date: ${invoiceDate}</p>
        </div>
        <div class="invoice-details">
            <p>Reverse Charge: ${reverseCharge}</p>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Discount</th>
                    <th>Net Amount</th>
                    <th>Tax Type</th>
                    <th>Tax Amount</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>${item.discount.toFixed(2)}</td>
                    <td>${item.netAmount.toFixed(2)}</td>
                    <td>${item.taxType}</td>
                    <td>${item.taxAmount.toFixed(2)}</td>
                    <td>${item.totalAmount.toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="invoice-footer">
            <button onclick="window.print()">Print Invoice</button>
        </div>
    `;
});

function printInvoice() {
    window.print();
}
