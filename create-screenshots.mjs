#!/usr/bin/env node

/**
 * Автоматическое создание скриншотов приложения
 *
 * Запуск: node create-screenshots.mjs
 *
 * Убедитесь, что:
 * 1. npm run dev запущен в другом терминале на https://localhost:5174/
 * 2. Playwright установлен: npm install
 */

import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SCREENSHOTS_DIR = path.join(__dirname, 'docs', 'screenshots')

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

const APP_URL = 'https://localhost:5173'
const VIEWPORT = { width: 1280, height: 800 }

async function takeScreenshots() {
  let browser
  try {
    console.log('🚀 Запуск Chromium...')
    browser = await chromium.launch({
      args: ['--ignore-certificate-errors'],
    })

    console.log('📱 Создание страницы...')
    const page = await browser.newPage({
      viewport: VIEWPORT,
      ignoreHTTPSErrors: true,
    })

    // Disable animations for consistent screenshots
    await page.addInitScript(() => {
      document.documentElement.style.setProperty('--animation-duration', '0s')
    })

    console.log('🌐 Загрузка приложения...')
    try {
      await page.goto(APP_URL, {
        waitUntil: 'networkidle',
      })
    } catch (e) {
      console.log('⚠️  Игнорируем ошибку сертификата, пытаемся снова...')
      await page.goto(APP_URL, {
        waitUntil: 'domcontentloaded',
      })
    }

    console.log('⏳ Ожидание загрузки...')
    await page.waitForTimeout(2000)

    // Enable presentation mode via localStorage
    console.log('🎯 Включение режима презентации...')
    await page.evaluate(() => {
      localStorage.setItem('presentationMode', 'true')
    })

    console.log('🔄 Перезагрузка с демо-данными...')
    try {
      await page.goto(APP_URL, {
        waitUntil: 'networkidle',
      })
    } catch (e) {
      await page.goto(APP_URL, {
        waitUntil: 'domcontentloaded',
      })
    }

    await page.waitForTimeout(3000)

    // Set theme to light
    await page.evaluate(() => {
      localStorage.setItem('ui-store', JSON.stringify({ theme: 'light', language: 'ru' }))
    })

    try {
      await page.reload({ waitUntil: 'networkidle' })
    } catch (e) {
      await page.reload({ waitUntil: 'domcontentloaded' })
    }
    await page.waitForTimeout(1000)

    // Screenshot 1: Portfolio Dashboard
    console.log('📸 1/7 Портфель (Portfolio)...')
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-portfolio.png'),
      fullPage: false,
    })

    // Screenshot 2: Instruments List
    console.log('📸 2/7 Инструменты (Instruments)...')
    await page.click('a[href="/instruments"]')
    await page.waitForTimeout(1500)
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02-instruments.png'),
      fullPage: false,
    })

    // Screenshot 3: Instrument Detail
    console.log('📸 3/7 Детали инструмента (Detail)...')
    try {
      // Try to find and click on first instrument link
      const firstInstrument = await page.locator('a').filter({ hasText: /\w/ }).first()
      await firstInstrument.click({ timeout: 5000 })
    } catch (e) {
      console.log('⚠️  Не удалось найти инструмент, пропускаем...')
    }
    await page.waitForTimeout(1500)
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '03-instrument-detail.png'),
      fullPage: false,
    })

    // Screenshot 4: Payments Section
    console.log('📸 4/7 Выплаты (Payments)...')
    const paymentsSection = page.locator('text=Выплаты, text=Payment')
    if (await paymentsSection.isVisible()) {
      await paymentsSection.scrollIntoViewIfNeeded()
      await page.waitForTimeout(800)
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, '04-payments.png'),
        fullPage: false,
      })
    } else {
      console.log('⚠️  Раздел "Выплаты" не найден, пропускаем...')
    }

    // Screenshot 5: Calendar
    console.log('📸 5/7 Календарь (Calendar)...')
    await page.click('a[href="/calendar"]')
    await page.waitForTimeout(1500)
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05-calendar.png'),
      fullPage: false,
    })

    // Screenshot 6: Ledger
    console.log('📸 6/7 Журнал (Ledger)...')
    await page.click('a[href="/ledger"]')
    await page.waitForTimeout(1500)
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06-ledger.png'),
      fullPage: false,
    })

    // Screenshot 7: Settings
    console.log('📸 7/7 Настройки (Settings)...')
    await page.click('a[href="/settings"]')
    await page.waitForTimeout(1500)
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '07-settings.png'),
      fullPage: false,
    })

    console.log('\n✅ Все скриншоты успешно созданы!')
    console.log(`📁 Сохранены в: ${SCREENSHOTS_DIR}`)
    console.log('\n📋 Файлы:')
    fs.readdirSync(SCREENSHOTS_DIR)
      .filter((f) => f.endsWith('.png'))
      .sort()
      .forEach((f) => {
        const size = fs.statSync(path.join(SCREENSHOTS_DIR, f)).size
        console.log(`   ✓ ${f} (${(size / 1024).toFixed(1)} KB)`)
      })

    await page.close()
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    console.error('\n💡 Советы:')
    console.error('   1. Убедитесь, что dev сервер запущен: npm run dev')
    console.error('   2. Проверьте, что сервер доступен на https://localhost:5174/')
    console.error('   3. Если ошибка про сертификат - это нормально, скрипт игнорирует HTTPS ошибки')
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// Run
takeScreenshots()
