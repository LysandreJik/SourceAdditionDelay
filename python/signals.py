#%% Imports
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
from sklearn.decomposition import FastICA, PCA
import plotly.plotly as py
import plotly.graph_objs as go
from func import *
from sounds import *

#%% Initial values

# Define the random seed
np.random.seed(0)
# Number of samples
n_samples = 2000
# Time vector
time = np.linspace(0, 80, n_samples)

#%% Signal creation

# Define first Sine wave
s1 = np.concatenate((square_chirp([1, 3]), square_chirp([3, 1])), axis=0)
s1 = get_elle()

# # Define second Sine wave
# s2 = np.concatenate((chirp([1, 0.2]), chirp([3, 5])), axis=0)
s2 = get_bien()

print(s1.shape)
print(s2.shape)

S = np.c_[s1, s2]

A = np.array([[0.8, 1], [1, 0.7]])
X = np.dot(S, A.T)

show(S, subplot=True)

show(X, subplot=True)

ica = FastICA(n_components=2)
S_ = ica.fit_transform(X)
A_ = ica.mixing_

print(S_.shape)
show(S_, subplot=True)

write_file(S_[:, 0], "after_ica_1.wav")
write_file(S_[:, 1], "after_ica_2.wav")

