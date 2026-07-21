import json
import os
import re
from pathlib import Path

import edge_tts


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def percent(value: str) -> int:
    match = re.search(r"(\d{1,3})", str(value or ""))
    return int(match.group(1)) if match else 0


def build_voice_text(data: dict) -> str:
    title = clean(data.get("title")) or "ce bon plan Amazon"
    current_price = clean(data.get("currentPrice"))
    original_price = clean(data.get("originalPrice"))
    discount = clean(data.get("discount"))
    reduction = percent(discount)

    if reduction >= 50:
        intro = "Alerte bon plan. Le prix vient de s'effondrer."
    elif reduction >= 30:
        intro = "Alerte bon plan. Grosse baisse de prix."
    elif current_price and original_price:
        intro = "Alerte bon plan. Amazon baisse enfin le prix."
    else:
        intro = "Alerte bon plan. Une promotion à ne pas manquer."

    # Le titre est volontairement raccourci pour éviter une voix trop longue.
    short_title = title[:105].rsplit(" ", 1)[0] if len(title) > 105 else title

    parts = [intro, short_title + "."]

    if current_price:
        parts.append(f"Prix actuel : {current_price}.")
    if original_price:
        parts.append(f"Au lieu de {original_price}.")
    if discount:
        parts.append(f"Réduction : {discount}.")

    parts.append("Lien dans la description.")
    return " ".join(parts)



async def main() -> None:
    props_path = Path("props.json")
    if not props_path.exists():
        raise FileNotFoundError("props.json est introuvable.")

    data = json.loads(props_path.read_text(encoding="utf-8"))
    text = build_voice_text(data)

    output = Path("public/voice.mp3")
    output.parent.mkdir(parents=True, exist_ok=True)

    voice = os.getenv("TTS_VOICE", "fr-FR-HenriNeural")
    rate = os.getenv("TTS_RATE", "+18%")
    pitch = os.getenv("TTS_PITCH", "-2Hz")

    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate=rate,
        pitch=pitch,
        volume="+0%",
    )
    await communicate.save(str(output))

    print("Texte voix :", text)
    print("Voix :", voice)
    print("Fichier créé :", output)


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
