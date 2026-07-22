import hashlib
import json
import re
from pathlib import Path


TELEGRAM_URL = "https://t.me/AlerteBonPlan"


def clean(value=""):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def clean_product_title(value, max_length=54):
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
