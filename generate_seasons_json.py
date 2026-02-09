import os
import json

# ---------- CONFIGURACIÓN ----------
ASSETS_EPISODES_DIR = "assets/episodes"
OUTPUT_JSON_PATH = "src/components/Episodes/seasons.json"

DEFAULT_TITLE = "Episodio sin título"
DEFAULT_DESCRIPTION = "Descripción no disponible"
DEFAULT_ID_START = 1
SEASON_NAME = "season1"
# -----------------------------------

def main():
    episodes = []
    current_id = DEFAULT_ID_START

    if not os.path.exists(ASSETS_EPISODES_DIR):
        print(f"❌ No existe la carpeta: {ASSETS_EPISODES_DIR}")
        return

    image_files = sorted([
        f for f in os.listdir(ASSETS_EPISODES_DIR)
        if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))
    ])

    for image in image_files:
        episode = {
            "id": current_id,
            "title": f"{DEFAULT_TITLE} {current_id}",
            "description": DEFAULT_DESCRIPTION,
            "image": image
        }

        episodes.append(episode)
        current_id += 1

    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)

    data = {
        SEASON_NAME: episodes
    }

    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("✅ seasons.json generado correctamente")
    print(f"📦 Episodios encontrados: {len(episodes)}")
    print(f"📄 Archivo creado en: {OUTPUT_JSON_PATH}")


if __name__ == "__main__":
    main()
