# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Sole Heaven - Full E2E Test Suite >> Admin Orders (/admin/orders) >> should load orders page with status filters
- Location: tests\e2e.spec.ts:355:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/login
Call log:
  - navigating to "http://localhost:3001/login", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test"
  2   | 
  3   | const BASE_URL = "http://localhost:3001"
  4   | const ADMIN_EMAIL = "admin@example.com"
  5   | const ADMIN_PASSWORD = "password123"
  6   | const TEST_EMAIL = `testuser_${Date.now()}@example.com`
  7   | const TEST_PASSWORD = "testpassword123"
  8   | 
  9   | async function loginAs(page: any, email: string, password: string) {
> 10  |   await page.goto(`${BASE_URL}/login`)
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/login
  11  |   await page.fill("#email", email)
  12  |   await page.fill("#password", password)
  13  |   await page.locator("button[type='submit']").click()
  14  |   await page.waitForTimeout(2000)
  15  | }
  16  | 
  17  | test.describe("Sole Heaven - Full E2E Test Suite", () => {
  18  | 
  19  |   // ======================== HOME PAGE ========================
  20  |   test.describe("Home Page (/)", () => {
  21  |     test("should load the home page with hero and featured products", async ({ page }) => {
  22  |       await page.goto(BASE_URL)
  23  | 
  24  |       await expect(page.locator("h1")).toContainText("STYLE")
  25  |       await expect(page.locator("text=SHOP NOW")).toBeVisible()
  26  |       await expect(page.locator("text=Featured Products")).toBeVisible()
  27  | 
  28  |       const productLinks = page.locator("a[href^='/products/']")
  29  |       await expect(productLinks.first()).toBeVisible({ timeout: 15000 })
  30  |     })
  31  |   })
  32  | 
  33  |   // ======================== PRODUCTS CATALOG ========================
  34  |   test.describe("Products Catalog (/products)", () => {
  35  |     test("should load and display products with filters", async ({ page }) => {
  36  |       await page.goto(`${BASE_URL}/products`)
  37  | 
  38  |       await expect(page.locator("h1")).toContainText("All Products")
  39  | 
  40  |       const productLinks = page.locator("a[href^='/products/']")
  41  |       await expect(productLinks.first()).toBeVisible({ timeout: 15000 })
  42  | 
  43  |       const brandSelect = page.locator("select").first()
  44  |       await expect(brandSelect).toBeVisible()
  45  | 
  46  |       const sizeButtons = page.locator("button").filter({ hasText: /^(3[89]|4[0-5])$/ })
  47  |       const sizeCount = await sizeButtons.count()
  48  |       expect(sizeCount).toBeGreaterThanOrEqual(7)
  49  |     })
  50  | 
  51  |     test("should filter by brand", async ({ page }) => {
  52  |       await page.goto(`${BASE_URL}/products`)
  53  |       await page.waitForSelector("a[href^='/products/']", { timeout: 15000 })
  54  | 
  55  |       const brandSelect = page.locator("select").first()
  56  |       const options = await brandSelect.locator("option").allTextContents()
  57  |       const brands = options.filter((o) => o !== "All Brands")
  58  | 
  59  |       if (brands.length > 0) {
  60  |         await brandSelect.selectOption(brands[0])
  61  |         await page.waitForTimeout(1000)
  62  |         await expect(page.locator("text=FILTERS:")).toBeVisible()
  63  |       }
  64  |     })
  65  | 
  66  |     test("should filter by size", async ({ page }) => {
  67  |       await page.goto(`${BASE_URL}/products`)
  68  |       await page.waitForSelector("a[href^='/products/']", { timeout: 15000 })
  69  | 
  70  |       const sizeBtn = page.locator("button").filter({ hasText: "42" }).first()
  71  |       await sizeBtn.click()
  72  |       await page.waitForTimeout(500)
  73  | 
  74  |       await expect(page.locator("text=Size: 42")).toBeVisible()
  75  |     })
  76  | 
  77  |     test("should paginate if more than 8 products", async ({ page }) => {
  78  |       await page.goto(`${BASE_URL}/products`)
  79  |       await page.waitForSelector("a[href^='/products/']", { timeout: 15000 })
  80  | 
  81  |       const nextBtn = page.locator("button:has-text('NEXT')")
  82  |       if (await nextBtn.isVisible() && !(await nextBtn.isDisabled())) {
  83  |         await nextBtn.click()
  84  |         await page.waitForTimeout(500)
  85  |         expect(page.url()).toContain("page=2")
  86  |       }
  87  |     })
  88  |   })
  89  | 
  90  |   // ======================== PRODUCT DETAIL ========================
  91  |   test.describe("Product Detail (/products/[id])", () => {
  92  |     async function getFirstProductId(browser: any) {
  93  |       const page = await browser.newPage()
  94  |       await page.goto(`${BASE_URL}/products`)
  95  |       await page.waitForSelector("a[href^='/products/']", { timeout: 15000 })
  96  |       const href = await page.locator("a[href^='/products/']").first().getAttribute("href")
  97  |       await page.close()
  98  |       return href?.replace("/products/", "")
  99  |     }
  100 | 
  101 |     test("should load product detail page", async ({ browser }) => {
  102 |       const productId = await getFirstProductId(browser)
  103 |       test.skip(!productId, "No products found")
  104 |       const page = await browser.newPage()
  105 |       await page.goto(`${BASE_URL}/products/${productId}`)
  106 |       await expect(page.locator("h1")).toBeVisible({ timeout: 15000 })
  107 |       await expect(page.locator("text=SELECT SIZE")).toBeVisible()
  108 |       const sizeButtons = page.locator("button").filter({ hasText: /^(3[89]|4[0-5])$/ })
  109 |       const sizeCount = await sizeButtons.count()
  110 |       expect(sizeCount).toBeGreaterThanOrEqual(1)
```