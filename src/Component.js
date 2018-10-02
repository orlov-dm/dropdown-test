class Component {
    setState(state) {
        const prevState = {...this.state};
        this.state = {
            ...prevState,
            ...state
        };
        this.render(prevState);
    }    
}

export default Component;