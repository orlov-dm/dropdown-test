import Component from './Component';
import './styles/Dropdown.css';
import crossIcon from './images/cross.svg';
import plusIcon from './images/plus.svg';
import { showElement, hideElement, isNodeInView } from './common';
import * as Constants from './constants';

class Dropdown extends Component {
  constructor({
    id,
    store,    
    placeholder = 'Введите имя друга',
    multiple = false,
    needAvatars = true,
    node = null
  }) {
    super();
    this.props = {
      id,
      store,
      placeholder,
      multiple,
      needAvatars,
      node
    };
    this.node = node != null ? node : document.getElementById(id);
    this.state = {
      selected: new Set(),
      canFetch: true,
      store,
      current: null,
      inputFocused: false,
      inFetch: false
    };

    this.inputContainerRef = null;
    this.inputRef = null;
    this.datalistRef = null;
    this.inputTimeout = null;
  }

  init() {
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

    if(multiple) {
      const addInfo = this.renderInfo({
        type: 'add',
        action: 'add',
        label: 'Добавить',
        icon: plusIcon,
        callback: event => {
          event.stopPropagation();
          this.setState({
            inputFocused: true
          });
        }
      });
      this.inputContainerRef.insertBefore(addInfo, this.inputRef);
      this.addInfoRef = addInfo;
      hideElement(addInfo);
    }
    
    const datalist = document.createElement('div');
    datalist.setAttribute('id', `${id}_data`);
    datalist.classList.add('data');
    datalist.classList.add('hidden');      
    this.datalistRef = datalist;          

    this.node.appendChild(container);
    this.node.appendChild(datalist);
    this.node.classList.add('dropdown');

    this.render();
    this.fetchData();
    this.subscribe();
    this.refresh();
  }  

  render(prevState = null) {
    if(prevState == null) {
      return;
    }
    const { inputFocused } = this.state;
    if(inputFocused) {
      this.inputRef.focus();
    }
    const fieldsChanged = [];
    for(const [key, value] of Object.entries(this.state)) {
      if(value !== prevState[key]) {
        fieldsChanged.push(key);
      }
    }

    if(!fieldsChanged.length) {
      return;
    }

    this.renderCurrent(prevState);
    const { selected } = this.state;
    const { 
      inputFocused: prevInputFocused,
      selected: prevSelected
    } = prevState;
    if(inputFocused !== prevInputFocused) {      
      this.toggleAdd(!inputFocused);
      showElement(this.datalistRef, true, inputFocused);
      const showInput = inputFocused || !this.state.selected.size;
      showElement(this.inputRef, false, showInput);
      if(inputFocused) {
        this.inputRef.focus();
      }
    }
    if(selected !== prevSelected) {
      this.toggleAdd(!inputFocused);
      const showInput = inputFocused || !this.state.selected.size;
      showElement(this.inputRef, false, showInput);
    }

    this.refresh();
  }

  renderCurrent(prevState) {
    const { current } = this.state;
    const { current: prevCurrent } = prevState;
    if(current !== prevCurrent) {      
      if(prevCurrent != null) {
        if(prevCurrent < this.datalistRef.childElementCount) {
          const prevRow = this.datalistRef.childNodes[prevCurrent];
          prevRow.classList.remove('current');
        }
      }

      if(current == null) {
        const newCurrent = prevCurrent - 1;
        if(newCurrent >= 0) {
          this.setState({
            current: newCurrent
          });
        }    
        return    
      } 
      const row = this.datalistRef.childNodes[current];      
      row.classList.add('current');

      if(!isNodeInView(row)) {
        row.scrollIntoView(current == null || current < prevCurrent);
      }

    }
  }

  async fetchData() {    
    const { canFetch, inFetch } = this.state;
    if(!canFetch) {
      return;
    }

    if(inFetch) {
      console.log("inFetch");
      return;
    }
    
    const { store } = this.state;    
    if(!store) {
      return;
    }

    let index = 0;
    const lastRow = this.datalistRef.lastElementChild;
    if(lastRow) {
      index = Number(lastRow.getAttribute('index')) + 1;
    }
    const query = this.inputRef.value.length ? this.inputRef.value : null;
    this.setState({
      inFetch:true
    });
    const range = await store.getRange(index, query);
    if(!range) {      
      this.setState({
        canFetch: false,
        inFetch: false
      });
      return;
    }        
    for(const value of range) {
      if(this.state.selected.has(value.data.id)) {
        continue;
      }
      this.datalistRef.appendChild(this.renderUser(value.index, value.data));        
    }
    this.setState({
      inFetch:false
    });    
  }

