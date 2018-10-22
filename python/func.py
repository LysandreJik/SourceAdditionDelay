import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
from scipy.io import wavfile
import os
from sklearn.decomposition import FastICA, PCA
import time
import json
from syllabe import get_basic_signals, get_signal, get_entire_signal
dirpath = os.path.dirname(os.path.abspath('__file__'))


def sine(frequency, size=1000):
    return np.sin(np.linspace(0, frequency, size))


def sign(frequency, size=1000):
    return np.sign(sine(frequency, size))


def chirp(frequency, size=1000):
    return signal.chirp(np.linspace(0, 10, size), f0=frequency[0], f1=frequency[1], t1=2.5)


def square_chirp(frequency, size=1000):
    return np.sign(signal.chirp(np.linspace(0, 10, size), f0=frequency[0], f1=frequency[1], t1=2.5))


def zeros():
    return np.zeros(1000)


def write_file(file, filename, fs=44100):
    wavfile.write(dirpath+"\\output\\"+filename, fs, file)


def show(signals, subplot=True):
    plt.figure()
    if subplot:
        if len(signals.shape) > 1:
            for index in range(signals.shape[1]):
                plt.subplot(signals.shape[1], 1, index+1)
                plt.plot(signals[:, index])
        else:
            plt.plot(signals)
    else:
        for index, signal in enumerate(signals):
            plt.plot(signal)
    plt.show(block=True)


def timing(f):
    def wrap(*args):
        time1 = time.time()
        ret = f(*args)
        time2 = time.time()
        print('{:s} function took {:.3f} ms'.format(f.__name__, (time2-time1)*1000.0))

        return ret
    return wrap


def get_model(file_name):
    with open(dirpath+'\\models\\'+file_name+'\\delays.json') as f:
        data = json.load(f)

    return data


@timing
def ICA(X):
    print(len(X))
    ica = FastICA(n_components=3)
    S_ = ica.fit_transform(X)
    A_ = ica.mixing_
    return S_, A_


def get_X_mat_2_sig(s1, s2, A=[[1, 1], [1, 1]], temporal_offset=1):
    return np.c_[
        np.add(np.dot(np.append(np.zeros(temporal_offset), s1[0:len(s1)-temporal_offset]), A[0][0]), np.dot(s2, A[0][1])),
        np.add(np.dot(s1, A[1][0]), np.dot(np.append(np.zeros(temporal_offset), s2[0:len(s2)-temporal_offset]), A[1][1]))
    ]


@timing
def getxn(model):
    # print('Fetching model : ', model)
    model = get_model(model)

    signaux = []

    maxlength = -1

    for source in model["sources"]:
        if source['path'] == "basic":
            # print('Length for', source['name'], len(get_basic_signals(source['name'], offset=int(source['t0'])*44100)))
            length = len(get_basic_signals(source['name'], offset=int(source['t0'])*44100))
        else:
            # print('Length for', source['name'], len(get_entire_signal(source['path'], int(source['t0'])*44100)))
            length = len(get_entire_signal(source['path'], int(source['t0'])*44100))

        if length > maxlength:
            maxlength = length

    signaux = np.zeros(maxlength)

    for source in model["sources"]:
        if source['path'] == "basic":
            signal = get_basic_signals(source['name'], offset=int(source['t0'])*44100)
            sig = normalize(np.append(signal, np.zeros(maxlength - len(signal))))
            signaux = np.c_[signaux, sig]
        else:
            signal = get_entire_signal(source['path'], int(source['t0'])*44100)
            write_file(signal, source['name'])
            sig = normalize(np.append(signal, np.zeros(maxlength - len(signal))))
            signaux = np.c_[signaux, sig]

    signaux = signaux[:, 1:3]
    for index, source in enumerate(signaux.T):
        write_file(source, "source"+str(index)+".wav")

    for index, microphoneRelationship in enumerate(model['relationships']):
        microphone = np.zeros(signaux.shape[0])
        for index2, individualRelationship in enumerate(microphoneRelationship):
            temporal_offset = round(44100*individualRelationship['delay'])
            # print(temporal_offset, index, index2)
            if temporal_offset > 0:
                microphone = np.array(np.add(microphone, np.append(np.zeros(temporal_offset), np.dot(1-individualRelationship['attenuation'], signaux[:, index2])[0:-temporal_offset])))
            else:
                microphone = np.array(np.add(microphone, np.dot(1-individualRelationship['attenuation'], signaux[:, index2])))
        if index == 0:
            microphones = microphone
        else:
            microphones = np.c_[microphones, microphone]
    return microphones





def flip(X):
    return -X

 
def normalize(X):
    return X/abs(np.amax(X))


def calculate_error(X, Y):
    return np.sum(np.abs(np.abs(normalize(X))-np.abs(normalize(Y))))


def calculate_squared_error(X, Y):
    return np.sum(np.abs(np.pow(normalize(X), 2)-np.pow(normalize(Y), 2)))


@timing
def pairn(S, S_):
    signaux = []
    for input_signal in S.T:
        min = {"index": -1, "value": -1}
        for index, output_signal in enumerate(S_.T):
            if min["value"] == -1 or min["value"] > calculate_error(input_signal, output_signal):
                min = {"index": index, "value": calculate_error(input_signal, output_signal)}
        signaux.append(np.c_[input_signal, S_[:, min["index"]]])
    return signaux

