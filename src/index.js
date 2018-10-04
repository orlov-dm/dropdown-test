import "@babel/polyfill";
import 'whatwg-fetch';
import runPolyfils from './polyfills';
runPolyfils();
import { stringify } from 'svgson-next';
import 'normalize.css';

import Dropdown from './Dropdown';
import Store from './Store';
import './styles/main.css';
import * as Constants from '../server/constants';

console.log(Constants);

function getFavouriteData() {
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


const filterFields = [
    Constants.USER_FIELD_NAME,
    Constants.USER_FIELD_SURNAME,
    Constants.USER_FIELD_FULLNAME,
    Constants.USER_FIELD_WORKPLACE
];
const store = new Store({
    data: getFavouriteData(),
    packCount: 50,
    packFetchCount: 1000,
    filterFields,
    url: '/users',
    reviver: function(key, value) {
        if(key === 'avatarUrl') {
            return stringify(value);
        }
        return value;
    }
});

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
    multiple: false,
    needAvatars: false
})).init();
