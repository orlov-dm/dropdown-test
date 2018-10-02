

export const showElement = function(element, layout = false, value = true) {
    if(!element) {
        console.error('Element is empty');
        return;
    }
    if(value) {
        const hiddenClass = layout ? 'hidden' : 'hidden-block';
        element.classList.remove(hiddenClass);
    } else {
        hideElement(element, layout);
    }
};

export const hideElement = function(element, layout = false, value = true) {
    if(!element) {
        console.error('Element is empty');
        return;
    }    
    if(value) {
        const hiddenClass = layout ? 'hidden' : 'hidden-block';
        element.classList.add(hiddenClass);
    } else {
        showElement(element);
    }
};

export const toggleElement = function(element, layout = false) {
    if(!element) {
        console.error('Element is empty');
        return;
    }
    const hiddenClass = layout ? 'hidden' : 'hidden-block';
    element.classList.toggle(hiddenClass);
};

export const isNodeInView = function(element, parentElement = null) {
    if(!element) {
        return null;
    }
    parentElement = parentElement == null ? element.parentElement : parentElement;
    const parentTopLeft = {
        x: parentElement.scrollLeft,
        y: parentElement.scrollTop
    };
    const { height: parentHeight, width: parentWidth } = parentElement.getBoundingClientRect();
    const parentBottomRight = {
        x: parentTopLeft.x + parentWidth,
        y: parentTopLeft.y + parentHeight
    };

    const { height: elementHeight, width: elementWidth } = element.getBoundingClientRect();
    const elementTopLeft = {
        x: element.offsetLeft,
        y: element.offsetTop
    };
    const elementBottomRight = {
        x: elementTopLeft.x + elementWidth,
        y: elementTopLeft.y + elementHeight
    };
    return elementTopLeft.x >= parentTopLeft.x &&
        elementTopLeft.y >= parentTopLeft.y &&
        elementBottomRight.x <= parentBottomRight.x &&
        elementBottomRight.y <= parentBottomRight.y;
}