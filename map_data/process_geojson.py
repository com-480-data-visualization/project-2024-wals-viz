import json

# Round to the second decimal all numbers in geojson file
# Read the GeoJSON file
with open('world-administrative-boundaries.geojson') as f:
    data = json.load(f)

# Function to round a number to the second decimal digit
def round_to_second_decimal(num):
    return round(num, 2)

# Recursively round all numbers in the GeoJSON data
def round_geojson_numbers(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (int, float)):
                data[key] = round_to_second_decimal(value)
            elif isinstance(value, (list, dict)):
                round_geojson_numbers(value)
    elif isinstance(data, list):
        for i in range(len(data)):
            if isinstance(data[i], (int, float)):
                data[i] = round_to_second_decimal(data[i])
            elif isinstance(data[i], (list, dict)):
                round_geojson_numbers(data[i])

# Round all numbers in the GeoJSON data
round_geojson_numbers(data)

# Drop the specified properties from the GeoJSON without using recursion
def drop_properties(data, properties_to_drop):
    for feature in data['features']:
        for prop in properties_to_drop:
            feature['properties'].pop(prop, None)

# Specify the properties to be dropped
properties_to_drop = ['iso3', 'color_code', 'french_short']

# Drop the properties from the GeoJSON data
drop_properties(data, properties_to_drop)

# Drop the elements with null iso_3166_1_alpha_2_codes
data['features'] = [feature for feature in data['features'] if feature['properties'].get('iso_3166_1_alpha_2_codes') is not None]

# Write the modified GeoJSON data back to the file
with open('processed_world-administrative-boundaries.geojson', 'w') as f:
    json.dump(data, f)