import asyncio
import json
import os
import re
from pathlib import Path

import edge_tts


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def smart_product_title(value: object, max_length: int = 54) -> str:
    """Crée un nom court, lisible et prononçable pour la vidéo."""
    title = clean(value)

    title = re.sub(
        r"\s*[\(\[]?\s*(?:vendeur tiers|expédié par amazon|vendu par amazon|"
        r"livraison prime|offre prime|stock limité)\s*[\)\]]?\s*$",
        "",
        title,
        flags=re.IGNORECASE,
    ).strip()

    lower = title.lower()

    # TV : exemple attendu -> TV 4K TCL QD-MINI LED
    if re.search(r"\b(tv|téléviseur|television|smart tv)\b", lower):
        brand_match = re.search(
            r"\b(TCL|Samsung|LG|Sony|Philips|Hisense|Panasonic|Xiaomi|Sharp|Thomson)\b",
            title,
            flags=re.IGNORECASE,
        )
        brand = brand_match.group(1).upper() if brand_match else ""

        resolution = ""
        if re.search(r"\b8k\b", lower):
            resolution = "8K"
        elif re.search(r"\b4k\b|\bultra\s*hd\b|\buhd\b", lower):
            resolution = "4K"

        # L'ordre est important : technologies spécifiques avant les génériques.
        technologies = (
            (r"\bqd[\s-]?mini[\s-]?led\b", "QD-MINI LED"),
            (r"\bneo\s*qled\b", "NEO QLED"),
            (r"\bmini[\s-]?led\b", "MINI LED"),
            (r"\bqd[\s-]?oled\b", "QD-OLED"),
            (r"\boled\b", "OLED"),
            (r"\bqled\b", "QLED"),
        )
        technology = next(
            (label for pattern, label in technologies if re.search(pattern, lower)),
            "",
        )

        result = " ".join(part for part in ("TV", resolution, brand, technology) if part)
        return result[:max_length].strip()

    # SSD
    if re.search(r"\bssd\b", lower):
        brand_match = re.search(
            r"\b(Samsung|Crucial|Kingston|WD|Western Digital|SanDisk|Seagate|Lexar|Corsair)\b",
            title,
            flags=re.IGNORECASE,
        )
        capacity_match = re.search(
            r"\b(\d+(?:[.,]\d+)?\s*(?:To|TB|Go|GB))\b",
            title,
            flags=re.IGNORECASE,
        )
        parts = ["SSD"]
        if brand_match:
            parts.append(brand_match.group(1))
        if re.search(r"\bnvme\b", lower):
            parts.append("NVMe")
        if capacity_match:
            capacity = re.sub(r"TB\b", "To", capacity_match.group(1), flags=re.IGNORECASE)
            capacity = re.sub(r"GB\b", "Go", capacity, flags=re.IGNORECASE)
            parts.append(capacity)
        return " ".join(parts)[:max_length].strip()

    # CPU
    cpu_match = re.search(
        r"\b((?:AMD\s*)?Ryzen\s*[3579]\s*\d{4,5}[A-Z0-9]*|"
        r"Intel\s*Core\s*(?:Ultra\s*)?[3579]\s*\d{3,5}[A-Z0-9-]*)\b",
        title,
        flags=re.IGNORECASE,
    )
    if cpu_match:
        return clean(cpu_match.group(1))[:max_length]

    # GPU
    gpu_match = re.search(
        r"\b((?:NVIDIA\s*)?(?:GeForce\s*)?RTX\s*\d{4}(?:\s*Ti|\s*SUPER)?|"
        r"(?:AMD\s*)?Radeon\s*RX\s*\d{4}(?:\s*XT)?)\b",
        title,
        flags=re.IGNORECASE,
    )
    if gpu_match:
        return clean(gpu_match.group(1))[:max_length]

    # Smartphone
    phone_match = re.search(
        r"\b(iPhone\s*\d{1,2}(?:\s*(?:Pro Max|Pro|Plus|Air))?|"
        r"Galaxy\s*[A-Z]\d{1,3}(?:\s*(?:Ultra|Plus|FE))?|"
        r"Pixel\s*\d{1,2}(?:\s*(?:Pro|a))?)\b",
        title,
        flags=re.IGNORECASE,
    )
    if phone_match:
        return clean(phone_match.group(1))[:max_length]

    # Nettoyage générique des références longues.
    title = re.sub(r"\b[A-Z]{1,6}[-_]?\d{4,}[A-Z0-9_-]*\b", "", title)
    title = re.sub(
        r"\b(?:modèle|référence|ref\.?)\s*:?\s*[A-Z0-9_-]+\b",
        "",
        title,
        flags=re.IGNORECASE,
    )
    title = re.split(
        r"\s+(?:avec|comprend|inclut|compatible avec)\s+",
        title,
        maxsplit=1,
        flags=re.IGNORECASE,
    )[0]
    title = re.split(r"\s*[,|;]\s*", title, maxsplit=1)[0]
    title = clean(title)

    if len(title) > max_length:
        title = title[:max_length].rsplit(" ", 1)[0].rstrip(" ,;:-")

    return title or "Bon plan Amazon"


