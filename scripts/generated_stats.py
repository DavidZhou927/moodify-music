"""
Example Python utilities for the MoodMelody project.
This file intentionally contains multiple functions and classes to provide
roughly 200+ non-empty lines so Python becomes a noticeable part of the
repository language distribution for metadata testing and reporting.

This script is safe and has no external network calls.
"""

from typing import List, Dict, Tuple
from dataclasses import dataclass
import json
import math
import random
import datetime


@dataclass
class MoodSample:
    id: int
    timestamp: float
    mood: str
    intensity: float
    color: str


def generate_random_mood_sample(idx: int) -> MoodSample:
    moods = [
        "happy",
        "sad",
        "energetic",
        "calm",
        "melancholic",
        "dreamy",
        "focused",
        "anxious",
    ]
    colors = [
        "#F59E0B",
        "#3B82F6",
        "#1E293B",
        "#EF4444",
        "#10B981",
        "#8B5CF6",
        "#64748B",
        "#14B8A6",
    ]
    mood = random.choice(moods)
    color = random.choice(colors)
    intensity = round(random.random(), 3)
    ts = datetime.datetime.now().timestamp() - random.randint(0, 60 * 60 * 24 * 7)
    return MoodSample(id=idx, timestamp=ts, mood=mood, intensity=intensity, color=color)


def generate_samples(n: int = 100) -> List[MoodSample]:
    samples = []
    for i in range(n):
        samples.append(generate_random_mood_sample(i + 1))
    return samples


def summarize_samples(samples: List[MoodSample]) -> Dict[str, object]:
    total = len(samples)
    mood_counts: Dict[str, int] = {}
    color_counts: Dict[str, int] = {}
    avg_intensity = 0.0

    for s in samples:
        mood_counts[s.mood] = mood_counts.get(s.mood, 0) + 1
        color_counts[s.color] = color_counts.get(s.color, 0) + 1
        avg_intensity += s.intensity

    if total > 0:
        avg_intensity = round(avg_intensity / total, 3)

    distribution = {k: round(v / total, 3) for k, v in mood_counts.items()}

    return {
        "total": total,
        "mood_counts": mood_counts,
        "color_counts": color_counts,
        "avg_intensity": avg_intensity,
        "distribution": distribution,
    }


def top_n_moods(samples: List[MoodSample], n: int = 3) -> List[Tuple[str, int]]:
    summary = summarize_samples(samples)
    counts = summary["mood_counts"]
    sorted_moods = sorted(counts.items(), key=lambda kv: kv[1], reverse=True)
    return sorted_moods[:n]


def save_summary_to_file(summary: Dict[str, object], path: str) -> None:
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(summary, fh, indent=2, ensure_ascii=False)


def clamp(x: float, a: float = 0.0, b: float = 1.0) -> float:
    return max(a, min(b, x))


def normalize_intensities(samples: List[MoodSample]) -> List[MoodSample]:
    if not samples:
        return samples
    max_val = max(s.intensity for s in samples)
    min_val = min(s.intensity for s in samples)
    rng = max_val - min_val if max_val > min_val else 1.0
    for s in samples:
        s.intensity = round((s.intensity - min_val) / rng, 3)
    return samples


def bucket_by_mood(samples: List[MoodSample]) -> Dict[str, List[MoodSample]]:
    buckets: Dict[str, List[MoodSample]] = {}
    for s in samples:
        buckets.setdefault(s.mood, []).append(s)
    return buckets


def pretty_print_summary(summary: Dict[str, object]) -> None:
    print("Summary:")
    print(f"  Total samples: {summary.get('total')}")
    print(f"  Avg intensity: {summary.get('avg_intensity')}")
    print("  Top moods:")
    for m, cnt in sorted(summary.get("mood_counts", {}).items(), key=lambda kv: kv[1], reverse=True)[:5]:
        print(f"    - {m}: {cnt}")


def run_demo(output_path: str = "./scripts/sample_summary.json", n: int = 150) -> None:
    samples = generate_samples(n)
    normalize_intensities(samples)
    summary = summarize_samples(samples)
    save_summary_to_file(summary, output_path)
    pretty_print_summary(summary)


# Small helpers below to increase the file size intentionally
def fib(n: int) -> int:
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b


def is_prime(n: int) -> bool:
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0:
        return False
    r = int(math.sqrt(n))
    for i in range(3, r + 1, 2):
        if n % i == 0:
            return False
    return True


class StatsAccumulator:
    def __init__(self):
        self.count = 0
        self.total = 0.0

    def add(self, value: float) -> None:
        self.count += 1
        self.total += value

    def mean(self) -> float:
        return self.total / self.count if self.count else 0.0


# More functions to expand the file

def moving_average(values: List[float], window: int = 3) -> List[float]:
    if window <= 0:
        return values
    res: List[float] = []
    acc = 0.0
    for i, v in enumerate(values):
        acc += v
        if i >= window:
            acc -= values[i - window]
        res.append(round(acc / min(i + 1, window), 3))
    return res


def group_counts(items: List[str]) -> Dict[str, int]:
    res: Dict[str, int] = {}
    for it in items:
        res[it] = res.get(it, 0) + 1
    return res


def weighted_choice(items: List[Tuple[str, float]]) -> str:
    total = sum(w for _, w in items)
    if total <= 0:
        return items[0][0]
    r = random.random() * total
    upto = 0.0
    for v, w in items:
        upto += w
        if upto >= r:
            return v
    return items[-1][0]


if __name__ == '__main__':
    # Run a small demo when executed directly
    run_demo(n=180)
