import os
import textwrap
from pathlib import Path

import requests
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from moviepy import ImageClip


WIDTH = 1080
HEIGHT = 1920
DURATION = 9

OUTPUT_FILE = Path("video_tiktok.mp4")
FRAME_FILE = Path("frame_v2.png")
PRODUCT_FILE = Path("product_image")


def download_image(url: str, destination: Path) -> None:
    if not url:
        raise ValueError("L'URL de l'image produit est manquante.")

    response = requests.get(
        url,
        timeout=30,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 Chrome/124 Safari/537.36"
            ),
            "Accept": "image/avif,image/webp,image/png,image/jpeg,*/*",
        },
    )

    response.raise_for_status()

    content_type = response.headers.get("content-type", "").lower()

    if "image" not in content_type:
        raise ValueError(
            f"L'URL reçue ne renvoie pas une image : {content_type}"
        )

    destination.write_bytes(response.content)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    )

    return ImageFont.truetype(path, size)


def draw_centered_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    text_font: ImageFont.FreeTypeFont,
    fill: str,
) -> None:
    bounds = draw.textbbox((0, 0), text, font=text_font)
    text_width = bounds[2] - bounds[0]

    draw.text(
        ((WIDTH - text_width) / 2, y),
        text,
        font=text_font,
        fill=fill,
    )


def create_gradient_background() -> Image.Image:
    background = Image.new("RGB", (WIDTH, HEIGHT))

    start = (15, 23, 42)
    end = (30, 41, 59)

    pixels = background.load()

    for y in range(HEIGHT):
        ratio = y / max(HEIGHT - 1, 1)

        red = int(start[0] + (end[0] - start[0]) * ratio)
        green = int(start[1] + (end[1] - start[1]) * ratio)
        blue = int(start[2] + (end[2] - start[2]) * ratio)

        for x in range(WIDTH):
            pixels[x, y] = (red, green, blue)

    return background


def create_product_card(
    product: Image.Image,
) -> Image.Image:
    card_width = 900
    card_height = 820

    shadow = Image.new(
        "RGBA",
        (card_width + 80, card_height + 80),
        (0, 0, 0, 0),
    )

    shadow_draw = ImageDraw.Draw(shadow)

    shadow_draw.rounded_rectangle(
        (40, 40, card_width + 40, card_height + 40),
        radius=55,
        fill=(0, 0, 0, 170),
    )

    shadow = shadow.filter(ImageFilter.GaussianBlur(28))

    card = Image.new(
        "RGBA",
        (card_width + 80, card_height + 80),
        (0, 0, 0, 0),
    )

    card.alpha_composite(shadow)

    draw = ImageDraw.Draw(card)

    draw.rounded_rectangle(
        (40, 40, card_width + 40, card_height + 40),
        radius=55,
        fill=(255, 255, 255, 255),
    )

    product = product.convert("RGBA")
    product.thumbnail((760, 700), Image.Resampling.LANCZOS)

    product_x = (card.width - product.width) // 2
    product_y = (card.height - product.height) // 2

    card.alpha_composite(product, (product_x, product_y))

    return card


def create_frame(
    title: str,
    current_price: str,
    original_price: str,
    discount: str,
    image_url: str,
) -> None:
    background = create_gradient_background()
    draw = ImageDraw.Draw(background)

    # Petit nom de la page
    draw_centered_text(
        draw,
        "ALERTEBONPLAN",
        58,
        font(34, bold=True),
        "#fbbf24",
    )

    # Bandeau principal
    draw.rounded_rectangle(
        (65, 115, 1015, 285),
        radius=48,
        fill="#dc2626",
    )

    draw_centered_text(
        draw,
        "ALERTE BON PLAN AMAZON",
        158,
        font(58, bold=True),
        "white",
    )

    # Produit
    download_image(image_url, PRODUCT_FILE)

    try:
        product = Image.open(PRODUCT_FILE)
        product.load()
    except Exception as error:
        raise ValueError(
            "L'image produit téléchargée est invalide."
        ) from error

    product_card = create_product_card(product)

    background.paste(
        product_card,
        ((WIDTH - product_card.width) // 2, 330),
        product_card,
    )

    draw = ImageDraw.Draw(background)

    # Titre sur 4 lignes maximum
    clean_title = " ".join(title.split())
    title_lines = textwrap.wrap(clean_title, width=35)[:4]

    title_y = 1240

    for line in title_lines:
        draw_centered_text(
            draw,
            line,
            title_y,
            font(46, bold=True),
            "white",
        )
        title_y += 60

    # Bloc du prix
    price_box_top = 1500

    draw.rounded_rectangle(
        (90, price_box_top, 990, 1840),
        radius=55,
        fill=(3, 7, 18),
        outline="#334155",
        width=4,
    )

    if current_price:
        draw_centered_text(
            draw,
            current_price,
            1550,
            font(105, bold=True),
            "#facc15",
        )
    else:
        draw_centered_text(
            draw,
            "PROMOTION EN COURS",
            1570,
            font(60, bold=True),
            "#facc15",
        )

    if original_price:
        old_price_text = f"Au lieu de {original_price}"

        bounds = draw.textbbox(
            (0, 0),
            old_price_text,
            font=font(46),
        )

        old_price_width = bounds[2] - bounds[0]
        old_price_x = (WIDTH - old_price_width) / 2
        old_price_y = 1690

        draw.text(
            (old_price_x, old_price_y),
            old_price_text,
            font=font(46),
            fill="#cbd5e1",
        )

        draw.line(
            (
                old_price_x,
                old_price_y + 30,
                old_price_x + old_price_width,
                old_price_y + 30,
            ),
            fill="#ef4444",
            width=7,
        )

    if discount:
        badge_left = 350
        badge_top = 1750
        badge_right = 730
        badge_bottom = 1870

        draw.rounded_rectangle(
            (
                badge_left,
                badge_top,
                badge_right,
                badge_bottom,
            ),
            radius=40,
            fill="#dc2626",
        )

        draw_centered_text(
            draw,
            discount,
            1766,
            font(68, bold=True),
            "white",
        )

    # Bas de vidéo
    draw_centered_text(
        draw,
        "Lien du produit dans la description",
        1880,
        font(32),
        "#cbd5e1",
    )

    background.save(FRAME_FILE, quality=95)


def create_video() -> None:
    title = os.environ.get("DEAL_TITLE", "").strip()
    current_price = os.environ.get("CURRENT_PRICE", "").strip()
    original_price = os.environ.get("ORIGINAL_PRICE", "").strip()
    discount = os.environ.get("DISCOUNT", "").strip()
    image_url = os.environ.get("IMAGE_URL", "").strip()

    if not title:
        raise ValueError("DEAL_TITLE est manquant.")

    if not image_url:
        raise ValueError("IMAGE_URL est manquante.")

    create_frame(
        title=title,
        current_price=current_price,
        original_price=original_price,
        discount=discount,
        image_url=image_url,
    )

    clip = ImageClip(str(FRAME_FILE)).with_duration(DURATION)

    # Zoom lent de 100 % à environ 104 %
    clip = clip.resized(
        lambda t: 1 + (0.04 * t / DURATION)
    )

    # Recadrage constant au format 1080 x 1920
    clip = clip.cropped(
        x_center=clip.w / 2,
        y_center=clip.h / 2,
        width=WIDTH,
        height=HEIGHT,
    )

    clip.write_videofile(
        str(OUTPUT_FILE),
        fps=30,
        codec="libx264",
        audio=False,
        preset="medium",
        ffmpeg_params=[
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
        ],
    )

    clip.close()


if __name__ == "__main__":
    create_video()
