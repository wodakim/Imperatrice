from playwright.sync_api import sync_playwright, expect
import time

def verify_spa():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate to Home
        print("Navigating to home...")
        page.goto("http://localhost:3000/en")

        # Take initial screenshot of Dashboard
        print("Taking Dashboard screenshot...")
        time.sleep(2)
        expect(page.get_by_text("My Spoons")).to_be_visible()
        page.screenshot(path="verification/1_dashboard.png")

        # 5. Check Panic Button (SOS)
        print("Checking Panic Button...")
        # Dispatch custom event 'triggerPanic'
        page.evaluate("window.dispatchEvent(new Event('triggerPanic'))")

        time.sleep(1)
        # Check title. In update, I used "panic_title" key in Dashboard scope
        # Let's check keys in en.json
        # Dashboard.panic_title = "Panic Button" (in original write, did I change it?)
        # Let's inspect content if fails
        try:
            expect(page.get_by_text("Panic Button")).to_be_visible()
        except:
            print("Panic Button text not found. Trying 'You are safe.'")
            try:
                expect(page.get_by_text("You are safe.")).to_be_visible()
            except:
                print("Failed to find Panic text. Screenshotting debug...")
                page.screenshot(path="verification/debug_panic.png")
                # print html
                # print(page.content())
                raise

        page.screenshot(path="verification/4_panic_overlay.png")

        browser.close()
        print("Verification complete.")

if __name__ == "__main__":
    verify_spa()
