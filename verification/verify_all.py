from playwright.sync_api import sync_playwright, expect
import os
import time

def main():
    if not os.path.exists('verification'):
        os.makedirs('verification')

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a large viewport to see details
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        try:
            # 1. Dashboard
            print("Navigating to Dashboard...")
            page.goto("http://localhost:3001/fr/dashboard")
            page.wait_for_load_state("networkidle")

            # Check Chrono
            print("Checking ChronoWidget...")
            expect(page.get_by_text("Chronobiologie")).to_be_visible()
            # Check seasonal tip presence (e.g. "Résolutions" for Jan, or whatever month it is)
            # Since month is dynamic, just check if ANY tip is visible at bottom of chrono widget
            # We look for the lightbulb icon or container
            # chrono widget has `text-xs text-[var(--color-text-muted)] bg-[var(--color-bg)] p-3 rounded-xl`
            # We can just screenshot the dashboard
            page.screenshot(path="verification/dashboard.png")
            print("Dashboard screenshot saved.")

            # 2. SEO
            print("Navigating to SEO...")
            page.goto("http://localhost:3001/fr/seo")
            page.wait_for_load_state("networkidle")

            # Check for Encadré style inputs
            # Use .first to avoid strict mode violation if text appears in preview
            expect(page.get_by_text("Marque").first).to_be_visible()
            expect(page.get_by_text("Type").first).to_be_visible()
            expect(page.get_by_text("Couleur").first).to_be_visible()
            expect(page.get_by_text("Matière").first).to_be_visible()
            # Check "Style" dropdown
            expect(page.get_by_text("Style").first).to_be_visible()

            page.screenshot(path="verification/seo.png")
            print("SEO screenshot saved.")

            # 3. Tools
            print("Navigating to Tools...")
            page.goto("http://localhost:3001/fr/tools")
            page.wait_for_load_state("networkidle")

            # Check Profit Calc inputs
            expect(page.get_by_text("Prix d'Achat (€)")).to_be_visible()

            # Check Magic Scripts dropdown
            # We verify the select exists and has options
            # Label might be "Choisir une situation..." (placeholder) or similar
            expect(page.get_by_text("Réponses Magiques")).to_be_visible()

            page.screenshot(path="verification/tools.png")
            print("Tools screenshot saved.")

            # 4. Crush Game
            print("Navigating to Crush...")
            page.goto("http://localhost:3001/fr/crush")
            page.wait_for_load_state("networkidle")

            # Check grid exists (grid-cols-8)
            # We can check for "Score" and "Record"
            expect(page.get_by_text("Score")).to_be_visible()
            expect(page.get_by_text("Record")).to_be_visible()

            page.screenshot(path="verification/crush.png")
            print("Crush screenshot saved.")

            # 5. Panic Room (Trigger via Header SOS button)
            # Button has aria-label="SOS"
            print("Triggering Panic Room...")
            # Button is animated, so force click
            page.get_by_label("SOS").click(force=True)
            # Wait for overlay
            page.wait_for_timeout(1000) # Wait for animation

            # Check 5-4-3-2-1
            # We check for text "5 choses que tu vois" (part of anchor_5)
            # Note: anchor_5 contains HTML "<b>5</b> choses...", expect might be tricky with HTML.
            # We just check visibility of the modal content
            expect(page.get_by_text("Tu es en sécurité.")).to_be_visible()

            page.screenshot(path="verification/panic.png")
            print("Panic Room screenshot saved.")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    main()
