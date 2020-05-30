window.onload = function () {
    document.getElementById("filter-box").style.display = 'none';
};

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
                removeInitialDOM()
                createTable(productInfoList);
                createDownloadButton(searchParameter);
            })
    }
    catch (error) {
        console.error(error)
    }
}

document.getElementById("filter-reset").onclick = () => {
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
                removeInitialDOM()
                createTable(productInfoList);
                createDownloadButton(searchParameter);
            })
    }
    catch (error) {
        console.error(error)
    }
}


document.getElementById("filter-submit").onclick = () => {
    var checkRadioButtonObj = checkRadioButtons()
    var filterWordsObj = checkFilterWords()
    console.log(filterWordsObj)
    manipulateTable(checkRadioButtonObj, filterWordsObj)
    console.log("clicked")
}

// function postAndCreateTable() {
//     let searchParameter = document.getElementById("search-box").value;
//     console.log(searchParameter)
//     try {
//         postData(
//             url = 'http://localhost:3015/posts',
//             data = {
//                 "searchParameter": searchParameter,
//                 "keyword": ""
//             }).then(data => {
//                 let productInfoList = data
//                 console.log(productInfoList)
//                 removeInitialDOM()
//                 createTable(productInfoList);
//                 createDownloadButton(searchParameter);
//             })
//     }
//     catch (error) {
//         console.error(error)
//     }
// }

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
    tbodyDOM.id = "tbodyDOM"
    var bDelete = false
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
                if (property === 'Price') {
                    var cellText = document.createTextNode(object[property])
                    cellText = Number(cellText)
                    if (isNaN(cellText)) {
                        bDelete = true
                    } else {
                        bDelete = false
                    }
                }
                var cellText = document.createTextNode(object[property])
                cell.appendChild(cellText);
            }
            tRowDOM.appendChild(cell);
        }
        tbodyDOM.appendChild(tRowDOM)
        // if (bDelete === false) {
        //     tbodyDOM.appendChild(tRowDOM)
        // }

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
    downloadButton.id = "download-button"
    aTagforDownload.appendChild(downloadButton)
    document.getElementById("search-block").appendChild(aTagforDownload)

}


function removeInitialDOM() {
    var btableDOM = document.getElementById("tableDOM")
    if (btableDOM !== null) {
        btableDOM.remove();
    } else {
        document.getElementById("filter-box").style.display = "block"
    }
    var bDownloadDOM = document.getElementById("download-button")
    if (bDownloadDOM !== null) {
        bDownloadDOM.remove();
    }
}


function checkRadioButtons() {
    var bRemoveZeroListing
    if (document.getElementById("yes").checked) {
        bRemoveZeroListing = true;
    }
    if (document.getElementById("no").checked) {
        bRemoveZeroListing = false;
    }
    var bSortPriceBy
    if (document.getElementById("ascending").checked) {
        bSortPriceBy = true;
    }
    if (document.getElementById("descending").checked) {
        bSortPriceBy = false;
    }

    return {
        "bRemoveZeroListing": bRemoveZeroListing,
        "bSortPriceBy": bSortPriceBy
    }
}

function checkFilterWords() {
    var filterTitle = document.getElementById("filter-word-in-title").value
    var filterBody = document.getElementById("filter-word-in-body").value
    return {
        "filterTitle": filterTitle,
        "filterBody": filterBody
    }
}

function manipulateTable(checkRadioButtonObj, filterWordsObj) {
    var bRemoveZeroListing = checkRadioButtonObj.bRemoveZeroListing
    var bSortPriceBy = checkRadioButtonObj.bSortPriceBy
    var filterTitle = filterWordsObj.filterTitle
    var filterBody = filterWordsObj.filterBody
    var tbodyDOM = document.getElementById("tbodyDOM")
    var rowArray = tbodyDOM.getElementsByTagName("tr")


    for (var index = 0; index < rowArray.length; index++) {
        if (bRemoveZeroListing === true) {
            var listingPrice = rowArray[index].getElementsByTagName("td")[1].innerText
            listingPrice = Number(listingPrice)
            if (listingPrice === 0 || isNaN(listingPrice)) {
                var rowDOM = rowArray[index]
                tbodyDOM.removeChild(rowDOM)
                index -= 1
                continue
            }
        }
        if (filterTitle) {
            var listingTitle = rowArray[index].getElementsByTagName("td")[2].innerText
            listingTitle = String(listingTitle)
            var bConstains = listingTitle.includes(filterTitle)
            if (bConstains === false) {
                var rowDOM = rowArray[index]
                tbodyDOM.removeChild(rowDOM)
                tag = 100
                index -= 1
                continue
            }
        }
        if (filterBody) {
            var listingBody = rowArray[index].getElementsByTagName("td")[3].innerText
            listingBody = String(listingBody)
            var bConstains = listingBody.includes(filterBody)
            if (bConstains === false) {
                var rowDOM = rowArray[index]
                tbodyDOM.removeChild(rowDOM)
                tag = 100
                index -= 1
                continue
            }
        }
    }


    var switching = true
    var shouldSwitch, xLP, yLP
    while (switching) {
        switching = false
        rowArray = tbodyDOM.getElementsByTagName("tr")
        for (var index = 0; index < (rowArray.length - 1); index++) {
            shouldSwitch = false
            xLP = rowArray[index].getElementsByTagName("td")[1].innerText
            xLP = Number(xLP)
            yLP = rowArray[index + 1].getElementsByTagName("td")[1].innerText
            yLP = Number(yLP)
            if (bSortPriceBy) {
                if (xLP > yLP) { //ascending
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (xLP < yLP) { //descending
                    shouldSwitch = true;
                    break;
                }

            }

        }
        if (shouldSwitch) {
            rowArray[index].parentNode.insertBefore(rowArray[index + 1], rowArray[index])
            switching = true
        }
    }
}