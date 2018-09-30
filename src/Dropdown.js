import './styles/Dropdown.css';

class Dropdown {
  constructor(props) {
    const { id, node = null, placeholder = null } = props;
    this.props = props;
    
    this.node = node != null ? node : document.getElementById(id);
    this.state = {
      'selected': [],      
    };

    this.inputContainerRef = null;
    this.inputRef = null;
    this.datalistRef = null;    
  }

  init() {
    this.render();
    this.subscribe();
    this.refresh();
  }

  render() {
    console.log('Render: ', this.node, this.props);
    if(this.node == null) {
      return;
    }
    const container = document.createDocumentFragment();
    const { id, data, placeholder } = this.props;

    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');
    inputContainer.setAttribute('id', `${id}_input_container`);
    const input = document.createElement('input');
    input.setAttribute('id', `${id}_input`);    
    input.classList.add('input');
    if(placeholder) {
      input.setAttribute('placeholder', placeholder);
    }
    const datalist = document.createElement('div');
    datalist.setAttribute('id', `${id}_data`);
    datalist.classList.add('data');
    datalist.classList.add('hidden');
        
    if(data) {
      data.slice(0, 20).forEach((value, index) => {
        datalist.appendChild(this.renderUser(index, value));
      });
    }

    inputContainer.appendChild(input);
    container.appendChild(inputContainer);
    container.appendChild(datalist);
    
    this.node.appendChild(container);
    this.node.classList.add('dropdown');


    this.inputContainerRef = inputContainer;
    this.inputRef = input;
    this.datalistRef = datalist;    
  }

  renderUser(index, { data }) {
    const { id, name, surname, workplace, avatarUrl } = data;
    const userContainer = document.createElement('div');
    userContainer.setAttribute('index', index);
    userContainer.setAttribute('id', id);
    userContainer.classList.add('row');

    const avatarNode = document.createElement('div');
    avatarNode.classList.add('avatar');
    avatarNode.innerHTML = avatarUrl;

    const infoNode = document.createElement('div');    
    infoNode.classList.add('info');
    
    
    const fullNameNode = document.createElement('span');
    fullNameNode.classList.add('full-name');
    fullNameNode.innerHTML =  `${name} ${surname}`;

    const workplaceNode = document.createElement('span');
    workplaceNode.classList.add('workplace');
    workplaceNode.innerHTML =  `${workplace}`;

    infoNode.appendChild(fullNameNode);
    infoNode.appendChild(workplaceNode);
    userContainer.appendChild(avatarNode);
    userContainer.appendChild(infoNode);
    return userContainer;
  }

  subscribe() {
    document.addEventListener('click', event => {
      this.datalistRef.classList.add('hidden');
      //event.stopPropagation();
    });
    this.inputContainerRef.addEventListener('click', event => {
      this.datalistRef.classList.toggle('hidden');
      event.stopPropagation();
      //this.datalistRef.classList.toggle('visible');      
    });
    this.datalistRef.addEventListener('click', event => {
      let { target } = event;
      console.dir(target);
      while(!target.classList.contains('row') && !target.classList.contains('data')) {        
        target = target.parentElement;
        console.log(target);
      }
      if(target.classList.contains('row')) {
        // found
        const index = target.getAttribute('index');
        this.select(index);
      }
    });
  }

  select(index) {
    const selectedNode = document.createElement('span');
    selectedNode.classList.add('selected');
    const { data } = this.props;
    const user = data[index];
    selectedNode.innerHTML = `${user.data.name} ${user.data.surname}`;
    this.inputContainerRef.insertBefore(selectedNode, this.inputRef);

    this.datalistRef.childNodes[index].style.display = 'none';
    this.state.selected.push(index);
    this.refresh();
  }

  refresh() {
    console.log(this.inputContainerRef.offsetHeight);
    this.datalistRef.style.top = `${this.inputContainerRef.offsetHeight}px`;
  }
}

export default Dropdown;