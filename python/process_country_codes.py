import json
import csv
import sys
import pycountry

# Open the CSV file specified as an argument
csv_file = sys.argv[1]
with open(csv_file, 'r') as f:
    reader = csv.reader(f)
    rows = list(reader)

# #print all countries in pycountry
# for country in pycountry.countries:
#     print(country.name) 

# Replace country names in the csv with the one in pycountry
for row in rows:
    if row[1] == 'Vatican City':
        row[1] = 'Holy See (Vatican City State)'
    elif row[1] == 'Venezuela':
        row[1] = 'Venezuela, Bolivarian Republic of'
    elif row[1] == 'Republic of the Congo':
        row[1] = 'Congo'
    elif row[1] == 'DR Congo':
        row[1] = 'Congo, The Democratic Republic of the'
    elif row[1] == 'Ivory Coast':
        row[1] = 'Côte d\'Ivoire'
    elif row[1] == 'Vietnam':
        row[1] = 'Viet Nam'
    elif row[1] == 'Saint Martin':
        row[1] = 'Saint Martin (French part)'
    elif row[1] == 'São Tomé and Príncipe':
        row[1] = 'Sao Tome and Principe'
    elif row[1] == 'Brunei':
        row[1] = 'Brunei Darussalam'
    elif row[1] == 'British Virgin Islands':
        row[1] = 'Virgin Islands, British'
    elif row[1] == 'Bolivia':
        row[1] = 'Bolivia, Plurinational State of'
    elif row[1] == 'French Southern and Antarctic Lands':
        row[1] = 'French Southern Territories'
    elif row[1] == 'Taiwan':
        row[1] = 'Taiwan, Province of China'
    elif row[1] == 'Moldova':
        row[1] = 'Moldova, Republic of'
    elif row[1] == 'Cape Verde':
        row[1] = 'Cabo Verde'
    elif row[1] == 'Russia':
        row[1] = 'Russian Federation'
    elif row[1] == 'United States Virgin Islands':
        row[1] = 'Virgin Islands, U.S.'
    elif row[1] == 'Syria':
        row[1] = 'Syrian Arab Republic'
    elif row[1] == 'Tanzania':
        row[1] = 'Tanzania, United Republic of'
    elif row[1] == 'Iran':
        row[1] = 'Iran, Islamic Republic of'
    elif row[1] == 'South Korea':
        row[1] = 'Korea, Republic of'
    elif row[1] == 'Macau':
        row[1] = 'Macao'
    elif row[1] == 'North Korea':
        row[1] = 'Korea, Democratic People\'s Republic of'
    elif row[1] == 'South Georgia':
        row[1] = 'South Georgia and the South Sandwich Islands'
    elif row[1] == 'Micronesia':
        row[1] = 'Micronesia, Federated States of'
    elif row[1] == 'Palestine':
        row[1] = 'Palestine, State of'
    elif row[1] == 'Turkey':
        row[1] = 'Türkiye'
    elif row[1] == 'Pitcairn Islands':
        row[1] = 'Pitcairn'
    elif row[1] == 'Caribbean Netherlands':
        row[1] = 'Bonaire, Sint Eustatius and Saba'
    elif row[1] == 'Laos':
        row[1] = 'Lao People\'s Democratic Republic'
    elif row[1] == 'Sint Maarten':
        row[1] = 'Sint Maarten (Dutch part)'
    elif row[1] == 'Falkland Islands':
        row[1] = 'Falkland Islands (Malvinas)'

# Add a new column header for the iso alpha-2 country codes
rows[0].append('iso_alpha2')

# Iterate through the rows and add the iso alpha-2 country code for each row
# according to the country name
for row in rows[1:]:
    try:
        if row[1] == 'Kosovo':
            row.append('XK')
            continue
        country = pycountry.countries.get(name=row[1])
        row.append(country.alpha_2)
    except KeyError:
        row.append('')

# Write the updated rows to a new CSV file
output_file = sys.argv[2]
with open(output_file, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

# # Process the TopoJSON file to add the iso alpha-2 country codes according to
# # id, which is the country iso country-code

# # Load the TopoJSON file
# with open('../map_data/countries-10m.topo.json') as f:
#     data = json.load(f)

# # Add the country codes to the TopoJSON file, lookup by numeric code
# # Don't process if id doesn't exist
# for feature in data['objects']['countries']['geometries']:
#     if 'id' in feature:
#         try:
#             country = pycountry.countries.get(numeric=feature['id'])
#             feature['properties']['iso_alpha2'] = country.alpha_2
#         except KeyError:
#             print('No country found for id: ' + str(feature['id']))

# # Save the updated TopoJSON file
# with open('../map_data/countries-10m-alpha-2.topo.json', 'w') as f:
#     json.dump(data, f)