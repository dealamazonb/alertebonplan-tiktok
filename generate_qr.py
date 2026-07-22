import os
from pathlib import Path

import qrcode


def main() -> None:
    telegram_url = os.getenv("TELEGRAM_PUBLIC_URL", "").strip()

    if not telegram_url:
        raise RuntimeError(
            "TELEGRAM_PUBLIC_URL est vide. Ajoute ton lien Telegram dans "
            "GitHub > Settings > Secrets and variables > Actions > Variables."
        )

    if not telegram_url.startswith(("https://t.me/", "http://t.me/")):
        raise RuntimeError(
            "TELEGRAM_PUBLIC_URL doit ressembler à https://t.me/NomDeTaChaine"
        )

    public_dir = Path("public")
    public_dir.mkdir(parents=True, exist_ok=True)

    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=14,
        border=2,
    )
    qr.add_data(telegram_url)
    qr.make(fit=True)

    image = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    output = public_dir / "telegram-qr.png"
    image.save(output, optimize=True)

    if not output.exists() or output.stat().st_size < 500:
        raise RuntimeError("Le QR code Telegram n'a pas été correctement créé.")

    print(f"QR Telegram créé : {output}")
    print(f"Lien Telegram : {telegram_url}")


if __name__ == "__main__":
    main()
