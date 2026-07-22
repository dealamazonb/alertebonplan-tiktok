import json
from pathlib import Path

from generate_voice import clean, smart_product_title


def main() -> None:
    props_path = Path("props.json")
    if not props_path.exists():
        raise FileNotFoundError("props.json est introuvable.")

    data = json.loads(props_path.read_text(encoding="utf-8"))

    title = smart_product_title(data.get("title"), max_length=65)
    current = clean(data.get("currentPrice"))
    original = clean(data.get("originalPrice"))
    discount = clean(data.get("discount"))
    affiliate_url = clean(data.get("affiliateUrl"))
    telegram_url = clean(data.get("telegramUrl"))

    lines = [f"🔥 {title}"]

    if current and original:
        lines.append(f"💰 {current} au lieu de {original}")
    elif current:
        lines.append(f"💰 Prix : {current}")

    if discount:
        lines.append(f"📉 {discount}")

    if affiliate_url:
        lines.extend(["", f"👉 Produit : {affiliate_url}"])

    if telegram_url:
        lines.append(f"📲 Telegram : {telegram_url}")

    lines.extend([
        "",
        "⚠️ Prix susceptible de changer.",
        "#BonPlan #Amazon #Promo #AlerteBonPlan",
    ])

    Path("tiktok_caption.txt").write_text("\n".join(lines), encoding="utf-8")
    print("Légende TikTok créée.")


if __name__ == "__main__":
    main()
