document.getElementById("search-button").onclick = () => {
    let searchParameter = document.getElementById("search-box").value;
    console.log(searchParameter)
    try {
        postData(
            url = 'http://localhost:3015/posts',
            data = {
                "searchParameter": searchParameter,
                "keyword": ""
            }).then(data => {
                let productInfoList = data
                console.log(productInfoList)
                var btableDOM = document.getElementById("tableDOM")
                if (btableDOM !== null) {
                    btableDOM.remove();
                }
                createTable(productInfoList);
                createDownloadButton(searchParameter);
            })
    }
    catch (error) {
        console.error(error)
    }
}

async function postData(url, data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function createTable(productInfoList) {
    var tableDOM = document.createElement("table")
    tableDOM.id = "tableDOM"
    var theadDOM = document.createElement("thead")

    tableHeader = ["Product ID", "Price", "Listing", "Description", "Links"]
    for (const index of tableHeader) {
        var cell = document.createElement("th")
        var cellText = document.createTextNode(index)
        cell.appendChild(cellText);
        theadDOM.appendChild(cell);
    }
    tableDOM.appendChild(theadDOM);

    var productArray = productInfoList.productInfoList
    var tbodyDOM = document.createElement("tbody")
    for (var index = 0; index < productArray.length; index++) {
        var object = productArray[index]
        var tRowDOM = document.createElement("tr")
        for (const property in object) {
            var cell = document.createElement("td")
            if (property === 'productURL') {
                var aTag = document.createElement("a")
                var cellText = document.createTextNode("link")
                aTag.href = object[property]
                aTag.appendChild(cellText);
                cell.appendChild(aTag)

            } else {
                var cellText = document.createTextNode(object[property])
                cell.appendChild(cellText);
            }
            tRowDOM.appendChild(cell);
        }
        tbodyDOM.appendChild(tRowDOM)
    }
    tableDOM.appendChild(tbodyDOM);
    document.getElementById("table-block").appendChild(tableDOM);
}

function createDownloadButton(searchParameter) {
    var aTagforDownload = document.createElement("a")
    aTagforDownload.href = `../expressjs-and-python/csvfiles/product-${searchParameter}.csv`
    aTagforDownload.download = `${searchParameter}-csv`
    var downloadButton = document.createElement("button");
    var text = document.createTextNode("Download to CSV")
    downloadButton.appendChild(text)
    aTagforDownload.appendChild(downloadButton)
    document.getElementById("search-block").appendChild(aTagforDownload)

}



