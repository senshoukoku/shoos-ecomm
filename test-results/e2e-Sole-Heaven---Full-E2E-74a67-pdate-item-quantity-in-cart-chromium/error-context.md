# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Sole Heaven - Full E2E Test Suite >> Cart Functionality >> should update item quantity in cart
- Location: tests\e2e.spec.ts:262:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/
Call log:
  - navigating to "http://localhost:3001/", waiting until "load"

```

# Test source

```ts
  125 |         await expect(page.locator("button:has-text('ADD TO CART')")).toBeVisible()
  126 |       }
  127 |       await page.close()
  128 |     })
  129 | 
  130 |     test("should add item to cart", async ({ browser }) => {
  131 |       const productId = await getFirstProductId(browser)
  132 |       test.skip(!productId, "No products found")
  133 |       const page = await browser.newPage()
  134 |       await page.goto(`${BASE_URL}/products/${productId}`)
  135 |       await page.waitForSelector("h1", { timeout: 15000 })
  136 | 
  137 |       const sizeBtn = page.locator("button").filter({ hasText: /^(3[89]|4[0-5])$/ }).first()
  138 |       if (await sizeBtn.isVisible() && !(await sizeBtn.isDisabled())) {
  139 |         await sizeBtn.click()
  140 |         await page.waitForTimeout(300)
  141 |         await page.locator("button:has-text('ADD TO CART')").click()
  142 |         await page.waitForTimeout(500)
  143 |         await expect(page.locator("text=ADDED TO CART!")).toBeVisible()
  144 |       }
  145 |       await page.close()
  146 |     })
  147 |   })
  148 | 
  149 |   // ======================== REGISTRATION ========================
  150 |   test.describe("Registration (/register)", () => {
  151 |     test("should display register form", async ({ page }) => {
  152 |       await page.goto(`${BASE_URL}/register`)
  153 |       await expect(page.locator("h1")).toContainText("Create Account")
  154 |       await expect(page.locator("#email")).toBeVisible()
  155 |       await expect(page.locator("#password")).toBeVisible()
  156 |       await expect(page.locator("#confirmPassword")).toBeVisible()
  157 |     })
  158 | 
  159 |     test("should show error for mismatched passwords", async ({ page }) => {
  160 |       await page.goto(`${BASE_URL}/register`)
  161 |       await page.fill("#email", "mismatch@test.com")
  162 |       await page.fill("#password", "validpassword1")
  163 |       await page.fill("#confirmPassword", "differentpassword")
  164 |       await page.locator("button[type='submit']").click()
  165 |       await page.waitForTimeout(500)
  166 |       await expect(page.locator("text=Passwords do not match")).toBeVisible({ timeout: 5000 })
  167 |     })
  168 | 
  169 |     test("should register a new user", async ({ page }) => {
  170 |       await page.goto(`${BASE_URL}/register`)
  171 |       await page.fill("#email", TEST_EMAIL)
  172 |       await page.fill("#password", TEST_PASSWORD)
  173 |       await page.fill("#confirmPassword", TEST_PASSWORD)
  174 |       await page.locator("button[type='submit']").click()
  175 | 
  176 |       await page.waitForURL(/\/$/, { timeout: 10000 }).catch(() => {})
  177 |       const currentUrl = page.url()
  178 |       expect(currentUrl !== `${BASE_URL}/register`).toBeTruthy()
  179 |     })
  180 |   })
  181 | 
  182 |   // ======================== LOGIN ========================
  183 |   test.describe("Login (/login)", () => {
  184 |     test("should display login form", async ({ page }) => {
  185 |       await page.goto(`${BASE_URL}/login`)
  186 |       await expect(page.locator("h1")).toContainText("Welcome Back")
  187 |       await expect(page.locator("#email")).toBeVisible()
  188 |       await expect(page.locator("#password")).toBeVisible()
  189 |     })
  190 | 
  191 |     test("should show error for invalid credentials", async ({ page }) => {
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
> 225 |       await page.goto(BASE_URL)
      |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/
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
  292 |       const response = await page.goto(`${BASE_URL}/nonexistent-page`)
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
```