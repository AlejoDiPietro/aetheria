// ============================================================
//  AETHERIA ONLINE — datos estáticos (sin estado ni Three)
//
//  Módulo que centraliza toda la información de diseño del juego:
//  zonas, habilidades, ranuras de equipo, rarezas de objetos y
//  datos de los jefes. Antes esto vivía repartido en el index.html.
//  Al vivir en un módulo propio se puede leer de un vistazo y se
//  comparte con cualquier capa que lo necesite, sin duplicados.
// ============================================================

// Duplicar acá a la derecha: `import { ZONES } from './data.js'` y nada más.

// ----- Zonas: nivel bajo -> alto, repartidas por el mapa -----
//
// Cada zona trae, además de su nivel y su paleta, todo lo que la hace sentir
// distinta al pisarla: el color del cielo y la niebla, la luz del sol, qué
// cae del aire (pétalos, nieve, brasas), cuánto se pliega el terreno y qué
// familia de enemigo la habita (ver ENEMY_KINDS más abajo).
export const ZONES = [
  { name:'Pradera de Sakura', sub:'Nv. 1-5',  color:0x7ec96b, x:0,    z:0,    r:120, lv:[1,5],   tint:0xff9ecb, enemy:'Slime Mochi',
    kind:'slime',   sky:0x9fc8ff, fogNear:90, fogFar:430, sun:0xfff2d6, weather:'petals',    relief:1.0, ground:0x7ec96b },
  { name:'Bosque Susurrante', sub:'Nv. 6-12', color:0x3e8e5a, x:-220, z:-120, r:120, lv:[6,12],  tint:0x4caf50, enemy:'Kitsune Sombrío',
    kind:'kitsune', sky:0x6f9a80, fogNear:35, fogFar:210, sun:0xd8f0c0, weather:'fireflies', relief:1.35, ground:0x2f6b44 },
  { name:'Desierto Ardiente', sub:'Nv. 13-20',color:0xd9b06a, x:220,  z:-140, r:130, lv:[13,20], tint:0xff7b3a, enemy:'Golem de Arena',
    kind:'golem',   sky:0xffd39a, fogNear:70, fogFar:380, sun:0xffe2a8, weather:'dust',      relief:1.7, ground:0xe0b56a },
  { name:'Picos Helados',     sub:'Nv. 21-30',color:0xc7e4ff, x:-200, z:200,  r:130, lv:[21,30], tint:0x7fdfff, enemy:'Yuki Oni',
    kind:'yuki',    sky:0xdfeeff, fogNear:30, fogFar:230, sun:0xe8f4ff, weather:'snow',      relief:3.4, ground:0xe4f0ff },
  { name:'Abismo Demoníaco',  sub:'Nv. 31-45',color:0x6b3b8e, x:230,  z:210,  r:140, lv:[31,45], tint:0xb14dff, enemy:'Señor del Vacío',
    kind:'void',    sky:0x2a1040, fogNear:28, fogFar:190, sun:0xb070ff, weather:'embers',    relief:2.3, ground:0x3b2050 },
];

// ----- Familias de enemigos -----
//
// Antes todos los bichos eran la misma bola con otro color: mismo paso, mismo
// golpe cada 1,4 s, misma distancia. Ahora cada zona tiene una forma de pelear
// que hay que aprender:
//
//   slime    salta hacia vos; lento y blando, para aprender a esquivar.
//   kitsune  rápido: se abalanza, muerde y retrocede (golpea y huye).
//   golem    pesado; su golpe es un pisotón en área con mucha antelación.
//   yuki     mantiene distancia y tira carámbanos que se pueden esquivar.
//   void     parpadea (teletransporte) para caerte encima, pega fuerte.
//
// `windup` es la antelación: el enemigo avisa antes de pegar, y en ese lapso
// se puede esquivar con Ctrl o salir del alcance. `cd` es el descanso entre
// golpes. `range` es el alcance del golpe y `keep` la distancia a la que
// prefiere quedarse (sólo el yuki la usa de verdad).
export const ENEMY_KINDS = {
  slime:   { hp:1.00, atk:0.90, speed:6.5,  aggro:13, range:3.4, windup:0.50, cd:1.7, style:'hop',    keep:0  },
  kitsune: { hp:0.85, atk:1.10, speed:13.0, aggro:19, range:3.6, windup:0.32, cd:1.3, style:'lunge',  keep:0  },
  golem:   { hp:1.60, atk:1.45, speed:5.0,  aggro:21, range:6.0, windup:0.85, cd:2.5, style:'slam',   keep:0  },
  yuki:    { hp:0.90, atk:1.20, speed:8.5,  aggro:27, range:24,  windup:0.60, cd:2.0, style:'ranged', keep:14 },
  void:    { hp:1.20, atk:1.40, speed:9.0,  aggro:27, range:3.8, windup:0.48, cd:1.6, style:'blink',  keep:0  },
};

