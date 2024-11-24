

export default class ComputerInfo{
    constructor(){
        this.url;
        this.name;
        this.x;
        this.y;
    }

    set(name, url, position){
        this.name = name;
        this.url = url;
        this.x = position[0];
        this.y = position[1];
        return this;
    }

    get path(){
        return "http://" + this.url;
    }
}