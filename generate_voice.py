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
        intro = "Alerte bon plan. Grosse baisse de prix sur Amazon."
    elif current_price and original_price:
        intro = "Alerte bon plan. Amazon baisse enfin le prix."
    else:
        intro = "Alerte bon plan. Cette promotion risque de partir vite."

    parts = [intro, title + "."]

    if current_price:
        parts.append(f"Il est actuellement à {current_price}.")
    if original_price:
        parts.append(f"Au lieu de {original_price}.")
    if discount:
        parts.append(f"Soit une réduction de {discount}.")

    parts.append("Le lien du produit est dans la description.")
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
    rate = os.getenv("TTS_RATE", "+8%")
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
