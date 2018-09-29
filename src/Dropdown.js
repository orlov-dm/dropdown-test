import './styles/Dropdown.css';

class Dropdown {
  constructor(props) {
    const { id, node = null } = props;
    this.props = props;
    
    this.node = node != null ? node : document.getElementById(id);
  }

  render() {
    console.log('Render: ', this.node, this.props);
    if(this.node == null) {
      return;
    }
    const container = document.createDocumentFragment();
    const { id, data } = this.props;

    const input = document.createElement('input');    
    input.setAttribute('id', `${id}_input`);
    input.classList.add('input');

    const datalist = document.createElement('div');
    datalist.setAttribute('id', `${id}_data`);
    datalist.classList.add('data');
    datalist.classList.add('hidden');
    
    this.inputRef = input;
    this.datalistRef = datalist;

    if(data) {
      data.slice(0, 20).forEach(value => {
        datalist.appendChild(this.renderUser(value));
      });
    }

    container.appendChild(input);
    container.appendChild(datalist);
    
    this.node.appendChild(container);
    this.node.classList.add('dropdown');

    this.subscribe();
  }

  renderUser(userData) {
    const userContainer = document.createElement('div');
    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.innerHTML = userData.data.avatarUrl;

    const info = document.createElement('div');
    info.classList.add('info');
    
    const fullName = document.createElement('span');
    fullName.classList.add('full-name');
    fullName.innerHTML =  `${userData.data.name} ${userData.data.surname}`;

    const workplace = document.createElement('span');
    workplace.classList.add('workplace');
    workplace.innerHTML =  `${userData.data.workplace}`;

    info.appendChild(fullName);
    info.appendChild(workplace);
    userContainer.appendChild(avatar);
    userContainer.appendChild(info);
    return userContainer;
  }

  subscribe() {
    this.inputRef.addEventListener('click', () => {
      this.datalistRef.classList.toggle('hidden');
      this.datalistRef.classList.toggle('visible');
    });
  }
}

export default Dropdown;