"""Derive a closed resource manifest from the preserved Oracle records.
Non-mana front-face effects are outside the resource policy, explicitly.
Unknown land-face text fails this derivation instead of guessing an ETB.
"""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[3]
records=json.loads((Path(__file__).parent/'card-sources.json').read_text())
out={}
for c in records:
 if c['family']=='mdfc':
  lands=[]
  for f in c['card_faces']:
   if f['type_line']!='Land':continue
   text=f['oracle_text'];m=re.fullmatch(r"(?:(This land enters tapped\.)\n|(As this land enters, you may pay 3 life\. If you don't, it enters tapped\.)\n)?\{T\}: Add \{([WUBRG])\}(?: or \{([WUBRG])\})?\.",text)
   assert m,(c['name'],text)
   face={'name':f['name'],'outputs':[[{'color':v}] for v in m.groups()[2:] if v]}
   if m[1]:face['tapped']=True
   if m[2]:face['entryLife']=3
   lands.append(face)
  card={'name':c['name'],'count':1,'lands':lands,'searchable':'Land' in c['card_faces'][0]['type_line']}
  front=c['card_faces'][0]
  if re.fullmatch(r'\{T\}: Add \{G\}\.',front['oracle_text']) and 'Creature' in front['type_line']:
   card['spell']={'kind':'producer','cost':front['mana_cost'],'creature':True,'outputs':[[{'color':'G'}]]}
  for name in [c['name']]+[f['name'] for f in c['card_faces']]:out[name]=card
 if c['family']=='fetch':
  text=c['oracle_text'];types=re.findall(r'\b(Plains|Island|Swamp|Mountain|Forest)\b',text)
  search={'tapped':'battlefield tapped' in text,'life':1 if 'Pay 1 life' in text else 0}
  if types:search['types']=types
  else:assert 'basic land card' in text;search['basicOnly']=True
  if 'four or more lands' in text:search['untapAt']=4
  out[c['name']]={'name':c['name'],'count':1,'searchable':True,'lands':[{'name':c['name'],'outputs':[],'search':search}]}
for c in records:
 if c['family']=='signet':
  m=re.fullmatch(r'\{1\}, \{T\}: Add \{([WUBRG])\}\{([WUBRG])\}\.',c['oracle_text'])
  assert m,c['name']
  out[c['name']]={'name':c['name'],'count':1,'spell':{'kind':'producer','cost':c['mana_cost'],'activationCost':'{1}','outputs':[[{'color':v} for v in m.groups()]]}}
# Audited resource actions. Drawing/other non-mana abilities are deliberately not simulated.
spells={
 'Llanowar Elves':dict(kind='producer',cost='{G}',creature=True,outputs=[[{'color':'G'}]]),
 'Elvish Mystic':dict(kind='producer',cost='{G}',creature=True,outputs=[[{'color':'G'}]]),
 'Fyndhorn Elves':dict(kind='producer',cost='{G}',creature=True,outputs=[[{'color':'G'}]]),
 'Birds of Paradise':dict(kind='producer',cost='{G}',creature=True,outputs=[[{'color':c}] for c in 'WUBRG']),
 'Boreal Druid':dict(kind='producer',cost='{G}',creature=True,outputs=[[{'color':'C','snow':True}]]),
 'Sol Ring':dict(kind='producer',cost='{1}',outputs=[[{'color':'C'},{'color':'C'}]]),
 'Mind Stone':dict(kind='producer',cost='{2}',outputs=[[{'color':'C'}]]),
 'Coldsteel Heart':dict(kind='producer',cost='{2}',tapped=True,chooseOutput=True,outputs=[[{'color':c,'snow':True}] for c in 'WUBRG']),
 'Lotus Petal':dict(kind='producer',cost='{0}',sacrifice=True,outputs=[[{'color':c}] for c in 'WUBRG']),
 'Dark Ritual':dict(kind='ritual',cost='{B}',outputs=[[{'color':'B'}]*3]),
 'Pyretic Ritual':dict(kind='ritual',cost='{1}{R}',outputs=[[{'color':'R'}]*3]),
 'Strike It Rich':dict(kind='treasure',cost='{R}',flashbackCost='{2}{R}'),
 'Rampant Growth':dict(kind='ramp',cost='{1}{G}',search=dict(basicOnly=True,tapped=True)),
 'Farseek':dict(kind='ramp',cost='{1}{G}',search=dict(types=['Plains','Island','Swamp','Mountain'],tapped=True)),
 "Nature's Lore":dict(kind='ramp',cost='{1}{G}',search=dict(types=['Forest'],tapped=False)),
 'Three Visits':dict(kind='ramp',cost='{1}{G}',search=dict(types=['Forest'],tapped=False)),
 'Cultivate':dict(kind='ramp',cost='{2}{G}',search=dict(basicOnly=True,tapped=True,toHand=1))
}
for name,spec in spells.items():
 source=next(c for c in records if c['name']==name)
 assert source['mana_cost']==spec['cost'],name
 if any(u.get('snow') for o in spec.get('outputs',[]) for u in o):assert 'Snow' in source['type_line'],name
 out[name]={'name':name,'count':1,'spell':spec}
# A simple, explicit creature-only spending restriction; Cavern subtype choices are not approximated.
out['Ancient Ziggurat']={'name':'Ancient Ziggurat','count':1,'searchable':True,'lands':[{'name':'Ancient Ziggurat','outputs':[[{'color':c,'creatureOnly':True}] for c in 'WUBRG']}]}
(root/'src/data/paymentPolicyCards.json').write_text(json.dumps(out,indent=2)+'\n')
print('Closed contracts:',len({v['name'] for v in out.values()}),'aliases:',len(out))
