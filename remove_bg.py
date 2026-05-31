from PIL import Image

def remove_fake_transparency(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()

    new_data = []
    for item in data:
        r, g, b, a = item
        # If the pixel is very light (R, G, B all > 220), make it transparent.
        # Fake checkerboard usually uses colors like (255,255,255) and (230,230,230) or (204,204,204).
        # We can also check if it's grayish by checking if max(r,g,b) - min(r,g,b) < 30.
        if r > 200 and g > 200 and b > 200 and (max(r,g,b) - min(r,g,b)) < 25:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(out_path, "PNG")
    print(f"Saved cleaned image to {out_path}")

remove_fake_transparency(
    "c:/Projects/Akalmatika/akalmatika-core-trace/public/Akalmatika_LogoUtama_Horizontal_Terang_fix.png",
    "c:/Projects/Akalmatika/akalmatika-core-trace/public/Akalmatika_LogoUtama_Horizontal_Terang_fix_clean.png"
)
