
class Store {
  constructor({
    packCount = 20,
    url,
    data = []
  }) {
    this.props = {
      packCount,
      url,
      data
    }    
  }  

  getOptions(field) {
    if(!this.props.hasOwnProperty(field)) {
      return null;
    }
    return this.props[field];
  }

  get(index) {
    const { data } = this.props;
    if (index >= data.length) {
      return null;
    }

    return data[index];
  }

  getRange(startIndex) {
    const { data, packCount } = this.props;
    if ((startIndex + packCount - 1) >= data.length) {
      this.fetch();
      return;
    }
    return {
      [Symbol.iterator]: () => {
        let i = startIndex;
        const endIndex = startIndex + packCount;
        return {
          next() {
            if (i < endIndex) {
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
    //this.data.slice(startIndex, )
  }

  fetch() {

  }
}

export default Store;