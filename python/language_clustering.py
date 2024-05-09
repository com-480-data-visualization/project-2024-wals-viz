"""
Clustering 
"""

import pandas as pd
from kmodes.kmodes import KModes 

import numpy as np

import matplotlib.pyplot as plt

def get_feature_map(language, feature_name):
    values = language[feature_name].unique()
    feature_map = {}
    for i, value in enumerate(values):
        feature_map[value] = i
    return feature_map

def translate_dataframe_to_values(language, feature_names):
    
    feature_maps = {}
    inv_feature_maps = {}
    
    df_copy = language.copy()
    
    for feature_name in feature_names:        
        feature_map = get_feature_map(language, feature_name)
        inv_feature_map = {v: k for k, v in feature_map.items()}

        
        feature_maps[feature_name] = feature_map
        inv_feature_maps[feature_name] = inv_feature_map
        
        
        for i in range(df_copy.shape[0]):
            df_copy.loc[df_copy.index[i], feature_name] = feature_map[df_copy.loc[df_copy.index[i], feature_name]]

    return df_copy, feature_maps, inv_feature_maps

basic_features = ['wals_code', 'iso_code', 'glottocode',
                  'Name', 'latitude', 'longitude', 'genus',
                  'family', 'macroarea', 'countrycodes',]

filename = '../data/'

language = pd.read_csv(filename + 'language.csv')

keep_features = [
'65A Perfective/Imperfective Aspect',
'66A The Past Tense',
'67A The Future Tense',
'68A The Perfect',
'69A Position of Tense-Aspect Affixes',
'79A Suppletion According to Tense and Aspect',
'102A Verbal Person Marking']

keep_features_extended = basic_features + keep_features

language_consonant_vowel = language[keep_features_extended]
language_consonant_vowel = language_consonant_vowel.dropna()

X_cons_vowel, feature_maps, inv_feature_maps = translate_dataframe_to_values(language_consonant_vowel, keep_features)


X_cons_vowel = X_cons_vowel[keep_features].to_numpy()

cost = []
K = range(2, 50) 
for k in list(K): 
    kmode = KModes(n_clusters=k, init = "random", n_init = 5, verbose=1) 
    kmode.fit_predict(X_cons_vowel) 
    cost.append(kmode.cost_) 
plt.figure()
plt.plot(K, cost, '-o')
plt.show()

kmodes = KModes(n_clusters = 10)
y_pred = kmodes.fit_predict(X_cons_vowel)


for label in np.unique(kmodes.labels_):
    print("Cluster " + str(int(label)))
    cluster_languages = language_consonant_vowel.iloc[y_pred == label, :]
    
    cur_cluster_centroids = kmodes.cluster_centroids_[label]
    for i in range(cur_cluster_centroids.shape[0]):
        print(keep_features[i] + " : " + inv_feature_maps[keep_features[i]][cur_cluster_centroids[i]])
    print("==============")
    for i in range(cluster_languages.shape[0]):
        print('\t' + cluster_languages.iloc[i]['Name'] + ' - ' \
              + cluster_languages.iloc[i]['macroarea'] + ' - '\
                  + cluster_languages.iloc[i]['family'])
    
    print("==============\n")
    print("==============")
