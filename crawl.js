const { JSDOM } = require('jsdom')

function normalizeURL(url) {
    let processedURL = ""
    if (url.startsWith("http://")){
        processedURL = url.slice(7)
    } else if (url.startsWith("https://")){
        processedURL = url.slice(8)
    }
    
    if (url.endsWith("/")){
        processedURL = processedURL.slice(0, -1)
    }

    return processedURL
}

function getURLsFromHTML(htmlBody, baseURL) {
    const output = []
    const dom = new JSDOM(htmlBody).window
    const urlList = dom.document.querySelectorAll('a')

    for (let anchorElement of urlList){
        const url = anchorElement.href
        if (url.startsWith('/')){
            if (baseURL.endsWith('/')){
                output.push(baseURL.slice(0, -1) + url)
            } else {
                output.push(baseURL + url)
            }
            
        } else {
            output.push(url)
        }
    } 

    return output
}

async function crawlPage(baseURL, currentURL, pages){
    // Checks if currentURL is in the same domain as baseURL
    if (!currentURL.startsWith(baseURL)){
        return pages
    }

    // Updates pages object w/ count, should return if entry exists in pages
    normalizedCurrentURL = normalizeURL(currentURL)
    if (normalizedCurrentURL in pages){
        pages[normalizedCurrentURL] ++
        return pages
    } else if (currentURL !== baseURL){
        pages[normalizedCurrentURL] = 1
    } else {
        pages[normalizedCurrentURL] = 0
    }

    try {
        // Requests page
        console.log(`Requesting ${currentURL}`)
        const response = await fetch(currentURL)
        const contentType = response.headers.get('content-type')
        // checks for valid response
        if (response.status >= 200 && response.status < 300){
            //checks if content is valid html
            if (contentType.includes('text/html')){
                const html = await response.text()

                const crawledURLs = getURLsFromHTML(html, baseURL)
  
                for (let crawledURL of crawledURLs){
                    await crawlPage(baseURL, crawledURL, pages)
                }
                return pages
            } else {
                console.log(`${response.url} responded with Content-Type:${contentType}`)
                return pages
            }
        } else {
            console.log(`${response.url} responded with Code:${response.status}`)
            return pages
        }
        
    } catch (err) {
        console.log(`Error: ${err}`)
    }



    return pages
}

module.exports = {
    normalizeURL,
    getURLsFromHTML
  }

async function main(){
    if (process.argv.length > 3){
        console.log("This application only takes one argument.")
        process.exit(0)
    } else if (process.argv.length < 3){
        console.log("This application takes a URL to crawl as an argument.")
        process.exit(0)
    }
    const baseURL = process.argv[2]
    console.log(`Crawler starting at ${baseURL}`)
    const pages = {}
    await crawlPage(baseURL, baseURL, pages)
    console.log(JSON.stringify(pages, null, 2))
}

main()