import "@babel/polyfill";
import runPolyfils from './polyfills';
runPolyfils();

import 'normalize.css';
import { stringify } from 'svgson-next';
import Dropdown from './Dropdown';
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

const data = getData();

(new Dropdown({
    id: 'dropdown',
    data,
    placeholder: 'Введите имя друга'
})).init();
