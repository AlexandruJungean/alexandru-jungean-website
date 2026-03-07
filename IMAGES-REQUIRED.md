# Images Required - Complete Reference

---

## 1. Existing Images to Update

These images already exist on the site but should be replaced with better versions to reflect current project state.

| Current Image | Path | Problem | Recommended Replacement |
|--------------|------|---------|------------------------|
| `Oradea-Experience.webp` | `images/` | Shows only Oradea, doesn't reflect the City Xperience franchise rebrand (2 cities) | Side-by-side screenshot of oradeaexperience.ro + clujxperience.ro, or a composite showing both brands |
| `Oradea-Experience2.webp` | `images/` | Hero mockup shows only the old single-city version | Device mockup showing both websites + City Xperience mobile app (laptop + 2 phones) |
| `project-4_1project-4.webp` | `images/` | BDD Logspeed hero - generic laptop wireframe stock photo, not a real screenshot | Real screenshot of bddlogspeed.ro in a laptop mockup frame |
| `Thumbnail---Oradea-Experience.webp` | `images/` | Small thumbnail still says "Oradea Experience" only | New thumbnail reflecting City Xperience brand with both city logos or both websites |

### Optional updates (nice to have)

| Current Image | Path | Improvement |
|--------------|------|-------------|
| `Thumbnail---BDD-Logspeed.webp` | `images/` | Could be refreshed with an actual screenshot of bddlogspeed.ro |
| `ardt-design.webp` | `images/` | Consider updating with a collage of all logos created (NGE, Aleu, TALOS, ATT) to reflect 5 years of work |

---

## 2. New Images Required

For each new project added to the site, you need **3 image types**. Below is the complete list.

### Image Types Explained

| Type | Used Where | Dimensions | srcset Variants |
|------|-----------|-----------|-----------------|
| **Listing image** | `projects.html` card | ~2400x1600 | `-p-500`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000` |
| **Hero mockup** | Project detail page (top) | ~2300x1500 | `-p-500`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000` |
| **Thumbnail** | "Similar Projects" cards on other pages | 1200x800 | None (single size) |

### srcset File Naming Pattern

For each main image, generate these width variants in WebP format:

```
ImageName.webp          -> original full-size
ImageName-p-2000.webp   -> 2000px width
ImageName-p-1600.webp   -> 1600px width
ImageName-p-1080.webp   -> 1080px width
ImageName-p-800.webp    -> 800px width
ImageName-p-500.webp    -> 500px width
```

All files go in `images/` folder at the project root.

---

### Project: Primaria Municipiului Salonta

| File | Type | Content Recommendation |
|------|------|----------------------|
| `Primaria-Salonta.webp` | Listing | Full desktop screenshot of salonta.net homepage. Show the hero section with search, mega nav, and first content sections. |
| `Primaria-Salonta-Mockup.webp` | Hero mockup | Laptop device frame with salonta.net displayed. Optionally include a tablet showing the admin panel or a different page. |
| `Thumbnail---Primaria-Salonta.webp` | Thumbnail | Cropped/zoomed version of the homepage screenshot. Focus on the hero area or the trilingual nav. |

**srcset files needed (12 total):**
- `Primaria-Salonta-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `Primaria-Salonta-Mockup-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `Thumbnail---Primaria-Salonta.webp` (single file, no variants)

**Screenshot URL:** https://nou.salonta.net

---

### Project: FleetKeeper

| File | Type | Content Recommendation |
|------|------|----------------------|
| `FleetKeeper.webp` | Listing | Composite: phone mockup showing the app dashboard (with color-coded status cards) + laptop showing fleetkeeper.app website side by side. |
| `FleetKeeper-Mockup.webp` | Hero mockup | Larger version of the same composition. Focus on the app's dashboard with the green/amber/orange/red status indicators. |
| `Thumbnail---FleetKeeper.webp` | Thumbnail | Phone-only mockup showing the app dashboard, or a tight crop of the website hero. |

**srcset files needed (12 total):**
- `FleetKeeper-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `FleetKeeper-Mockup-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `Thumbnail---FleetKeeper.webp` (single file)

**Screenshot URLs:** https://fleetkeeper.app + app screenshots from device/emulator

---

### Project: Radical Football

| File | Type | Content Recommendation |
|------|------|----------------------|
| `Radical-Football.webp` | Listing | Full desktop screenshot of radicalfootball.ro homepage. Show the conference section, speaker grid, or the hero with the mission statement. |
| `Radical-Football-Mockup.webp` | Hero mockup | Laptop frame with radicalfootball.ro. Optionally include a second screen showing the admin dashboard or the Konva diagram builder. |
| `Thumbnail---Radical-Football.webp` | Thumbnail | Cropped hero section or the conference/speakers area. |

**srcset files needed (12 total):**
- `Radical-Football-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `Radical-Football-Mockup-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `Thumbnail---Radical-Football.webp` (single file)

**Screenshot URL:** https://radicalfootball.ro

---

### Project: Amidamaru

| File | Type | Content Recommendation |
|------|------|----------------------|
| `Amidamaru.webp` | Listing | Full desktop screenshot of amidamaru.ro. The dark hero with truck image, red accents, and "Request Quote" CTA is visually strong. |
| `Amidamaru-Mockup.webp` | Hero mockup | Laptop frame with amidamaru.ro homepage. Include the language switcher (9 flags) visible if possible to emphasize multilingual support. |
| `Thumbnail---Amidamaru.webp` | Thumbnail | Cropped hero section showing the truck, company name, and CTA buttons. |

