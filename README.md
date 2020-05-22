# Carousell Scraper

## Why I developed this script
I developed a Carousell scrapping script as I was deciding on purchasing a used laptop. Sellers would only put down their laptop specifcations such as number of  RAM in the description.
I had to click on every listing to identify if the listing was a laptop that meet my specifications.

The scipt I developed will output all the lisitng in an excel file with specifications, price and direct links to the listing. I plan on further developing a Web App for users to input their search terms and output an excel file for easy viewing.  

## How I developed this script
Looking at the http logs from carousell website, there is a http response from the server which contains all information in the listing displayed on the browser. Therefore, there is no need for DOM manipluation.

However, there is a catch. As carousell is a dynamic website, more listings only get populated as you scroll down the browser. Each time the browser gets populated with more listing, the browser will send and receive a new HTTP request with the current web session details. My script was able to emulate this behavior by taking in details of the current web session, package it in my next HTTP request and send it out to carousell webservers. 

I was considering using Puppeteer to handle the dynamic web content while using javascript package such as Cheerio.js to handle the DOM manipulations. Perhaps I would do that in my next project.

## Future improvements
1. Develop a more robust script using Puppeteer
2. Develop a Web App for users to input their parameters for scraping