import carousell
import json
import sys

keyword = str(sys.argv[2])
query = str(sys.argv[1])
productInfoDict = carousell.scrapeCarousell(keyword,query)
print(str(productInfoDict),end='')
# print("test", end='')
# sys.stdout.flush()
