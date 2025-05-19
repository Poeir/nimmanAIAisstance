import re

def clean_unicode_spaces(text):
    return re.sub(r'[\u202f\u2009\u00a0]', ' ', text)