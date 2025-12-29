// Select the elements of the form.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Select the elements on the list.
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")

// Capture the input event to format the value.
amount.oninput = () => {
    // Get the actual value of input and remove the characters non numerics.
    let value = amount.value.replace(",", "")

    // Transform the value into cents.
    value = Number(value) / 100

    // Update the value of the input
    amount.value = value.toFixed(2).replace(".", ",")
}

function formatCurrencyBRL(value) { 
    // Format the value on the BRL default (Brazilian Real).
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    // Return the formatted value.
    return value
}

// Capture the submit event of the form to get the values.
form.onsubmit = (event) => {
    // Prevent the default behavior to recharge the page.
    event.preventDefault()

    
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    // Call the function who add the item on the list.
    expenseAdd(newExpense)
}

// Add a new item on the list.
function expenseAdd(newExpense) {
    try {
    // Create the element to add on the list (ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")
    
    // Create an icon for the category.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Create the info for the expense.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Create the name of the expense.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Create the category of the expense.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Add name and category on div on the information on the expense.
    expenseInfo.append(expenseName, expenseCategory)

    // Create the value of the expense.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
        .toUpperCase()
        .replace("R$", "")}`

    // Create the remove icon.
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remover")

    // Add the info on the item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Add the item on the list.
    expenseList.append(expenseItem)

    // Clear the form to add a new item
    formClear()

    // Update the totals.
    updateTotals()
    } catch (error) {
        alert("Não foi possível adicionar a lista de despesas. Tente novamente depois.")
        console.log(error)
    }
}

// Update the totals.
function updateTotals() {
    try {
        // Recuperate all the item (li) on the list. (ul)
        const items = expenseList.children

        // Update the quantity of items of the list.
        expensesQuantity.textContent = `${items.length} ${
            items.length > 1 ? "despesas" : "despesa"
        }`

        // Variable to increment the total.
        let total = 0

        // Travel each item (li) of the list (ul).
        for(let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")

            // Remove characters non numerics and replace the comma for dot.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            // Convert the value to float.
            value = parseFloat(value)

            // Verify if is a valid number.
            if(isNaN(value)){
                return alert(
                    "Não foi possível calcular o total. O valor não parece ser um número."
                )
            }

            // Increment the total value.
            total += Number(value)
        }

        // Create the span to add the R$ already formatted.
         const symbolBRL = document.createElement("small")
         symbolBRL.textContent = "R$" 

         // Format the value and remove the R$ who has displayed by the small with a customizable style.
         total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

         // Clean the content of the element.
         expensesTotal.innerHTML = ""

         // Add the symbol of the currency and the total value formatted.
         expensesTotal.append(symbolBRL, total)
    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais.")
    }
}

// Capture the click event to remove an item of the list.
expenseList.addEventListener("click", function (event)  {
    // Verify if the clicked element is a remove-icon.
    if(event.target.classList.contains("remove-icon")){
        // Claim the li father of the clicked element.
        const item = event.target.closest(".expense")

        // Remove the item of the list.
        item.remove()
    }

    // Update the totals.
    updateTotals()
})

function formClear() {
    // Clear the inputs.
    expense.value = ""
    category.value = ""
    amount.value = ""

    // Put the focus on the amount input.
    expense.focus()
}