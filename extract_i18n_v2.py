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

            nested = {}

            # Navigation
            nested['Navigation'] = {
                "home": messages.get('nav_home', 'Home'),
                "studio": messages.get('nav_studio', 'Studio'),
                "seo": messages.get('nav_seo', 'SEO'),
                "tools": messages.get('nav_tools', 'Tools'),
                "relax": messages.get('nav_relax', 'Relax'),
                "crush": messages.get('nav_crush', 'Crush'),
                "trophies": messages.get('nav_trophies', 'Trophies')
            }

            # Dashboard (Home, Panic, Spoons, Chrono, Relax, Tips)
            nested['Dashboard'] = {
                "spoons_title": messages.get('spoons_title', ''),
                "spoons_high": messages.get('spoons_high', ''),
                "spoons_mid": messages.get('spoons_mid', ''),
                "spoons_low": messages.get('spoons_low', ''),
                "chrono_title": messages.get('chrono_title', ''),
                "chrono_calm": messages.get('chrono_calm', ''),
                "chrono_prime": messages.get('chrono_prime', ''),
                "chrono_good": messages.get('chrono_good', ''),
                "tip_title": messages.get('tip_title', ''),
                "tip_jan": messages.get('tip_jan', ''),
                "tip_spring": messages.get('tip_spring', ''),
                "tip_summer": messages.get('tip_summer', ''),
                "tip_autumn": messages.get('tip_autumn', ''),
                "tip_winter": messages.get('tip_winter', ''),
                "tips": messages.get('tips', []),
                "relax_title": messages.get('relax_title', ''),
                "relax_subtitle": messages.get('relax_subtitle', ''),
                "breath_title": messages.get('breath_title', ''),
                "breath_instruction": messages.get('breath_instruction', ''),
                "joke_title": messages.get('joke_title', ''),
                "btn_next_joke": messages.get('btn_next_joke', ''),
                "jokes": messages.get('jokes', []),
                "panic_title": messages.get('panic_title', ''),
                "panic_text": messages.get('panic_text', ''),
                "anchor_title": messages.get('anchor_title', ''),
                "anchor_5": messages.get('anchor_5', ''),
                "anchor_4": messages.get('anchor_4', ''),
                "anchor_3": messages.get('anchor_3', ''),
                "anchor_2": messages.get('anchor_2', ''),
                "anchor_1": messages.get('anchor_1', ''),
                "btn_better": messages.get('btn_better', '')
            }

            # Studio
            nested['Studio'] = {
                "studio_title": messages.get('studio_title', ''),
                "studio_subtitle": messages.get('studio_subtitle', ''),
                "studio_new": messages.get('studio_new', ''),
                "studio_success": messages.get('studio_success', ''),
                "studio_next": messages.get('studio_next', ''),
                "studio_validate": messages.get('studio_validate', ''),
                "studio_done": messages.get('studio_done', ''),
                "studio_final_title": messages.get('studio_final_title', ''),
                "studio_final_subtitle": messages.get('studio_final_subtitle', ''),
                "studio_final_tip1": messages.get('studio_final_tip1', ''),
                "studio_final_tip2": messages.get('studio_final_tip2', ''),
                "studio_final_tip3": messages.get('studio_final_tip3', ''),
                "cat_clothes": messages.get('cat_clothes', ''),
                "cat_shoes": messages.get('cat_shoes', ''),
                "cat_bags": messages.get('cat_bags', ''),
                "step_cover_t": messages.get('step_cover_t', ''),
                "step_cover_d": messages.get('step_cover_d', ''),
                "step_cover_s": messages.get('step_cover_s', ''),
                "step_back_t": messages.get('step_back_t', ''),
                "step_back_d": messages.get('step_back_d', ''),
                "step_back_s": messages.get('step_back_s', ''),
                "step_brand_t": messages.get('step_brand_t', ''),
                "step_brand_d": messages.get('step_brand_d', ''),
                "step_brand_s": messages.get('step_brand_s', ''),
                "step_comp_t": messages.get('step_comp_t', ''),
                "step_comp_d": messages.get('step_comp_d', ''),
                "step_comp_s": messages.get('step_comp_s', ''),
                "step_details_t": messages.get('step_details_t', ''),
                "step_details_d": messages.get('step_details_d', ''),
                "step_details_s": messages.get('step_details_s', ''),
                "step_defects_t": messages.get('step_defects_t', ''),
                "step_defects_d": messages.get('step_defects_d', ''),
                "step_defects_s": messages.get('step_defects_s', '')
            }

            # Seo
            nested['Seo'] = {
                "seo_title": messages.get('seo_title', ''),
                "seo_subtitle": messages.get('seo_subtitle', ''),
                "title_perfect": messages.get('title_perfect', ''),
                "ph_brand": messages.get('ph_brand', ''),
                "ph_type": messages.get('ph_type', ''),
                "ph_color": messages.get('ph_color', ''),
                "ph_material": messages.get('ph_material', ''),
                "ph_condition": messages.get('ph_condition', ''),
                "ph_vibe": messages.get('ph_vibe', ''),
                "ph_details": messages.get('ph_details', ''),
                "ph_manual_tag": messages.get('ph_manual_tag', ''),
                "ex_brand": messages.get('ex_brand', ''),
                "ex_type": messages.get('ex_type', ''),
                "ex_color": messages.get('ex_color', ''),
                "ex_material": messages.get('ex_material', ''),
                "ex_condition": messages.get('ex_condition', ''),
                "ex_vibe": messages.get('ex_vibe', ''),
                "cond_new": messages.get('cond_new', ''),
                "cond_vgood": messages.get('cond_vgood', ''),
                "cond_good": messages.get('cond_good', ''),
                "cond_fair": messages.get('cond_fair', ''),
                "label_preview": messages.get('label_preview', ''),
                "btn_copy": messages.get('btn_copy', ''),
                "btn_remix": messages.get('btn_remix', ''),
                "btn_add": messages.get('btn_add', ''),
                "desc_magic": messages.get('desc_magic', ''),
                "tags_title": messages.get('tags_title', ''),
                "pack_select": messages.get('pack_select', ''),
                "style_casual": messages.get('style_casual', ''),
                "style_pro": messages.get('style_pro', ''),
                "style_emoji": messages.get('style_emoji', ''),
                "style_story": messages.get('style_story', ''),
                "style_minimal": messages.get('style_minimal', ''),
                "seo_hint_short": messages.get('seo_hint_short', ''),
                "seo_hint_brand": messages.get('seo_hint_brand', ''),
                "seo_hint_type": messages.get('seo_hint_type', ''),
                "seo_hint_adj": messages.get('seo_hint_adj', ''),
                "seo_hint_perfect": messages.get('seo_hint_perfect', ''),
                "seo_data": messages.get('seo_data', {})
            }

            # Tools
            nested['Tools'] = {
                "seasonal_title": messages.get('seasonal_title', ''),
                "season_focus_label": messages.get('season_focus_label', ''),
                "season_prep_label": messages.get('season_prep_label', ''),
                "season_focus": messages.get('season_focus', []),
                "season_prep": messages.get('season_prep', []),
                "calc_title": messages.get('calc_title', ''),
                "calc_buy_ph": messages.get('calc_buy_ph', ''),
                "calc_sell_ph": messages.get('calc_sell_ph', ''),
                "calc_fees_ph": messages.get('calc_fees_ph', ''),
                "calc_result_label": messages.get('calc_result_label', ''),
                "scripts_title": messages.get('scripts_title', ''),
                "script_select_ph": messages.get('script_select_ph', ''),
                "copy_response": messages.get('copy_response', ''),
                "packing_title": messages.get('packing_title', ''),
                "reset_list": messages.get('reset_list', ''),
                "pack_items": messages.get('pack_items', []),
                # Scripts (Loop or manual)
                "script_lowball_label": messages.get('script_lowball_label', ''),
                "script_lowball": messages.get('script_lowball', ''),
                "script_rude_label": messages.get('script_rude_label', ''),
                "script_rude": messages.get('script_rude', ''),
                "script_ghost_label": messages.get('script_ghost_label', ''),
                "script_ghost": messages.get('script_ghost', ''),
                "script_reserve_label": messages.get('script_reserve_label', ''),
                "script_reserve": messages.get('script_reserve', ''),
                "script_late_label": messages.get('script_late_label', ''),
                "script_late": messages.get('script_late', ''),
                "script_accept_label": messages.get('script_accept_label', ''),
                "script_accept": messages.get('script_accept', ''),
                "script_counter_label": messages.get('script_counter_label', ''),
                "script_counter": messages.get('script_counter', ''),
                "script_bundle_label": messages.get('script_bundle_label', ''),
                "script_bundle": messages.get('script_bundle', ''),
                "script_thanks_label": messages.get('script_thanks_label', ''),
                "script_thanks": messages.get('script_thanks', ''),
                "script_review_label": messages.get('script_review_label', ''),
                "script_review": messages.get('script_review', ''),
                "script_measure_label": messages.get('script_measure_label', ''),
                "script_measure": messages.get('script_measure', '')
            }

            # Crush
            nested['Crush'] = {
                "game_title": messages.get('game_title', ''),
                "score": messages.get('score', 'Score'),
                "high_score": messages.get('high_score', 'Record'),
                "btn_new_game": messages.get('btn_new_game', '')
            }

            # Trophies
            nested['Trophies'] = {
                "trophy_title": messages.get('trophy_title', ''),
                "trophy_subtitle": messages.get('trophy_subtitle', ''),
                "notif_trophy": messages.get('notif_trophy', ''),
                "notif_pack": messages.get('notif_pack', '')
                # Add all trophies dynamically in component or manual here if we use t('tr_n_...')
                # Since trophies are dynamic IDs, we can just use the flat list fallback or add them.
                # Adding common pattern:
            }
            # Add all tr_n_ and tr_d_ to Trophies namespace
            for k, v in messages.items():
                if k.startswith('tr_n_') or k.startswith('tr_d_'):
                    nested['Trophies'][k] = v

            nested['Auth'] = messages['Auth']

            # Merge flat + nested
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
