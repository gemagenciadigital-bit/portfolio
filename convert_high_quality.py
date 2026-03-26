import os
from PIL import Image

def convert_png_to_webp(src_dir, dest_dir):
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        
    files = [f for f in os.listdir(src_dir) if f.endswith('.png')]
    count = 0
    for filename in files:
        png_path = os.path.join(src_dir, filename)
        webp_filename = filename.replace('.png', '.webp')
        webp_path = os.path.join(dest_dir, webp_filename)
        
        try:
            with Image.open(png_path) as img:
                # Using 98 quality for ultra-sharp UI elements
                img.save(webp_path, 'webp', quality=98, method=6)
            os.remove(png_path)
            count += 1
            if count % 10 == 0:
                print(f"Converted {count}/{len(files)}: {filename} -> {webp_filename}")
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")
            
    print(f"Finished! Total {count} images converted with Ultra Quality (98).")

if __name__ == "__main__":
    src = r"c:\Users\Eze\Desktop\sequence\public\sequence\gifHeroPNG"
    dest = r"c:\Users\Eze\Desktop\sequence\public\sequence\gifHero"
    convert_png_to_webp(src, dest)
