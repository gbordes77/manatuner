#!/usr/bin/env python3
"""Independent exact oracle: Fraction + combinations; no production imports.
Finite London stopping tree for a colored/off-color/spell deck. Two policies
expose the source article's prose/code discrepancy when a 7-card redraw
contains exactly 3 spells before bottoming to six.
"""
from fractions import Fraction as F
from math import comb
from functools import lru_cache
import json

def C(n,k):
    return comb(n,k) if 0 <= k <= n else 0

@lru_cache(None)
def hands(N,K,L,n):
    den=C(N,n)
    return [(a,b,F(C(K,a)*C(L-K,b)*C(N-L,n-a-b),den))
            for a in range(min(K,n)+1)
            for b in range(min(L-K,n-a)+1)
            if C(K,a)*C(L-K,b)*C(N-L,n-a-b)]

def london(N,L,K,turn,pips,policy='code'):
    reach=F(1); enough=F(0); success=F(0)
    sizes=([7] if N==99 else [])+[7,6,5,4]
    for step,size in enumerate(sizes):
        reject=F(0)
        free=N==99 and step==0
        for a,b,mass in hands(N,K,L,7):
            lands=a+b; spells=7-lands
            if size==7: bottom=0
            elif size==6: bottom=int(spells <= (3 if policy=='code' else 2))
            elif size==5: bottom=0 if spells>=4 else (1 if spells==3 else 2)
            else: bottom=min(3,max(0,4-spells))
            kept_lands=lands-bottom
            kept_good=a-max(0,bottom-b)
            keep=(size==4 or ((3 if free else 2)<=kept_lands<=(5 if size==7 else 4)))
            if not keep: reject+=mass; continue
            # Bottomed cards cannot be drawn in this horizon: top library is N-7.
            n=turn if N==99 else turn-1
            for da,db,draw_mass in hands(N-7,K-a,L-lands,n):
                p=reach*mass*draw_mass
                if kept_lands+da+db>=turn:
                    enough+=p
                    if kept_good+da>=pips:success+=p
        reach*=reject
    return success/enough if enough else F(0)

if __name__=='__main__':
    result=[]
    for N,L,K,t,p in [(60,25,20,2,2),(60,25,21,2,2),(60,25,23,4,4),(60,25,24,4,4),(40,17,13,2,2),(40,17,14,2,2),(99,41,29,2,2),(99,41,30,2,2)]:
        code=london(N,L,K,t,p,'code');prose=london(N,L,K,t,p,'prose')
        result.append(dict(N=N,L=L,K=K,turn=t,pips=p,target=(89+t)/100,
                           exact_code_policy=float(code),exact_prose_policy=float(prose),
                           code_fraction=str(code)))
    print(json.dumps(result,indent=2))
