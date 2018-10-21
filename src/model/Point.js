
export default class Point{
    constructor(x, y, type, T0){
        this._x = x;
        this._y = y;
        this._type = type;
        this._T0 = T0;
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

    getT0(){
        return this._T0;
    }
}
