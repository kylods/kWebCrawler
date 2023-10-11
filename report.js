function printReport(pages){
    const sortedURLs = Object.entries(pages)
        .sort((a, b) => b[1] - a[1])  // Sort based on the count (values)
        .map(entry => entry[0]);      // Extract URLs (keys)

    console.log("===Starting Report===")
    for (let page in sortedURLs){
        console.log(`Found ${pages[sortedURLs[page]]} internal links to ${sortedURLs[page]}`)
    }
}

module.exports = {
    printReport
  }