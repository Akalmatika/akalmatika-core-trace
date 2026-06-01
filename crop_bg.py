from PIL import Image

def remove_background_and_crop(img_path, out_path, tolerance=30):
    img = Image.open(img_path).convert("RGBA")
    
    # Get the background color from the top-left corner (0, 0)
    bg_color = img.getpixel((0, 0))
    r_bg, g_bg, b_bg = bg_color[:3]
    print(f"Detected background color: {r_bg, g_bg, b_bg}")
    
    # Also handle pure white/light gray background if corner is transparent
    # but the image has a fake transparency checkerboard or similar.
    # In this case, we inspect the corner. If the corner is already transparent,
    # we can use a default color or just skip.
    
    data = img.getdata()
    new_data = []
    
    for item in data:
        r, g, b, a = item
        # If the pixel is close to the background color, make it transparent
        if abs(r - r_bg) <= tolerance and abs(g - g_bg) <= tolerance and abs(b - b_bg) <= tolerance:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(out_path, "PNG")
    print(f"Saved cleaned and cropped image to {out_path}")

remove_background_and_crop(
    "c:/Projects/Akalmatika/akalmatika-core-trace/public/Akalmatika_LogoSekunder_Gelap.png",
    "c:/Projects/Akalmatika/akalmatika-core-trace/public/Akalmatika_LogoSekunder_Gelap_clean.png"
)
