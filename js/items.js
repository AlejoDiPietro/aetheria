// ============================================================
//  AETHERIA ONLINE — lógica de objetos y botín (pura)
//
//  Todo lo que crea, valora o describe un objeto, sin tocar la
//  escena ni el DOM. Recibe lo que necesita por parámetro y
//  devuelve datos; la presentación (spawn del mesh, render del
//  inventario) queda en el index.html.
//
//  El generador de ids vive acá porque los objetos se crean desde
//  varios frentes (botín, tienda, jefes) y no deben chocar entre
//  sí. El guardado lo preserva vía getItemId()/setItemId().
// ============================================================

import { SLOTS, RARITIES, ALL_RARITIES, UNIQUE_RARITY, GEAR, UNIQUES, SLOT_NOMBRE } from './data.js?v=2';   // la versión tiene que coincidir con la del index.html

export function xpForLevel(lv){ return Math.floor(80 * Math.pow(1.35, lv-1)); }

// ----- generador de ids -----
let itemId = 1;
export const getItemId = () => itemId;
export function setItemId(n){ if(Number.isFinite(n) && n > 0) itemId = n; }
function nextId(){ const id = itemId; itemId++; return id; }

export function rollRarity(boss){
  const pool = RARITIES.map((r,i)=>({ r, w:r.w + (boss? i*5 : 0) }));
  let tot = pool.reduce((s,p)=>s+p.w,0), x = Math.random()*tot;
  for(const p of pool){ if((x -= p.w) <= 0) return p.r; }
  return RARITIES[0];
}

export function makeGear(type, lv, rarity){
  const g = GEAR[type], base = lv*1.6 + 4;
  const stats = { atk:0, def:0, hpMax:0, mpMax:0 };
  /*
    Cada familia reparte distinto para que la elección tenga sentido: el yelmo
    da poca defensa pero maná, el escudo es defensa pura y aguante. Si todas
    dieran lo mismo, cinco ranuras serían una sola repetida cinco veces.
  */
  if(g.main==='atk'){ stats.atk=Math.round(base*rarity.mult); stats.def=Math.round(base*0.2*rarity.mult); }
  else if(g.main==='def'){ stats.def=Math.round(base*0.8*rarity.mult); stats.hpMax=Math.round(base*1.6*rarity.mult); }
  else if(g.main==='cabeza'){ stats.def=Math.round(base*0.45*rarity.mult); stats.hpMax=Math.round(base*0.7*rarity.mult); stats.mpMax=Math.round(base*0.9*rarity.mult); }
  else if(g.main==='bloqueo'){ stats.def=Math.round(base*1.1*rarity.mult); stats.hpMax=Math.round(base*0.8*rarity.mult); }
  else { stats.atk=Math.round(base*0.4*rarity.mult); stats.mpMax=Math.round(base*1.2*rarity.mult); stats.def=Math.round(base*0.3*rarity.mult); }
  const nm = g.names[Math.floor(Math.random()*g.names.length)];
  return { id:nextId(), type, slot:type, icon:g.icon, rarity, lv,
           name:(rarity.key!=='common'? rarity.name+' ':'')+nm, stats };
}

export function makePotion(kind, lv){
  return kind==='hp'
    ? { id:nextId(), type:'potion', icon:'🧪', rarity:RARITIES[0], name:'Poción de Vida', heal:{hp:60+lv*6, mp:0}, qty:1 }
    : { id:nextId(), type:'potion', icon:'🔷', rarity:RARITIES[0], name:'Poción de Maná', heal:{hp:0, mp:40+lv*4}, qty:1 };
}

export function makeUnique(zone){
  const t = UNIQUES[zone.name];
  return { id:nextId(), type:t.type, slot:t.type, icon:t.icon, rarity:UNIQUE_RARITY,
           lv:zone.lv[1]+3, name:t.name, stats:{...t.stats}, unique:true };
}

export function rollLoot(e){
  const items = [];
  const gold = Math.floor((4 + e.lv*3) * (e.isBoss?10:1) * (0.7+Math.random()*0.6));
  if(gold>0) items.push({ gold });
  if(Math.random() < (e.isBoss?1:0.35)) items.push(makePotion(Math.random()<0.6?'hp':'mp', e.lv));
  if(Math.random() < (e.isBoss?1:0.28)){
    const n = e.isBoss?2:1;
    for(let i=0;i<n;i++) items.push(makeGear(SLOTS[Math.floor(Math.random()*SLOTS.length)], e.lv, rollRarity(e.isBoss)));
  }
  return items;
}

export function itemValue(item){
  if(item.gold !== undefined) return item.gold;
  if(item.type==='potion') return 16 + Math.round((item.heal.hp||item.heal.mp)*0.35);
  const s = item.stats;
  const sum = s.atk + s.def + s.hpMax*0.4 + s.mpMax*0.5;
  return Math.floor((6 + item.lv*3 + sum) * item.rarity.mult);
}
export function sellValue(item){ return Math.max(1, Math.floor(itemValue(item) * 0.4)); }

export function statLine(it){
  const s = it.stats||{}, parts=[];
  if(s.atk) parts.push('ATK +'+s.atk);
  if(s.def) parts.push('DEF +'+s.def);
  if(s.hpMax) parts.push('HP +'+s.hpMax);
  if(s.mpMax) parts.push('MP +'+s.mpMax);
  return parts.join(' · ');
}
export function slotName(s){ return SLOT_NOMBRE[s] || s; }

// Re-exports de utilidad que el main puede importar desde un solo sitio.
export { ALL_RARITIES };
