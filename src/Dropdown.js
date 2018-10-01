import './styles/Dropdown.css';
import crossIcon from './images/cross.svg';
import plusIcon from './images/plus.svg';
import { showElement, hideElement, toggleElement } from './common';

class Dropdown {
  constructor(props) {
    const { id, node = null } = props;
    this.props = props;
    const { favouriteStore } = this.props;
    this.node = node != null ? node : document.getElementById(id);
    this.state = {
      selected: new Set(),
      canFetch: true,
      store: favouriteStore
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
    const { id, placeholder, multiple } = this.props;

    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');
    inputContainer.setAttribute('id', `${id}_input_container`);
    const input = document.createElement('input');
    input.setAttribute('id', `${id}_input`);    
    input.classList.add('input');
    if(placeholder) {
      input.setAttribute('placeholder', placeholder);
    }
    

    inputContainer.appendChild(input);
    container.appendChild(inputContainer);

    this.inputContainerRef = inputContainer;
    this.inputRef = input;

    this.renderData();
    
    if(multiple) {
      const addInfo = this.renderInfo({
        type: 'add',
        action: 'add',
        label: 'Добавить',
        icon: plusIcon,
        callback: event => {
          event.stopPropagation();
          this.toggleAdd(false);
          showElement(this.datalistRef);
        }
      });
      this.inputContainerRef.insertBefore(addInfo, this.inputRef);
      this.addInfoRef = addInfo;
      hideElement(addInfo);
    }

    this.node.appendChild(container);
    this.node.classList.add('dropdown');
  }

  async renderData() {    
    const { canFetch } = this.state;
    if(!canFetch) {
      return;
    }
    if(!this.datalistRef) {
      const { id } = this.props;
      const datalist = document.createElement('div');
      datalist.setAttribute('id', `${id}_data`);
      datalist.classList.add('data');
      datalist.classList.add('hidden');
      this.inputContainerRef.appendChild(datalist);
      this.datalistRef = datalist;
    }
    const { store } = this.state;    
    if(!store) {
      return;
    }

    const listItemsCount = this.datalistRef.childElementCount;    
    let index = listItemsCount;
    if(this.state.store === this.props.restStore) {
      index -= this.props.favouriteStore.length;
    }
    const query = this.inputRef.value.length ? this.inputRef.value : null;
    const range = await store.getRange(index, query);
    console.log('renderData from index: ' + index);
    if(!range) {
      if(this.state.store === this.props.favouriteStore) {
        this.state.store = this.props.restStore;
        await this.renderData();
        return;
      }
      this.state.canFetch = false;      
      return;
    }        
    for(const value of range) {
      this.datalistRef.appendChild(this.renderUser(index++, value));        
    }    
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

    const userInfoNode = document.createElement('div');    
    userInfoNode.classList.add('user-info');
    
    
    const fullNameNode = document.createElement('span');
    fullNameNode.classList.add('full-name');
    fullNameNode.innerHTML =  `${id} ${name} ${surname}`;

    const workplaceNode = document.createElement('span');
    workplaceNode.classList.add('workplace');
    workplaceNode.innerHTML =  `${workplace}`;

    userInfoNode.appendChild(fullNameNode);
    userInfoNode.appendChild(workplaceNode);
    userContainer.appendChild(avatarNode);
    userContainer.appendChild(userInfoNode);
    return userContainer;
  }

  renderInfo({
    type,
    label = null,
    callback = null,
    action = null,
    icon = null,
    actionCallback = null
  }) {
    if(type == null) {
      console.error('Type is missing');
      return;
    }
    const infoNode = document.createElement('div');
    infoNode.classList.add('info');
    infoNode.classList.add(type);

    if(label) {
      const labelNode = document.createElement('span'); 
      labelNode.innerHTML = label;
      infoNode.appendChild(labelNode);
    }

    if(callback != null) {
      infoNode.addEventListener('click', callback);
    }

    if(action != null) {
      const actionNode = document.createElement('i');
      actionNode.classList.add('action');
      actionNode.classList.add(action);
      actionNode.classList.add('icon');
      actionNode.innerHTML = icon;

      if(actionCallback != null) {
        actionNode.addEventListener('click', actionCallback);
      }
      infoNode.appendChild(actionNode);
    }
    return infoNode;
  }

  subscribe() {
    const { multiple } = this.props;
    document.addEventListener('click', event => {
      event.stopPropagation();
      this.toggleAdd(true);
      hideElement(this.datalistRef);
    });
    this.inputRef.addEventListener('change', event => {

    });

    this.inputContainerRef.addEventListener('click', event => {
      event.stopPropagation();
      if(!multiple && this.state.selected.size) {
        return;
      }
      showElement(this.datalistRef);
    });
    this.datalistRef.addEventListener('click', event => {
      event.stopPropagation();
      let { target } = event;      
      target = target.closest('.row');
      if(target) {
        // found
        const index = target.getAttribute('index');
        this.select(index);        
      }
      hideElement(this.datalistRef);
    });

    this.datalistRef.addEventListener('scroll', event => {
      if(!this.state.canFetch) {
        return;
      }
      let { target } = event;
      const scrollPosition = target.scrollHeight - target.scrollTop - target.offsetHeight;
      if(scrollPosition < 1000) {
          console.log(scrollPosition);
          this.renderData();
      }      
    });    
  }

  select(index) {
    const { store, multiple } = this.props;
    const user = store.get(index);
    const label = `${user.data.name} ${user.data.surname}`;
    const info = this.renderInfo({
      type: 'selected',
      action: 'remove',
      icon: crossIcon,
      label,      
      actionCallback: event => {
        event.stopPropagation();
        info.remove();
        this.state.selected.delete(index);
        showElement(this.datalistRef.childNodes[index]);        
        
        this.toggleAdd(true);
        hideElement(this.datalistRef);
        this.refresh();
      }
    })    

    const target = multiple ? this.addInfoRef : this.inputRef;
    this.inputContainerRef.insertBefore(info, target);
    hideElement(this.datalistRef.childNodes[index]);
    this.state.selected.add(index);
    this.toggleAdd(true);
    this.refresh();
  }

  toggleAdd(show = true) {
    const { multiple } = this.props;
    if(show && !this.inputRef.value.length && this.state.selected.size) {
      if(multiple) {
        showElement(this.addInfoRef);
      }
      hideElement(this.inputRef);
    } else {
      if(multiple) {
        hideElement(this.addInfoRef);
      }
      showElement(this.inputRef);
      this.inputRef.focus();
    }
    this.refresh();
  }

  refresh() {
    if(this.timerID) {
      clearTimeout(this.timerID);
    }    
    this.timerID = setTimeout(() => {
      this.datalistRef.style.top = `${this.inputContainerRef.offsetHeight}px`;
      this.timerID = null;
    }, 0);
  }

  switchStore() {

  }
}

export default Dropdown;