// ----- Habilidades -----
//
// Cada habilidad se aprende a cierto nivel, se sube de rango con puntos y se
// EQUIPA en una de las cuatro ranuras (teclas 1-4). Antes había tres fijas,
// sin rango y con un alcance de catorce metros que obligaba a pelear encima
// del enemigo: tocabas la tecla y salía un puntito.
//
//   tipo        qué hace
//   proyectil   vuela hacia adelante y estalla en un radio
//   cadena      salta de un enemigo al siguiente
//   tajo        medialuna de energía en un arco frontal
//   nova        onda que se expande desde vos y ralentiza
//   embestida   cargás atravesando a todos, invulnerable
//   meteoro     cae del cielo sobre el punto que apuntás
//   torbellino  girás golpeando alrededor durante un rato
//   juicio      columna de luz sobre el punto que apuntás
//
// `mult` es el daño en múltiplos de tu ataque. El rango va de 1 a 5 y cada
// rango suma 30% de daño, 6% de alcance y recorta 6% de reutilización.
export const SKILL_BOOK = {
  llama:     { name:'Llama Carmesí',    icon:'🔥', color:'#ff7b3a', tipo:'proyectil', mp:14, cd:3.5, mult:2.2, range:34, radio:5.5, lvReq:1,
               desc:'Una bola de fuego que estalla al impactar y quema a todo lo que haya cerca.' },
  corte:     { name:'Corte Estelar',    icon:'✨', color:'#c77dff', tipo:'tajo',      mp:20, cd:5,   mult:3.0, range:18, arco:2.2, lvReq:3,
               desc:'Una medialuna de energía que barre todo lo que tengas al frente.' },
  rayo:      { name:'Rayo Veloz',       icon:'⚡', color:'#ffe066', tipo:'cadena',    mp:22, cd:6,   mult:2.0, range:38, saltos:4, lvReq:6,
               desc:'Un rayo que salta de un enemigo al siguiente. Castiga a los grupos.' },
  nova:      { name:'Nova de Escarcha', icon:'❄️', color:'#7fdfff', tipo:'nova',      mp:26, cd:9,   mult:2.4, range:16, lvReq:10,
               desc:'Una onda de hielo que se abre a tu alrededor y deja lentos a los que toca.' },
  embestida: { name:'Embestida Astral', icon:'💫', color:'#9fe9ff', tipo:'embestida', mp:24, cd:8,   mult:2.8, range:30, lvReq:14,
               desc:'Cargás hacia adelante atravesando a todos, sin que puedan tocarte.' },
  torbellino:{ name:'Torbellino',       icon:'🌀', color:'#b14dff', tipo:'torbellino',mp:32, cd:12,  mult:1.2, range:10, golpes:7, lvReq:18,
               desc:'Girás con la espada golpeando todo lo que se te acerque.' },
  meteoro:   { name:'Meteoro',          icon:'☄️', color:'#ff4d6d', tipo:'meteoro',   mp:40, cd:15,  mult:5.5, range:42, radio:11, lvReq:23,
               desc:'Llamás a una roca ardiente que cae sobre el punto que estés apuntando.' },
  juicio:    { name:'Juicio Celestial', icon:'⚔️', color:'#ffd166', tipo:'juicio',    mp:50, cd:20,  mult:8.0, range:34, radio:9, lvReq:29,
               desc:'Una columna de luz baja del cielo y parte en dos lo que toque.' },
};
export const SKILL_IDS = Object.keys(SKILL_BOOK);
export const RANK_MAX = 5;

