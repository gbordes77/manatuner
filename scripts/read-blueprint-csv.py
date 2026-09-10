#!/usr/bin/env python3
"""Read ManaTuner's two CSV tables without treating metadata as table rows."""
import csv
import json
import sys
from pathlib import Path


def read_blueprint(path):
    deck, metrics = [], {}
    header = None
    with Path(path).open(encoding='utf-8-sig', newline='') as stream:
        for row in csv.reader(stream):
            if not row or not any(row):
                continue
            if row[0] == 'section':
                header = row
                continue
            if header is None or row[0].startswith('#'):
                continue
            if len(row) != len(header):
                raise ValueError(f'Incorrect column count in {row[0]} section')
            item = dict(zip(header, row))
            if item['section'] == 'deck':
                item['quantity'] = int(item['quantity'])
                for flag in ('is_land', 'is_sideboard', 'is_commander'):
                    if item[flag] not in ('true', 'false'):
                        raise ValueError(f'Invalid {flag}')
                    item[flag] = item[flag] == 'true'
                deck.append(item)
            elif item['section'] == 'summary':
                metrics[item['metric']] = item['value']
            else:
                raise ValueError(f"Unknown section {item['section']}")
    if not deck or 'total_cards' not in metrics:
        raise ValueError('Missing deck or summary table')
    library = [card for card in deck if not card['is_sideboard'] and not card['is_commander']]
    totals = {
        'library': sum(card['quantity'] for card in library),
        'lands': sum(card['quantity'] for card in library if card['is_land']),
        'commanders': sum(card['quantity'] for card in deck if card['is_commander']),
        'sideboard': sum(card['quantity'] for card in deck if card['is_sideboard']),
    }
    if totals['library'] != int(metrics['total_cards']) or totals['lands'] != int(metrics['total_lands']):
        raise ValueError('Deck zones disagree with summary totals')
    return {'cards': deck, 'metrics': metrics, 'totals': totals}


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python3 scripts/read-blueprint-csv.py export.csv')
    print(json.dumps(read_blueprint(sys.argv[1]), ensure_ascii=False, indent=2))
