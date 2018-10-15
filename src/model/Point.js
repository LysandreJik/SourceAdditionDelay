
export default class Point{
    constructor(x, y){
        this._x = x;
        this._y = y;
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