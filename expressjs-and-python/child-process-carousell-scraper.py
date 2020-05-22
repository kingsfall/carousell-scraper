import carousell
import json
import sys


keyword = str(sys.argv[2])
query = str(sys.argv[1])
# keyword = ''
# query = 'bajaj'
productInfoDict = carousell.scrapeCarousellwCSV(keyword, query)
# Serialize obj to a JSON formatted str using this conversion table.
productInfoDict = json.dumps(productInfoDict)
productInfoDict = str(productInfoDict)
print(productInfoDict, end='')
