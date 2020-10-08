# ZHTML renderelő

Egy programkönyvtár, amely azokat a funkciókat egyesíti, amelyek sok ZUI alkalmazásban közösek. Ezt nevezzük renderelőnek. Ez magában foglalja a következő funkciókat:
- bizonyos típusú ábrák megjelenítése, köztük a legfontosabb VL ábrák: képek, nyilak, dobozok, címkék, szövegblokkok
- zoomolás vizuális megvalósítása, animáció, euklideszi és Poincaré-egyenesen való átzoomolás, gyorsítás és lassítás (easing), szemantikus zoomolás
- a zoomolás szemantikus zoomolás performancia-optimalizálása ([FLIP] módszerrel)
- felhasználói input kezelése a navigáláshoz: zooming, panning, ezek korlátozása szükség esetén
- alapvető szerkesztő funkciók (a contenteditable analógiájára)
- ... esetleg további dolgok, amiket a ZVL alapvetésünk részének tekintünk

Mindezeket web component-ekkel valósítjuk meg, és az elemek stílusozása a hagyományos módon CSS-sel történik.

## Canvas

Felmerült, hogy Canvas alapú vagy DOM alapú legyen a renderelő, és alapvetően a DOM alapú felel meg legjobban a kívánságainknak. Amennyiben valamely elem Canvas alapú akar lenni, magának kell létrehozni a canvast és belerajzolni. Nem használunk közös canvast, mert az átfedéseket közel lehetetlen lenne lekezelni vegyes DOM-canvas üzemmódban.

[FLIP]: https://aerotwist.com/blog/flip-your-animations/