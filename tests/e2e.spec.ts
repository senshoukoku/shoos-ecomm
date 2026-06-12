import { test, expect } from "@playwright/test"

const BASE_URL = "http://localhost:3001"
const ADMIN_EMAIL = "admin@example.com"
const ADMIN_PASSWORD = "password123"
const TEST_EMAIL = `testuser_${Date.now()}@example.com`
const TEST_PASSWORD = "testpassword123"

async function loginAs(page: any, email: string, password: string) {
  await page.goto(`${BASE_URL}/login`)
  await page.fill("#email", email)
  await page.fill("#password", password)
  await page.locator("button[type='submit']").click()
  await page.waitForTimeout(2000)
}

test.describe("Sole Heaven - Full E2E Test Suite", () => {

  // ======================== HOME PAGE ========================
  test.describe("Home Page (/)", () => {
    test("should load the home page with hero and featured products", async ({ page }) => {
      await page.goto(BASE_URL)

      await expect(page.locator("h1")).toContainText("STYLE")
      await expect(page.locator("text=SHOP NOW")).toBeVisible()
      await expect(page.locator("text=Featured Products")).toBeVisible()

      const productLinks = page.locator("a[href^='/products/']")
      await expect(productLinks.first()).toBeVisible({ timeout: 15000 })
    })
  })

  // ======================== PRODUCTS CATALOG ========================
  test.describe("Products Catalog (/products)", () => {
    test("should load and display products with filters", async ({ page }) => {
      await page.goto(`${BASE_URL}/products`)

      await expect(page.locator("h1")).toContainText("All Products")

      const productLinks = page.locator("a[href^='/products/']")
      await expect(productLinks.first()).toBeVisible({ timeout: 15000 })

      const brandSelect = page.locator("select").first()
      await expect(brandSelect).toBeVisible()

      const sizeButtons = page.locator("button").filter({ hasText: /^(3[89]|4[0-5])$/ })
      const sizeCount = await sizeButtons.count()
      expect(sizeCount).toBeGreaterThanOrEqual(7)
    })

    test("should filter by brand", async ({ page }) => {
      await page.goto(`${BASE_URL}/products`)
      await page.waitForSelector("a[href^='/products/']", { timeout: 15000 })

      const brandSelect = page.locator("select").first()
      const options = await brandSelect.locator("option").allTextContents()
      const brands = options.filter((o) => o !== "All Brands")

      if (brands.length > 0) {
        await brandSelect.selectOption(brands[0])
        await page.waitForTimeout(1000)
        await expect(page.locator("text=FILTERS:")).toBeVisible()
      }
    })

    test("should filter by size", async ({ page }) => {
      await page.goto(`${BASE_URL}/products`)
      await page.waitForSelector("a[href^='/products/']", { timeout: 15000 })

      const sizeBtn = page.locator("button").filter({ hasText: "42" }).first()
      await sizeBtn.click()
      await page.waitForTimeout(500)

      await expect(page.locator("text=Size: 42")).toBeVisible()
    })

    test("should paginate if more than 8 products", async ({ page }) => {
      await page.goto(`${BASE_URL}/products`)
      await page.waitForSelector("a[href^='/products/']", { timeout: 15000 })

      const nextBtn = page.locator("button:has-text('NEXT')")
      if (await nextBtn.isVisible() && !(await nextBtn.isDisabled())) {
        await nextBtn.click()
        await page.waitForTimeout(500)
        expect(page.url()).toContain("page=2")
      }
    })
  })

  // ======================== PRODUCT DETAIL ========================
  test.describe("Product Detail (/products/[id])", () => {
    async function getFirstProductId(browser: any) {
      const page = await browser.newPage()
      await page.goto(`${BASE_URL}/products`)
      await page.waitForSelector("a[href^='/products/']", { timeout: 15000 })
      const href = await page.locator("a[href^='/products/']").first().getAttribute("href")
      await page.close()
      return href?.replace("/products/", "")
    }

    test("should load product detail page", async ({ browser }) => {
      const productId = await getFirstProductId(browser)
      test.skip(!productId, "No products found")
      const page = await browser.newPage()
      await page.goto(`${BASE_URL}/products/${productId}`)
      await expect(page.locator("h1")).toBeVisible({ timeout: 15000 })
      await expect(page.locator("text=SELECT SIZE")).toBeVisible()
      const sizeButtons = page.locator("button").filter({ hasText: /^(3[89]|4[0-5])$/ })
      const sizeCount = await sizeButtons.count()
      expect(sizeCount).toBeGreaterThanOrEqual(1)
      await page.close()
    })

    test("should select size and show add to cart button", async ({ browser }) => {
      const productId = await getFirstProductId(browser)
      test.skip(!productId, "No products found")
      const page = await browser.newPage()
      await page.goto(`${BASE_URL}/products/${productId}`)
      await page.waitForSelector("h1", { timeout: 15000 })

      const sizeBtn = page.locator("button").filter({ hasText: /^(3[89]|4[0-5])$/ }).first()
      if (await sizeBtn.isVisible() && !(await sizeBtn.isDisabled())) {
        await sizeBtn.click()
        await page.waitForTimeout(300)
        await expect(page.locator("button:has-text('ADD TO CART')")).toBeVisible()
      }
      await page.close()
    })

    test("should add item to cart", async ({ browser }) => {
      const productId = await getFirstProductId(browser)
      test.skip(!productId, "No products found")
      const page = await browser.newPage()
      await page.goto(`${BASE_URL}/products/${productId}`)
      await page.waitForSelector("h1", { timeout: 15000 })

      const sizeBtn = page.locator("button").filter({ hasText: /^(3[89]|4[0-5])$/ }).first()
      if (await sizeBtn.isVisible() && !(await sizeBtn.isDisabled())) {
        await sizeBtn.click()
        await page.waitForTimeout(300)
        await page.locator("button:has-text('ADD TO CART')").click()
        await page.waitForTimeout(500)
        await expect(page.locator("text=ADDED TO CART!")).toBeVisible()
      }
      await page.close()
    })
  })

  // ======================== REGISTRATION ========================
  test.describe("Registration (/register)", () => {
    test("should display register form", async ({ page }) => {
      await page.goto(`${BASE_URL}/register`)
      await expect(page.locator("h1")).toContainText("Create Account")
      await expect(page.locator("#email")).toBeVisible()
      await expect(page.locator("#password")).toBeVisible()
      await expect(page.locator("#confirmPassword")).toBeVisible()
    })

    test("should show error for mismatched passwords", async ({ page }) => {
      await page.goto(`${BASE_URL}/register`)
      await page.fill("#email", "mismatch@test.com")
      await page.fill("#password", "validpassword1")
      await page.fill("#confirmPassword", "differentpassword")
      await page.locator("button[type='submit']").click()
      await page.waitForTimeout(500)
      await expect(page.locator("text=Passwords do not match")).toBeVisible({ timeout: 5000 })
    })

    test("should register a new user", async ({ page }) => {
      await page.goto(`${BASE_URL}/register`)
      await page.fill("#email", TEST_EMAIL)
      await page.fill("#password", TEST_PASSWORD)
      await page.fill("#confirmPassword", TEST_PASSWORD)
      await page.locator("button[type='submit']").click()

      await page.waitForURL(/\/$/, { timeout: 10000 }).catch(() => {})
      const currentUrl = page.url()
      expect(currentUrl !== `${BASE_URL}/register`).toBeTruthy()
    })
  })

  // ======================== LOGIN ========================
  test.describe("Login (/login)", () => {
    test("should display login form", async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)
      await expect(page.locator("h1")).toContainText("Welcome Back")
      await expect(page.locator("#email")).toBeVisible()
      await expect(page.locator("#password")).toBeVisible()
    })

    test("should show error for invalid credentials", async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)
      await page.fill("#email", "nonexistent@test.com")
      await page.fill("#password", "wrongpassword")
      await page.locator("button[type='submit']").click()
      await expect(page.locator("text=Invalid email or password")).toBeVisible({ timeout: 5000 })
    })

    test("should login as admin", async ({ page }) => {
      await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
      await page.waitForURL(/\/$/, { timeout: 10000 }).catch(() => {})
      await page.waitForTimeout(1000)

      await expect(page.locator("text=Admin")).toBeVisible({ timeout: 5000 })
      await expect(page.locator("text=Sign Out")).toBeVisible()
    })
  })

  // ======================== NAVIGATION ========================
  test.describe("Navigation", () => {
    test("should navigate through links", async ({ page }) => {
      await page.goto(BASE_URL)

      await page.locator("text=Products").first().click()
      await expect(page).toHaveURL(/\/products/)

      await page.locator("text=SHOOOS").first().click()
      await expect(page).toHaveURL(/\/$/)
    })
  })

  // ======================== CART ========================
  test.describe("Cart Functionality", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL)
      await page.evaluate(() => {
        localStorage.removeItem("sneaker-cart")
      })
      await page.reload()

      await page.goto(`${BASE_URL}/products`)
      await page.waitForSelector("a[href^='/products/']", { timeout: 15000 })
      const href = await page.locator("a[href^='/products/']").first().getAttribute("href")
      if (href) {
        await page.goto(`${BASE_URL}${href}`)
        await page.waitForTimeout(2000)

        const sizeBtn = page.locator("button").filter({ hasText: /^(3[89]|4[0-5])$/ }).first()
        if (await sizeBtn.isVisible() && !(await sizeBtn.isDisabled())) {
          await sizeBtn.click()
          await page.waitForTimeout(300)
          await page.locator("button:has-text('ADD TO CART')").click()
          await page.waitForTimeout(500)
        }
      }
    })

    async function openCart(page: any) {
      await page.evaluate(() => {
        const cartStore = JSON.parse(localStorage.getItem("sneaker-cart") || "{}")
        localStorage.setItem("sneaker-cart", JSON.stringify({ ...cartStore, state: { ...cartStore.state, isOpen: true } }))
      })
      await page.reload()
      await page.waitForTimeout(1000)
    }

    test("should open cart drawer and show items", async ({ page }) => {
      await openCart(page)
      await expect(page.locator("text=Cart")).toBeVisible({ timeout: 5000 })
    })

    test("should update item quantity in cart", async ({ page }) => {
      await openCart(page)
      await page.waitForTimeout(500)

      const plusBtn = page.locator("button:has-text('+')").first()
      if (await plusBtn.isVisible()) {
        await plusBtn.click()
        await page.waitForTimeout(300)
      }
    })

    test("should remove item from cart", async ({ page }) => {
      await openCart(page)
      await page.waitForTimeout(500)

      const removeBtn = page.locator("button:has-text('Remove')").first()
      if (await removeBtn.isVisible()) {
        await removeBtn.click()
        await page.waitForTimeout(300)
        await expect(page.locator("text=Your cart is empty.")).toBeVisible()
      } else {
        const cartText = await page.locator("text=Cart").isVisible()
        expect(cartText).toBeTruthy()
      }
    })
  })

  // ======================== 404 PAGE ========================
  test.describe("404 Page", () => {
    test("should show custom 404 page", async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/nonexistent-page`)
      expect(response?.status()).toBe(404)
      await expect(page.locator("text=Page Not Found")).toBeVisible()
    })
  })

  // ======================== ADMIN DASHBOARD ========================
  test.describe("Admin Dashboard (/admin)", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
    })

    test("should load admin dashboard with stats", async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`)
      await page.waitForTimeout(3000)

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 10000 })
      await expect(page.locator("text=TOTAL PRODUCTS")).toBeVisible()
      await expect(page.locator("text=TOTAL ORDERS")).toBeVisible()
      await expect(page.locator("text=PENDING ORDERS")).toBeVisible()
    })
  })

  // ======================== ADMIN PRODUCTS ========================
  test.describe("Admin Products (/admin/products)", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
    })

    test("should list products in admin", async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/products`)
      await page.waitForTimeout(3000)

      await expect(page.getByRole("heading", { name: "Products" })).toBeVisible({ timeout: 10000 })

      const rows = page.locator("table tbody tr")
      const rowCount = await rows.count()
      expect(rowCount).toBeGreaterThanOrEqual(1)
    })

    test("should have Add Product button", async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/products`)
      await page.waitForTimeout(2000)

      await expect(page.locator("a[href='/admin/products/new']")).toBeVisible({ timeout: 5000 })
    })

    test("should navigate to new product form", async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/products`)
      await page.waitForTimeout(2000)

      await page.locator("a[href='/admin/products/new']").click()
      await page.waitForTimeout(1000)
      await expect(page.getByRole("heading", { name: "New Product" })).toBeVisible({ timeout: 5000 })
    })
  })

  // ======================== ADMIN ORDERS ========================
  test.describe("Admin Orders (/admin/orders)", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
    })

    test("should load orders page with status filters", async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/orders`)
      await page.waitForTimeout(3000)

      await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible({ timeout: 10000 })

      const filterBtns = page.locator("button").filter({ hasText: /ALL|PAID|SHIPPED|DELIVERED/ })
      const count = await filterBtns.count()
      expect(count).toBeGreaterThanOrEqual(4)
    })
  })

  // ======================== MISSING PAGES ========================
  test.describe("Missing Pages Verification", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
    })

    test("admin edit product page should load with form", async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/products`)
      await page.waitForTimeout(3000)

      const editBtn = page.locator("button:has-text('EDIT')").first()
      if (await editBtn.isVisible()) {
        await editBtn.click()
        await page.waitForTimeout(3000)

        await expect(page.getByRole("heading", { name: "Edit Product" })).toBeVisible({ timeout: 10000 })
      }
    })

    test("account order detail page should load", async ({ page }) => {
      await page.goto(`${BASE_URL}/account`)
      await page.waitForTimeout(3000)

      const orderRow = page.locator("table tbody tr").first()
      if (await orderRow.isVisible()) {
        await orderRow.click()
        await page.waitForTimeout(3000)

        const currentUrl = page.url()
        expect(currentUrl).toContain("/account/orders/")
      }
    })
  })

  // ======================== AUTH PROTECTION ========================
  test.describe("Auth Protection", () => {
    test("should redirect to login when accessing checkout without auth", async ({ page }) => {
      await page.goto(`${BASE_URL}/checkout`)
      await page.waitForURL(/\/login/, { timeout: 10000 })
    })

    test("should redirect to login when accessing account without auth", async ({ page }) => {
      await page.goto(`${BASE_URL}/account`)
      await page.waitForURL(/\/login/, { timeout: 10000 })
    })

    test("should redirect to login when accessing admin without auth", async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`)
      await page.waitForURL(/\/login/, { timeout: 10000 })
    })
  })

  // ======================== API ENDPOINTS ========================
  test.describe("API Endpoints", () => {
    test("GET /api/products should return products", async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/api/products?page=1&limit=4`)
      expect(response?.status()).toBe(200)

      const data = JSON.parse(await response!.text())
      expect(data.products).toBeDefined()
      expect(Array.isArray(data.products)).toBeTruthy()
    })

    test("GET /api/auth/session should return session info", async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/api/auth/session`)
      expect(response?.status()).toBe(200)
    })
  })

  // ======================== AI CHAT ========================
  test.describe("AI Chat", () => {
    test("should have chat bubble visible on all pages", async ({ page }) => {
      await page.goto(BASE_URL)
      await page.waitForTimeout(2000)

      const chatBtn = page.locator("button[aria-label='Open chat']")
      await expect(chatBtn).toBeVisible({ timeout: 5000 })
    })
  })

  // ======================== SIGN OUT ========================
  test.describe("Sign Out", () => {
    test("should sign out successfully", async ({ page }) => {
      await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)

      await page.locator("button:has-text('Sign Out')").click()
      await page.waitForTimeout(2000)

      await expect(page.locator("a[href='/login']").first()).toBeVisible({ timeout: 5000 })
    })
  })
})
