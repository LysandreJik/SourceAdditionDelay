import {pointsController} from "../App";
import Point from "./Point";
import store from '../controller/store/Store'
import {showLoading} from "../controller/actions/PageActions";
import {showMicrophoneCanvas} from "../controller/actions/PageActions";
import {MaxNumberOfPoints} from "../components/Environment/Options";
import {refreshApp} from "../controller/actions/UXActions";
import {signalsController} from "../components/Signal/SignalCanvas";
//console.log(window.require('electron').remote)
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
        backend.getMicrophonesFromModel(['microphones', MaxNumberOfPoints, JSON.stringify(ret)]).then((data) => {console.log(data); data = JSON.parse(data); console.log('Python script execution time : ', Math.floor(data.time*1000)+ "ms."); store.dispatch(showMicrophoneCanvas(data))});
    }

    static createEnvironment(base, audio, T0){
        //console.log("Creating sources");
        let sources  = [];
        let bankSignals = signalsController.getBankSignals();

        for(let i = 0; i < bankSignals.length; i++){
            sources.push(bankSignals[i])
        }

        if(T0[0] < 0){
            T0[0] = 0
        }

        if(T0[1] < T0[0]){
            T0[0] = 5;
            T0[1] = 30;
        }

        //console.log(sources);
        let sourcesAmount = audio[0] + (Math.random()*(audio[1] - audio[0]));

        if(sourcesAmount < 2 || sourcesAmount > sources.length){
            sourcesAmount = 2 + (Math.round(Math.random() * (sources.length - 2)));
        }
        //console.log(sources);
        //console.log("Sources amount", sourcesAmount);

        let envSources = [];

        for(let i = 0; i < sourcesAmount; i++){
            let index = Math.random() * (sources.length - 1);
            let source = sources.splice(index, 1);
            envSources.push(source)
        }

        let microphoneAmount = 2 + (Math.round(Math.random() * (sources.length + 1)));
        //console.log("Microphones amount", microphoneAmount)

        pointsController.clearPoints();
        pointsController.setMicrophones();
        for(let i = 0; i < microphoneAmount; i++){
            pointsController.addPoint(0, 0, pointsController.getMethod(), Math.random()*i*5);
        }

        //console.log(pointsController.getMicrophones());

        for(let i = 0; i < sourcesAmount; i++){
            let source = envSources[i];
            pointsController.setSources(source[0]);
            pointsController.addPoint(0, 0, pointsController.getMethod(), T0[0] + (Math.random() * (T0[1] - T0[0])));
        }

        //console.log(pointsController.getSources());

        let canvas = document.getElementById('Canvas').getBoundingClientRect();
        pointsController.randomizePositions(20, 20, canvas.width-20, canvas.height-20);
        store.dispatch(refreshApp());
    }

    static fetchAndSave(path="D:/", numberOfRandomGenerations = 10, name, audio, T0, base=false, medium = "air", title = "delays"){
        //console.log('Fetching and saving', numberOfRandomGenerations);
        if(numberOfRandomGenerations > 0){

            Template.createEnvironment(base, audio, T0);

            let sos = 34000;

            let microphones = pointsController.getMicrophones().map((point , index) =>  {return {x: point.getX(), y: point.getY(), index}});

            //console.log(pointsController.getSources());

            let sources = pointsController.getSources().map((point , index) =>  {return {path: point.getType().signal, name: point.getType().name, t0: point.getT0(), t: point.getType().metadata.n/point.getType().metadata.fs, x: point.getX(), y: point.getY(), index}});

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
                        attenuation: (Template.distance(microphone, source)/100)*0.01,
                    });

                });
                ret.relationships.push(relationship);
            });

            ret.info = {
                date: new Date().toISOString(),
                nbMicros: microphones.length,
                nbSources: sources.length,
                version: 1.0
            };

            //console.log("RET", ret)

            backend.getMicrophonesFromModel(['save', JSON.stringify(ret), path, name])
                .then((data) => {
                    console.log("Data boi", data);
                })
                .then(() => {
                    this.fetchAndSave(path, numberOfRandomGenerations=numberOfRandomGenerations-1, name);
                });
        }
    }



    static distance(point1, point2){
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
    }

}
