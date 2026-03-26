import os
from PIL import Image

def convert_png_to_webp(directory):
    files = [f for f in os.listdir(directory) if f.endswith('.png')]
    count = 0
    for filename in files:
        png_path = os.path.join(directory, filename)
        webp_filename = filename.replace('.png', '.webp')
        webp_path = os.path.join(directory, webp_filename)
        
        try:
            with Image.open(png_path) as img:
                img.save(webp_path, 'webp', quality=80)
            os.remove(png_path)
            count += 1
            if count % 10 == 0:
                print(f"Converted {count}/{len(files)}: {filename} -> {webp_filename}")
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")
            
    print(f"Finished! Total {count} images converted and originals deleted.")

if __name__ == "__main__":
    target_dir = r"c:\Users\Eze\Desktop\sequence\public\sequence\gifHero"
    convert_png_to_webp(target_dir)
