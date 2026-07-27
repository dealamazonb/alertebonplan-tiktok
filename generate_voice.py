import asyncio
import json
import os
import re
from pathlib import Path

import edge_tts


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def smart_product_title(value: object, max_length: int = 52) -> str:
    title = clean(value)
    title = re.sub(
        r"\s*[\(\[]?\s*(?:vendeur tiers|expédié par amazon|vendu par amazon|livraison prime|offre prime|stock limité)\s*[\)\]]?\s*$",
        "",
        title,
        flags=re.IGNORECASE,
    ).strip()
    title = re.split(r"\s+(?:avec|comprend|inclut|compatible avec)\s+", title, maxsplit=1, flags=re.IGNORECASE)[0]
    title = re.split(r"\s*[,|;]\s*", title, maxsplit=1)[0]
    title = re.sub(r"\b[A-Z]{1,6}[-_]?\d{5,}[A-Z0-9_-]*\b", "", title)
    title = clean(title)
    if len(title) > max_length:
        title = title[:max_length].rsplit(" ", 1)[0].rstrip(" ,;:-")
    return title or "Bon plan Amazon"


def number_from_percent(value: object) -> int:
    match = re.search(r"(\d{1,3})", clean(value))
    return int(match.group(1)) if match else 0


def choose_format(data: dict) -> str:
    original = clean(data.get("originalPrice"))
    discount = clean(data.get("discount"))
    if original and discount:
        return "verified_drop"
    return "price_only"


def build_segments(data: dict) -> dict[str, str]:
    title = smart_product_title(data.get("title"))
    current = clean(data.get("currentPrice"))
    original = clean(data.get("originalPrice"))
    discount = clean(data.get("discount"))
    fmt = choose_format(data)
    reduction = number_from_percent(discount)

    if fmt == "verified_drop":
        if reduction >= 50:
            hook = f"Le prix de ce produit vient de s'effondrer à {current}."
        elif reduction >= 30:
            hook = f"Grosse baisse de prix sur ce produit : {current}."
        else:
            hook = f"Ce produit passe actuellement à {current}."
        detail = f"{title}. Avant {original}, maintenant {current}, soit {discount}."
    else:
        hook = f"Je viens de repérer ce produit à {current}."
        detail = f"{title}. Le prix affiché est de {current}."

    cta = "Retrouve les prochains bons plans sur Alerte Bon Plan."

    return {
        "hook": hook,
        "detail": detail,
        "cta": cta,
        "shortTitle": title,
        "format": fmt,
    }


async def save_voice(text: str, destination: Path) -> None:
    communicator = edge_tts.Communicate(
        text=text,
        voice=os.getenv("TTS_VOICE", "fr-FR-HenriNeural"),
        rate=os.getenv("TTS_RATE", "+4%"),
        pitch=os.getenv("TTS_PITCH", "+0Hz"),
        volume="+0%",
    )
    await communicator.save(str(destination))
    if not destination.exists() or destination.stat().st_size < 500:
        raise RuntimeError(f"Audio invalide : {destination}")


async def main() -> None:
    props_path = Path("props.json")
    if not props_path.exists():
        raise FileNotFoundError("props.json est introuvable.")

    data = json.loads(props_path.read_text(encoding="utf-8"))
    segments = build_segments(data)
    public_dir = Path("public")
    public_dir.mkdir(parents=True, exist_ok=True)

    for name in ("hook", "detail", "cta"):
        destination = public_dir / f"voice_{name}.mp3"
        await save_voice(segments[name], destination)
        print(f"{name}: {segments[name]}")

    data["shortTitle"] = segments["shortTitle"]
    data["format"] = segments["format"]
    props_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    asyncio.run(main())
