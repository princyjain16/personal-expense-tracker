$(document).ready(function () {

    // Get expenses from LocalStorage
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // Display expenses when page loads
    displayExpenses(expenses);


    // Add Expense
    $("#expenseForm").submit(function (event) {

        event.preventDefault();

        let expenseName = $("#expenseName").val();
        let expenseAmount = parseFloat($("#expenseAmount").val());
        let expenseCategory = $("#expenseCategory").val();
        let expenseDate = $("#expenseDate").val();

        // Create expense object
        let expense = {
            id: Date.now(),
            name: expenseName,
            amount: expenseAmount,
            category: expenseCategory,
            date: expenseDate
        };

        // Add expense to array
        expenses.push(expense);

        // Save expenses to LocalStorage
        localStorage.setItem("expenses", JSON.stringify(expenses));

        // Display updated expenses
        displayExpenses(expenses);

        // Clear form
        $("#expenseForm")[0].reset();

        alert("Expense added successfully!");

    });


    // Display Expenses
    function displayExpenses(expenseList) {

        $("#expenseTableBody").empty();

        if (expenseList.length === 0) {

            $("#noExpenses").show();

        } else {

            $("#noExpenses").hide();

            $.each(expenseList, function (index, expense) {

                let row = `
                    <tr>
                        <td>${expense.name}</td>
                        <td>₹${expense.amount.toFixed(2)}</td>
                        <td>${expense.category}</td>
                        <td>${expense.date}</td>
                        <td>
                            <button 
                                class="btn btn-danger btn-sm delete-btn"
                                data-id="${expense.id}">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;

                $("#expenseTableBody").append(row);

            });

        }

        updateSummary(expenseList);

    }


    // Delete Expense
    $(document).on("click", ".delete-btn", function () {

        let expenseId = $(this).data("id");

        expenses = expenses.filter(function (expense) {

            return expense.id != expenseId;

        });

        // Update LocalStorage
        localStorage.setItem("expenses", JSON.stringify(expenses));

        // Display updated list
        applyFilters();

    });


    // Filter by Category
    $("#filterCategory").change(function () {

        applyFilters();

    });


    // Search Expense
    $("#searchExpense").on("keyup", function () {

        applyFilters();

    });


    // Apply Filters and Search
    function applyFilters() {

        let selectedCategory = $("#filterCategory").val();
        let searchText = $("#searchExpense").val().toLowerCase();

        let filteredExpenses = expenses.filter(function (expense) {

            let categoryMatch =
                selectedCategory === "All" ||
                expense.category === selectedCategory;

            let searchMatch =
                expense.name.toLowerCase().includes(searchText);

            return categoryMatch && searchMatch;

        });

        displayExpenses(filteredExpenses);

    }


    // Update Summary
    function updateSummary(expenseList) {

        let total = 0;

        $.each(expenseList, function (index, expense) {

            total += expense.amount;

        });

        let count = expenseList.length;

        let average = count > 0 ? total / count : 0;

        $("#totalExpenses").text("₹" + total.toFixed(2));

        $("#expenseCount").text(count);

        $("#averageExpense").text("₹" + average.toFixed(2));

    }

});