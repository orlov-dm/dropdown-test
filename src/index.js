import "@babel/polyfill";
import Dropdown from './Dropdown';
import './styles/main.css';

import Avatars from '@dicebear/avatars';
import MaleSprites from '@dicebear/avatars-male-sprites';
import FemaleSprites from '@dicebear/avatars-female-sprites';

const MaleAvatars = new Avatars(MaleSprites);
const FemaleAvatars = new Avatars(FemaleSprites);

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

document.getElementById('root').addEventListener('click', function() {

    let svg = avatars.create('custom-seed1');
    document.getElementById('avatar').innerHTML = svg;
});