# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Sole Heaven - Full E2E Test Suite >> Auth Protection >> should redirect to login when accessing admin without auth
- Location: tests\e2e.spec.ts:413:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/admin
Call log:
  - navigating to "http://localhost:3001/admin", waiting until "load"

```

# Test source

```ts
  314 | 
  315 |   // ======================== ADMIN PRODUCTS ========================
  316 |   test.describe("Admin Products (/admin/products)", () => {
  317 |     test.beforeEach(async ({ page }) => {
  318 |       await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
  319 |     })
  320 | 
  321 |     test("should list products in admin", async ({ page }) => {
  322 |       await page.goto(`${BASE_URL}/admin/products`)
  323 |       await page.waitForTimeout(3000)
  324 | 
  325 |       await expect(page.getByRole("heading", { name: "Products" })).toBeVisible({ timeout: 10000 })
  326 | 
  327 |       const rows = page.locator("table tbody tr")
  328 |       const rowCount = await rows.count()
  329 |       expect(rowCount).toBeGreaterThanOrEqual(1)
  330 |     })
  331 | 
  332 |     test("should have Add Product button", async ({ page }) => {
  333 |       await page.goto(`${BASE_URL}/admin/products`)
  334 |       await page.waitForTimeout(2000)
  335 | 
  336 |       await expect(page.locator("a[href='/admin/products/new']")).toBeVisible({ timeout: 5000 })
  337 |     })
  338 | 
  339 |     test("should navigate to new product form", async ({ page }) => {
  340 |       await page.goto(`${BASE_URL}/admin/products`)
  341 |       await page.waitForTimeout(2000)
  342 | 
  343 |       await page.locator("a[href='/admin/products/new']").click()
  344 |       await page.waitForTimeout(1000)
  345 |       await expect(page.getByRole("heading", { name: "New Product" })).toBeVisible({ timeout: 5000 })
  346 |     })
  347 |   })
  348 | 
  349 |   // ======================== ADMIN ORDERS ========================
  350 |   test.describe("Admin Orders (/admin/orders)", () => {
  351 |     test.beforeEach(async ({ page }) => {
  352 |       await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
  353 |     })
  354 | 
  355 |     test("should load orders page with status filters", async ({ page }) => {
  356 |       await page.goto(`${BASE_URL}/admin/orders`)
  357 |       await page.waitForTimeout(3000)
  358 | 
  359 |       await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible({ timeout: 10000 })
  360 | 
  361 |       const filterBtns = page.locator("button").filter({ hasText: /ALL|PAID|SHIPPED|DELIVERED/ })
  362 |       const count = await filterBtns.count()
  363 |       expect(count).toBeGreaterThanOrEqual(4)
  364 |     })
  365 |   })
  366 | 
  367 |   // ======================== MISSING PAGES ========================
  368 |   test.describe("Missing Pages Verification", () => {
  369 |     test.beforeEach(async ({ page }) => {
  370 |       await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
  371 |     })
  372 | 
  373 |     test("admin edit product page should load with form", async ({ page }) => {
  374 |       await page.goto(`${BASE_URL}/admin/products`)
  375 |       await page.waitForTimeout(3000)
  376 | 
  377 |       const editBtn = page.locator("button:has-text('EDIT')").first()
  378 |       if (await editBtn.isVisible()) {
  379 |         await editBtn.click()
  380 |         await page.waitForTimeout(3000)
  381 | 
  382 |         await expect(page.getByRole("heading", { name: "Edit Product" })).toBeVisible({ timeout: 10000 })
  383 |       }
  384 |     })
  385 | 
  386 |     test("account order detail page should load", async ({ page }) => {
  387 |       await page.goto(`${BASE_URL}/account`)
  388 |       await page.waitForTimeout(3000)
  389 | 
  390 |       const orderRow = page.locator("table tbody tr").first()
  391 |       if (await orderRow.isVisible()) {
  392 |         await orderRow.click()
  393 |         await page.waitForTimeout(3000)
  394 | 
  395 |         const currentUrl = page.url()
  396 |         expect(currentUrl).toContain("/account/orders/")
  397 |       }
  398 |     })
  399 |   })
  400 | 
  401 |   // ======================== AUTH PROTECTION ========================
  402 |   test.describe("Auth Protection", () => {
  403 |     test("should redirect to login when accessing checkout without auth", async ({ page }) => {
  404 |       await page.goto(`${BASE_URL}/checkout`)
  405 |       await page.waitForURL(/\/login/, { timeout: 10000 })
  406 |     })
  407 | 
  408 |     test("should redirect to login when accessing account without auth", async ({ page }) => {
  409 |       await page.goto(`${BASE_URL}/account`)
  410 |       await page.waitForURL(/\/login/, { timeout: 10000 })
  411 |     })
  412 | 
  413 |     test("should redirect to login when accessing admin without auth", async ({ page }) => {
> 414 |       await page.goto(`${BASE_URL}/admin`)
      |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/admin
  415 |       await page.waitForURL(/\/login/, { timeout: 10000 })
  416 |     })
  417 |   })
  418 | 
  419 |   // ======================== API ENDPOINTS ========================
  420 |   test.describe("API Endpoints", () => {
  421 |     test("GET /api/products should return products", async ({ page }) => {
  422 |       const response = await page.goto(`${BASE_URL}/api/products?page=1&limit=4`)
  423 |       expect(response?.status()).toBe(200)
  424 | 
  425 |       const data = JSON.parse(await response!.text())
  426 |       expect(data.products).toBeDefined()
  427 |       expect(Array.isArray(data.products)).toBeTruthy()
  428 |     })
  429 | 
  430 |     test("GET /api/auth/session should return session info", async ({ page }) => {
  431 |       const response = await page.goto(`${BASE_URL}/api/auth/session`)
  432 |       expect(response?.status()).toBe(200)
  433 |     })
  434 |   })
  435 | 
  436 |   // ======================== AI CHAT ========================
  437 |   test.describe("AI Chat", () => {
  438 |     test("should have chat bubble visible on all pages", async ({ page }) => {
  439 |       await page.goto(BASE_URL)
  440 |       await page.waitForTimeout(2000)
  441 | 
  442 |       const chatBtn = page.locator("button[aria-label='Open chat']")
  443 |       await expect(chatBtn).toBeVisible({ timeout: 5000 })
  444 |     })
  445 |   })
  446 | 
  447 |   // ======================== SIGN OUT ========================
  448 |   test.describe("Sign Out", () => {
  449 |     test("should sign out successfully", async ({ page }) => {
  450 |       await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
  451 | 
  452 |       await page.locator("button:has-text('Sign Out')").click()
  453 |       await page.waitForTimeout(2000)
  454 | 
  455 |       await expect(page.locator("a[href='/login']").first()).toBeVisible({ timeout: 5000 })
  456 |     })
  457 |   })
  458 | })
  459 | 
```