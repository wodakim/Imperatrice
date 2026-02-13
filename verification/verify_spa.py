from playwright.sync_api import sync_playwright, expect
import time

def verify_spa():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate to Home
        print("Navigating to home...")
        page.goto("http://localhost:3000")
        time.sleep(2) # Wait for fade in

        # Take initial screenshot of Dashboard
        print("Taking Dashboard screenshot...")
        page.screenshot(path="verification/1_dashboard.png")

        # 2. Check Spoons Widget presence
        expect(page.get_by_text("My Spoons")).to_be_visible()

        # 3. Navigate to Studio
        print("Navigating to Studio...")
        page.get_by_text("Studio").click()
        time.sleep(1)
        expect(page.get_by_text("Clothes & Fashion")).to_be_visible()
        page.screenshot(path="verification/2_studio_selection.png")

        # 4. Navigate to SEO
        print("Navigating to SEO...")
        page.get_by_text("SEO").click()
        time.sleep(1)
        expect(page.get_by_text("Listing Generator")).to_be_visible()
        page.screenshot(path="verification/3_seo.png")

        # 5. Check Panic Button (SOS)
        print("Checking Panic Button...")
        # Assuming SOS button has aria-label or specific class
        # It's in the header, might be an icon.
        # Let's find by role button and index or label if possible.
        # In Header.tsx we added aria-label="SOS Hypersensibilité" but translation key might differ?
        # Actually in Header.tsx: aria-label="SOS Hypersensibilité" is hardcoded?
        # Wait, I used {t('subtitle')} but hardcoded aria-label in the write_file step for Header.tsx?
        # Let's check Header.tsx content I wrote.

        # Actually I wrote Header.tsx with: aria-label="SOS Hypersensibilité"

        page.get_by_label("SOS Hypersensibilité").click()
        time.sleep(1)
        page.screenshot(path="verification/4_panic_overlay.png")

        browser.close()
        print("Verification complete.")

if __name__ == "__main__":
    verify_spa()
