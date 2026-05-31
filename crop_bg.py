from PIL import Image

def remove_fake_transparency_and_crop(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()

    new_data = []
    for item in data:
        r, g, b, a = item
        # Remove fake checkerboard: light gray/white pixels
        if r > 200 and g > 200 and b > 200 and (max(r,g,b) - min(r,g,b)) < 25:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    
    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        # Crop to the bounding box
        img = img.crop(bbox)
        
    img.save(out_path, "PNG")
    print(f"Saved cleaned and cropped image to {out_path}")

remove_fake_transparency_and_crop(
    "c:/Projects/Akalmatika/akalmatika-core-trace/public/Akalmatika_LogoUtama_Horizontal_Terang_fix.png",
    "c:/Projects/Akalmatika/akalmatika-core-trace/public/Akalmatika_LogoUtama_Horizontal_Terang_fix_clean.png"
)
