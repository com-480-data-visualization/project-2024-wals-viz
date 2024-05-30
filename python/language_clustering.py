"""
Clustering 
"""

import pandas as pd
from kmodes.kmodes import KModes 
import numpy as np
import json

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

def get_color_from_geoarea(geoarea):

    color_codes = {'Africa' : 1,
                   'Eurasia' : 2,
                   'South America' : 3,
                   'North America' : 4,
                   'Papunesia' : 5,
                   'Australia' : 6}

    return color_codes[geoarea]

basic_features = ['wals_code', 'iso_code', 'glottocode',
                  'Name', 'latitude', 'longitude', 'genus',
                  'family', 'macroarea', 'countrycodes',]

data_folder = '../website/data/'
output_json_file = '../website/data/feature_cluster_data_verbs.json'
language = pd.read_csv(data_folder + 'language.csv')

# keep_features = [
# '65A Perfective/Imperfective Aspect',
# '66A The Past Tense',
# '67A The Future Tense',
# '68A The Perfect',
# '69A Position of Tense-Aspect Affixes',
# '79A Suppletion According to Tense and Aspect',
# '102A Verbal Person Marking']
keep_features = [
'26A Prefixing vs. Suffixing in Inflectional Morphology',
'27A Reduplication',
'25A Locus of Marking: Whole-language Typology',
'24A Locus of Marking in Possessive Noun Phrases',
'23A Locus of Marking in the Clause',
]

keep_features_extended = basic_features + keep_features

language_consonant_vowel = language[keep_features_extended]
language_consonant_vowel = language_consonant_vowel.dropna()

X_features, feature_maps, inv_feature_maps = translate_dataframe_to_values(language_consonant_vowel, keep_features)


X_features = X_features[keep_features].to_numpy()

cost = []
K = range(2, 50) 
for k in list(K): 
    kmode = KModes(n_clusters=k, init = "random", n_init = 5, verbose=1) 
    kmode.fit_predict(X_features) 
    cost.append(kmode.cost_) 
plt.figure()
plt.plot(K, cost, '-o')
plt.show()

n_clusters = 5

kmodes = KModes(n_clusters = n_clusters)
y_pred = kmodes.fit_predict(X_features)

nodes = []
edges = []

cur_node_id = -1
for label in np.unique(kmodes.labels_):
    cur_node_id += 1
    print("Cluster " + str(int(label)))
    cur_cluster_name = 'Cluster ' + str(int(label))
    nodes.append({"name":cur_cluster_name, 
                  "color":0,
                  "id" : cur_node_id})
    cluster_languages = language_consonant_vowel.iloc[y_pred == label, :]

    cur_cluster_id = cur_node_id
    
    for i in range(cluster_languages.shape[0]):
        cur_node_id += 1
        cur_color = get_color_from_geoarea(cluster_languages.iloc[i]['macroarea'])
        nodes.append({"name":cluster_languages.iloc[i]['Name'], 
                      "iso_name":cluster_languages.iloc[i]['iso_code'],
                      "color" : cur_color,
                      "id" : cur_node_id})
        edges.append({ "source": cur_cluster_id, "target": cur_node_id })

cluster_output_dict = {'nodes' : nodes, 
                       'edges' : edges}

with open(output_json_file, 'w') as fp:
    json.dump(cluster_output_dict, fp, indent = 2)