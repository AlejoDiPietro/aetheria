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
export const ZONES = [
  { name:'Pradera de Sakura', sub:'Nv. 1-5',  color:0x7ec96b, x:0,    z:0,    r:120, lv:[1,5],   tint:0xff9ecb, enemy:'Slime Mochi' },
  { name:'Bosque Susurrante', sub:'Nv. 6-12', color:0x3e8e5a, x:-220, z:-120, r:120, lv:[6,12],  tint:0x4caf50, enemy:'Kitsune Sombrío' },
  { name:'Desierto Ardiente', sub:'Nv. 13-20',color:0xd9b06a, x:220,  z:-140, r:130, lv:[13,20], tint:0xff7b3a, enemy:'Golem de Arena' },
  { name:'Picos Helados',     sub:'Nv. 21-30',color:0xc7e4ff, x:-200, z:200,  r:130, lv:[21,30], tint:0x7fdfff, enemy:'Yuki Oni' },
  { name:'Abismo Demoníaco',  sub:'Nv. 31-45',color:0x6b3b8e, x:230,  z:210,  r:140, lv:[31,45], tint:0xb14dff, enemy:'Señor del Vacío' },
];

// ----- Habilidades -----
export const SKILLS = {
  1:{ name:'Llama Carmesí', mp:12, cd:3, mult:2.4, color:'#ff7b3a', range:14 },
  2:{ name:'Rayo Veloz',    mp:16, cd:5, mult:3.2, color:'#ffe066', range:22 },
  3:{ name:'Corte Estelar', mp:24, cd:8, mult:4.5, color:'#c77dff', range:16 },
};

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
