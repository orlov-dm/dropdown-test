import "@babel/polyfill";
import Dropdown from './Dropdown';
import './main.css';

(new Dropdown).hello();


function getData() {
    // Read the JSON-formatted data from the DOM.
    const element = document.getElementById('user_data');
    const data = JSON.parse(element.textContent);
    // Clear the element’s contents now that we have a copy of the data.
    element.innerHTML = '';
    return data;
};

const data = getData();
console.log(data);