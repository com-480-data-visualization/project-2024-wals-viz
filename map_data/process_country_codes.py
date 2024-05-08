import json
import pycountry

# Process the TopoJSON file to add the iso alpha-2 country codes according to
# id, which is the country iso country-code

# Load the TopoJSON file
with open('countries-10m.topo.json') as f:
    data = json.load(f)

# Add the country codes to the TopoJSON file, lookup by numeric code
# Don't process if id doesn't exist
for feature in data['objects']['countries']['geometries']:
    if 'id' in feature:
        try:
            country = pycountry.countries.get(numeric=feature['id'])
            feature['properties']['iso_alpha2'] = country.alpha_2
        except KeyError:
            print('No country found for id: ' + str(feature['id']))

# Save the updated TopoJSON file
with open('countries-10m-alpha-2.topo.json', 'w') as f:
    json.dump(data, f)