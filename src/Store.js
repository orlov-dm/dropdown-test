class Store {
  constructor({
    packCount = 20,
    packFetchCount = 1000,
    url = null,
    data = [],    
    reviver = null,
  }) {
    this.props = {
      packCount,
      packFetchCount,
      url,
      reviver
    };
    const canFetch = url != null;
    this.state = {
      data,
      canFetch,
      isFetching: false
    };   
  }

  get length() {
    return this.state.data.length;
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
      return false;
    }
    const { packFetchCount } = this.props;
    const { data } = this.state;
    return index >= (data.length - packFetchCount/2);
  }

  async getRange(startIndex, query = null) {
    const { packCount } = this.props;
    const { data } = this.state;
    if(this.shouldFetch(startIndex + packCount)) {
      await this.dataFetch(data.length);
    }
    this.updateFilter(query);
    const isRowValid = this.isRowValid.bind(this);
    const length = data.length;
    if (startIndex >= length) {
      return null;
    }
    return {
      [Symbol.iterator]: () => {
        let i = startIndex;
        const endIndex = startIndex + packCount;
        

        return {
          next() {
            if (i < endIndex && i < length) {
              const row = data[i];
              if(!isRowValid(row)) {
                return this.next();
              }
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

  async dataFetch(startIndex) {
    this.state.isFetching = true;
    const { packFetchCount, url, reviver } = this.props;
    const response = await fetch(`${url}?startIndex=${startIndex}&packCount=${packFetchCount}`);    
    const result = await response.text();

    const data = JSON.parse(result, reviver);
    if(!data.length) {
      this.state.canFetch = false;    
    } else {
      this.state.data.push(...data);
    }    
    this.state.isFetching = false;
  }

  updateFilter(query) {
    if(query == null) {
      this.filterRegexp = null;
      return;
    }
    this.filterRegexp = new RegExp(query,"");    
  }

  isRowValid(row) {
    if(this.filterRegexp == null) {
      return true;
    }
    
    for(const value of Object.values(row)) {
      if(this.filterRegexp.test(value)) {
        return true;
      }
    }
  }
}

export default Store;