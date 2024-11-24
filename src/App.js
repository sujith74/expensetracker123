import logo from './logo.svg';
import './App.css';
import React,{useState,useEffect,useRef} from 'react'
import { RxCrossCircled } from "react-icons/rx";
import { SlPencil } from "react-icons/sl";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { RiNumber1 } from "react-icons/ri";
import { PiPizzaLight } from "react-icons/pi";
import Chart from "./chart";
// import BarChart from './barchart';
import './Modal';
// import  Chart from './chart'
function App() {

  const [balance ,setBalance] = useState('5000')
  const [expense,setExpense] = useState('0')
  const [incomeAmount, setIncomeAmount] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    date: ''
  });

  const [expenseList, setExpenseList] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  //Show hide modals
  const [isOpenExpense, setIsOpenExpense] = useState(false);
  const [isOpenBalance, setIsOpenBalance] = useState(false);

  const [categorySpends, setCategorySpends] = useState({
    food: 0,
    entertainment: 0,
    travel: 0,
  });
  const [categoryCount, setCategoryCount] = useState({
    food: 0,
    entertainment: 0,
    travel: 0,
  });
  const [expenses, setExpenses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({ ...prevData, [name]: value }));
};

useEffect(() => {
  //Check localStorage
  const localBalance = localStorage.getItem("balance");

  if (localBalance) {
    setBalance(Number(localBalance));
  } else {
    setBalance(5000);
    localStorage.setItem("balance", 5000);
  }

  const items = JSON.parse(localStorage.getItem("expenses"));

  setExpenseList(items || []);
  setIsMounted(true);
}, []);

useEffect(() => {
  if (expenseList.length > 0 || isMounted) {
    localStorage.setItem("expenses", JSON.stringify(expenseList));
  }

  if (expenseList.length > 0) {
    setExpense(
      expenseList.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.price),
        0
      )
    );
  } else {
    setExpense(0);
  }

  let foodSpends = 0,
    entertainmentSpends = 0,
    travelSpends = 0;
  let foodCount = 0,
    entertainmentCount = 0,
    travelCount = 0;

  expenseList.forEach((item) => {
    if (item.category == "food") {
      foodSpends += Number(item.price);
      foodCount++;
    } else if (item.category == "entertainment") {
      entertainmentSpends += Number(item.price);
      entertainmentCount++;
    } else if (item.category == "travel") {
      travelSpends += Number(item.price);
      travelCount++;
    }
  });

  setCategorySpends({
    food: foodSpends,
    travel: travelSpends,
    entertainment: entertainmentSpends,
  });

  setCategoryCount({
    food: foodCount,
    travel: travelCount,
    entertainment: entertainmentCount,
  });

  localStorage.setItem(
    "categorySpends",
    JSON.stringify({ food: foodSpends, travel: travelSpends, entertainment: entertainmentSpends })
  );
  localStorage.setItem(
    "categoryCount",
    JSON.stringify({ food: foodCount, travel: travelCount, entertainment: entertainmentCount })
  );
}, [expenseList]);

useEffect(() => {
  if (isMounted) {
    localStorage.setItem("balance", balance);
  }
}, [balance]);

