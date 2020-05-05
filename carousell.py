import requests
import json
import io
import pandas as pd
import csv



def sendReceiveHTTPRequest(session,query):
    url = 'https://sg.carousell.com/api-service/search/search/3.3/products/'
    payload = {"count":40,"countryId":"1880251","filters":[],"locale":"en","prefill":{},"query":query,"session":session}
    # headers = {
    #     "authority": "sg.carousell.com",
    #     "y-x-request-id": "fSClPNPAY6KlShDN",
    #     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36",
    #     "method": "POST",
    #     "path": "/api-service/filter/search/3.3/products/",
    #     "scheme": "https",
    #     "accept": "*/*",
    #     "accept-language": "en-SG,en-US;q=0.9,en;q=0.8",
    #     "content-length": 154,
    #     "content-type": "application/json",
    #     "origin": "https://sg.carousell.com",
    #     "referer": "https://sg.carousell.com/search/",
    #     "sec-fetch-dest": "empty",
    #     "sec-fetch-mode": "cors",
    #     "sec-fetch-site": "same-origin"
    # }
    # payload.update(headers)
    responseMsg = requests.post(url,payload)
    jsonObj = json.loads(responseMsg.text)
    return jsonObj

    
    




# productID = jsonObj["data"]["results"][index]["listingCard"]["id"]
# title = jsonObj["data"]["results"][index]["listingCard"]["belowFold"][0]["stringContent"]
# price = jsonObj["data"]["results"][index]["listingCard"]["belowFold"][1]["stringContent"]
# bodycontent = jsonObj["data"]["results"][index]["listingCard"]["belowFold"][2]["stringContent"]
# productURL = 'https://sg.carousell.com/p/'+title.replace(" ","-")+productID
def writeToCSV(productInfo,csvWrite):
    csvRows = productInfo.values()
    csvWrite.writerow(csvRows)
    return

def fillProductContainer(listing,productInfo):
    productInfo["productID"] = listing["listingCard"]["id"]
    productInfo["price"] = (listing["listingCard"]["belowFold"][1]["stringContent"]).replace("S$","")
    productInfo["title"] = listing["listingCard"]["belowFold"][0]["stringContent"]
    productInfo["bodycontent"] = listing["listingCard"]["belowFold"][2]["stringContent"]
    title = listing["listingCard"]["belowFold"][0]["stringContent"]
    productID = listing["listingCard"]["id"]
    productInfo["productURL"] = 'https://sg.carousell.com/p/'+title.replace(" ","-")+"-"+productID
    return productInfo


def getProductIDwtihSession(jsonObj,keyword,csvWrite,bFirstWrite):
    # print(jsonObj)
    productInfo = {}
    try:
        for listing in jsonObj["data"]["results"]:
            print(listing)
            # print(type(jsonObj["data"]["results"]))
            bodycontent = listing["listingCard"]["belowFold"][2]["stringContent"]
            if keyword in bodycontent:
                productInfo = fillProductContainer(listing,productInfo)
                if bFirstWrite == 1:
                    csvHeader = productInfo.keys()
                    csvWrite.writerow(csvHeader)
                    bFirstWrite = 0
                # print(productInfo)
                writeToCSV(productInfo,csvWrite)
    except:
        csvFile.close()
    return bFirstWrite



# This is the main function
# session = None
keyword = '16'
csvFile = open('product.csv','w',encoding="utf-8", newline="")
bFirstWrite = 1
csvWrite = csv.writer(csvFile)
queryArray = ["dell xps"]
for query in queryArray:
    print(query)
    session = None
    for loop in range(5):
        # print(session)
        print("this is loop: " + str(loop))
        jsonObj = sendReceiveHTTPRequest(session,query)
        bFirstWrite = getProductIDwtihSession(jsonObj,keyword,csvWrite,bFirstWrite)
        session = jsonObj["data"]["session"]
csvFile.close()

