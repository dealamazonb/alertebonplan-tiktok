import os
import textwrap
from pathlib import Path

import requests
from PIL import Image, ImageDraw, ImageFont
from moviepy import ImageClip


WIDTH = 1080
HEIGHT = 1920
DURATION = 8

OUTPUT_FILE = Path("video_tiktok.mp4")
FRAME_FILE = Path("frame.png")
PRODUCT_FILE = Path("product.jpg")


def download_image(url: str, destination: Path) -> None:
    response = requests.get(
        url,
        timeout=30,
        headers={"User-Agent": "Mozilla/5.0"},
    )
    response.raise_for_status()
    destination.write_bytes(response.content)


def get_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    font_name = (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    )
    return ImageFont.truetype(font_name, size)


def fit_product_image(image: Image.Image, max_size: tuple[int, int]) -> Image.Image:
    image = image.convert("RGBA")
    image.thumbnail(max_size, Image.Resampling.LANCZOS)
    return image


def centered_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    font: ImageFont.FreeTypeFont,
    fill: str,
) -> None:
    box = draw.textbbox((0, 0), text, font=font)
    width = box[2] - box[0]
    draw.text(((WIDTH - width) / 2, y), text, font=font, fill=fill)


def create_frame(
    title: str,
    current_price: str,
    original_price: str,
    discount: str,
    image_url: str,
) -> None:
    background = Image.new("RGB", (WIDTH, HEIGHT), "#111827")
    draw = ImageDraw.Draw(background)

    # En-tête
    draw.rounded_rectangle(
        (70, 70, 1010, 250),
        radius=45,
        fill="#ef4444",
    )

    centered_text(
        draw,
        "🚨 ALERTE BON PLAN",
        105,
        get_font(70, bold=True),
        "white",
    )

    # Image du produit
    if image_url:
        download_image(image_url, PRODUCT_FILE)
        product = Image.open(PRODUCT_FILE)
        product = fit_product_image(product, (800, 760))

        white_card = Image.new("RGBA", (880, 840), "white")
        card_x = 100
        card_y = 330

        background.paste(
            white_card,
            (card_x, card_y),
            white_card,
        )

        product_x = (WIDTH - product.width) // 2
        product_y = card_y + (840 - product.height) // 2

        background.paste(
            product,
            (product_x, product_y),
            product,
        )

    # Titre
    wrapped_title = textwrap.wrap(title, width=32)[:4]
    title_y = 1230

    for line in wrapped_title:
        centered_text(
            draw,
            line,
            title_y,
            get_font(48, bold=True),
            "white",
        )
        title_y += 62

    # Prix actuel
    if current_price:
        centered_text(
            draw,
            current_price,
            1510,
            get_font(100, bold=True),
            "#facc15",
        )

    # Ancien prix
    if original_price:
        centered_text(
            draw,
            f"Au lieu de {original_price}",
            1640,
            get_font(48),
            "#d1d5db",
        )

    # Réduction
    if discount:
        draw.rounded_rectangle(
            (315, 1720, 765, 1850),
            radius=35,
            fill="#ef4444",
        )

        centered_text(
            draw,
            discount,
            1740,
            get_font(75, bold=True),
            "white",
        )

    background.save(FRAME_FILE)


def create_video() -> None:
    title = os.environ.get(
        "DEAL_TITLE",
        "Bon plan Amazon",
    )

    current_price = os.environ.get(
        "CURRENT_PRICE",
        "79,99 €",
    )

    original_price = os.environ.get(
        "ORIGINAL_PRICE",
        "129,99 €",
    )

    discount = os.environ.get(
        "DISCOUNT",
        "-38 %",
    )

    image_url = os.environ.get(
        "IMAGE_URL",
        "https://m.media-amazon.com/images/I/61jLiCovxVL._AC_SL1500_.jpg",
    )

    create_frame(
        title,
        current_price,
        original_price,
        discount,
        image_url,
    )

    clip = ImageClip(str(FRAME_FILE), duration=DURATION)

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


if __name__ == "__main__":
    create_video()
