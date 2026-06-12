# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Sole Heaven - Full E2E Test Suite >> 404 Page >> should show custom 404 page
- Location: tests\e2e.spec.ts:291:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/nonexistent-page
Call log:
  - navigating to "http://localhost:3001/nonexistent-page", waiting until "load"

```

# Test source

```ts
  192 |       await page.goto(`${BASE_URL}/login`)
  193 |       await page.fill("#email", "nonexistent@test.com")
  194 |       await page.fill("#password", "wrongpassword")
  195 |       await page.locator("button[type='submit']").click()
  196 |       await expect(page.locator("text=Invalid email or password")).toBeVisible({ timeout: 5000 })
  197 |     })
  198 | 
  199 |     test("should login as admin", async ({ page }) => {
  200 |       await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
  201 |       await page.waitForURL(/\/$/, { timeout: 10000 }).catch(() => {})
  202 |       await page.waitForTimeout(1000)
  203 | 
  204 |       await expect(page.locator("text=Admin")).toBeVisible({ timeout: 5000 })
  205 |       await expect(page.locator("text=Sign Out")).toBeVisible()
  206 |     })
  207 |   })
  208 | 
  209 |   // ======================== NAVIGATION ========================
  210 |   test.describe("Navigation", () => {
  211 |     test("should navigate through links", async ({ page }) => {
  212 |       await page.goto(BASE_URL)
  213 | 
  214 |       await page.locator("text=Products").first().click()
  215 |       await expect(page).toHaveURL(/\/products/)
  216 | 
  217 |       await page.locator("text=SOLE HEAVEN").first().click()
  218 |       await expect(page).toHaveURL(/\/$/)
  219 |     })
  220 |   })
  221 | 
  222 |   // ======================== CART ========================
  223 |   test.describe("Cart Functionality", () => {
  224 |     test.beforeEach(async ({ page }) => {
  225 |       await page.goto(BASE_URL)
  226 |       await page.evaluate(() => {
  227 |         localStorage.removeItem("sneaker-cart")
  228 |       })
  229 |       await page.reload()
  230 | 
  231 |       await page.goto(`${BASE_URL}/products`)
  232 |       await page.waitForSelector("a[href^='/products/']", { timeout: 15000 })
  233 |       const href = await page.locator("a[href^='/products/']").first().getAttribute("href")
  234 |       if (href) {
  235 |         await page.goto(`${BASE_URL}${href}`)
  236 |         await page.waitForTimeout(2000)
  237 | 
  238 |         const sizeBtn = page.locator("button").filter({ hasText: /^(3[89]|4[0-5])$/ }).first()
  239 |         if (await sizeBtn.isVisible() && !(await sizeBtn.isDisabled())) {
  240 |           await sizeBtn.click()
  241 |           await page.waitForTimeout(300)
  242 |           await page.locator("button:has-text('ADD TO CART')").click()
  243 |           await page.waitForTimeout(500)
  244 |         }
  245 |       }
  246 |     })
  247 | 
  248 |     async function openCart(page: any) {
  249 |       await page.evaluate(() => {
  250 |         const cartStore = JSON.parse(localStorage.getItem("sneaker-cart") || "{}")
  251 |         localStorage.setItem("sneaker-cart", JSON.stringify({ ...cartStore, state: { ...cartStore.state, isOpen: true } }))
  252 |       })
  253 |       await page.reload()
  254 |       await page.waitForTimeout(1000)
  255 |     }
  256 | 
  257 |     test("should open cart drawer and show items", async ({ page }) => {
  258 |       await openCart(page)
  259 |       await expect(page.locator("text=Cart")).toBeVisible({ timeout: 5000 })
  260 |     })
  261 | 
  262 |     test("should update item quantity in cart", async ({ page }) => {
  263 |       await openCart(page)
  264 |       await page.waitForTimeout(500)
  265 | 
  266 |       const plusBtn = page.locator("button:has-text('+')").first()
  267 |       if (await plusBtn.isVisible()) {
  268 |         await plusBtn.click()
  269 |         await page.waitForTimeout(300)
  270 |       }
  271 |     })
  272 | 
  273 |     test("should remove item from cart", async ({ page }) => {
  274 |       await openCart(page)
  275 |       await page.waitForTimeout(500)
  276 | 
  277 |       const removeBtn = page.locator("button:has-text('Remove')").first()
  278 |       if (await removeBtn.isVisible()) {
  279 |         await removeBtn.click()
  280 |         await page.waitForTimeout(300)
  281 |         await expect(page.locator("text=Your cart is empty.")).toBeVisible()
  282 |       } else {
  283 |         const cartText = await page.locator("text=Cart").isVisible()
  284 |         expect(cartText).toBeTruthy()
  285 |       }
  286 |     })
  287 |   })
  288 | 
  289 |   // ======================== 404 PAGE ========================
  290 |   test.describe("404 Page", () => {
  291 |     test("should show custom 404 page", async ({ page }) => {
> 292 |       const response = await page.goto(`${BASE_URL}/nonexistent-page`)
      |                                   ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/nonexistent-page
  293 |       expect(response?.status()).toBe(404)
  294 |       await expect(page.locator("text=Page Not Found")).toBeVisible()
  295 |     })
  296 |   })
  297 | 
  298 |   // ======================== ADMIN DASHBOARD ========================
  299 |   test.describe("Admin Dashboard (/admin)", () => {
  300 |     test.beforeEach(async ({ page }) => {
  301 |       await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
  302 |     })
  303 | 
  304 |     test("should load admin dashboard with stats", async ({ page }) => {
  305 |       await page.goto(`${BASE_URL}/admin`)
  306 |       await page.waitForTimeout(3000)
  307 | 
  308 |       await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 10000 })
  309 |       await expect(page.locator("text=TOTAL PRODUCTS")).toBeVisible()
  310 |       await expect(page.locator("text=TOTAL ORDERS")).toBeVisible()
  311 |       await expect(page.locator("text=PENDING ORDERS")).toBeVisible()
  312 |     })
  313 |   })
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
```