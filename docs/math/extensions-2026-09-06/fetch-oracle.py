"""Independent Fraction oracle, physical identities, land-only policies.
No production imports; no mana pool or grouped-card states. Readiness is a set
of tapped physical identities. Payment uses matching of distinct permanents.
"""
from fractions import Fraction as F
from functools import lru_cache
from itertools import combinations
import json
from pathlib import Path

def reference(deck,cost,turn,draw):
 def matches(board,tapped):
  available=[deck[i]['colors'] for i in board if i not in tapped and 'fetch' not in deck[i]]
  def match(req,options):
   if not req:return True
   for j,colors in enumerate(options):
    if req[0]=='1' or req[0] in colors:
     if match(req[1:],options[:j]+options[j+1:]):return True
   return False
  return match(cost,available)
 @lru_cache(None)
 def main(hand,library,board,tapped,t,played):
  if t==turn and matches(board,tapped):return F(1)
  choices=[F(0)]
  if not played:
   for i in hand:
    if not deck[i]:continue
    choices.append(main(tuple(j for j in hand if j!=i),library,tuple(sorted(board+(i,))),tuple(sorted(tapped+((i,) if deck[i].get('tapped') else ()))),t,True))
  for i in board:
   if i in tapped or 'fetch' not in deck[i]:continue
   remboard=tuple(j for j in board if j!=i)
   targets=[j for j in library if deck[j] and 'fetch' not in deck[j] and (not deck[i].get('basicOnly') or deck[j].get('basic')) and (not deck[i].get('types') or set(deck[i]['types'])&set(deck[j].get('types',[])))]
   choices.append(main(hand,library,remboard,tapped,t,played))
   for j in targets:
    choices.append(main(hand,tuple(k for k in library if k!=j),tuple(sorted(remboard+(j,))),tuple(sorted(tapped+((j,) if deck[i]['fetch'] or deck[j].get('tapped') else ()))),t,played))
  if t<turn and library:
   choices.append(sum((main(tuple(sorted(hand+(i,))),tuple(j for j in library if j!=i),board,(),t+1,False) for i in library),F(0))/len(library))
  return max(choices)
 probability=F(0);hands=list(combinations(range(len(deck)),7))
 for hand in hands:
  lib=tuple(i for i in range(len(deck)) if i not in hand)
  if draw:
   p=sum((main(tuple(sorted(hand+(i,))),tuple(j for j in lib if j!=i),(),(),1,False) for i in lib),F(0))/len(lib)
  else:p=main(hand,lib,(),(),1,False)
  probability+=p/len(hands)
 return {'numerator':probability.numerator,'denominator':probability.denominator,'probability':float(probability)}

rows=[]
for tapped in [False,True]:
 for turn in [1,2,3]:
  for draw in [False,True]:
   cards=[{'fetch':tapped,'basicOnly':True}]*2+[{'colors':['G'],'basic':True,'types':['Forest']},{'colors':['W'],'basic':True,'types':['Plains']}]+[{}]*6
   rows.append({'fetchTapped':tapped,'turn':turn,'draw':draw,'cost':['G','W'],**reference(cards,['G','W'],turn,draw)})
path=Path(__file__).parent/'fetch-oracle.json';path.write_text(json.dumps(rows,indent=2)+'\n')
print(len(rows),'rational oracle cases')
