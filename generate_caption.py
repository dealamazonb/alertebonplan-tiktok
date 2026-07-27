import json
import re
from pathlib import Path


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def shorten_title(value: object, max_length: int = 70) -> str:
    title = clean(value)
    if len(title) <= max_length:
        return title

    shortened = title[: max_length + 1]
    last_space = shortened.rfind(" ")
    if last_space > 25:
        shortened = shortened[:last_space]

    return shortened.rstrip(" ,;:-") + "…"


def load_props() -> dict:
    path = Path("props.json")
    if not path.exists():
        raise FileNotFoundError("props.json est introuvable.")

    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, dict):
        raise ValueError("props.json doit contenir un objet JSON.")

    return data


def build_tiktok_caption(props: dict) -> str:
    title = shorten_title(props.get("title") or "Bon plan Amazon")
    current_price = clean(props.get("currentPrice"))
    original_price = clean(props.get("originalPrice"))
    discount = clean(props.get("discount"))

    lines = [f"🔥 {title}"]

    if current_price and original_price and discount:
        lines.append(
            f"💰 {current_price} au lieu de {original_price} ({discount})"
        )
    elif current_price:
        lines.append(f"💰 Prix actuel : {current_price}")

    lines.extend([
        "",
        "D’autres bons plans sont disponibles sur mon profil.",
        "#BonPlan #Amazon #Promo",
    ])

    return "\n".join(lines)


def build_facebook_caption(props: dict) -> str:
    title = shorten_title(props.get("title") or "Bon plan Amazon", 100)
    current_price = clean(props.get("currentPrice"))
    original_price = clean(props.get("originalPrice"))
    discount = clean(props.get("discount"))
    affiliate_url = clean(props.get("affiliateUrl"))

    lines = ["🔥 BON PLAN AMAZON", "", title]

    if current_price and original_price and discount:
        lines.extend([
            "",
            f"💰 {current_price} au lieu de {original_price}",
            f"📉 {discount}",
        ])
    elif current_price:
        lines.extend(["", f"💰 Prix actuel : {current_price}"])

    if affiliate_url:
        lines.extend(["", f"🛒 Voir l’offre : {affiliate_url}"])

    lines.extend([
        "",
        "Lien affilié : une commission peut être perçue sans coût supplémentaire pour vous.",
        "",
        "#BonPlan #Amazon #Promo",
    ])

    return "\n".join(lines)


def main() -> None:
    props = load_props()
    tiktok_caption = build_tiktok_caption(props)
    facebook_caption = build_facebook_caption(props)

    Path("tiktok_caption.txt").write_text(tiktok_caption, encoding="utf-8")
    Path("facebook_caption.txt").write_text(facebook_caption, encoding="utf-8")

    print("Légende TikTok :")
    print(tiktok_caption)
    print("\nLégende Facebook :")
    print(facebook_caption)


if __name__ == "__main__":
    main()
