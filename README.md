# Web ČSOP Nasavrky

Statický web v [Astru](https://astro.build), hostovaný na Cloudflare Pages.
Obsah (akce, aktuality, galerie) se edituje přes [Sveltia CMS](https://github.com/sveltia/sveltia-cms) na `/admin` –
každá úprava je commit do GitHubu a Cloudflare Pages web sám sestaví a nasadí (~1–2 min).

## Vývoj

```bash
npm install
npm run dev        # http://localhost:4321  (koncepty jsou v dev režimu vidět)
npm run build      # výstup do dist/
npm run preview    # build + lokální Cloudflare Pages (wrangler pages dev)
```

Lokálně lze CMS používat i bez přihlášení: `npm run dev`, otevřít http://localhost:4321/admin/
v Chrome/Edge a zvolit „Work with Local Repository“ (pracuje přímo se soubory na disku).

## Struktura

| Kde | Co |
|---|---|
| `src/content/akce/` | akce (kalendář) – proběhlé se samy přesunou do archivu, web se přestavuje každou noc |
| `src/content/aktuality/` | novinky, mohou mít připojené album z galerie |
| `src/content/galerie/` | fotoalba (seznam fotek ve frontmatteru) |
| `src/assets/uploads/` | fotky nahrané přes CMS (při nahrání se zmenší na max. 2400 px a převedou na WebP) |
| `src/content.config.ts` | schéma obsahu – musí odpovídat `public/admin/config.yml` |
| `public/_redirects` | přesměrování starých WordPress URL |
| `docs/prototyp.html` | původní statický návrh redesignu |

## Zprovoznění (jednorázově)

1. **Cloudflare Pages** – dashboard → *Workers & Pages* → *Create* → *Pages* → *Connect to Git* →
   repo `skyhawk90/csop-web`, větev `main`.
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - (verzi Node bere z `.nvmrc`)

   Web poběží na `csop-web.pages.dev`, každý push na `main` ho znovu nasadí.
2. **Noční přestavba** (kvůli přesunu proběhlých akcí do archivu) – v Pages projektu
   *Settings → Builds → Deploy hooks* vytvořit hook pro `main` a jeho URL uložit na GitHubu
   do *Settings → Secrets and variables → Actions* jako `CF_PAGES_DEPLOY_HOOK`.
3. **Přihlášení do administrace** – nasadit [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
   (tlačítko *Deploy to Cloudflare* v jeho README), na GitHubu založit OAuth App
   (*Settings → Developer settings → OAuth Apps*, callback `https://sveltia-cms-auth.<účet>.workers.dev/callback`),
   do Workeru dát `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` a `ALLOWED_DOMAINS=csopnasavrky.cz,csop-web.pages.dev`.
   Pak v `public/admin/config.yml` doplnit `base_url` (označeno TODO).
4. **Editoři** – každý potřebuje GitHub účet s přístupem *Write* k repu.
5. **Doména** – v Pages projektu *Custom domains* přidat `csopnasavrky.cz` a `www.csopnasavrky.cz`
   (doména musí být v Cloudflare, tj. změnit NS u registrátora).