  renderUser(index, { id, name, surname, workplace, avatarUrl }) {
    const { id: dropdownId, needAvatars }  = this.props;
    const userContainer = document.createElement('div');
    userContainer.setAttribute('index', index);
    userContainer.setAttribute('id', `${dropdownId}_row_${id}`);
    userContainer.setAttribute('user-id', id);
    userContainer.classList.add('row');    

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
    if(needAvatars) {
      const avatarNode = document.createElement('div');
      avatarNode.classList.add('avatar');
      avatarNode.innerHTML = avatarUrl;
      userContainer.appendChild(avatarNode);
    }
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

  clear() {    
    while (this.datalistRef.firstChild) {
      this.datalistRef.removeChild(this.datalistRef.firstChild);
    }
  }

  setCurrent(index) {
    let current = index;
    if (index >= this.datalistRef.childElementCount) {
      current = this.datalistRef.childElementCount - 1;
    } else if( index < 0 )  {
      current = 0;
    }
    this.setState({
      current
    });
  }

  subscribe() {
    const { multiple } = this.props;
    this.inputRef.addEventListener('input', event => {
      //add input timeout for short words too reduce query counts
      if(this.inputTimeout) {
        clearTimeout(this.inputTimeout);
        this.inputTimeout = null;
      }
      let timeout = 0;
      if(event.target.value.length < 4) {
        timeout = 500; //msec
      }
      this.inputTimeout = setTimeout(() => {
        this.refetchData();
      }, timeout);      
    });

    this.inputRef.addEventListener('blur', event => {
      this.setState({
        inputFocused: false
      });
    });

    this.inputRef.addEventListener('keydown', event => {
      //console.log(event.keyCode);
      const keyCode = Number(event.keyCode);
      if(keyCode === Constants.KEY_ENTER) {
        const { current } = this.state;
        if(current == null) {
          return;
        }
        this.select(this.datalistRef.childNodes[current]);
        return;
      }

      if(!Constants.NAVIGATION_KEYS.includes(keyCode)) {
        return;
      }
      const { current } = this.state;
      let nextCurrent = current == null ? -1 : current;
      if (keyCode == Constants.KEY_UP ||
        keyCode == Constants.KEY_DOWN) {
        nextCurrent += keyCode == Constants.KEY_DOWN ? 1 : -1;
      } else if (keyCode == Constants.KEY_PAGE_UP ||
        keyCode == Constants.KEY_PAGE_DOWN) {
        nextCurrent += keyCode == Constants.KEY_PAGE_DOWN ? 10 : -10;
      } else if (keyCode == Constants.KEY_PAGE_HOME) {
        nextCurrent = 0;
      } else if (keyCode == Constants.KEY_PAGE_END) {
        nextCurrent = this.datalistRef.childElementCount - 1;
      }      
      this.setCurrent(nextCurrent);
    });

    this.inputContainerRef.addEventListener('click', event => {      
      event.stopPropagation();
      if(!multiple && this.state.selected.size) {
        return;
      }
      this.setState({
        inputFocused: true
      });
    });
    
    this.datalistRef.addEventListener('mousedown', event => {
      let { target } = event;      
      target = target.closest('.row');
      if(target) {
        this.select(target);        
      }      
    });

    this.datalistRef.addEventListener('scroll', event => {
      if(!this.state.canFetch) {
        return;
      }
      let { target } = event;
      //scroll to bottom
      const scrollPosition = target.scrollHeight - (target.scrollTop + target.offsetHeight);
      if(scrollPosition < 1000) {   
        if(!this.state.inFetch) {
          this.fetchData();
        }
      }      
    });    
  }

  select(row) {    
    if(!row) {
      console.error("Can't select row, ", row);
      return;
    }
    const { store, multiple } = this.props;
    
    const id = Number(row.getAttribute('user-id'));
    const user = store.get(row.getAttribute('index'));
    const label = `${user.data.name} ${user.data.surname}`;
    const info = this.renderInfo({
      type: 'selected',
      action: 'remove',
      icon: crossIcon,
      label,      
      actionCallback: event => {
        event.stopPropagation();
        info.remove();
        const selected = new Set(this.state.selected);        
        selected.delete(id);
        this.refetchData();
        this.setState({
          inputFocused: false,
          selected
        });        
      }
    })    

    const target = multiple ? this.addInfoRef : this.inputRef;
    this.inputContainerRef.insertBefore(info, target);    
    const selected = new Set(this.state.selected);
    selected.add(id);
    row.remove();
    this.setState({
      current: null,
      inputFocused: false,
      selected
    });    
  }

  toggleAdd(show = true) {
    const { multiple } = this.props;
    if(!multiple) {
      return;
    }
    if(show && !this.inputRef.value.length && this.state.selected.size) {
      showElement(this.addInfoRef);      
    } else {      
      hideElement(this.addInfoRef);
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

  getRow(id) {
    const { id: dropdownId }  = this.props;    
    return document.getElementById(`${dropdownId}_row_${id}`);
  }

  refetchData() {
    this.clear();
    this.fetchData();
    this.setState({
      canFetch: true,
      current: null
    });
    this.datalistRef.scrollTo(0,0);
  }
}

export default Dropdown;