import json
import base64
import os
import re

# We'll read seed_products.py as a text file, extract the Base64 strings, save them as JPGs, 
# and replace them with /static/images/... paths.

def extract_and_save():
    os.makedirs("static/images", exist_ok=True)
    
    with open("seed_products.py", "r", encoding="utf-8") as f:
        content = f.read()
        
    # We will regex find all 'data:image/jpeg;base64,...' strings
    
    def replacer(match):
        base64_str = match.group(1)
        # generate a somewhat unique name using hash of base64
        import hashlib
        h = hashlib.md5(base64_str.encode()).hexdigest()[:10]
        filename = f"img_{h}.jpg"
        filepath = os.path.join("static", "images", filename)
        
        # save file
        try:
            with open(filepath, "wb") as img_file:
                img_file.write(base64.b64decode(base64_str))
            print(f"Saved {filepath}")
        except Exception as e:
            print("Failed to save", e)
            
        return f"'/static/images/{filename}'"
    
    new_content = re.sub(r"'data:image/[^;]+;base64,([^']+)'", replacer, content)
    new_content = re.sub(r'"data:image/[^;]+;base64,([^"]+)"', replacer, new_content)
    
    with open("seed_products.py", "w", encoding="utf-8") as f:
        f.write(new_content)

if __name__ == "__main__":
    extract_and_save()
