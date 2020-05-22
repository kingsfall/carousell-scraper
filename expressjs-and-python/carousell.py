import requests
import json
import csv

productInfoDict = {'productInfoList': []}
productIDlist = []


def writeToCSV(productInfo, csvWrite):
    csvRows = productInfo.values()
    csvWrite.writerow(csvRows)
    return


def sendReceiveHTTPRequest(session, query):
    url = 'https://sg.carousell.com/api-service/search/search/3.3/products/'
    payload = {"count": 40, "countryId": "1880251", "filters": [],
               "locale": "en", "prefill": {}, "query": query, "session": session}
    responseMsg = requests.post(url, payload)
    jsonObj = json.loads(responseMsg.text)
    return jsonObj


def fillProductContainer(listing, productInfo):
    productInfo["productID"] = listing["listingCard"]["id"]
    productInfo["price"] = (
        listing["listingCard"]["belowFold"][1]["stringContent"]).replace("S$", "")
    productInfo["title"] = listing["listingCard"]["belowFold"][0]["stringContent"]
    productInfo["bodycontent"] = listing["listingCard"]["belowFold"][2]["stringContent"]
    title = listing["listingCard"]["belowFold"][0]["stringContent"]
    productID = listing["listingCard"]["id"]
    productInfo["productURL"] = 'https://sg.carousell.com/p/' + \
        title.replace(" ", "-")+"-"+productID
    return productInfo


def getProductIDwtihSession(jsonObj, keyword):
    global bFirstWrite
    # # print("write param:", bFirstWrite)
    global productInfoDict
    global productIDlist
    try:
        for listing in jsonObj["data"]["results"]:
            # # print("breakpoint1")
            bodycontent = listing["listingCard"]["belowFold"][2]["stringContent"]
            if keyword in bodycontent:
                # print("breakpoint2")
                productInfo = {}
                productInfo = fillProductContainer(listing, productInfo)

                # write if statement to check for duplicate
                if productInfo["productID"] not in productIDlist:
                    productIDlist.append(productInfo["productID"])
                    productInfoDict['productInfoList'].append(productInfo)
                    if bFirstWrite == 1:
                        # print("breakpoint3")
                        csvHeader = productInfo.keys()
                        csvWrite.writerow(csvHeader)
                        bFirstWrite = 0
                    # print("breakpoint4")
                    writeToCSV(productInfo, csvWrite)
                    # print("breakpoint5")
                # print("after ",bFirstWrite)

    except:
        return
    return


def scrapeCarousell(keyword, query):
    session = None
    for loop in range(5):
        jsonObj = sendReceiveHTTPRequest(session, query)
        getProductIDwtihSession(jsonObj, keyword)
        session = jsonObj["data"]["session"]
    return productInfoDict


def scrapeCarousellwCSV(keyword, query):
    global csvFile
    csvFile = open(
        f'./csvfiles/product-{query}.csv', 'w', encoding="utf-8", newline="")
    global csvWrite
    csvWrite = csv.writer(csvFile)
    global bFirstWrite
    bFirstWrite = 1
    productInfoDict = scrapeCarousell(keyword, query)
    csvFile.close()
    return productInfoDict


if __name__ == '__main__':
    keyword = ''
    query = 'bajaj'
    csvFile = open(
        f'product-{query}.csv', 'w', encoding="utf-8", newline="")
    csvWrite = csv.writer(csvFile)
    bFirstWrite = 1
    scrapeCarousell(keyword, query)
    csvFile.close()
