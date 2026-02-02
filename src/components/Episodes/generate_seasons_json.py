import os
import json
import re

# 📁 Carpeta donde están las imágenes
IMAGES_FOLDER = "./images"
OUTPUT_JSON = "seasons.json"

# Regex para detectar capítulos tipo 1x01.webp
EPISODE_REGEX = re.compile(r"(\d+)x(\d+)\.webp$", re.IGNORECASE)

seasons = {}

for file in os.listdir(IMAGES_FOLDER):
    match = EPISODE_REGEX.match(file)
    if match:
        season_num = int(match.group(1))
        episode_num = int(match.group(2))

        if season_num not in seasons:
            seasons[season_num] = {
                "season": season_num,
                "icon": f"Season_{season_num}_Icon.webp",
                "episodes": []
            }

        seasons[season_num]["episodes"].append({
            "episode": episode_num,
            "image": file
        })

# Ordenar episodios y temporadas
output = {
    "seasons": sorted(
        [
            {
                **season,
                "episodes": sorted(
                    season["episodes"], key=lambda e: e["episode"]
                )
            }
            for season in seasons.values()
        ],
        key=lambda s: s["season"]
    )
}

# Guardar JSON
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print("✅ seasons.json generado correctamente")
