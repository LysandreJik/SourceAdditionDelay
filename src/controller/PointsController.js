import Point from "../model/Point";

export default class PointsController{
    constructor(){
        this._points = [];
    }

    addPoint(x, y){
        this._points.push(new Point(x, y));
    }

    removePoint(index){
        this._points.slice(index, 1);
    }

    getPoints(){
        return this._points;
    }
}