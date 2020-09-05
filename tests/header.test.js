const puppeteer = require("puppeteer")
jest.setTimeout(30000);

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    })
    page = await browser.newPage()
    await page.goto("localhost:8080")
})

afterEach(async () => {
    await browser.close()
})

// Checking for correct header text.
test("The header has the correct text", async () => {
    await page.waitForSelector('a.header__title')
    const text = await page.$eval("a.header__title", el => el.innerHTML)
    expect(text).toEqual("Public Header")
})

// Starting auth flow by clicking the login button.
test("Clicking login, starts auth flow", async () => {
    await page.waitForSelector(".login__btn")
    await page.click(".login__btn")

    const url = await page.url()
    expect(url).toMatch(/login/)
})