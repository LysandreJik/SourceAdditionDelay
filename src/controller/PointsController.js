import Point from "../model/Point";

export default class PointsController{
    constructor(){
        this._points = [];
        this._pointAdditionMethod = "microphone";
    }

    getMethod(){
        return this._pointAdditionMethod;
    }

    setSources(type){
        this._pointAdditionMethod = type;
    }

    setMicrophones(){
        this._pointAdditionMethod = "microphone";
    }

    addPoint(x, y, type, T0){
        this._points.push(new Point(x, y, type, T0));
        //console.log(this._points);
    }

    getMicrophones(){
        return this._points.filter((point) => point.getType() === "microphone")
    }

    getSources(){
        return this._points.filter((point) => point.getType() !== "microphone")
    }

    randomizePositions(minX, minY, maxX, maxY){
        this._points.forEach((point) => {
            point.setX(Math.floor((Math.random() * (maxX - minX)) + minX));
            point.setY(Math.floor((Math.random() * (maxY - minY)) + minY));
        })
    }

    removePoint(index){
        //console.log(this._points);
        this._points.splice(index, 1);
        //console.log(this._points);
    }

    getPoints(){
        return this._points;
    }

    clearPoints(){
        this._points = [];
    }
}
