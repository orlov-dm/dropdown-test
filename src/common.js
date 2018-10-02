

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