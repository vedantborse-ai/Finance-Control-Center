// Define expenses globally
const categories = ['food', 'transport', 'entertainment', 'clothes', 'other'];
const expenses = [0, 0, 0, 0, 0];
let subscriptionTotalCost = 0;
let monthlyLimit = 0;

// Expense Logger
document.getElementById('expenseForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const amountField = document.getElementById('expenseAmount');
    const categoryField = document.getElementById('expenseCategory');
    const nameField = document.getElementById("expenseName");
    const amount = parseFloat(amountField.value);
    const category = categoryField.value;

    if (!isNaN(amount) && amount > 0) {
        const index = categories.indexOf(category);
        if (index !== -1) {
            expenses[index] += amount;
            console.log(`Updated expenses:`, expenses);
            updateChart(); // Update chart when expenses change
            checkLimit(); // Check if expenses exceed limit
        } else {
            console.log('Invalid category');
        }
    } else {
        console.log('Enter a valid amount');
    }

    // Clear input fields
    amountField.value = '';
    categoryField.value = '';
    nameField.value = '';
});

document.getElementById('limitForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const limitField = document.getElementById('monthlyLimit');
    const limitValue = parseFloat(limitField.value);

    if (!isNaN(limitValue) && limitValue > 0) {
        monthlyLimit = limitValue;
        document.getElementById('limitStatus').textContent = `Monthly limit set to $${monthlyLimit}`;
        checkLimit(); // Check if current expenses exceed new limit
    } else {
        console.log('Enter a valid limit amount');
    }

    // Clear input field
    limitField.value = '';
});

document.getElementById('subscriptionForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const nameField = document.getElementById('subscriptionName');
    const costField = document.getElementById('subscriptionCost');

    const name = nameField.value;
    const cost = parseFloat(costField.value);

    if (!isNaN(cost) && cost > 0 && name.trim() !== '') {
        const subscriptionList = document.getElementById('subscriptionList');
        const li = document.createElement('li');
        li.textContent = `${name}: $${cost}/month`;
        subscriptionList.appendChild(li);

        // Add subscription cost to total subscriptions but NOT to the chart
        subscriptionTotalCost += cost;
        checkLimit(); // Check if added subscription exceeds limit
    } else {
        console.log('Enter valid subscription details');
    }

    // Clear input fields
    nameField.value = '';
    costField.value = '';
});

// Spending Visualization (Chart.js)
const ctx = document.getElementById('spendingChart').getContext('2d');
const spendingChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Food', 'Transport', 'Entertainment', 'Clothes', 'Other'],
        datasets: [{
            label: 'Spending by Category',
            data: expenses,
            backgroundColor: [
                '#3498db',
                '#2ecc71',
                '#9b59b6',
                '#f1c40f',
                '#e74c3c'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Function to update the chart dynamically
function updateChart() {
    spendingChart.data.datasets[0].data = expenses; // Update data
    spendingChart.update(); // Refresh the chart
}

// Function to check if expenses exceed monthly limit
function checkLimit() {
    if (monthlyLimit > 0) {
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense, 0) + subscriptionTotalCost;

        if (totalExpenses >= monthlyLimit) {
            window.alert("Monthly spending limit exceeded!");
        }
    }
}
