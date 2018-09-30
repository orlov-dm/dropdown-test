

export const showElement = function(element) {
    if(!element) {
        console.error('Element is empty');
        return;
    }
    element.classList.remove('hidden');
};

export const hideElement = function(element) {
    if(!element) {
        console.error('Element is empty');
        return;
    }
    element.classList.add('hidden');
};

export const toggleElement = function(element) {
    if(!element) {
        console.error('Element is empty');
        return;
    }
    element.classList.toggle('hidden');
};