def discount_number(value: object) -> int:
    match = re.search(r"(\d{1,3})", clean(value))
    return int(match.group(1)) if match else 0


def voice_segments(data: dict) -> dict[str, str]:
    short_title = smart_product_title(data.get("title"))
    current = clean(data.get("currentPrice"))
    original = clean(data.get("originalPrice"))
    discount = clean(data.get("discount"))
    reduction = discount_number(discount)

    if reduction >= 50:
        intro = "Alerte bon plan. Le prix vient de s'effondrer."
    elif reduction >= 30:
        intro = "Alerte bon plan. Grosse baisse de prix."
    elif current and original:
        intro = "Alerte bon plan. Amazon baisse enfin le prix."
    else:
        intro = "Alerte bon plan. Une promotion à ne pas manquer."

    product = f"{short_title}."

    price_parts: list[str] = []
    if current:
        price_parts.append(f"Prix actuel, {current}.")
    if original:
        price_parts.append(f"Au lieu de {original}.")
    if discount:
        price_parts.append(f"Soit une réduction de {discount}.")
    price = " ".join(price_parts) or "Découvre le prix de cette offre."

    final = "Retrouve le lien du produit dans la description."

    return {
        "intro": intro,
        "product": product,
        "price": price,
        "final": final,
        "shortTitle": short_title,
    }


async def save_voice(text: str, destination: Path) -> None:
    voice = os.getenv("TTS_VOICE", "fr-FR-HenriNeural")
    rate = os.getenv("TTS_RATE", "-5%")
    pitch = os.getenv("TTS_PITCH", "-2Hz")

    communicator = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate=rate,
        pitch=pitch,
        volume="+0%",
    )
    await communicator.save(str(destination))

    if not destination.exists() or destination.stat().st_size < 500:
        raise RuntimeError(f"Le fichier audio {destination} n'a pas été correctement créé.")


async def main() -> None:
    props_path = Path("props.json")
    if not props_path.exists():
        raise FileNotFoundError("props.json est introuvable.")

    data = json.loads(props_path.read_text(encoding="utf-8"))
    segments = voice_segments(data)

    public_dir = Path("public")
    public_dir.mkdir(parents=True, exist_ok=True)

    for segment_name in ("intro", "product", "price", "final"):
        destination = public_dir / f"voice_{segment_name}.mp3"
        await save_voice(segments[segment_name], destination)
        print(f"Créé : {destination} — {segments[segment_name]}")

    data["shortTitle"] = segments["shortTitle"]
    props_path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Titre vidéo : {segments['shortTitle']}")


if __name__ == "__main__":
    asyncio.run(main())
