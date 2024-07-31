## import 
from oAuth import load_creds
import google.generativeai as genai

# setup fine tuned ai bot
creds = load_creds()
genai.configure(credentials=creds)
name = "categorizer-w96cc9hez4u7"
categorizer = genai.GenerativeModel(model_name=f'tunedModels/{name}')
name = "analyzer-bys21ugc6n7d"
analyzer = genai.GenerativeModel(model_name=f'tunedModels/{name}')

# fune tuned ai bot api endpoint 


remote = True ## True for using hosted api to test False for local testing

if remote:
    def categorizer_func(input1):
        result = categorizer.generate_content(input1)
        return result.text
else:
    def categorizer_func(input1):
        result = categorizer.generate_content(input1)
        return result.text

if remote:
    def analyzer_func(input2):
        result = analyzer.generate_content(input2)
        return result.text
else:
    def analyzer_func(input2):
        result = analyzer.generate_content(input2)
        return result.text

