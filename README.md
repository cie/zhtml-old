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

## Components

These components are provided

* `z-window`
* `z-canvas`
* `z-fig` a general-purpose figure backed by an HTML DOM Element. Good for creating:
    * rectangles
    * rounded rectangles
    * text boxes
    * labels
    * fixed layouts
* `z-connector` a figure that connects two figures with a line and possibly arrowheads


## Animációs szabályok

- Animáció közben nem futtatunk JS-t és nem állítunk CSS-t.
- nem animálunk custom CSS propertyket, hanem kiszámoltatjuk a valódi CSS propertyket a végső esetre, és aztán átanimáljuk.

## API
### Figure API

#### Slots
Every figure MUST have a default `<slot>` where children of the element can be added. It MUST be rendered as a direct child of the host element.

#### Properties
#### Methods
#### Events

#### CSS style
Every figure MUST set its host element to have
- `display` block
- `position` anything but `static`
- `transform-origin` `0 0`

#### CSS variables


### `z-canvas` API

Several z-canvas elements can be added to the same window, and they will always move together.

### `z-window` API

`view` an AnimatedPoint object

### Transitions

`--z-anim-<sth>` properties


[FLIP]: https://aerotwist.com/blog/flip-your-animations/