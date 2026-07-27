import json
import re
from pathlib import Path

from generate_voice import clean, smart_product_title


def category_hashtag(title: str) -> str:
    normalized = title.lower()
    groups = [
        (("ssd", "rtx", "ryzen", "pc", "clavier", "souris"), "#HighTech"),
        (("iphone", "smartphone", "galaxy", "pixel"), "#Smartphone"),
        (("aspirateur", "airfryer", "friteuse", "robot", "cuisine"), "#Maison"),
        (("lego", "jouet", "pokemon", "playmobil"), "#Jouets"),
        (("perceuse", "visseuse", "bosch", "makita"), "#Bricolage"),
    ]
    for keywords, hashtag in groups:
        if any(word in normalized for word in keywords):
            return hashtag
    return "#BonPlanAmazon"


def main() -> None:
    data = json.loads(Path("props.json").read_text(encoding="utf-8"))
    title = smart_product_title(data.get("title"), max_length=62)
    current = clean(data.get("currentPrice"))
    original = clean(data.get("originalPrice"))
    discount = clean(data.get("discount"))
    affiliate_url = clean(data.get("affiliateUrl"))

    tiktok = [f"{title} à {current} 👀"]
    if original and discount:
        tiktok.append(f"Avant {original} • {discount}")
    tiktok.extend(["", "D'autres bons plans arrivent chaque jour.", "#BonPlan #Amazon " + category_hashtag(title)])

    facebook = [f"🔥 {title}", "", f"Prix actuel : {current}"]
    if original and discount:
        facebook.extend([f"Ancien prix : {original}", f"Réduction : {discount}"])
    facebook.extend(["", affiliate_url, "", "Lien affilié : une commission peut être perçue sans coût supplémentaire.", "#BonPlan #Amazon " + category_hashtag(title)])

    Path("tiktok_caption.txt").write_text("\n".join(tiktok), encoding="utf-8")
    Path("facebook_caption.txt").write_text("\n".join(facebook), encoding="utf-8")


if __name__ == "__main__":
    main()
