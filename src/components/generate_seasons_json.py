import os
import json
import re

# ---------- CONFIGURACIÓN ----------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

ASSETS_EPISODES_DIR = os.path.join(SCRIPT_DIR, "../../assets/episodes")
OUTPUT_JSON_PATH = os.path.join(SCRIPT_DIR, "../components/Episodes/seasons.json")

DEFAULT_TITLE = "Episodio sin título"
DEFAULT_DESCRIPTION = "Descripción no disponible"
DEFAULT_ID_START = 1
# -----------------------------------

def main():
    if not os.path.exists(ASSETS_EPISODES_DIR):
        print(f"❌ No existe la carpeta: {ASSETS_EPISODES_DIR}")
        return

    # Patrón para episodios: XXxYY.ext (01x01.webp)
    # Acepta 1 o 2 dígitos para temporada y capítulo
    episode_pattern = re.compile(r"^(\d{1,2})x(\d{1,2})\.(png|jpg|jpeg|webp)$", re.IGNORECASE)
    # Patrón para iconos de temporada: Season_X_Icon.webp
    icon_pattern = re.compile(r"^Season_(\d+)_Icon\.(png|jpg|jpeg|webp)$", re.IGNORECASE)

    files = os.listdir(ASSETS_EPISODES_DIR)

    seasons_dict = {}
    season_icons = {}
    current_id = DEFAULT_ID_START

    # Primero detectamos los iconos de cada temporada
    for f in files:
        match_icon = icon_pattern.match(f)
        if match_icon:
            season_num = int(match_icon.group(1))
            season_icons[f"season{season_num}"] = f

    # Ahora detectamos los episodios válidos
    episode_files = [
        f for f in files if episode_pattern.match(f)
    ]

    # Ordenamos numéricamente por temporada y capítulo
    episode_files.sort(
        key=lambda f: (
            int(episode_pattern.match(f).group(1)),  # temporada
            int(episode_pattern.match(f).group(2))   # capítulo
        )
    )

    for f in episode_files:
        match = episode_pattern.match(f)
        season_num = int(match.group(1))
        episode_num = int(match.group(2))
        season_key = f"season{season_num}"

        episode = {
            "id": current_id,
            "title": f"{DEFAULT_TITLE} {episode_num}",
            "description": DEFAULT_DESCRIPTION,
            "image": f
        }

        if season_key not in seasons_dict:
            seasons_dict[season_key] = {
                "icon": season_icons.get(season_key, None),
                "episodes": []
            }

        seasons_dict[season_key]["episodes"].append(episode)
        current_id += 1

    # Convertir a formato plano que tu app espera: season1: [episodios]
    output_json = {}
    for season_key, value in seasons_dict.items():
        output_json[season_key] = value["episodes"]
        # opcional: si quieres mantener icono:
        # output_json[season_key + "_icon"] = value["icon"]

    # Crear carpeta si no existe
    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)

    # Guardar JSON
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(output_json, f, indent=2, ensure_ascii=False)

    print("✅ seasons.json generado correctamente")
    for season, eps in output_json.items():
        print(f"📦 {season}: {len(eps)} episodios")
    print(f"📄 Archivo creado en: {OUTPUT_JSON_PATH}")

if __name__ == "__main__":
    main()
