import re
import json
import os

def main():
    try:
        with open('prototype/index.html', 'r', encoding='utf-8') as f:
            content = f.read()

        start_marker = "const i18nData = {"

        start_idx = content.find(start_marker)
        if start_idx == -1:
            print("Could not find i18nData")
            return

        # Find the end of the object (simple brace counting)
        open_braces = 1 # We start after '{'
        end_idx = start_idx + len(start_marker)

        for i, char in enumerate(content[end_idx:], start=end_idx):
            if char == '{':
                open_braces += 1
            elif char == '}':
                open_braces -= 1
                if open_braces == 0:
                    end_idx = i + 1
                    break

        # Extracted content: { fr: { ... }, en: { ... } }
        json_str = content[start_idx + len("const i18nData = "):end_idx]

        # Create temp JS file to eval
        temp_js = f"""
const i18nData = {json_str};
console.log(JSON.stringify(i18nData, null, 2));
"""
        with open('temp_extract.js', 'w', encoding='utf-8') as f:
            f.write(temp_js)

        # Create messages dir
        if not os.path.exists('messages'):
            os.makedirs('messages')

        # Run node
        ret = os.system('node temp_extract.js > i18n_dump.json')
        if ret != 0:
            print("Node execution failed")
            return

        # Read and split
        with open('i18n_dump.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        for lang, messages in data.items():
            # Add missing Auth/Nav keys if not present
            if 'Auth' not in messages:
                messages['Auth'] = {
                    "login_title": "Connexion / Inscription",
                    "email_label": "Email",
                    "password_label": "Mot de passe",
                    "signin_button": "Se connecter",
                    "signup_button": "S'inscrire"
                }
                if lang == 'en':
                     messages['Auth'] = {
                        "login_title": "Login / Sign Up",
                        "email_label": "Email",
                        "password_label": "Password",
                        "signin_button": "Sign In",
                        "signup_button": "Sign Up"
                    }
                # Fallback for others to EN or FR, but let's keep it simple for prototype

            if 'Navigation' not in messages:
                # Map flat keys to nested Navigation object if prefered, or keep flat
                # My components use t('home'), so flat keys like 'nav_home' might need mapping
                # But my component uses useTranslations('Navigation') and calls t('home').
                # The extracted JSON is flat: "nav_home": "Accueil".
                # next-intl with namespace expects: { Navigation: { home: "Accueil" } }
                # OR I use useTranslations() without namespace and call t('nav_home').
                # Let's check my Navigation.tsx: `useTranslations('Navigation'); ... t('home')`
                # So I need to structure the JSON.

                new_msgs = {}
                nested = {}

                # Manual Mapping for structure
                nested['Navigation'] = {
                    "home": messages.get('nav_home', 'Home'),
                    "studio": messages.get('nav_studio', 'Studio'),
                    "seo": messages.get('nav_seo', 'SEO'),
                    "tools": messages.get('nav_tools', 'Tools'),
                    "relax": messages.get('nav_relax', 'Relax'),
                    "crush": messages.get('nav_crush', 'Crush'),
                    "trophies": messages.get('nav_trophies', 'Trophies')
                }

                nested['Dashboard'] = {
                    "spoons_title": messages.get('spoons_title', 'Spoons'),
                    "spoons_high": messages.get('spoons_high', ''),
                    "spoons_mid": messages.get('spoons_mid', ''),
                    "spoons_low": messages.get('spoons_low', ''),
                    "chrono_title": messages.get('chrono_title', ''),
                    "chrono_calm": messages.get('chrono_calm', ''),
                    "chrono_prime": messages.get('chrono_prime', ''),
                    "chrono_good": messages.get('chrono_good', '')
                }

                nested['Studio'] = {
                    "cat_clothes": messages.get('cat_clothes', ''),
                    "step_cover_t": messages.get('step_cover_t', ''),
                    "step_cover_d": messages.get('step_cover_d', ''),
                    "step_cover_s": messages.get('step_cover_s', ''),
                    # ... add others broadly or just merge all flat keys into root for fallback?
                    # Ideally, I should merge all flat keys AND the structured ones.
                    "studio_title": messages.get('studio_title', ''),
                    "studio_subtitle": messages.get('studio_subtitle', ''),
                    "studio_done": messages.get('studio_done', ''),
                    "studio_validate": messages.get('studio_validate', '')
                }

                nested['Seo'] = {
                    "seo_title": messages.get('seo_title', ''),
                    "seo_subtitle": messages.get('seo_subtitle', ''),
                    "title_perfect": messages.get('title_perfect', ''),
                    "ph_brand": messages.get('ph_brand', ''),
                    # ...
                }

                nested['Tools'] = {
                    "calc_title": messages.get('calc_title', ''),
                    "scripts_title": messages.get('scripts_title', ''),
                    "packing_title": messages.get('packing_title', ''),
                    # ...
                }

                nested['Crush'] = {
                    "game_title": messages.get('game_title', '')
                }

                nested['Trophies'] = {
                    "trophy_title": messages.get('trophy_title', ''),
                    "trophy_subtitle": messages.get('trophy_subtitle', '')
                }

                nested['Auth'] = messages['Auth'] # Keep the one we added

                # Merge original flat keys (for legacy or direct access) + Nested
                final_msgs = {**messages, **nested}

                with open(f'messages/{lang}.json', 'w', encoding='utf-8') as f:
                    json.dump(final_msgs, f, ensure_ascii=False, indent=2)
                    print(f"Wrote messages/{lang}.json")

        # Cleanup
        if os.path.exists('temp_extract.js'): os.remove('temp_extract.js')
        if os.path.exists('i18n_dump.json'): os.remove('i18n_dump.json')

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
