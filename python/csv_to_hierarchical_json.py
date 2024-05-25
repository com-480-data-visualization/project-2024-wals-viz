# In this example we want to create a hierarchical JSON from a CSV file.
# Specifically, we want to create a hierarchy for language regions, family and genuses

import csv
import json
import pandas

def csv_to_hierarchical_json(csv_file, json_file):
    
    # Step 1 - Read the csv and keep only the columns of interest (i.e. genus, family, macroarea)
    df = pandas.read_csv(csv_file)
    df = df[['genus', 'family', 'macroarea']]

    # Step 2 - Remove blank rows
    df = df.dropna()

    # Step 3 - Find the keys for the hierarchy
    macroareas = df['macroarea'].unique()
    families = df['family'].unique()
    genuses = df['genus'].unique()

    # print('\nMacroareas:', macroareas)
    # print('\n\nFamilies:', families)
    # print('\n\nGenuses:', genuses)

    # Step 4 - Create a hierarchical JSON in the format (macroarea -> family -> genus)
    hierarchical_json = []
    for macroarea in macroareas:

        # find the families for the current macroarea
        families_for_macroarea = df[df['macroarea'] == macroarea]['family'].unique()
        # print('\nFamilies for', macroarea, ':', families_for_macroarea)

        # for each family find the genuses
        children = []
        for family in families_for_macroarea:

            genuses_for_family = df[(df['macroarea'] == macroarea) & (df['family'] == family)]['genus'].unique()
            # print('\nGenuses for', family, ':', genuses_for_family)

            # Count how many times each genus appears (leafs of the hierarchy)
            leafs = []
            for genus in genuses_for_family:
                count = df[(df['macroarea'] == macroarea) & (df['family'] == family) & (df['genus'] == genus)].shape[0]
                # print(genus, 'appears', count, 'times')
                leafs.append({"name": genus, "value": count})   # leaf nodes of the hierarchy

            # append an entry for the current genus to the children array of the correct genus
            children.append({"name": family, "children": leafs})    # parent nodes of the hierarchy

        # Append the children array to the current macroarea
        hierarchical_json.append({"name": macroarea, "children": children})   # granparent nodes of the hierarchy

        # print('\nHierarchical JSON:', hierarchical_json)
        # input("Press Enter to continue...")
    
    # Add root node
    hierarchical_json = {"name": "lang_categories", "children": hierarchical_json}
    
    # Step 5 - Save the hierarchical JSON to a file
    with open(json_file, 'w') as outfile:
        json.dump(hierarchical_json, outfile)

    

# Usage example
csv_file = '../website/data/language.csv'
json_file = '../website/data/hierarchical_genuses.json'
csv_to_hierarchical_json(csv_file, json_file)