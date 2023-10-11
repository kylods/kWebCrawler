const { test, expect } = require('@jest/globals')
const { normalizeURL } = require('./crawl.js')
const { getURLsFromHTML } = require('./crawl.js')

test('tests normalizeURL() with http://kuelos.net/', () => {
    expect(normalizeURL("http://kuelos.net/")).toBe('kuelos.net')
})
test('tests normalizeURL() with https://jestjs.io/docs/getting-started', () => {
    expect(normalizeURL("https://jestjs.io/docs/getting-started")).toBe('jestjs.io/docs/getting-started')
})
test('tests normalizeURL() with https://www.boot.dev/assignments/0eb6dd92-7d44-4980-a558-2168f0db4ee5', () => {
    expect(normalizeURL("https://www.boot.dev/assignments/0eb6dd92-7d44-4980-a558-2168f0db4ee5")).toBe('www.boot.dev/assignments/0eb6dd92-7d44-4980-a558-2168f0db4ee5')
})



test('tests getURLsFromHTML() absolute URL', () => {
    expect(getURLsFromHTML('<a href="https://boot.dev">Learn Backend Development</a>', 'https://boot.dev')).toStrictEqual(["https://boot.dev/"])
})
test('tests getURLsFromHTML() relative URL', () => {
    expect(getURLsFromHTML('<a href="/assignments.html">Learn Backend Development</a>', 'https://boot.dev')).toStrictEqual(["https://boot.dev/assignments.html"])
})
test('tests getURLsFromHTML() relative URL', () => {
    expect(getURLsFromHTML('<a href="/assignments.html">Learn Backend Development</a>', 'https://boot.dev/')).toStrictEqual(["https://boot.dev/assignments.html"])
})