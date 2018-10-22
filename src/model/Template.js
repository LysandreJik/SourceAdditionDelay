import {pointsController} from "../App";
import Point from "./Point";
import store from '../controller/store/Store'
import {showLoading} from "../controller/actions/PageActions";
import {showMicrophoneCanvas} from "../controller/actions/PageActions";
const backend = window.require('electron').remote.getGlobal('shared').backend;

export default class Template{
    static export(medium = "air", title = "template"){
        this.downloadObjectAsJson({
            microphones: pointsController.getMicrophones().map(point =>  {return {x: point.getX(), y: point.getY()}}),
            sources: pointsController.getSources().map(point => {return {x: point.getX(), y: point.getY()}}), medium}, title);
    }

    static downloadObjectAsJson(exportObj, exportName){
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    /**
     * Attenuation de l'air à 20°C, humidité relative de 50% et fréquence de l'onde à 200Hz : 0.01 dB/m
     * @param medium
     * @param title
     */
    static exportDelaysAndAttenuations(medium = "air", title = "delays"){
        let sos = 34000;

        let microphones = pointsController.getMicrophones().map((point , index) =>  {return {x: point.getX(), y: point.getY(), index}});
        let sources = pointsController.getSources().map((point , index) =>  {return {path: point.getType().path, name: point.getType().name, t0: point.getT0(), x: point.getX(), y: point.getY(), index}});

        let ret = {
            microphones,
            sources,
            relationships: []
        };

        microphones.map(microphone => {
            let relationship = [];
            sources.map(source => {
                relationship.push({
                    microphoneIndex: microphone.index,
                    sourceIndex: source.index,
                    delay: Template.distance(microphone, source)/sos,
                    attenuation: (Template.distance(microphone, source)/100)*0.01
                });

            });
            ret.relationships.push(relationship);
        });

        Template.downloadObjectAsJson(ret, title)
    }

    static fetchMicrophonesInput(medium = "air", title = "delays"){
        let sos = 34000;

        let microphones = pointsController.getMicrophones().map((point , index) =>  {return {x: point.getX(), y: point.getY(), index}});
        let sources = pointsController.getSources().map((point , index) =>  {return {path: point.getType().path, name: point.getType().name, t0: point.getT0(), x: point.getX(), y: point.getY(), index}});

        let ret = {
            microphones,
            sources,
            relationships: []
        };

        microphones.map(microphone => {
            let relationship = [];
            sources.map(source => {
                relationship.push({
                    microphoneIndex: microphone.index,
                    sourceIndex: source.index,
                    delay: Template.distance(microphone, source)/sos,
                    attenuation: (Template.distance(microphone, source)/100)*0.01
                });

            });
            ret.relationships.push(relationship);
        });

        store.dispatch(showLoading());
        backend.getMicrophonesFromModel(['microphones', JSON.stringify(ret)]).then((data) => {console.log(data); data = JSON.parse(data); console.log('Python script execution time : ', Math.floor(data.time*1000)+ "ms."); store.dispatch(showMicrophoneCanvas(data))});
    }

    static distance(point1, point2){
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
    }

}
