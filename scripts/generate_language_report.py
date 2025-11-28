"""
Generate a detailed language statistics report for the repo.
Outputs JSON with per-file line counts and aggregated per-extension stats.
"""
import os
import json
from collections import defaultdict

ROOT='.'
EXCLUDE_DIRS={'node_modules','.git','dist'}
EXTENSIONS=['.py','.ts','.tsx','.js','.jsx']

report = {
    'files': [],
    'by_extension': {},
    'total_lines': 0
}

ext_counts = defaultdict(int)

def is_excluded(path):
    for ex in EXCLUDE_DIRS:
        if ex in path.split(os.sep):
            return True
    return False

for dirpath, dirs, files in os.walk(ROOT):
    # mutate dirs to skip excluded
    dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
    if is_excluded(dirpath):
        continue
    for f in files:
        for ext in EXTENSIONS:
            if f.endswith(ext):
                p = os.path.join(dirpath, f)
                try:
                    with open(p, 'r', encoding='utf-8') as fh:
                        lines = [l for l in fh if l.strip()]
                    cnt = len(lines)
                    rel = os.path.relpath(p, ROOT)
                    report['files'].append({'path': rel, 'lines': cnt, 'ext': ext})
                    ext_counts[ext] += cnt
                    report['total_lines'] += cnt
                except Exception as e:
                    # ignore unreadable files
                    print('ERR', p, e)

for ext, cnt in ext_counts.items():
    pct = round(cnt / report['total_lines'] * 100) if report['total_lines'] else 0
    report['by_extension'][ext] = {'lines': cnt, 'percent': pct}

os.makedirs('reports', exist_ok=True)
with open('reports/language_stats.json', 'w', encoding='utf-8') as fh:
    json.dump(report, fh, indent=2, ensure_ascii=False)

print('Report written to reports/language_stats.json')
