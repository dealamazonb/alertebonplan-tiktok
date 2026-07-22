import asyncio
import json
import os
import re
from pathlib import Path

import edge_tts


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def smart_product_title(value: str, max_length: int = 54) -> str:
    title = clean(value)

    # Retire les mentions commerciales inutiles.
    noise_patterns = [
        r"\s*\(\s*(?:vendeur tiers|expédié par amazon|vendu par amazon|livraison prime|stock limité|offre prime)\s*\)\s*$",
        r"\s*[-–—]\s*(?:vendeur tiers|expédié par amazon|vendu par amazon|livraison prime)\s*$",
        r"\s*\[(?:vendeur tiers|expédié par amazon|vendu par amazon|prime)\]\s*$",
    ]
    for pattern in noise_patterns:
        title = re.sub(pattern, "", title, flags=re.IGNORECASE).strip()

    lower = title.lower()

    # Téléviseurs : conserve seulement le type, la définition, la marque
    # et les technologies importantes. Les références techniques sont ignorées.
    if re.search(r"\b(tv|téléviseur|television|smart tv)\b", lower):
        brand_match = re.search(
            r"\b(TCL|Samsung|LG|Sony|Philips|Hisense|Panasonic|Xiaomi|Sharp|Thomson)\b",
            title,
            flags=re.IGNORECASE,
        )
        brand = brand_match.group(1).upper() if brand_match else ""

        tokens = []
        if re.search(r"\b8k\b", lower):
            tokens.append("8K")
        elif re.search(r"\b4k\b|\bultra\s*hd\b|\buhd\b", lower):
            tokens.append("4K")

        tech_map = [
            (r"\bqd[\s-]?mini[\s-]?led\b", "QD-MINI LED"),
            (r"\bmini[\s-]?led\b", "MINI LED"),
            (r"\bqd[\s-]?oled\b", "QD-OLED"),
            (r"\boled\b", "OLED"),
            (r"\bqled\b", "QLED"),
            (r"\bneo\s*qled\b", "NEO QLED"),
        ]
        tech = ""
        for pattern, label in tech_map:
            if re.search(pattern, lower):
                tech = label
                break

        parts = ["TV"]
        if tokens:
            parts.extend(tokens)
        if brand:
            parts.append(brand)
        if tech:
            parts.append(tech)

        result = " ".join(parts)
        return result[:max_length].strip()

    # Smartphones.
    if re.search(r"\b(smartphone|téléphone|iphone|galaxy|pixel)\b", lower):
        brand_match = re.search(
            r"\b(Apple|Samsung|Google|Xiaomi|OnePlus|Honor|Motorola|Nothing|Oppo|Realme)\b",
            title,
            flags=re.IGNORECASE,
        )
        brand = brand_match.group(1) if brand_match else ""
        model_match = re.search(
            r"\b(iPhone\s*\d{1,2}(?:\s*(?:Pro|Pro Max|Plus|Air))?|Galaxy\s*[A-Z]\d{1,3}(?:\s*(?:Ultra|Plus|FE))?|Pixel\s*\d{1,2}(?:\s*(?:Pro|a))?)\b",
            title,
            flags=re.IGNORECASE,
        )
        model = clean(model_match.group(1)) if model_match else ""
        result = " ".join(x for x in ["Smartphone", brand, model] if x)
        if result != "Smartphone":
            return result[:max_length].strip()

    # SSD.
    if re.search(r"\bssd\b", lower):
        brand_match = re.search(
            r"\b(Samsung|Crucial|Kingston|WD|Western Digital|SanDisk|Seagate|Lexar|Corsair)\b",
            title,
            flags=re.IGNORECASE,
        )
        capacity_match = re.search(r"\b(\d+(?:[.,]\d+)?\s*(?:To|TB|Go|GB))\b", title, flags=re.IGNORECASE)
        parts = ["SSD"]
        if brand_match:
            parts.append(brand_match.group(1))
        if re.search(r"\bnvme\b", lower):
            parts.append("NVMe")
        if capacity_match:
            parts.append(capacity_match.group(1).replace("TB", "To").replace("GB", "Go"))
        return " ".join(parts)[:max_length].strip()

    # Processeurs.
    cpu_match = re.search(
        r"\b((?:AMD\s*)?Ryzen\s*[3579]\s*\d{4,5}[A-Z0-9]*|Intel\s*Core\s*(?:Ultra\s*)?[3579]\s*\d{3,5}[A-Z0-9-]*)\b",
        title,
        flags=re.IGNORECASE,
    )
    if cpu_match:
        return clean(cpu_match.group(1))[:max_length]

    # Cartes graphiques.
    gpu_match = re.search(
        r"\b((?:NVIDIA\s*)?(?:GeForce\s*)?RTX\s*\d{4}(?:\s*Ti|\s*SUPER)?|(?:AMD\s*)?Radeon\s*RX\s*\d{4}(?:\s*XT)?)\b",
        title,
        flags=re.IGNORECASE,
    )
    if gpu_match:
        return clean(gpu_match.group(1))[:max_length]

    # Nettoyage générique : retire références longues et détails secondaires.
    title = re.sub(r"\b[A-Z]{1,5}[-_]?\d{4,}[A-Z0-9_-]*\b", "", title)
    title = re.sub(r"\b(?:modèle|référence|ref\.?)\s*:?\s*[A-Z0-9_-]+\b", "", title, flags=re.IGNORECASE)
    title = re.split(r"\s+(?:avec|comprend|inclut|compatible avec)\s+", title, maxsplit=1, flags=re.IGNORECASE)[0]
    title = re.split(r"\s*[,|;]\s*", title, maxsplit=1)[0]
    title = clean(title)

    if len(title) > max_length:
        title = title[:max_length].rsplit(" ", 1)[0].rstrip(" ,;:-")

    return title or "Bon plan Amazon"


