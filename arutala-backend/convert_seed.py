import json
import base64
import urllib.request
from io import BytesIO
from PIL import Image

def get_base64(url):
    if not url.startswith("http"):
        return url
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            img_data = response.read()
        
        # Compress image
        img = Image.open(BytesIO(img_data))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        img.thumbnail((400, 400))
        buffer = BytesIO()
        img.save(buffer, format="JPEG", quality=40)
        encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
        return f"data:image/jpeg;base64,{encoded}"
    except Exception as e:
        print(f"Failed to fetch/compress {url}: {e}")
        return url

# We'll read seed_products.py as a text file, execute it to get the PRODUCTS list, 
# modify the dictionaries, and write back the PRODUCTS list.

import importlib.util
spec = importlib.util.spec_from_file_location("seed_products", "seed_products.py")
seed_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(seed_module)

products = seed_module.PRODUCTS

for p in products:
    if 'images' in p:
        if 'primary' in p['images']:
            print(f"Converting primary for {p['slug']}...")
            p['images']['primary'] = get_base64(p['images']['primary'])
        if 'secondary' in p['images']:
            print(f"Converting secondary for {p['slug']}...")
            p['images']['secondary'] = get_base64(p['images']['secondary'])

# Now we rewrite seed_products.py
with open("seed_products.py", "r", encoding="utf-8") as f:
    original_content = f.read()

# We need to replace the `PRODUCTS = [...]` part.
# Since it's a bit hard to inject python code safely, let's just dump the JSON and format it.
products_json = json.dumps(products, indent=4)
new_code = f"""\"\"\"
Seed all products from the frontend data into the database.
Run: venv\\Scripts\\python seed_products.py
\"\"\"
from sqlmodel import SQLModel, Session, select
from app.db.session import engine
from app.models.product import Product
import json

PRODUCTS = json.loads(r'''{products_json}''')

def seed():
    with Session(engine) as session:
        added = 0
        updated = 0
        for p_data in PRODUCTS:
            existing_product = session.exec(select(Product).where(Product.slug == p_data["slug"])).first()
            if existing_product:
                for key, value in p_data.items():
                    setattr(existing_product, key, value)
                session.add(existing_product)
                updated += 1
            else:
                product = Product(**p_data)
                session.add(product)
                added += 1
        
        session.commit()
        
        total = session.exec(select(Product)).all()
        print(f"[OK] Products seeded. Added: {{added}}, Updated: {{updated}}, Total in DB: {{len(total)}}")
        for p in total:
            feat = " [FEATURED]" if p.isFeatured else ""
            print(f"  - {{p.slug}}: {{p.name}} ({{p.family}}) Rp {{p.price:,}}{{feat}}")

if __name__ == "__main__":
    seed()
"""

with open("seed_products.py", "w", encoding="utf-8") as f:
    f.write(new_code)
print("Finished converting to base64!")
