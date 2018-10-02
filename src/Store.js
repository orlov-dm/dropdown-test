class Store {
  constructor({
    packCount = 20,
    packFetchCount = 1000,
    url = null,
    data = [],    
    reviver = null,
    filterFields = null
  }) {
    this.props = {
      packCount,
      packFetchCount,
      url,
      reviver,
      filterFields
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
        let count = 0;
        return {
          next() {
            if (count < packCount && i < length) {
              const row = data[i];
              if(!isRowValid(row)) {
                ++i;
                return this.next();
              }
              ++count;
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
      // const MAX_APPEND_COUNT = 200;
      // const appendData = (from = 0) => {
      //   let i = from;
      //   while(i < MAX_APPEND_COUNT && i < data.length) {
      //     this.state.data.push(data[i++]);
      //   }
      //   if(i < data.length) {
      //     setTimeout(appendData, 0, i);
      //   }
      // };

      // appendData();
    }    
    this.state.isFetching = false;
  }

  updateFilter(query) {
    if(query == null) {
      this.filterRegexp = null;
      return;
    }
    this.filterRegexp = new RegExp('.*' + query + '.*','');    
  }

  isRowValid(row) {
    if(this.filterRegexp == null) {
      return true;
    }
    const { filterFields } = this.props;
    for(const field of filterFields) {
      if(!row.data.hasOwnProperty(field) || row.data[field] == null) {
        continue;
      }
      if(this.filterRegexp.test(row.data[field])) {
        return true;
      }
    }
  }
}

export default Store;