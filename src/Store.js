import { transliterate, langReverse } from '../server/common';

window.langReverse = langReverse;
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
}

export default Store;