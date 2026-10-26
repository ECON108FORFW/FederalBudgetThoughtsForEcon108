#!/usr/bin/env python3
"""Build a local profanity dictionary from the public NoSwearing alphabetical pages."""
import json
import re
import string
import urllib.request
from bs4 import BeautifulSoup
from pathlib import Path

entries = set()
for letter in string.ascii_lowercase:
    url = f"https://www.noswearing.com/dictionary/{letter}"
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; ECON108Blog/1.0)"})
    with urllib.request.urlopen(request, timeout=25) as response:
        document = response.read().decode("utf-8", "replace")
    text = BeautifulSoup(document, "html.parser").get_text("\n", strip=True)
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    start = next((i for i, line in enumerate(lines) if "Below is a list of" in line), None)
    end = next((i for i, line in enumerate(lines) if "More Slang Translators" in line), None)
    if start is None or end is None or end <= start:
        raise RuntimeError(f"Could not locate dictionary entries on {url}")
    page_words = 0
    for line in lines[start + 1:end]:
        match = re.fullmatch(r"(.+?)\s+-\s+.+", line)
        if match:
            word = match.group(1).strip().lower()
            if re.fullmatch(r"[\w'-]+(?:\s+[\w'-]+)*", word):
                entries.add(word)
                page_words += 1
    if page_words == 0:
        raise RuntimeError(f"No dictionary entries found on {url}")
if len(entries) < 150:
    raise RuntimeError(f"Unexpectedly small NoSwearing dictionary: {len(entries)} entries")
output = Path("assets/noswearing-words.json")
output.parent.mkdir(exist_ok=True)
output.write_text(json.dumps(sorted(entries), ensure_ascii=False), encoding="utf-8")
print(f"Bundled {len(entries)} NoSwearing dictionary entries.")
