
function runPolyfills() {
    //Element.prototype.remove
    (function (arr) {
        arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
            if (this.parentNode !== null)
                this.parentNode.removeChild(this);
            }
        });
        });
    })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

    //Element.prototype.closest
    (function(ELEMENT) {
        ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
        ELEMENT.closest = ELEMENT.closest || function closest(selector) {
            if (!this) return null;
            if (this.matches(selector)) return this;
            if (!this.parentElement) {return null}
            else return this.parentElement.closest(selector)
          };
    }(Element.prototype));
};

export default runPolyfills;