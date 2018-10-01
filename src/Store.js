import { stringify } from 'svgson-next';
class Store {
  constructor({
    packCount = 20,
    packFetchCount = 1000,
    url,
    data = []
  }) {
    this.props = {
      packCount,
      packFetchCount,
      url      
    };
    
    this.state = {
      data,
      canFetch: true,
      isFetching: false
    };   
  }  

  getOptions(field) {
    if(!this.props.hasOwnProperty(field)) {
      return null;
    }
    return this.props[field];
  }

  get(index) {
    const { data } = this.state;
    if (index >= data.length) {
      return null;
    }

    return data[index];
  }

  shouldFetch(index) {
    if(!this.state.canFetch || this.state.isFetching) {
      return;
    }
    const { packFetchCount } = this.props;
    const { data } = this.state;
    return index >= (data.length - packFetchCount/2);
  }

  async getRange(startIndex) {    
    const { packCount } = this.props;
    const { data } = this.state;
    if(this.shouldFetch(startIndex + packCount)) {
      await this.usersFetch(data.length);
    }
    return {
      [Symbol.iterator]: () => {
        let i = startIndex;
        const endIndex = startIndex + packCount;
        const length = data.length;
        return {
          next() {
            if (i < endIndex && i < length) {
              return {
                done: false,
                value: data[i++]
              };
            } else {
              return {
                done: true
              };
            }
          }
        };
      }
    };
  }

  async usersFetch(startIndex) {
    this.state.isFetching = true;
    const { packFetchCount } = this.props;
    const response = await fetch(`/users?startIndex=${startIndex}&packCount=${packFetchCount}`);    
    const result = await response.text();
    const data = JSON.parse(result, function(key, value) {
        if(key === 'avatarUrl') {
            return stringify(value);
        }
        return value;
    });    

    if(data.length) {
      this.state.data.push(...data);
    } else {
      this.state.canFetch = false;    
    }    
    this.state.isFetching = false;
  }
}

export default Store;