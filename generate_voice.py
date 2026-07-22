import hashlib
import json
import re
from pathlib import Path


TELEGRAM_URL = "https://t.me/AlerteBonPlan"


def clean(value=""):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def clean_product_title(value, max_length=80):
    title = clean(value)

    suffix_patterns = [
        r"\s*\(\s*vendeur tiers\s*\)\s*$",
        r"\s*\(\s*expédié par amazon\s*\)\s*$",
        r"\s*\(\s*vendu par amazon\s*\)\s*$",
        r"\s*\(\s*livraison prime\s*\)\s*$",
        r"\s*\(\s*stock limité\s*\)\s*$",
        r"\s*\(\s*offre prime\s*\)\s*$",
        r"\s*[-–—]\s*vendeur tiers\s*$",
        r"\s*[-–—]\s*expédié par amazon\s*$",
        r"\s*[-–—]\s*vendu par amazon\s*$",
        r"\s*\[(?:vendeur tiers|expédié par amazon|vendu par amazon|prime)\]\s*$",
    ]

    for pattern in suffix_patterns:
        title = re.sub(pattern, "", title, flags=re.IGNORECASE).strip()

    if len(title) > max_length:
        for separator in (" - ", " – ", " — ", ", avec ", ", pour ", " | "):
            head = title.split(separator, 1)[0].strip()
            if 18 <= len(head) <= max_length:
                title = head
                break

    if len(title) > max_length:
        shortened = title[:max_length].rsplit(" ", 1)[0].strip()
        title = (shortened or title[:max_length]).rstrip(" ,;:-") + "…"

    return title or "Bon plan Amazon"


def number_from_text(value=""):
    match = re.search(r"(\d+(?:[.,]\d+)?)", str(value or "").replace(" ", ""))
    if not match:
        return None
    try:
        return float(match.group(1).replace(",", "."))
    except ValueError:
        return None


def euro(value):
    if value is None:
        return ""
    rounded = round(value, 2)
    if rounded.is_integer():
        return f"{int(rounded)} €"
    return f"{rounded:.2f}".replace(".", ",") + " €"


def category_hashtags(title):
    text = clean(title).lower()

    groups = {
        "tech": {
            "words": [
                "ssd", "nvme", "processeur", "ryzen", "intel", "carte graphique",
                "gpu", "ram", "mémoire", "pc", "gaming", "clavier", "souris",
                "écran", "monitor", "casque", "écouteur", "chargeur", "webcam"
            ],
            "tags": ["#tech", "#gaming", "#pcgaming", "#setup", "#informatique"],
        },
        "smartphone": {
            "words": [
                "iphone", "samsung", "galaxy", "smartphone", "téléphone",
                "pixel", "xiaomi", "oneplus", "airpods", "apple"
            ],
            "tags": ["#smartphone", "#mobile", "#hightech", "#tech", "#geek"],
        },
        "maison": {
            "words": [
                "aspirateur", "robot", "cafetière", "machine à café", "airfryer",
                "friteuse", "micro-ondes", "four", "matelas", "canapé", "maison",
                "cuisine", "nettoyeur"
            ],
            "tags": ["#maison", "#cuisine", "#astuce", "#shopping", "#quotidien"],
        },
        "beaute": {
            "words": [
                "parfum", "maquillage", "beauté", "soin", "shampoing",
                "rasoir", "coiffure", "sèche-cheveux"
            ],
            "tags": ["#beaute", "#parfum", "#soin", "#shopping", "#bonplan"],
        },
        "jeux": {
            "words": [
                "lego", "jouet", "playmobil", "nintendo", "playstation",
                "ps5", "xbox", "console", "jeu vidéo"
            ],
            "tags": ["#jeuxvideo", "#gaming", "#console", "#geek", "#cadeau"],
        },
        "sport": {
            "words": [
                "musculation", "fitness", "sport", "vélo", "running",
                "tapis de course", "haltère", "basket"
            ],
            "tags": ["#sport", "#fitness", "#training", "#bonplan", "#shopping"],
        },
    }

    for group in groups.values():
        if any(word in text for word in group["words"]):
            return group["tags"]

    return ["#shopping", "#bonsplans", "#deal", "#promo", "#astuce"]


def select_hook(data):
    title = clean_product_title(data.get("title"), max_length=80)
    discount = clean(data.get("discount"))
    current = clean(data.get("currentPrice"))
    original = clean(data.get("originalPrice"))

    reduction = number_from_text(discount) or 0
    seed = hashlib.sha256((title + current + original + discount).encode("utf-8")).digest()[0]

    if reduction >= 50:
        hooks = [
            "😱 Le prix vient de s’effondrer sur Amazon !",
            "🔥 Plus de 50 % de réduction sur ce bon plan !",
            "🚨 Cette baisse de prix est complètement folle !",
        ]
    elif reduction >= 30:
        hooks = [
            "🔥 Amazon casse encore le prix !",
            "💥 Grosse baisse de prix à saisir rapidement !",
            "🚨 Ce bon plan risque de ne pas durer !",
        ]
    else:
        hooks = [
            "🔥 Nouveau bon plan repéré sur Amazon !",
            "👀 Cette promotion mérite clairement le détour !",
            "💸 Un bon prix à vérifier avant qu’il ne remonte !",
        ]

    return hooks[seed % len(hooks)]


def build_caption(data):
    title = clean_product_title(data.get("title"), max_length=80)
    current = clean(data.get("currentPrice"))
    original = clean(data.get("originalPrice"))
    discount = clean(data.get("discount"))
    affiliate_url = clean(data.get("affiliateUrl"))

    current_num = number_from_text(current)
    original_num = number_from_text(original)

    lines = [
        select_hook(data),
        "",
        f"🛍️ {title}",
    ]

    if current and original:
        lines.append(f"💰 {current} au lieu de {original}")
    elif current:
        lines.append(f"💰 Prix : {current}")
    elif original:
        lines.append(f"💰 Ancien prix indiqué : {original}")

    if current_num is not None and original_num is not None and original_num > current_num:
        saving = original_num - current_num
        lines.append(f"✅ Économie estimée : {euro(saving)}")

    if discount:
        lines.append(f"🔥 Réduction : {discount}")

    lines.extend([
        "",
        f"👉 Voir l’offre : {affiliate_url}",
        "ℹ️ Lien affilié : je peux percevoir une commission sans coût supplémentaire pour toi.",
        "",
        "📲 Rejoins AlerteBonPlan pour recevoir les prochaines promotions :",
        TELEGRAM_URL,
        "",
    ])

    base_tags = ["#amazon", "#bonplan", "#promotion", "#bonsplans", "#amazonfr"]
    dynamic_tags = category_hashtags(title)
    reach_tags = ["#pourtoi", "#fyp", "#tiktokfr"]

    tags = []
    for tag in base_tags + dynamic_tags + reach_tags:
        if tag not in tags:
            tags.append(tag)

    lines.append(" ".join(tags[:15]))
    return "\n".join(lines).strip()


def main():
    props = Path("props.json")
    if not props.exists():
        raise FileNotFoundError("props.json est introuvable.")

    data = json.loads(props.read_text(encoding="utf-8"))
    caption = build_caption(data)

    Path("tiktok_caption.txt").write_text(caption, encoding="utf-8")
    print("Légende TikTok générée :")
    print(caption)


if __name__ == "__main__":
    main()
