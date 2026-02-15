from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    try:
        response = page.goto("http://localhost:3000/fr/dashboard")
        if response.status != 200:
            print(f"Error: Page returned status {response.status}")
            return

        page.wait_for_timeout(2000)

        # Take a screenshot
        page.screenshot(path="verification_css_override.png", full_page=True)
        print("Screenshot saved to verification_css_override.png")

        # Verify computed style for an element with text-white if we can find one
        # Assuming there is something with text-white on the dashboard
        # Based on the image, the header icons might be using it.
        # Let's try to evaluate the style of a known text-white element or just check if the rule exists.

        # We can also check if the rule is applied by checking for an element that *should* be white but is now red.
        # Or just verify the stylesheet text via JS.

        has_rule = page.evaluate("""() => {
            for (let sheet of document.styleSheets) {
                try {
                    for (let rule of sheet.cssRules) {
                        if (rule.selectorText === '.text-white' && rule.style.color === 'rgb(244, 67, 54)') {
                            return true;
                        }
                    }
                } catch(e) {}
            }
            return false;
        }""")

        if has_rule:
            print("SUCCESS: Found .text-white rule with color rgb(244, 67, 54) (#F44336)")
        else:
            print("WARNING: Could not strictly verify the CSS rule via JS loop (might be in a different sheet or cross-origin)")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
