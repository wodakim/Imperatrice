import re
import json
import os

def main():
    try:
        # 1. Extract base translations from prototype/index.html
        with open('prototype/index.html', 'r', encoding='utf-8') as f:
            content = f.read()

        start_marker = "const i18nData = {"
        start_idx = content.find(start_marker)

        json_str = "{}"
        if start_idx != -1:
            open_braces = 1
            end_idx = start_idx + len(start_marker)
            for i, char in enumerate(content[end_idx:], start=end_idx):
                if char == '{':
                    open_braces += 1
                elif char == '}':
                    open_braces -= 1
                    if open_braces == 0:
                        end_idx = i + 1
                        break
            json_str = content[start_idx + len("const i18nData = "):end_idx]

        # Use Node to evaluate the prototype JS object
        temp_js = f"""
const i18nData = {json_str};
console.log(JSON.stringify(i18nData, null, 2));
"""
        with open('temp_extract.js', 'w', encoding='utf-8') as f:
            f.write(temp_js)

        if not os.path.exists('messages'):
            os.makedirs('messages')

        ret = os.system('node temp_extract.js > i18n_dump.json')
        if ret != 0:
            print("Node execution failed")
            return

        with open('i18n_dump.json', 'r', encoding='utf-8') as f:
            base_data = json.load(f)

        # 2. Load the new Infographic translations (FR reference)
        infographic_data = {}
        if os.path.exists('messages/infographic_fr.json'):
            with open('messages/infographic_fr.json', 'r', encoding='utf-8') as f:
                infographic_data = json.load(f)

        # 3. Merge and Save for each language
        for lang in ['fr', 'en', 'es', 'de', 'it', 'pl']:
            # Start with existing file if possible to preserve manual edits,
            # otherwise start with base_data or empty.
            # Ideally we rely on base_data + new features.

            # Use base_data for this lang if available, else empty (or fallback to en/fr)
            current_messages = base_data.get(lang, {})

            # --- Namespace Construction ---
            nested = {}

            # Auth
            nested['Auth'] = current_messages.get('Auth', {
                "login_title": "Connexion / Inscription",
                "email_label": "Email",
                "password_label": "Mot de passe",
                "signin_button": "Se connecter",
                "signup_button": "S'inscrire"
            })
            if lang == 'en' and 'Auth' not in current_messages:
                 nested['Auth'] = {
                    "login_title": "Login / Sign Up",
                    "email_label": "Email",
                    "password_label": "Password",
                    "signin_button": "Sign In",
                    "signup_button": "Sign Up"
                }

            # Navigation
            nested['Navigation'] = {
                "home": current_messages.get('nav_home', 'Home'),
                "studio": current_messages.get('nav_studio', 'Studio'),
                "seo": current_messages.get('nav_seo', 'SEO'),
                "tools": current_messages.get('nav_tools', 'Tools'),
                "relax": current_messages.get('nav_relax', 'Relax'),
                "crush": current_messages.get('nav_crush', 'Crush'),
                "trophies": current_messages.get('nav_trophies', 'Trophies')
            }

            # Dashboard
            nested['Dashboard'] = {
                "spoons_title": current_messages.get('spoons_title', ''),
                "spoons_high": current_messages.get('spoons_high', ''),
                "spoons_mid": current_messages.get('spoons_mid', ''),
                "spoons_low": current_messages.get('spoons_low', ''),
                "chrono_title": current_messages.get('chrono_title', ''),
                "chrono_calm": current_messages.get('chrono_calm', ''),
                "chrono_prime": current_messages.get('chrono_prime', ''),
                "chrono_good": current_messages.get('chrono_good', ''),
                "tip_title": current_messages.get('tip_title', ''),
                "tip_jan": current_messages.get('tip_jan', ''),
                "tip_spring": current_messages.get('tip_spring', ''),
                "tip_summer": current_messages.get('tip_summer', ''),
                "tip_autumn": current_messages.get('tip_autumn', ''),
                "tip_winter": current_messages.get('tip_winter', ''),
                "tips": current_messages.get('tips', []),
                "relax_title": current_messages.get('relax_title', ''),
                "relax_subtitle": current_messages.get('relax_subtitle', ''),
                "breath_title": current_messages.get('breath_title', ''),
                "breath_instruction": current_messages.get('breath_instruction', ''),
                "joke_title": current_messages.get('joke_title', ''),
                "btn_next_joke": current_messages.get('btn_next_joke', ''),
                "jokes": current_messages.get('jokes', []),
                "panic_title": current_messages.get('panic_title', ''),
                "panic_text": current_messages.get('panic_text', ''),
                "anchor_title": current_messages.get('anchor_title', ''),
                "anchor_5": current_messages.get('anchor_5', ''),
                "anchor_4": current_messages.get('anchor_4', ''),
                "anchor_3": current_messages.get('anchor_3', ''),
                "anchor_2": current_messages.get('anchor_2', ''),
                "anchor_1": current_messages.get('anchor_1', ''),
                "btn_better": current_messages.get('btn_better', ''),
                "infographic_title": current_messages.get('infographic_title', 'Infographie 2026' if lang == 'fr' else 'Infographic 2026'),
                "infographic_btn": current_messages.get('infographic_btn', '📚 Guide Vinted 2026' if lang == 'fr' else '📚 Vinted Guide 2026')
            }

            # Studio
            nested['Studio'] = {
                "studio_title": current_messages.get('studio_title', ''),
                "studio_subtitle": current_messages.get('studio_subtitle', ''),
                "studio_new": current_messages.get('studio_new', ''),
                "studio_success": current_messages.get('studio_success', ''),
                "studio_next": current_messages.get('studio_next', ''),
                "studio_validate": current_messages.get('studio_validate', ''),
                "studio_done": current_messages.get('studio_done', ''),
                "studio_final_title": current_messages.get('studio_final_title', ''),
                "studio_final_subtitle": current_messages.get('studio_final_subtitle', ''),
                "studio_final_tip1": current_messages.get('studio_final_tip1', ''),
                "studio_final_tip2": current_messages.get('studio_final_tip2', ''),
                "studio_final_tip3": current_messages.get('studio_final_tip3', ''),
                "cat_clothes": current_messages.get('cat_clothes', ''),
                "cat_shoes": current_messages.get('cat_shoes', ''),
                "cat_bags": current_messages.get('cat_bags', ''),
                "step_cover_t": current_messages.get('step_cover_t', ''),
                "step_cover_d": current_messages.get('step_cover_d', ''),
                "step_cover_s": current_messages.get('step_cover_s', ''),
                "step_back_t": current_messages.get('step_back_t', ''),
                "step_back_d": current_messages.get('step_back_d', ''),
                "step_back_s": current_messages.get('step_back_s', ''),
                "step_brand_t": current_messages.get('step_brand_t', ''),
                "step_brand_d": current_messages.get('step_brand_d', ''),
                "step_brand_s": current_messages.get('step_brand_s', ''),
                "step_comp_t": current_messages.get('step_comp_t', ''),
                "step_comp_d": current_messages.get('step_comp_d', ''),
                "step_comp_s": current_messages.get('step_comp_s', ''),
                "step_details_t": current_messages.get('step_details_t', ''),
                "step_details_d": current_messages.get('step_details_d', ''),
                "step_details_s": current_messages.get('step_details_s', ''),
                "step_defects_t": current_messages.get('step_defects_t', ''),
                "step_defects_d": current_messages.get('step_defects_d', ''),
                "step_defects_s": current_messages.get('step_defects_s', '')
            }

            # Seo
            nested['Seo'] = {
                "seo_title": current_messages.get('seo_title', ''),
                "seo_subtitle": current_messages.get('seo_subtitle', ''),
                "title_perfect": current_messages.get('title_perfect', ''),
                "ph_brand": current_messages.get('ph_brand', ''),
                "ph_type": current_messages.get('ph_type', ''),
                "ph_color": current_messages.get('ph_color', ''),
                "ph_material": current_messages.get('ph_material', ''),
                "ph_condition": current_messages.get('ph_condition', ''),
                "ph_vibe": current_messages.get('ph_vibe', ''),
                "ph_details": current_messages.get('ph_details', ''),
                "ph_manual_tag": current_messages.get('ph_manual_tag', ''),
                "ex_brand": current_messages.get('ex_brand', ''),
                "ex_type": current_messages.get('ex_type', ''),
                "ex_color": current_messages.get('ex_color', ''),
                "ex_material": current_messages.get('ex_material', ''),
                "ex_condition": current_messages.get('ex_condition', ''),
                "ex_vibe": current_messages.get('ex_vibe', ''),
                "cond_new": current_messages.get('cond_new', ''),
                "cond_vgood": current_messages.get('cond_vgood', ''),
                "cond_good": current_messages.get('cond_good', ''),
                "cond_fair": current_messages.get('cond_fair', ''),
                "label_preview": current_messages.get('label_preview', ''),
                "btn_copy": current_messages.get('btn_copy', ''),
                "btn_remix": current_messages.get('btn_remix', ''),
                "btn_add": current_messages.get('btn_add', ''),
                "desc_magic": current_messages.get('desc_magic', ''),
                "tags_title": current_messages.get('tags_title', ''),
                "pack_select": current_messages.get('pack_select', ''),
                "style_casual": current_messages.get('style_casual', ''),
                "style_pro": current_messages.get('style_pro', ''),
                "style_emoji": current_messages.get('style_emoji', ''),
                "style_story": current_messages.get('style_story', ''),
                "style_minimal": current_messages.get('style_minimal', ''),
                "seo_hint_short": current_messages.get('seo_hint_short', ''),
                "seo_hint_brand": current_messages.get('seo_hint_brand', ''),
                "seo_hint_type": current_messages.get('seo_hint_type', ''),
                "seo_hint_adj": current_messages.get('seo_hint_adj', ''),
                "seo_hint_perfect": current_messages.get('seo_hint_perfect', ''),
                "seo_data": current_messages.get('seo_data', {})
            }

            # Tools
            nested['Tools'] = {
                "seasonal_title": current_messages.get('seasonal_title', ''),
                "season_focus_label": current_messages.get('season_focus_label', ''),
                "season_prep_label": current_messages.get('season_prep_label', ''),
                "season_focus": current_messages.get('season_focus', []),
                "season_prep": current_messages.get('season_prep', []),
                "calc_title": current_messages.get('calc_title', ''),
                "calc_buy_ph": current_messages.get('calc_buy_ph', ''),
                "calc_sell_ph": current_messages.get('calc_sell_ph', ''),
                "calc_fees_ph": current_messages.get('calc_fees_ph', ''),
                "calc_result_label": current_messages.get('calc_result_label', ''),
                "scripts_title": current_messages.get('scripts_title', ''),
                "script_select_ph": current_messages.get('script_select_ph', ''),
                "copy_response": current_messages.get('copy_response', ''),
                "packing_title": current_messages.get('packing_title', ''),
                "reset_list": current_messages.get('reset_list', ''),
                "pack_items": current_messages.get('pack_items', []),
                "script_lowball_label": current_messages.get('script_lowball_label', ''),
                "script_lowball": current_messages.get('script_lowball', ''),
                "script_rude_label": current_messages.get('script_rude_label', ''),
                "script_rude": current_messages.get('script_rude', ''),
                "script_ghost_label": current_messages.get('script_ghost_label', ''),
                "script_ghost": current_messages.get('script_ghost', ''),
                "script_reserve_label": current_messages.get('script_reserve_label', ''),
                "script_reserve": current_messages.get('script_reserve', ''),
                "script_late_label": current_messages.get('script_late_label', ''),
                "script_late": current_messages.get('script_late', ''),
                "script_accept_label": current_messages.get('script_accept_label', ''),
                "script_accept": current_messages.get('script_accept', ''),
                "script_counter_label": current_messages.get('script_counter_label', ''),
                "script_counter": current_messages.get('script_counter', ''),
                "script_bundle_label": current_messages.get('script_bundle_label', ''),
                "script_bundle": current_messages.get('script_bundle', ''),
                "script_thanks_label": current_messages.get('script_thanks_label', ''),
                "script_thanks": current_messages.get('script_thanks', ''),
                "script_review_label": current_messages.get('script_review_label', ''),
                "script_review": current_messages.get('script_review', ''),
                "script_measure_label": current_messages.get('script_measure_label', ''),
                "script_measure": current_messages.get('script_measure', '')
            }

            # Crush
            nested['Crush'] = {
                "game_title": current_messages.get('game_title', ''),
                "score": current_messages.get('score', 'Score'),
                "high_score": current_messages.get('high_score', 'Record'),
                "btn_new_game": current_messages.get('btn_new_game', '')
            }

            # Trophies
            nested['Trophies'] = {
                "trophy_title": current_messages.get('trophy_title', ''),
                "trophy_subtitle": current_messages.get('trophy_subtitle', ''),
                "notif_trophy": current_messages.get('notif_trophy', ''),
                "notif_pack": current_messages.get('notif_pack', '')
            }
            for k, v in current_messages.items():
                if k.startswith('tr_n_') or k.startswith('tr_d_'):
                    nested['Trophies'][k] = v

            # --- INFOGRAPHIC (New) ---
            # Inject infographic data. For non-FR languages, we use the FR data as a placeholder
            # or try to keep existing if manually translated.
            # Since we just added this feature, existing data is likely empty for Infographic.

            # Note: In a real scenario, we'd translate these. Here we fallback to FR data
            # but ensure the keys exist so t('Infographic.key') works.

            nested['Infographic'] = infographic_data # Use the FR keys/values as base

            # --- MERGE ---
            final_msgs = {**current_messages, **nested}

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
