import requests
import json

productInfoDict = {'productInfoList': []}

def sendReceiveHTTPRequest(session,query):
    url = 'https://sg.carousell.com/api-service/search/search/3.3/products/'
    payload = {"count":40,"countryId":"1880251","filters":[],"locale":"en","prefill":{},"query":query,"session":session}
    responseMsg = requests.post(url,payload)
    jsonObj = json.loads(responseMsg.text)
    return jsonObj

def fillProductContainer(listing,productInfo):
    productInfo["productID"] = listing["listingCard"]["id"]
    productInfo["price"] = (listing["listingCard"]["belowFold"][1]["stringContent"]).replace("S$","")
    productInfo["title"] = listing["listingCard"]["belowFold"][0]["stringContent"]
    productInfo["bodycontent"] = listing["listingCard"]["belowFold"][2]["stringContent"]
    title = listing["listingCard"]["belowFold"][0]["stringContent"]
    productID = listing["listingCard"]["id"]
    productInfo["productURL"] = 'https://sg.carousell.com/p/'+title.replace(" ","-")+"-"+productID
    return productInfo

def getProductIDwtihSession(jsonObj,keyword):
    try:
        for listing in jsonObj["data"]["results"]:
            bodycontent = listing["listingCard"]["belowFold"][2]["stringContent"]
            if keyword in bodycontent:
                productInfo = {}
                productInfo = fillProductContainer(listing,productInfo)
                productInfoDict['productInfoList'].append(productInfo)
    except:
        return
    return

def scrapeCarousell(keyword,query):
    session = None
    for loop in range(5):
        jsonObj = sendReceiveHTTPRequest(session,query)
        bFirstWrite = getProductIDwtihSession(jsonObj,keyword)
        session = jsonObj["data"]["session"]
    return productInfoDict

if __name__ == '__main__':
    productInfoDict = {'productInfoList': []}
    scrapeCarousell(keyword,query)



