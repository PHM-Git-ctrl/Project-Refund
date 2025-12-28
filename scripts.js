// Select the elements of the form
const amount = document.getElementById("amount");

amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")

    amount.value = value;
}