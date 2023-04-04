const form = document.querySelector("form.add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];

// calculate and update statstics
function updateStatistics(){
    const updatedIncome = transactions
                            .filter(transaction => transaction.option == "income-check")
                            .reduce((total, transaction) => total += Number(transaction.amount), 0);

    const updatedExpense = transactions
                            .filter(transaction => transaction.option == "expense-check")
                            .reduce((total, transaction) => total += transaction.amount, 0);
    
    updatedBalance = updatedIncome - updatedExpense;
    balance.textContent = updatedBalance;
    income.textContent = updatedIncome;
    expense.textContent = updatedExpense;

}

// template for income and expenses html
function generateTemplate(id, source, amount, time){
    return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                $<span>${Math.abs(amount)}</span>
                <i class="bi bi-trash delete"></i>
            </li>`;
}

// add transaction to DOM
function addTransactionDOM(id, source, amount, option, time){
    if(option == "income-check"){
        incomeList.innerHTML += generateTemplate(id, source, amount, time);
    } else {
        expenseList.innerHTML += generateTemplate(id, source, amount, time);
    }
}

// add transaction to local storage
function addTransaction(source, amount, option){
    const time = new Date();
    const transaction = {
        id: Math.floor(Math.random()*100000),
        source: source,
        amount: amount,
        option: option,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addTransactionDOM(transaction.id, source, amount, option, transaction.time);
}


form.addEventListener("submit", event => {
    event.preventDefault();
    if(form.source.value.trim() === "" || form.amount.value === "" || form.amount.value <= 0 ){
        return alert("Please add proper values");
    }
    addTransaction(form.source.value.trim(), Number(form.amount.value), form.option.value);

    updateStatistics();
    form.reset();
})

// loop through each local storage transaction and save it to the DOM 
function getTransaction(){
    transactions.forEach(transaction => {
        if(transaction.option == "income-check"){
            incomeList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        } else {
            expenseList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }
    });
}

// delete transaction from local storage
function deleteTransaction(id){
    transactions = transactions.filter(transaction => {
        return transaction.id !== id;
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// remove transaction from DOM
incomeList.addEventListener("click", event => {
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStatistics();
    }
});

expenseList.addEventListener("click", event => {
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStatistics();
    }
});
   

function init(){
    updateStatistics();
    getTransaction();
}

init();