**srcset files needed (12 total):**
- `Amidamaru-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `Amidamaru-Mockup-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `Thumbnail---Amidamaru.webp` (single file)

**Screenshot URL:** https://amidamaru.ro

---

### Project: Service 24 BDD

| File | Type | Content Recommendation |
|------|------|----------------------|
| `Service-24-BDD.webp` | Listing | Full desktop screenshot of the homepage. The dark hero with teal/orange accents and "Get a Quote" + "Call Now" buttons is eye-catching. |
| `Service-24-BDD-Mockup.webp` | Hero mockup | Laptop frame showing the homepage. Optionally include a phone showing the mobile view (to highlight the device-aware call feature). |
| `Thumbnail---Service-24-BDD.webp` | Thumbnail | Cropped hero or the services grid section. |

**srcset files needed (12 total):**
- `Service-24-BDD-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `Service-24-BDD-Mockup-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `Thumbnail---Service-24-BDD.webp` (single file)

**Screenshot URL:** https://service24bdd.netlify.app

---

### Project: Nuestra

| File | Type | Content Recommendation |
|------|------|----------------------|
| `Nuestra.webp` | Listing | Split-screen composite: left half shows the dark streetwear homepage ("The Street is Ours"), right half shows the light sport homepage ("The Game is Ours"). This dual-brand split is the visual hook. |
| `Nuestra-Mockup.webp` | Hero mockup | Two laptops or one laptop + one tablet, each showing a different brand theme. Or a single wide screenshot with a diagonal split between the two themes. |
| `Thumbnail---Nuestra.webp` | Thumbnail | Smaller version of the split-screen composite. Focus on the contrast between dark and light themes. |

**srcset files needed (12 total):**
- `Nuestra-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `Nuestra-Mockup-p-500.webp`, `-p-800`, `-p-1080`, `-p-1600`, `-p-2000`
- `Thumbnail---Nuestra.webp` (single file)

**Screenshot URL:** https://nuestra-shop.netlify.app + /sport section

---

### City Xperience Franchise Logo (additional)

| File | Type | Content Recommendation |
|------|------|----------------------|
| `cluj-xperience.webp` | Logo | Cluj Xperience logo. ADDED. |
| `oradea-xperience.webp` | Logo | Oradea Xperience logo (replaces old Oradea-Experience-logo.webp). ADDED. |
| `xperience.webp` | Logo | City Xperience umbrella brand logo. ADDED. |

**Path:** `images/clients/`
**All three logos added with srcset variants (-p-500, -p-800).**

---

## 3. Summary Checklist

### New files to create (total: 73 files)

**Per project (x6 projects = 66 files):**
- [ ] Listing image + 5 srcset variants = 6 files
- [ ] Hero mockup + 5 srcset variants = 6 files
- [ ] Thumbnail = 1 file
- **Subtotal per project: 13 files**

**Additional:**
- [ ] `images/clients/Cluj-Xperience-logo.webp` (1 file)

**Existing images to replace (6 files + their srcset variants):**
- [ ] `Oradea-Experience.webp` + srcset variants
- [ ] `Oradea-Experience2.webp` + srcset variants
- [ ] `project-4_1project-4.webp` (no srcset needed, single file)
- [ ] `Thumbnail---Oradea-Experience.webp` (single file)

### How to generate srcset variants efficiently

**Option A: Using Sharp (Node.js script)**
```javascript
const sharp = require('sharp');
const sizes = [500, 800, 1080, 1600, 2000];

async function generateVariants(inputPath, baseName) {
  for (const width of sizes) {
    await sharp(inputPath)
      .resize(width)
      .webp({ quality: 80 })
      .toFile(`images/${baseName}-p-${width}.webp`);
  }
  // Copy original as the base file
  await sharp(inputPath)
    .webp({ quality: 85 })
    .toFile(`images/${baseName}.webp`);
}

// Usage:
// generateVariants('screenshots/primaria-salonta-full.png', 'Primaria-Salonta');
// generateVariants('screenshots/primaria-salonta-mockup.png', 'Primaria-Salonta-Mockup');
```

**Option B: Using Squoosh CLI**
```bash
npx @squoosh/cli --webp '{"quality":80}' --resize '{"width":500}' -d images/ -s "-p-500" input.png
npx @squoosh/cli --webp '{"quality":80}' --resize '{"width":800}' -d images/ -s "-p-800" input.png
npx @squoosh/cli --webp '{"quality":80}' --resize '{"width":1080}' -d images/ -s "-p-1080" input.png
npx @squoosh/cli --webp '{"quality":80}' --resize '{"width":1600}' -d images/ -s "-p-1600" input.png
npx @squoosh/cli --webp '{"quality":80}' --resize '{"width":2000}' -d images/ -s "-p-2000" input.png
```

**Option C: Using Figma/Canva**
Export at each width manually. Most tedious but works if you're designing mockups there anyway.

### Recommended mockup tools
- **Shots.so** - Free device mockups (laptops, phones), drag-and-drop screenshots
- **Smartmockups.com** - Free tier with many device templates
- **Figma + Device Mockup plugins** - If you already use Figma
- **Screenshots:** Use browser at 1440px or 1920px width, full page capture with DevTools (Ctrl+Shift+P -> "Capture full size screenshot")
