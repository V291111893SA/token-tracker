import { test } from '@playwright/test'

test.describe('Application Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://localhost:5174/', {
      waitUntil: 'networkidle',
      ignoreHTTPSErrors: true,
    })

    // Wait for app to load
    await page.waitForTimeout(2000)

    // Enable presentation mode by setting localStorage
    await page.evaluate(() => {
      localStorage.setItem('presentationMode', 'true')
    })

    // Reload page to load demo data
    await page.goto('https://localhost:5174/', {
      waitUntil: 'networkidle',
      ignoreHTTPSErrors: true,
    })

    await page.waitForTimeout(3000)
  })

  test('01 - Portfolio Dashboard', async ({ page }) => {
    await page.screenshot({ path: 'docs/screenshots/01-portfolio.png', fullPage: false })
  })

  test('02 - Instruments List', async ({ page }) => {
    await page.click('a[href="/instruments"]')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'docs/screenshots/02-instruments.png', fullPage: false })
  })

  test('03 - Instrument Detail', async ({ page }) => {
    await page.click('a[href="/instruments"]')
    await page.waitForTimeout(1000)
    // Click on first instrument
    await page.click('table tbody tr:first-child')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'docs/screenshots/03-instrument-detail.png', fullPage: false })
  })

  test('04 - Payments Section', async ({ page }) => {
    await page.click('a[href="/instruments"]')
    await page.waitForTimeout(1000)
    // Click on first instrument
    await page.click('table tbody tr:first-child')
    await page.waitForTimeout(1000)
    // Scroll to payments section
    await page.locator('text=Выплаты').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'docs/screenshots/04-payments.png', fullPage: false })
  })

  test('05 - Calendar', async ({ page }) => {
    await page.click('a[href="/calendar"]')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'docs/screenshots/05-calendar.png', fullPage: false })
  })

  test('06 - Ledger', async ({ page }) => {
    await page.click('a[href="/ledger"]')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'docs/screenshots/06-ledger.png', fullPage: false })
  })

  test('07 - Settings', async ({ page }) => {
    await page.click('a[href="/settings"]')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'docs/screenshots/07-settings.png', fullPage: false })
  })
})
