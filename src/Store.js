import { transliterate, langReverse } from '../server/common';

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
       data: {
        [Store.DATA_STATE_LOCAL]: data,
        [Store.DATA_STATE_EXTENDED]: []
      },
      canFetch,
      isFetching: false,
      dataState: Store.DATA_STATE_LOCAL,
      query: null
    };   
  }

  // get length() {
  //   return this.state.data.length;
  // }

  getOptions(field) {
    if(!this.props.hasOwnProperty(field)) {
      return null;
    }
    return this.props[field];
  }

  getData() {
    const { data, dataState } = this.state;
    return data[dataState];
  }
  get(index) {
    const data = this.getData();
    if (index >= data.length) {
      return null;
    }

    return data[index];
  }

  shouldFetch(index) {
    if(!this.state.canFetch || this.state.isFetching) {
      return false;
    }
    if(this.isInExtendedSearch()) {
      return true;
    }
    const { packFetchCount } = this.props;
    const data = this.getData();
    return index >= (data.length - packFetchCount/2);
  }  

  async getRange(startIndex, query = null) {
    const { packCount } = this.props;
    const data = this.getData();
    if(this.shouldFetch(startIndex + packCount)) {
      await this.dataFetch(data.length);
    }    
    this.updateFilter(this.isInExtendedSearch() ? null : query);    
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
              row.index = i++;
              return {
                done: false,
                value: row
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
    const { query } = this.state;
    const fetchQuery = [`startIndex=${startIndex}`, `packCount=${packFetchCount}`];
    if(query != null) {
      fetchQuery.push(`query=${query}`);
    }
    const response = await fetch(`${url}?${fetchQuery.join('&')}`);
    const result = await response.text();

    const data = JSON.parse(result, reviver);
    if(!data.length) {
      this.state.canFetch = false;    
    } else {      
      this.getData().push(...data);
    }    
    this.state.isFetching = false;
  }

  prepareQuery(query) {
    query = query.trim().toLowerCase();
    return query;
  }

  updateFilter(query) {
    if(query == null) {
      this.filterRegexps = null;
      return;
    }
    query = this.prepareQuery(query);
    this.filterRegexps = [];
    const transliteratedQuery = transliterate(query);
    const reversedQuery = langReverse(query);
    const reversedTransliteratedQuery = langReverse(transliteratedQuery);
    this.filterRegexps.push(new RegExp('.*' + query + '.*'));
    this.filterRegexps.push(new RegExp('.*' + transliteratedQuery + '.*'));
    this.filterRegexps.push(new RegExp('.*' + reversedQuery + '.*'));
    this.filterRegexps.push(new RegExp('.*' + reversedTransliteratedQuery + '.*'));
  }

  isRowValid(row) {
    if(this.filterRegexps == null) {
      return true;
    }
    const { filterFields } = this.props;
    for(const field of filterFields) {
      if(!row.data.hasOwnProperty(field) || row.data[field] == null) {
        continue;
      }
      for(const filterRegexp of this.filterRegexps) {
        if(filterRegexp.test(row.data[field].toLowerCase())) {
          return true;
        }
      };
    }
  }

  isInExtendedSearch() {
    return this.state.dataState === Store.DATA_STATE_EXTENDED;
  }

  setExtendedSearch(query = null) {
    this.state.canFetch = true;
    this.state.dataState = query == null ? Store.DATA_STATE_LOCAL : Store.DATA_STATE_EXTENDED;
    this.state.query = query;
    if(query == null) {
      this.state.data[Store.DATA_STATE_EXTENDED] = [];
    }
  }
}

Store.DATA_STATE_LOCAL = 'local';
Store.DATA_STATE_EXTENDED = 'extended';

export default Store;