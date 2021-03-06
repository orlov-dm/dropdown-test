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
        [Store.DATA_STATE_REMOTE]: []
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

  reset() {
    this._setRemoteSearch(null);
  }

  shouldFetch(index) {
    if(!this.state.canFetch || this.state.isFetching) {
      return false;
    }
    const { packCount } = this.props;
    const data = this.getData();
    return index >= (data.length - packCount * 2);
  }

  async getRange(startIndex, query = null) {
    const { packCount } = this.props;
    const data = this.getData();
    const index = startIndex;
    if(this.shouldFetch(index + packCount)) {
      await this.dataFetch();
    }
    this.updateFilter(this._isInRemoteSearch() ? null : query);
    const length = data.length;

    const range = [];
    if (index < length) {
      for(let i = index; range.length < packCount && i < data.length; ++i) {
        const row = data[i];
        if(!this.isRowValid(row)) {
          ++i;
          continue;
        }
        range.push(row);
      }
    }
    console.log(index, range.length);
    //enter remote search when no data in local storage
    if(index === 0 && 
      query != null && !range.length && !this._isInRemoteSearch()) {
      console.log('Remote search');
      this._setRemoteSearch(query);
      return this.getRange(0, query);
    }    

    return range;
  }

  async dataFetch() {
    this.state.isFetching = true;
    const { packFetchCount, url, reviver } = this.props;
    const { query } = this.state;
    const data = this.getData();
    const startIndex = data.length ? data[data.length - 1].index + 1 : 0;
    const fetchQuery = [`startIndex=${startIndex}`, `packCount=${packFetchCount}`];
    if(query != null) {
      fetchQuery.push(`query=${query}`);
    }
    const response = await fetch(`${url}?${fetchQuery.join('&')}`);
    const result = await response.text();

    const resultData = JSON.parse(result, reviver);
    if(!resultData.length) {
      this.state.canFetch = false;
    } else {
      data.push(...resultData);
    }
    this.state.isFetching = false;
  }

  prepareQuery(query) {
    query = query.trim().toLowerCase();
    return query;
  }

  //local filtering
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
    if(row == null) {
      return false;
    }
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

  //server filtering mode
  _isInRemoteSearch() {
    return this.state.dataState === Store.DATA_STATE_REMOTE;
  }

  _setRemoteSearch(query = null) {
    this.state.canFetch = true;
    this.state.dataState = query == null ? Store.DATA_STATE_LOCAL : Store.DATA_STATE_REMOTE;
    this.state.query = query;
    if(query == null) {
      this.state.data[Store.DATA_STATE_REMOTE] = [];
    }
  }
}

Store.DATA_STATE_LOCAL = 'local';
Store.DATA_STATE_REMOTE = 'remote';

export default Store;