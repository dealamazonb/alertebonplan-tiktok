import json
import re
from pathlib import Path


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def smart_product_title(value: str, max_length: int = 70) -> str:
    title = clean(value)

    if len(title) <= max_length:
        return title

    shortened = title[: max_length + 1]
    last_space = shortened.rfind(" ")

    if last_space > 25:
        shortened = shortened[:last_space]

    return shortened.rstrip(" ,;:-") + "…"


def load_props() -> dict:
    props_path = Path("props.json")

    if not props_path.exists():
        raise FileNotFoundError("Le fichier props.json est introuvable.")

    with props_path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, dict):
        raise ValueError("props.json doit contenir un objet JSON.")

    return data


def build_caption(props: dict) -> str:
    title = smart_product_title(props.get("title", "Bon plan Amazon"))
    current_price = clean(props.get("currentPrice"))
    original_price = clean(props.get("originalPrice"))
    discount = clean(props.get("discount"))

    lines = [f"🔥 {title}"]

    if current_price:
        if original_price and discount:
            lines.append(
                f"💰 {current_price} au lieu de {original_price} ({discount})"
            )
        else:
            lines.append(f"💰 Prix repéré : {current_price}")

    lines.append("")
    lines.append("D’autres bons plans sont disponibles sur mon profil.")
    lines.append("#BonPlan #Amazon #Promo")

    return "\n".join(lines)


def main() -> None:
    props = load_props()
    caption = build_caption(props)

    Path("caption.txt").write_text(
        caption,
        encoding="utf-8",
    )

    print(caption)


if __name__ == "__main__":
    main()