def percent(value: str) -> int:
    match = re.search(r"(\d{1,3})", str(value or ""))
    return int(match.group(1)) if match else 0


def build_segments(data: dict) -> dict:
    title = smart_product_title(data.get("title"), max_length=54)
    current = clean(data.get("currentPrice"))
    original = clean(data.get("originalPrice"))
    discount = clean(data.get("discount"))
    reduction = percent(discount)

    if reduction >= 50:
        intro = "Alerte bon plan. Le prix vient de s'effondrer."
    elif reduction >= 30:
        intro = "Alerte bon plan. Grosse baisse de prix."
    elif current and original:
        intro = "Alerte bon plan. Amazon baisse enfin le prix."
    else:
        intro = "Alerte bon plan. Une promotion à ne pas manquer."

    product = f"{title}."

    price_parts = []
    if current:
        price_parts.append(f"Prix actuel : {current}.")
    if original:
        price_parts.append(f"Au lieu de {original}.")
    if discount:
        price_parts.append(f"Réduction : {discount}.")
    price = " ".join(price_parts) or "Découvre le prix de cette offre."

    final = "Lien du produit dans la description."

    return {
        "intro": intro,
        "product": product,
        "price": price,
        "final": final,
        "shortTitle": title,
    }


async def create_audio(text: str, output: Path, voice: str, rate: str, pitch: str) -> None:
    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate=rate,
        pitch=pitch,
        volume="+0%",
    )
    await communicate.save(str(output))


async def main() -> None:
    props_path = Path("props.json")
    if not props_path.exists():
        raise FileNotFoundError("props.json est introuvable.")

    data = json.loads(props_path.read_text(encoding="utf-8"))
    segments = build_segments(data)

    public = Path("public")
    public.mkdir(parents=True, exist_ok=True)

    voice = os.getenv("TTS_VOICE", "fr-FR-HenriNeural")
    rate = os.getenv("TTS_RATE", "-5%")
    pitch = os.getenv("TTS_PITCH", "-2Hz")

    for name in ("intro", "product", "price", "final"):
        output = public / f"voice_{name}.mp3"
        await create_audio(segments[name], output, voice, rate, pitch)
        print(f"{name} : {segments[name]}")

    # Le titre court est également transmis à Remotion.
    data["shortTitle"] = segments["shortTitle"]
    props_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    print("Titre court :", segments["shortTitle"])


if __name__ == "__main__":
    asyncio.run(main())
