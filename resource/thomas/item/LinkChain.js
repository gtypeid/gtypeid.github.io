
export default class LinkChain{

    constructor(){
        this._prev = new Array();
        this._next = new Array();
    }

    addNext(item){
        this._next.push(item);
        return item;
    }


    addPrev(item){
        this._prev.push(item);
        return item;
    }

    removePrev(item){
        const index = this._prev.findIndex(it => it.uIndex === item.uIndex);
        if (index !== -1) {
            this._prev.splice(index, 1);
        }
    }

    removeNext(item){
        const index = this._next.findIndex(it => it.uIndex === item.uIndex);
        if (index !== -1) {
            this._next.splice(index, 1);
        }
    }

    request(node){

    }

    response(node){

    }

    get prev(){
        return this._prev;
    }

    get next(){
        return this._next;
    }
}