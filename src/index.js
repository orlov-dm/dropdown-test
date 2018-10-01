import "@babel/polyfill";
import runPolyfils from './polyfills';
runPolyfils();
import { stringify } from 'svgson-next';
import 'normalize.css';

import Dropdown from './Dropdown';
import Store from './Store';
import './styles/main.css';



function getData() {
    // Read the JSON-formatted data from the DOM.
    const element = document.getElementById('user_data');
    const data = JSON.parse(element.textContent, function(key, value) {
        if(key === 'avatarUrl') {
            return stringify(value);
        }
        return value;
    });
    // Clear the element’s contents now that we have a copy of the data.
    element.remove();
    return data;
};


const packCount = 50;
const data = getData();
const url = '/users';
const reviver = function(key, value) {
    if(key === 'avatarUrl') {
        return stringify(value);
    }
    return value;
};
const store = new Store({data, packCount, url, reviver});

(new Dropdown({
    id: 'dropdown',
    store,
    placeholder: 'Введите имя друга',
    multiple: true,
})).init();

(new Dropdown({
    id: 'dropdown_single',
    store,
    placeholder: 'Введите имя друга',
    multiple: false
})).init();
