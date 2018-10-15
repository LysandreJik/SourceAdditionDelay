
export default class Point{
    constructor(x, y, type){
        this._x = x;
        this._y = y;
        this._type = type;
    }

    getType(){
        return this._type;
    }

    getX(){
        return this._x;
    }

    getY(){
        return this._y;
    }

    setX(x){
        this._x = x;
    }

    setY(y){
        this._y = y;
    }



}
