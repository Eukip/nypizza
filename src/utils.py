def nearest_value(items: list, value):
    found = items[0]
    for item in items:
        if abs(item - value) < abs(found - value):
            found = item

    return found
