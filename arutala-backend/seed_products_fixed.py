from sqlmodel import Session, select
from app.db.session import engine
from app.models.product import Product

PRODUCTS = [{'slug': 'discovery-set',
  'name': 'Discovery',
  'family': 'Floral',
  'subtitle': 'The Olfactive Journey | 5 x 2ml Vials + Gift Voucher',
  'description': 'Explore the entire ARUTALA core collection at your own pace. '
                 'This elegant box contains five 2ml glass vials of our '
                 'signature extrait de parfums. As a token of appreciation, '
                 'purchasing this set includes a complimentary voucher worth '
                 'Rp 350.000 towards your first full-size (100ml) bottle '
                 'purchase.',
  'price': 350000,
  'images': {'primary': '/static/images/img_51d58c1e81.jpg',
             'secondary': '/static/images/img_d0b95f35de.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['Rintik', 'Hening'],
            'heart': ['Fajar', 'Senja'],
            'base': ['Kala', 'Voucher Inclusion']},
  'noteDescriptions': {'Rintik': 'The Nostalgia (Petrichor, Green Tea & '
                                 'Jasmine)',
                       'Hening': 'The Solitude (French Lavender, Sandalwood & '
                                 'Cashmere)',
                       'Fajar': 'The Awakening (Kaffir Lime, Crushed Mint & '
                                'Vetiver)',
                       'Senja': 'The Romance (Damascan Rose, Patchouli & '
                                'Vanilla)',
                       'Kala': 'The Mystery (Agarwood, Incense & Black Pepper)',
                       'Voucher Inclusion': 'Includes a redeemable Rp 350.000 '
                                            'digital code for your next '
                                            'full-size purchase.'},
  'volume': '5 x 2ml / 5 x 0.06 FL.OZ',
  'concentration': 'Extrait de Parfum',
  'story': 'For those who wish to experience the poetry of silence before '
           'committing. The Discovery Set is your personal invitation to our '
           'boutique atelier—five chapters of memories waiting to unfold on '
           'your skin. Find your signature, and let the voucher guide your '
           'next step.',
  'isFeatured': False},
 {'slug': 'rintik',
  'name': 'Rintik',
  'family': 'Floral',
  'subtitle': 'The Nostalgia | Petrichor, Green Tea & Jasmine Grandiflorum',
  'description': 'A liquid memory of dry, parched earth instantly refreshed by '
                 'the very first droplets of rain after a long monsoon dry '
                 'season. It unfolds with clean, ozonic mineral notes, '
                 'settling into a comforting heart of warm jasmine and calming '
                 'green tea.',
  'price': 499000,
  'images': {'primary': '/static/images/img_d0b95f35de.jpg',
             'secondary': '/static/images/img_8ecde01242.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['Petrichor', 'Wet Earth', 'Rain Accord'],
            'heart': ['Green Tea', 'Jasmine Grandiflorum', 'Dewy Leaves'],
            'base': ['Clean Musk', 'Soft Woods', 'Mineral Accord']},
  'noteDescriptions': {'Petrichor': 'The legendary, earthy perfume of dry soil '
                                    'reacting to the first droplets of fresh '
                                    'rain.',
                       'Wet Earth': 'Damp, rich, and fertile soil under a '
                                    'cooling downpour, providing deep organic '
                                    'grounding.',
                       'Rain Accord': 'An airy, refreshing ozonic element that '
                                      'mimics the cool breeze preceding a '
                                      'storm.',
                       'Green Tea': 'A clean, herbal, and tranquil tea '
                                    'infusion that introduces serene clarity '
                                    'and freshness.',
                       'Jasmine Grandiflorum': 'Hand-plucked velvety white '
                                               'blossoms offering a sweet, '
                                               'comforting, and warm floral '
                                               'embrace.',
                       'Dewy Leaves': 'Crisp green botanical sap that evokes '
                                      'crushed foliage inside a rain-swept '
                                      'courtyard.',
                       'Clean Musk': 'A soft, skin-hugging musk that recreates '
                                     'the purity of fresh line-dried linen.',
                       'Soft Woods': 'A quiet, comforting blend of cedar and '
                                     'blonde woods that structures the '
                                     'drydown.',
                       'Mineral Accord': 'A modern, stony element that roots '
                                         'the airy rain and sweet floral notes '
                                         'to earth.'},
  'volume': '100ml / 3.4 FL.OZ',
  'concentration': 'Extrait de Parfum',
  'story': 'Capturing the memory of parched earth embraced by the first '
           'rainfall after a long dry season. This fragrance speaks of quiet '
           'nostalgia, of returning home, and the warmth of childhood spent on '
           'the veranda, sipping hot jasmine tea during a breezy, rain-swept '
           'afternoon.',
  'isFeatured': True},
 {'slug': 'hening',
  'name': 'Hening',
  'family': 'Woody',
  'subtitle': 'The Solitude | French Lavender, Sandalwood & Cashmere Wood',
  'description': 'A calming, powdery, and deeply woody sanctuary. Designed as '
                 'a personal cocoon, it opens with soothing aromatic herbs '
                 'before melting into a luxurious, velvety heart of cashmere '
                 'and premium Mysore sandalwood.',
  'price': 499000,
  'images': {'primary': '/static/images/img_51d58c1e81.jpg',
             'secondary': '/static/images/img_2af5af0c1f.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['French Lavender', 'Bergamot', 'Sage'],
            'heart': ['Cashmere Wood', 'White Musk', 'Powdery Iris'],
            'base': ['Mysore Sandalwood', 'Cedarwood', 'Amber']},
  'noteDescriptions': {'French Lavender': 'Soothing and therapeutic botanical '
                                          'lavender with elegant, '
                                          'sweet-herbaceous undertones.',
                       'Bergamot': 'Cold-pressed Calabrian citrus peel that '
                                   'provides a gentle, clean morning light.',
                       'Sage': 'A cleansing, medicinal aromatic herb that '
                               'clears the mind with cool herbal structures.',
                       'Cashmere Wood': 'A velvety, modern synthetic molecule '
                                        'conveying the tactile comfort of '
                                        'premium cashmere.',
                       'White Musk': 'Deeply comforting and soft, wrapping the '
                                     'wearer in a cloud of pristine, peaceful '
                                     'solitude.',
                       'Powdery Iris': 'Sophisticated, cool floral butter that '
                                       'introduces an elegant, classic '
                                       'cosmetic-powdery trail.',
                       'Mysore Sandalwood': 'Ultra-creamy, smooth, and sacred '
                                            'wood offering an eternal, '
                                            'meditative grounding.',
                       'Cedarwood': 'Dry, clean timber from Atlas forests that '
                                    'anchors the soft aromatic heart.',
                       'Amber': 'A rich, sweet balsamic warmth that leaves a '
                                'lingering, secure embrace on bare skin.'},
  'volume': '100ml / 3.4 FL.OZ',
  'concentration': 'Eau de Parfum',
  'story': 'Dedicated to the quiet sanctuary of the third watch of the night. '
           'This is a story about the profound beauty of solitude—a precious '
           "interval where the world's clamor fades away, inviting you to "
           'engage in a honest, undisturbed dialogue with yourself.',
  'isFeatured': True},
 {'slug': 'fajar',
  'name': 'Fajar',
  'family': 'Citrus',
  'subtitle': 'The Awakening | Kaffir Lime, Crushed Mint & Vetiver',
  'description': 'A brilliant explosion of cold morning air and zesty citrus '
                 'energy. This invigorating scent features crushed mint leaves '
                 'and sharp kaffir lime, balanced by clean, smoky vetiver to '
                 'fuel your daily ambitions.',
  'price': 499000,
  'images': {'primary': '/static/images/img_41f6e2a73e.jpg',
             'secondary': '/static/images/img_4d3c8b60de.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['Kaffir Lime', 'Bergamot', 'Grapefruit'],
            'heart': ['Crushed Mint Leaves', 'Eucalyptus', 'Ginger'],
            'base': ['Vetiver', 'Light Musk', 'White Amber']},
  'noteDescriptions': {'Kaffir Lime': 'An exotic, highly aromatic green citrus '
                                      'with zesty, high-vibrational Indonesian '
                                      'rind oils.',
                       'Bergamot': 'Bright, bitter-sweet Italian citrus that '
                                   'opens the blend with radiant optimism.',
                       'Grapefruit': 'A juicy, mouth-watering citrus splash '
                                     'that adds a modern, sporty sharpness.',
                       'Crushed Mint Leaves': 'Crisp, icy green mint providing '
                                              'an instant wave of cooling, '
                                              'focused energy.',
                       'Eucalyptus': 'Camphorous, breezy, and clean, mimicking '
                                     'the refreshing chill of dawn air.',
                       'Ginger': 'A warm, spicy root extract that bridges '
                                 'fresh top notes with earthier woods.',
                       'Vetiver': 'Dry, clean, smoky grass roots that provide '
                                  'an elegant, professional base.',
                       'Light Musk': 'A sheer, transparent musk that holds '
                                     'volatile citruses without clouding their '
                                     'vibrancy.',
                       'White Amber': 'A sparkling, mineral amber base that '
                                      'feels like soft morning sunshine on the '
                                      'skin.'},
  'volume': '100ml / 3.4 FL.OZ',
  'concentration': 'Eau de Parfum',
  'story': 'Capturing the very essence of clean morning air and burning '
           'ambition. This fragrance narrates the vibrant energy of the modern '
           'explorer, ready to conquer the day and chase academic or career '
           'heights with unyielding optimism and head held high.',
  'isFeatured': False},
 {'slug': 'segara',
  'name': 'Segara',
  'family': 'Woody',
  'subtitle': 'The Freedom | Sea Salt, Coastal Sage & Ambergris',
  'description': 'An airy, mineral, and marine-woody exploration of untethered '
                 'freedom. Inspired by remote ocean cliffs, it combines '
                 'refreshing sea salt and coastal sage with the salty, rustic '
                 'depth of driftwood and ambergris.',
  'price': 549000,
  'images': {'primary': '/static/images/img_45d01ec483.jpg',
             'secondary': '/static/images/img_88963aa910.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['Sea Salt', 'Ozone Accord', 'Bergamot'],
            'heart': ['Coastal Sage', 'Myrtle', 'Geranium Leaf'],
            'base': ['Driftwood', 'Ambergris', 'Sea Moss']},
  'noteDescriptions': {'Sea Salt': 'An airy, mineral crystalline note '
                                   'capturing the cooling salt spray of '
                                   'crashing waves.',
                       'Ozone Accord': 'A clean, modern, high-altitude oxygen '
                                       "breeze that opens up the fragrance's "
                                       'sky.',
                       'Bergamot': 'Sparkling, sunny citrus that introduces a '
                                   'bright Mediterranean warmth.',
                       'Coastal Sage': 'Aromatic, herbaceous, and wild, '
                                       'evoking clifftop shrubs overlooking a '
                                       'deep blue ocean.',
                       'Myrtle': 'Sweet, green, and balsamic botanical oils '
                                 'that add deep historical character.',
                       'Geranium Leaf': 'Minty, rosy green leaf notes that add '
                                        'structural, clean-cut definition.',
                       'Driftwood': 'Salty, sun-bleached wood cured by sea '
                                    'waters, giving a rustic and raw timber '
                                    'base.',
                       'Ambergris': 'A highly precious, warm, and salty marine '
                                    "mineral accord that mirrors the ocean's "
                                    'depth.',
                       'Sea Moss': 'A salty, deep-sea green lichen that '
                                   'grounds the marine drydown with organic '
                                   'longevity.'},
  'volume': '100ml / 3.4 FL.OZ',
  'concentration': 'Eau de Parfum',
  'story': "An anthem of absolute, boundless freedom. Inspired by Indonesia's "
           'hidden coastal cliffs where crashing waves hit rugged rocks, '
           'releasing a wave of relief that dissolves all weariness and sparks '
           'the untamed, adventurous spirit within.',
  'isFeatured': False},
 {'slug': 'swarna',
  'name': 'Swarna',
  'family': 'Woody',
  'subtitle': 'The Romance | Mandarin, Benzoin & Warm Amber',
  'description': 'A rich, comforting, and sweet resinous masterwork inspired '
                 'by the golden hour. It wraps juicy mandarin orange and spicy '
                 'cinnamon inside a deeply warm, comforting cocoon of benzoin '
                 'resin and Madagascan vanilla.',
  'price': 549000,
  'images': {'primary': '/static/images/img_614d83493f.jpg',
             'secondary': '/static/images/img_d74b8a8cea.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['Mandarin Orange', 'Pink Pepper', 'Bergamot'],
            'heart': ['Benzoin', 'Cinnamon Bark', 'Honeyed Rose'],
            'base': ['Warm Amber', 'Madagascan Vanilla', 'Patchouli']},
  'noteDescriptions': {'Mandarin Orange': 'Sweet, sunny, and juicy citrus that '
                                          'captures the romantic blush of '
                                          'sunset skies.',
                       'Pink Pepper': 'A vibrant, spicy-rosy note that adds a '
                                      'sparkling, flirtatious warmth to the '
                                      'open.',
                       'Bergamot': 'Calabrian citrus that provides a '
                                   'sophisticated, bright light to the heavy '
                                   'resins.',
                       'Benzoin': 'A sweet, balsamic golden resin that smells '
                                  'of vanilla, warm honey, and toasted '
                                  'almonds.',
                       'Cinnamon Bark': 'A comforting, dry exotic spice that '
                                        'brings a warm, cozy touch to the '
                                        'heart.',
                       'Honeyed Rose': 'A soft, velvet rose absolute that '
                                       'blossoms gently inside the balsamic '
                                       'resins.',
                       'Warm Amber': 'A deep, rich, fossilized resin accord '
                                     'radiating a secure, skin-like heat.',
                       'Madagascan Vanilla': 'Dark, authentic vanilla bean '
                                             'absolute revealing deep woody '
                                             'sweetness.',
                       'Patchouli': 'Earthy, wet-wood fractions that anchor '
                                    'the sweet amber with modern '
                                    'sophistication.'},
  'volume': '100ml / 3.4 FL.OZ',
  'concentration': 'Eau de Parfum',
  'story': 'Inspired by the magic of Golden Hour—the breathtaking transition '
           'as the sun sets and the sky blushes orange. This fragrance is a '
           'narrative of intimate embraces, mature romance, and the profound '
           'safety found in being near the one who truly knows you.',
  'isFeatured': True},
 {'slug': 'aksara',
  'name': 'Aksara',
  'family': 'Woody',
  'subtitle': 'The Intellect | Tobacco Leaf, Old Paper & Cedarwood',
  'description': 'An intellectual, rich, and dry woody-leather scent. '
                 'Reminiscent of a quiet heritage library, it centers sweet '
                 'tobacco leaves and dry cedarwood, layered with a nostalgic, '
                 'comforting old paper accord and warm spices.',
  'price': 599000,
  'images': {'primary': '/static/images/img_d0b95f35de.jpg',
             'secondary': '/static/images/img_17646e9bbe.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['Saffron', 'Cardamom', 'Black Pepper'],
            'heart': ['Tobacco Leaf', 'Old Paper Accord', 'Clove Bud'],
            'base': ['Cedarwood', 'Tonka Bean', 'Smoked Vetiver']},
  'noteDescriptions': {'Saffron': 'A precious, warm, and bittersweet spice '
                                  'with rich leather and straw undertones.',
                       'Cardamom': 'Cold-spicy, aromatic, and slightly sweet, '
                                   'introducing an intellectual, noble '
                                   'opening.',
                       'Black Pepper': 'A vibrant, dry spice that introduces '
                                       'sharpness, depth, and a touch of '
                                       'intrigue.',
                       'Tobacco Leaf': 'Rich, sweet, and leafy tobacco with '
                                       'warm honey and hay-like nuances.',
                       'Old Paper Accord': 'A comforting, nostalgic smell of '
                                           'aged parchment, cellulose, and '
                                           'vanilla-like wood.',
                       'Clove Bud': 'Warm, fiery spice that provides a '
                                    'vintage, sophisticated sting to the '
                                    'heart.',
                       'Cedarwood': 'Dry, clean timber representing sturdy '
                                    'bookshelves and old study chambers.',
                       'Tonka Bean': 'A sweet, powdery bean absolute '
                                     'reminiscent of almond, vanilla, and warm '
                                     'hay.',
                       'Smoked Vetiver': 'A dry, smoky root oil that lends a '
                                         'deep, thoughtful shadow to the '
                                         'base.'},
  'volume': '100ml / 3.4 FL.OZ',
  'concentration': 'Eau de Parfum',
  'story': 'Evoking the serene ambiance of an ancient, leather-bound archive '
           'or a quiet study. This scent narrates the depth of contemplation, '
           'mature emotions, great ideas penned down, and the effortless '
           'charisma of an intellectual mind.',
  'isFeatured': False},
 {'slug': 'puspa',
  'name': 'Puspa',
  'family': 'Floral',
  'subtitle': 'The Mystique | Sedap Malam (Tuberose), Dark Rose & Patchouli',
  'description': 'An opulent, mysterious, and carnal white floral scent '
                 'celebrating the magical night-blooming flowers of Indonesia. '
                 'Heavy, hand-harvested tuberose and rich, dark roses are '
                 'grounded by a deep patchouli and black musk foundation.',
  'price': 599000,
  'images': {'primary': '/static/images/img_8ecde01242.jpg',
             'secondary': '/static/images/img_02d27ccb97.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['Green Ivy', 'Ylang-Ylang', 'Clove Bud'],
            'heart': ['Sedap Malam (Tuberose)', 'Dark Rose', 'Night Jasmine'],
            'base': ['Patchouli', 'Sandalwood', 'Black Musk']},
  'noteDescriptions': {'Green Ivy': 'A bitter-green, botanical open resembling '
                                    'pushing through wet vines at dusk.',
                       'Ylang-Ylang': 'Rich, exotic, and banana-sweet tropical '
                                      'blossom that sets a magnetic tone.',
                       'Clove Bud': 'A tiny, spicy-warm bud that adds a '
                                    'mysterious, hypnotic touch to the open.',
                       'Sedap Malam (Tuberose)': 'An opulent, hand-harvested '
                                                 'nocturnal floral absolute, '
                                                 'creamy, buttery, and '
                                                 'hypnotic.',
                       'Dark Rose': 'Velvety, dark Damascus rose absolute, '
                                    'bringing a deep, romantic mystery.',
                       'Night Jasmine': 'Indolic, lush night-blooming jasmine '
                                        'that adds sensual depth to the heart.',
                       'Patchouli': 'Earthy, damp herbal root oil that anchors '
                                    'the exotic floral bouquet with '
                                    'sophisticated soil notes.',
                       'Sandalwood': 'Creamy, smooth, and grounding wood that '
                                     'matches the rich, buttery flowers.',
                       'Black Musk': 'A dark, skin-hugging musk that provides '
                                     'an unforgettable, magnetic trail.'},
  'volume': '100ml / 3.4 FL.OZ',
  'concentration': 'Extrait de Parfum',
  'story': 'A tribute to the nocturnal exotics of Indonesian '
           'blossoms—magical, elegant, and deeply alluring. This fragrance '
           'weaves a tale of enigmatic charm, sophisticated grace, and the '
           'courageous spirit that dares to stand out in a crowded room.',
  'isFeatured': False},
 {'slug': 'rempah',
  'name': 'Rempah',
  'family': 'Woody',
  'subtitle': 'The Heritage | Cinnamon, Nutmeg & Dark Chocolate Accord',
  'description': 'A decadent, warm-spicy, and exotic gourmand masterpiece. '
                 'This fragrance traces the historic spice trade routes of '
                 'Indonesia, pairing premium cinnamon, nutmeg, and cardamom '
                 'with a rich, bittersweet dark chocolate base.',
  'price': 599000,
  'images': {'primary': '/static/images/img_cc9e14c4ae.jpg',
             'secondary': '/static/images/img_a34726fe92.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['Cardamom', 'Nutmeg', 'Clove Bud'],
            'heart': ['Cinnamon Bark', 'Star Anise', 'Ginger'],
            'base': ['Dark Chocolate', 'Patchouli', 'Sandalwood']},
  'noteDescriptions': {'Cardamom': 'Cold-spicy, sweet, and aromatic; a noble '
                                   'opening representing ancient trade.',
                       'Nutmeg': 'Warm, dry, woody spice that bridges top '
                                 'notes with exotic gourmand elements.',
                       'Clove Bud': 'A highly aromatic spice with historical '
                                    'significance, hot and warm-spicy.',
                       'Cinnamon Bark': 'A sweet, woody, exotic spice bringing '
                                        'comforting richness to the heart.',
                       'Star Anise': 'A sweet, licorice-like herbal spice that '
                                     'adds distinct oriental structure.',
                       'Ginger': 'Zesty, hot spice root adding a sparkling, '
                                 'high-end culinary touch.',
                       'Dark Chocolate': 'A rich, bitter-sweet cacao absolute, '
                                         'adding an exotic, decadent finish.',
                       'Patchouli': 'Damp, rich earth fractions that recall '
                                    'the tropical landscapes of origin.',
                       'Sandalwood': 'Creamy, smooth, comforting wood that '
                                     'balances the spicy and gourmand notes.'},
  'volume': '100ml / 3.4 FL.OZ',
  'concentration': 'Eau de Parfum',
  'story': 'A nostalgic journey through the luxurious spice routes of '
           'Indonesia, once sought after by empires. It tells a story of a '
           'powerful lineage, indomitable resilience, and a deep-seated pride '
           'in ancestral roots, modernised in an ultra-premium, contemporary '
           'blend.',
  'isFeatured': False},
 {'slug': 'amerta',
  'name': 'Amerta',
  'family': 'Floral',
  'subtitle': 'The Legacy | Saffron, Egyptian Jasmine & Amberwood',
  'description': 'A signature extrait of unparalleled projection and luxury. '
                 "Meaning 'eternal' or 'immortal', it layers warm, radiant "
                 'saffron and opulent Egyptian jasmine over a sparkling '
                 'amberwood and earthy oakmoss sillage.',
  'price': 599000,
  'images': {'primary': '/static/images/img_15a538625b.jpg',
             'secondary': '/static/images/img_2af5af0c1f.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['Saffron', 'Bitter Almond', 'Bergamot'],
            'heart': ['Egyptian Jasmine', 'Cedarwood', 'Mineral Accord'],
            'base': ['Amberwood', 'Oakmoss', 'White Musk']},
  'noteDescriptions': {'Saffron': 'Intensely warm, metallic-sweet spice that '
                                  'creates an ultra-luxury, radiant opening.',
                       'Bitter Almond': 'A nutty, cherry-like opening facet '
                                        'that adds a sophisticated gourmand '
                                        'bite.',
                       'Bergamot': 'Cold Calabrian citrus that lifts the '
                                   'heavy, radiant saffron with a sparkling '
                                   'touch.',
                       'Egyptian Jasmine': 'Sweet, rich, and honeyed white '
                                           'floral notes harvested at peak '
                                           'potency.',
                       'Cedarwood': 'Dry, clean, structural wood that adds '
                                    'stability to the radiant heart.',
                       'Mineral Accord': 'A modern, salty-ozone mineral '
                                         'texture that provides a glowing '
                                         'weightlessness.',
                       'Amberwood': 'A highly radiant, sweet-mineral woody '
                                    'amber with unmatched projection.',
                       'Oakmoss': 'Earthy, wet forest lichen that adds depth, '
                                  'anchoring the perfume for extreme '
                                  'longevity.',
                       'White Musk': 'A clean, velvety, long-lasting skin-hug '
                                     'that forms a luxurious, soft sillage.'},
  'volume': '100ml / 3.4 FL.OZ',
  'concentration': 'Extrait de Parfum',
  'story': "Derived from the ancient word for 'immortality'. Amerta is our "
           'signature extrait, telling the story of an unforgettable trace. '
           'Its formula is meticulously crafted so that when the wearer '
           'departs, their presence lingers in the air—an everlasting symbol '
           'of success, legacy, and timeless influence.',
  'isFeatured': False},
 {'slug': 'kala',
  'name': 'Kala',
  'family': 'Woody',
  'subtitle': 'The Time | Agarwood, Incense & Black Pepper',
  'description': 'A deep, mysterious, and timeless blend of precious agarwood '
                 'and smoldering incense, capturing the essence of time '
                 'itself.',
  'price': 699000,
  'images': {'primary': '/static/images/img_45d01ec483.jpg',
             'secondary': '/static/images/img_d0b95f35de.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['Black Pepper', 'Bergamot', 'Cardamom'],
            'heart': ['Incense', 'Leather', 'Rosewood'],
            'base': ['Agarwood (Oud)', 'Amber', 'Patchouli']},
  'noteDescriptions': {'Black Pepper': 'Sharp, spicy opening.',
                       'Bergamot': 'Bright citrus lift.',
                       'Cardamom': 'Warm aromatic spice.',
                       'Incense': 'Smoky, mystical resin.',
                       'Leather': 'Rich, dark, and textured.',
                       'Rosewood': 'Sweet, woody depth.',
                       'Agarwood (Oud)': 'Precious, dark, and complex.',
                       'Amber': 'Warm, golden resin.',
                       'Patchouli': 'Earthy and grounding.'},
  'volume': '100ml / 3.4 FL.OZ',
  'concentration': 'Extrait de Parfum',
  'story': 'Kala represents the unstoppable passage of time. A fragrance that '
           'honors the ancient rituals of incense burning and the timeless '
           'elegance of agarwood.',
  'isFeatured': False},
 {'slug': 'senja',
  'name': 'Senja',
  'family': 'Floral',
  'subtitle': 'The Dusk | Damascan Rose, Patchouli & Vanilla',
  'description': 'A romantic and poetic fragrance that captures the '
                 'breathtaking beauty of the sunset. A warm blend of rich '
                 'rose, earthy patchouli, and sweet vanilla.',
  'price': 599000,
  'images': {'primary': '/static/images/img_614d83493f.jpg',
             'secondary': '/static/images/img_2af5af0c1f.jpg',
             'tertiary': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=1000',
             'scent': 'https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=800&h=1000',
             'ambience': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200'},
  'notes': {'top': ['Pink Pepper', 'Mandarin', 'Plum'],
            'heart': ['Damascan Rose', 'Jasmine', 'Ylang-Ylang'],
            'base': ['Patchouli', 'Vanilla', 'White Musk']},
  'noteDescriptions': {'Pink Pepper': 'Rosy spice.',
                       'Mandarin': 'Sweet twilight citrus.',
                       'Plum': 'Dark, juicy fruit.',
                       'Damascan Rose': 'Rich, romantic floral.',
                       'Jasmine': 'Sensual white flower.',
                       'Ylang-Ylang': 'Exotic sweetness.',
                       'Patchouli': 'Deep earthy twilight.',
                       'Vanilla': 'Warm, comforting dusk.',
                       'White Musk': 'Soft fading light.'},
  'volume': '100ml / 3.4 FL.OZ',
  'concentration': 'Eau de Parfum',
  'story': 'Senja captures the golden hour where day turns into night. It is a '
           'romantic tribute to the Indonesian dusk, wrapping you in the '
           'warmth of a setting sun.',
  'isFeatured': False}]

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
        print(f"[OK] Products seeded. Added: {added}, Updated: {updated}, Total in DB: {len(total)}")
        for p in total:
            feat = " [FEATURED]" if p.isFeatured else ""
            print(f"  - {p.slug}: {p.name} ({p.family}) Rp {p.price:,}{feat}")

if __name__ == "__main__":
    seed()
