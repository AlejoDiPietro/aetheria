# Aetheria Online

Un action RPG 3D que corre entero en el navegador, en un solo archivo HTML y sin build.

**▶ [Jugar](https://alejodipietro.github.io/aetheria/)** · Escritorio, teclado y mouse.

![Aetheria Online](captura.jpg)

## Qué hay adentro

- **Cinco zonas** con terreno, clima y fauna propios: Pradera de Sakura, Bosque Susurrante, Desierto Ardiente, Picos Helados y Abismo Demoníaco.
- **Combate y progresión**: niveles, experiencia, estadísticas, tres habilidades con cooldown y jefes por zona.
- **Loot con rarezas** —de Común a ÚNICO— con objetos irrepetibles que sólo sueltan ciertos jefes.
- **Inventario, equipamiento y tienda**: cada pieza equipada recalcula las estadísticas del personaje.
- El personaje está **construido con geometría primitiva y animado a mano**, sin modelos externos ni librería de animación.

## Cómo está hecho

Three.js y nada más. Un `index.html` de 74 KB con todo adentro: la escena, el HUD en HTML plano, el bucle de juego, la lógica de progresión y el guardado en `localStorage`. Sin framework, sin bundler y sin nada que compilar.

Three.js viene versionado en `vendor/` en lugar de pedirse a un CDN. Es más peso en el repositorio, pero el juego no depende de que un tercero siga en pie para arrancar.

## Correrlo local

Necesita un servidor estático, porque los módulos ES no cargan desde `file://`:

```bash
npx serve .
```

## Controles

| Tecla | Acción |
|---|---|
| `WASD` | Mover (relativo a la cámara) |
| `Shift` | Correr |
| `Espacio` | Saltar |
| `Ctrl` | Esquiva |
| Click izquierdo | Fijar enemigo y atacar |
| Click derecho + mover | Orbitar la cámara |
| Rueda | Acercar y alejar |
| `Tab` | Fijar el enemigo más cercano |
| `1` `2` `3` | Habilidades |
| `I` | Inventario |
| `E` | Hablar con el mercader (cerca) |
| `K` | Guardar la partida |

## Licencia

MIT. Three.js se distribuye bajo su propia licencia MIT, incluida en `vendor/`.
