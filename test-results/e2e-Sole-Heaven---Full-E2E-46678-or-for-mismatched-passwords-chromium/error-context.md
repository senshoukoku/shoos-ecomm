# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Sole Heaven - Full E2E Test Suite >> Registration (/register) >> should show error for mismatched passwords
- Location: tests\e2e.spec.ts:159:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/register
Call log:
  - navigating to "http://localhost:3001/register", waiting until "load"

```

# Test source

```ts
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
  111 |       await page.close()
  112 |     })
  113 | 
  114 |     test("should select size and show add to cart button", async ({ browser }) => {
  115 |       const productId = await getFirstProductId(browser)
  116 |       test.skip(!productId, "No products found")
  117 |       const page = await browser.newPage()
  118 |       await page.goto(`${BASE_URL}/products/${productId}`)
  119 |       await page.waitForSelector("h1", { timeout: 15000 })
  120 | 
  121 |       const sizeBtn = page.locator("button").filter({ hasText: /^(3[89]|4[0-5])$/ }).first()
  122 |       if (await sizeBtn.isVisible() && !(await sizeBtn.isDisabled())) {
  123 |         await sizeBtn.click()
  124 |         await page.waitForTimeout(300)
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
> 160 |       await page.goto(`${BASE_URL}/register`)
      |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/register
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
```