## import 
from .oAuth import load_creds
import google.generativeai as genai

# setup fine tuned ai bot
creds = load_creds()
genai.configure(credentials=creds)
name = "categorizer-w96cc9hez4u7"
# categorizer = genai.GenerativeModel(model_name=f'tunedModels/{name}')
categorizer = genai.GenerativeModel('gemini-1.5-flash')
name = "analyzer-bys21ugc6n7d"
analyzer = genai.GenerativeModel(model_name=f'tunedModels/{name}')

# fune tuned ai bot api endpoint 

def categorizer_func(input1):
    result = categorizer.generate_content(input1)
    return result.text

def analyzer_func(input2):
    result = analyzer.generate_content(input2)
    return result.text

def transaction_procossor(Transaction_string):
    result = categorizer.generate_content("You need to extract information about this transaction, it needs to include transaction_date (in YYYY-MM-DD format), description and amount (decimal number) information, in case when it is not available return None for that field, return the output in json format " + Transaction_string)
    return result.text

def transaction_procossor_update(Transaction_string):
    result = categorizer.generate_content("You need to extract information about this transaction, it needs to include transaction_date (in YYYY-MM-DD format), description and amount (decimal number) information and new_transaction_date, new_description and new new_amount in case when it is not available return None for that field, return the output in json format " + Transaction_string)
    return result.text

def transactoin_procossor_search(Transaction_string):
    result = categorizer.generate_content("You need to extract information about this text, it needs to include transaction_date (in YYYY-MM-DD format), description and amount (decimal number) information when the information is not available return None for that field, return the output in json format transaction information is as follow: " + Transaction_string)
    return result.text