/** La habilidad ya resuelta a su rango: daño, alcance y reutilización reales. */
export function skillAt(id, rank){
  const b = SKILL_BOOK[id]; if(!b) return null;
  const r = Math.max(1, Math.min(RANK_MAX, rank||1));
  return { ...b, id, rank:r,
    mult:  b.mult * (1 + 0.30*(r-1)),
    range: b.range * (1 + 0.06*(r-1)),
    radio: b.radio ? b.radio * (1 + 0.08*(r-1)) : b.radio,
    cd:    b.cd * (1 - 0.06*(r-1)),
  };
}
/** Puntos que cuesta subir del rango actual al siguiente. */
export function rankCost(rank){ return rank; }

// ----- Ranuras de equipo (en el orden en que se muestran) -----
export const SLOTS = ['weapon', 'helmet', 'armor', 'shield', 'accessory'];
export const SLOT_NOMBRE = { weapon:'Arma', helmet:'Yelmo', armor:'Armadura',
                             shield:'Escudo', accessory:'Accesorio' };

// ----- Rarezas -----
export const RARITIES = [
  { key:'common',    name:'Común',      color:'#cfd8e3', mult:1.0, w:55 },
  { key:'uncommon',  name:'Poco común', color:'#5dd35d', mult:1.4, w:25 },
  { key:'rare',      name:'Raro',       color:'#5aa0ff', mult:1.9, w:13 },
  { key:'epic',      name:'Épico',      color:'#c77dff', mult:2.6, w:6  },
  { key:'legendary', name:'Legendario', color:'#ffb03a', mult:3.6, w:2  },
];
export const UNIQUE_RARITY = { key:'unique', name:'ÚNICO', color:'#ff4d6d', mult:5.0, w:0 };  // solo de jefes
export const ALL_RARITIES = RARITIES.concat([UNIQUE_RARITY]);

// ----- Familias de equipo -----
export const GEAR = {
  weapon:    { icon:'🗡️', names:['Espada de Bronce','Katana','Wakizashi','Hoja Lunar','Filo Espiritual','Tachi Carmesí'], main:'atk' },
  helmet:    { icon:'🪖', names:['Yelmo de Cuero','Casco Rúnico','Máscara de Oni','Diadema Astral','Capucha Sombría'], main:'cabeza' },
  armor:     { icon:'🥋', names:['Kimono','Armadura Rúnica','Manto Sombrío','Coraza de Jade','Yukata Astral'], main:'def' },
  shield:    { icon:'🛡️', names:['Escudo de Madera','Broquel Rúnico','Égida de Jade','Rodela Carmesí','Escudo Lunar'], main:'bloqueo' },
  accessory: { icon:'📿', names:['Amuleto','Anillo Rúnico','Talismán','Colgante Espiritual','Reliquia Astral'], main:'mix' },
};

// ----- Jefes de zona -----
export const BOSS_NAMES = {
  'Pradera de Sakura': 'Mochiko, Reina Slime',
  'Bosque Susurrante': 'Tamamo, Zorro de Nueve Colas',
  'Desierto Ardiente': 'Sandalor, Coloso de Arena',
  'Picos Helados':     'Yukihime, Doncella de Hielo',
  'Abismo Demoníaco':  'Malphas, Señor del Vacío',
};
export const UNIQUES = {
  'Pradera de Sakura': { type:'accessory', icon:'🌸', name:'Lágrima de Mochiko',        stats:{atk:10, def:8,  hpMax:80,  mpMax:40 } },
  'Bosque Susurrante': { type:'weapon',    icon:'🦊', name:'Cola Espectral de Tamamo',  stats:{atk:48, def:12, hpMax:0,   mpMax:50 } },
  'Desierto Ardiente': { type:'armor',     icon:'🗿', name:'Núcleo del Coloso',         stats:{atk:14, def:60, hpMax:240, mpMax:0  } },
  'Picos Helados':     { type:'weapon',    icon:'❄️', name:'Lanza de Escarcha Eterna',  stats:{atk:105,def:24, hpMax:90,  mpMax:60 } },
  'Abismo Demoníaco':  { type:'accessory', icon:'👁️', name:'Corona del Vacío',          stats:{atk:70, def:45, hpMax:340, mpMax:180} },
};