const handleSubmit = (e) => {
  e.preventDefault();

  const { title, price, category, date } = formData;
    if (!title || !price || !category || !date) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert("Please enter a valid price.");
      return;
    }
  
    if (editIndex !== null) {
      // Update existing expense
      const updatedExpenses = [...expenses];
      const oldExpense = expenses[editIndex];
      const oldPrice = Number(expenses[editIndex].price);
      updatedExpenses[editIndex] = formData;

      setExpenses(updatedExpenses);
      setBalance((prevBalance) => {

        const newBalance = prevBalance + oldPrice - priceNumber;
        localStorage.setItem("balance", newBalance);  // Update balance in localStorage

        return newBalance;
      });
           setExpense((prevExpense) => {
        const newExpense = prevExpense - oldPrice + priceNumber;
        localStorage.setItem("expense", newExpense);  // Update expense in localStorage

        return newExpense;
      });    

      updateCategoryData(oldExpense, formData, false)

       setEditIndex(null);
    } else {
      // Add new expense
      setExpenses((prevExpenses) => [...prevExpenses, formData]);
      setBalance((prevBalance) => {
        const newBalance = prevBalance - priceNumber;
        localStorage.setItem("balance", newBalance);  // Update balance in localStorage

        return newBalance;
      });
      setExpense((prevExpense) => {
        const newExpense = prevExpense + priceNumber;
        localStorage.setItem("expense", newExpense);  // Update expense in localStorage

        return newExpense;
      });
      updateCategoryData(null, formData, true);
    }
    setFormData({ title: '', price: '', category: '', date: '' });// Reset form after submission

   
    
};
const updateCategoryData = (oldExpense, newExpense, isNew) => {
  setCategorySpends((prev) => {
    const updated = { ...prev };

    if (oldExpense) {
      updated[oldExpense.category] -= Number(oldExpense.price);
    }
    updated[newExpense.category] += Number(newExpense.price);

    return updated;
  });

  setCategoryCount((prev) => {
    const updated = { ...prev };

    if (oldExpense) {
      updated[oldExpense.category] -= 1;
    }
    if (isNew || oldExpense?.category !== newExpense.category) {
      updated[newExpense.category] += 1;
    }

    return updated;
  });
}




  return (
    <div className="">
      <div className="header">
        <div className='red'></div>
        <div className="yellow"></div>
        <div className='green'></div>

      </div>
      <section className="box">
        <h1 className="box-title">Expense Tracker</h1>
        <div className="s1">
          <div className="Balance-section">
            <h1 className="Balance">Wallet Balance:  <span className='balance-no'>{balance}</span></h1>
            <button className="Add-income"> + Add Income</button>
          </div>
          <div className="Expense-section">
          <h1 className="Expense">Expenses: <span className='expense-no'>{expense}</span></h1>
          <button className="Add-Expense"> + Add Expense</button>


          </div>
          <div className="chart"><Chart 
          data={[
            { name: "Food", value: categorySpends.food },
            { name: "Entertainment", value: categorySpends.entertainment },
            { name: "Travel", value: categorySpends.travel },
          ]}/></div>
          </div>

          <dialog className='add-expenses-popup '>
        <h1 className='expenses-title'>Add Expenses</h1>
        <form className='form-expenses ' method="dialog">
          <input type="text" placeholder='Title' name='title' className='input' value={formData.title}
            onChange={handleChange}  />
          <input type="text" placeholder='Price' name='price' className='input' value={formData.price}
            onChange={handleChange} />
<select
  name="category"
  className="input"
  value={formData.category}
  onChange={handleChange}
>
  <option value="" disabled>
    Select Category
  </option>
  <option value="entertainment">Entertainment</option>
  <option value="food">Food</option>
  <option value="travel">Travel</option>
</select>
          <input type="date" placeholder='dd/mm/yyyy' name='date' className='input'  value={formData.date}
            onChange={handleChange} />

<button className='add-expense-button' onClick={handleSubmit}>Add Expense</button>
<button className='cancel-expense'>Cancel</button>
        </form>
      </dialog>
      
<section>
  <header className='head'>
      <h1 className="transactions">Recent Transactions </h1>
      <h1 className='top-expenses'>Top Expenses</h1>
      </header>
      <div className='display-data'>
      <div className="transactions-section">
      {expenses.map((expense, index) => (
        <div className="content" key={index}>
          <div className="react-icon"><PiPizzaLight /></div>
          <div className="name">
            <h1 className="title-transactions">{expense.title}</h1>
            <p className="Date">{new Date(expense.date).toLocaleDateString()}</p>
          </div>
          <p className="amount">₹{expense.price}</p>
          <button className="cross-button"><RxCrossCircled className="cross" /></button>
          <button className="pencil-button" onClick={() => {
    setEditIndex(index); 
    setFormData(expenses[index]); 
  }}><SlPencil className="pencil" /></button>
        </div>
      ))}
<div className='pagination-top'>
 <div className='pagination'>
 <button><FaLongArrowAltLeft /></button>
 <button><RiNumber1 /></button>
 <button><FaLongArrowAltRight /></button>
 </div>
 </div>
 </div>
      
      <div className="top-expenses-section">
       {/* <BarChart
          data={[
            { name: "Food", value: categorySpends.food },
            { name: "Entertainment", value: categorySpends.entertainment },
            { name: "Travel", value: categorySpends.travel },
          ]}/>  */}
    

      </div>
      </div>
      
      </section>

      

      <dialog className='add-balance-popup'>
        <h1 className='title-balance'>Add balance</h1>
        <form method="dialog">
        <input type='number' placeholder='Income Amount' className='input' value={incomeAmount}
        onChange={(e) => setIncomeAmount(e.target.value)}
/>
        <button className='balance-button' onClick={() => setBalance(parseInt(balance) + parseInt(incomeAmount || 0))}>Add Balance</button>
        <button className='cancel-balance'>Cancel</button>
        </form>
      </dialog>
      <dialog className='edit-popup'>
        <h1 className='edit-title'>Edit Expenses</h1>
        <form method="dialog" onSubmit={handleSubmit}>
        <input type="text" placeholder ='Title' className='input'   value={formData.title}
            onChange={handleChange}/>
        <input type="text" placeholder ='Price' className='input'  value={formData.price}
            onChange={handleChange} />
       <select
      name="category"
      className="input"
      value={formData.category}
      onChange={handleChange}
    >
      <option value="" disabled>
        Select Category
      </option>
      <option value="entertainment">Entertainment</option>
      <option value="food">Food</option>
      <option value="travel">Travel</option>
    </select>
        <input type="date" placeholder='dd/mm/yyyy' className='input'  value={formData.date}
            onChange={handleChange} />
        <button className='edit-button' onClick={handleSubmit}>Add Expense</button>
        <button className='cancel-edit' onClick={() => {
              setEditIndex(null);
              setFormData({ title: '', price: '', category: '', date: '' });
            }}>Cancel</button>
</form>
      </dialog>
      </section>
     
    </div>
  );
}

export default App;
