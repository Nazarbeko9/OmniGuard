import os
import time
import sys

# 1. ZARARLI FORMATLAR VA SHUBHALI FAYLLARNI QIDIRISH (Malware Scanner)
# Telegram yoki brauzerdan yuklangan "Download" papkasini nazorat qilish
SCAN_DIRECTORY = os.path.expanduser("~/Downloads")
# Kiberxavfsizlikda eng ko'p tarqalgan soxta va xavfli kengaytmalar
DANGEROUS_EXTENSIONS = [".exe.png", ".scr", ".bat.jpg", ".vbs", ".exe"]

def scan_and_destroy():
    print(f"[*] {SCAN_DIRECTORY} papkasi real vaqtda nazorat qilinmoqda...")
    if not os.path.exists(SCAN_DIRECTORY):
        return

    for root, dirs, files in os.walk(SCAN_DIRECTORY):
        for file in files:
            # Fayl nomini va formatini tekshirish
            file_path = os.path.join(root, file)
            lower_file = file.toLowerCase() if hasattr(file, 'toLowerCase') else file.lower()
            
            # Ikki tomonlama kengaytmali viruslarni aniqlash (Masalan: rasm.png.exe)
            is_malicious = any(lower_file.endswith(ext) for ext in DANGEROUS_EXTENSIONS) or (".png.exe" in lower_file)
            
            if is_malicious:
                try:
                    print(f"[🚨 WARNING] Xavfli fayl aniqlandi: {file}")
                    # Haqiqatdan ham o'chirib tashlash (Tizimni tozalash)
                    os.remove(file_path)
                    print(f"[🔥 DESTROYED] Zararli fayl muvaffaqiyatli yo'q qilindi: {file_path}")
                except Exception as e:
                    print(f"[-] Faylni o'chirishda xatolik: {e}")

# 2. NOQONUNIY VA FISHING SAYTLARNI BLOKLASH (DNS/Hosts Filter)
# Windows tizimidagi hosts fayli orqali zararli saytlarni bloklash
HOSTS_PATH = r"C:\Windows\System32\drivers\etc\hosts" if sys.platform == "win32" else "/etc/hosts"
REDIRECT_IP = "127.0.0.1"
# Bloklanishi kerak bo'lgan fishing va firgarlik saytlari bazasi
BLOCKED_SITES = [
    "free-cs2-skins.com",
    "telegram-bonus-free.uz",
    "uz-pay-crypto.ru"
]

def block_malicious_sites():
    try:
        with open(HOSTS_PATH, "r+") as file:
            content = file.read()
            for site in BLOCKED_SITES:
                if site not in content:
                    # Saytni mahalliy IP ga yo'naltirib, bloklab qo'yamiz
                    file.write(f"\n{REDIRECT_IP} {site}")
                    print(f"[🔒 BLOCKED] Fishing sayt tizim darajasida bloklandi: {site}")
    except PermissionError:
        print("[!] Diqqat! Saytlarni bloklash uchun Python dasturini Administrator (Run as Administrator) sifatida ishga tushirish kerak.")

# MAIN LOOP: Dastur orqa fonda tinimsiz ishlab turishi uchun
if __name__ == "__main__":
    block_malicious_sites()
    while True:
        scan_and_destroy()
        time.sleep(5)  # Har 5 soniyada tizimni tekshirib turadi