import json

json_string = '''
 [   {     "transaction_date": "01 Jan",     "description": "Uni of Sydney Accom CommBank app BPAY 2 0000768351",     "amount": "712.00"   },   {     "transaction_date": "04 Jan",     "description": "Uni of Sydney Accom CommBank app BPAY 2 0000768351 Rent",     "amount": "80.86"   },   {     "transaction_date": "06 Jan",     "description": "TAOBAO.COM LONDON GBR Card xx9594 AUD 35.79 Value Date: 03/01/2024",     "amount": "35.79"   },   {     "transaction_date": "06 Jan",     "description": "Google YouTube Music Pyrmont AU AUS Card xx9594 Value Date: 04/01/2024",     "amount": "6.49"   },   {     "transaction_date": "10 Jan",     "description": "Microsoft*Microsoft 36 msbill.info AU AU Card xx9594 Value Date: 08/01/2024",     "amount": "29.99"   } ] 
'''

try:
    print(json_string)
    transactions = json.loads(json_string)
    print("Valid JSON")
    for transaction in transactions:
        print(transaction)
except json.JSONDecodeError as e:
    print(f"Invalid JSON: {e}")
