import csv
import difflib
import json
import pathlib
import urllib.parse
import urllib.request

IMDB_TITLES = """Avatar: The Last Airbender
Steel Ball Run: JoJo's Bizarre Adventure
Bluey
Attack on Titan
Fullmetal Alchemist: Brotherhood
The Legend of Hanuman
Rick and Morty
Arcane
One Piece
Hunter X Hunter
Batman: The Animated Series
Bleach: Thousand-Year Blood War
Death Note
Gravity Falls
Cowboy Bebop
Vinland Saga
Frieren: Beyond Journey's End
BoJack Horseman
Dragon Ball Z
Dragon Ball Z
Steins; Gate
Berserk
Monster
Fighting Spirit
Re: ZERO - Starting Life in Another World (Re-Edit)
South Park
Invincible
Naruto: Shippuden
Adventure Time
Code Geass: Lelouch of the Rebellion
Blue Eye Samurai
Over the Garden Wall
X-Men '97
Haikyuu!!
Takopi's Original Sin
Justice League Unlimited
Gintama
The Simpsons
One Punch Man
Archer
Regular Show
JoJo's Bizarre Adventure
Your Lie in April
Young Justice
Scavengers Reign
Primal
The Venture Bros.
The Apothecary Diaries
The Owl House
Rurouni Kenshin: Trust & Betrayal
Hilda
Hunter x Hunter
Adventure Time: Fionna & Cake
Adventure Time: Distant Lands
Futurama
Demon Slayer: Kimetsu no Yaiba
Jujutsu Kaisen
Star Wars: The Clone Wars
Solo Leveling
Neon Genesis Evangelion
Fullmetal Alchemist
Dragon Ball
Dragon Ball
Mob Psycho 100
Samurai Jack
Samurai Champloo
Justice League
The Boondocks
The Bugs Bunny Show
Smiling Friends
Kaguya-sama: Love Is War
Star Wars: Maul - Shadow Lord
Pantheon
Common Side Effects
Ghost in the Shell: Stand Alone Complex
Rurouni Kenshin
Detective Conan
Yu Yu Hakusho: Ghost Files
Tear Along the Dotted Line
Lord of Mysteries
Mushi-Shi
Great Teacher Onizuka
Fruits Basket
To Be Hero X
The Bugs Bunny/Road Runner Hour
Nana
Love, Death & Robots
Naruto
The Heroes
Erased
The Legend of Vox Machina
The Amazing World of Gumball
X-Men
Violet Evergarden
Spider-Man: The Animated Series
The Spectacular Spider-Man
Invader ZIM
Trollhunters: Tales of Arcadia
The New Batman Adventures
The Ricky Gervais Show""".splitlines()

ALIASES = {
    "hunter x hunter": ["hunter x hunter"],
    "steins gate": ["steins;gate", "steins gate"],
    "fullmetal alchemist": ["fullmetal alchemist"],
    "dragon ball": ["dragon ball"],
    "the heroes": ["heroes"],
    "rurouni kenshin": ["rurouni kenshin"],
    "yu yu hakusho ghost files": ["yu yu hakusho"],
    "the bugs bunny road runner hour": ["bugs bunny", "road runner"],
}

def normalize(value):
    return ''.join(ch for ch in value.lower() if ch.isalnum())

def get_json(url, key):
    request = urllib.request.Request(url, headers={"X-GES-Key": key, "X-GES-Expected-Contract": "517674fd6550bc50"})
    with urllib.request.urlopen(request, timeout=120) as response:
        return json.loads(response.read())

def candidate_score(imdb_title, library_title):
    left = normalize(imdb_title)
    right = normalize(library_title)
    score = difflib.SequenceMatcher(None, left, right).ratio()
    if left == right:
        score = 1.0
    for alias in ALIASES.get(normalize(imdb_title), []):
        alias_score = difflib.SequenceMatcher(None, normalize(alias), right).ratio()
        score = max(score, alias_score)
    return score

key_path = pathlib.Path.home() / ".config" / "opencode" / "ge-api.key"
key = key_path.read_text(encoding="utf-8").strip()
library = get_json("https://api.norvi.tech/sonarr/api/v3/series", key)
rows = []
seen = set()
for imdb_title in IMDB_TITLES:
    normalized = normalize(imdb_title)
    if normalized in seen:
        continue
    seen.add(normalized)
    scored = sorted(((candidate_score(imdb_title, item.get("title", "")), item) for item in library), key=lambda pair: pair[0], reverse=True)
    score, match = scored[0] if scored else (0, None)
    if score < 0.78:
        match = None
    if match:
        episodes = get_json("https://api.norvi.tech/sonarr/api/v3/episode?seriesId=" + urllib.parse.quote(str(match["id"])), key)
        missing = [episode for episode in episodes if episode.get("monitored") and not episode.get("hasFile") and episode.get("airDateUtc")]
        missing_labels = "; ".join(f"S{episode.get('seasonNumber', 0):02d}E{episode.get('episodeNumber', 0):02d} - {episode.get('title', '')}" for episode in missing)
        rows.append({"imdb_title": imdb_title, "duplicate_in_source": "no", "in_library": "yes", "sonarr_title": match.get("title", ""), "match_score": f"{score:.3f}", "library_series_id": match.get("id", ""), "total_episodes": len(episodes), "episodes_with_files": sum(1 for episode in episodes if episode.get("hasFile")), "missing_monitored_episodes": len(missing), "missing_episode_list": missing_labels, "notes": "" if not missing else "Missing monitored aired episodes"})
    else:
        rows.append({"imdb_title": imdb_title, "duplicate_in_source": "no", "in_library": "no", "sonarr_title": "", "match_score": f"{score:.3f}", "library_series_id": "", "total_episodes": "", "episodes_with_files": "", "missing_monitored_episodes": "", "missing_episode_list": "", "notes": "No confident Sonarr title match"})

output = pathlib.Path.cwd() / "imdb-top-100-animated-series-library-comparison.csv"
with output.open("w", newline="", encoding="utf-8-sig") as handle:
    writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)
print(output)
print(json.dumps({"source_titles": len(IMDB_TITLES), "unique_titles": len(rows), "in_library": sum(row["in_library"] == "yes" for row in rows), "missing_titles": sum(row["in_library"] == "no" for row in rows), "with_missing_episodes": sum(row["in_library"] == "yes" and int(row["missing_monitored_episodes"] or 0) > 0 for row in rows)}, ensure_ascii=False))
