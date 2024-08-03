import os
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

SEASONS = list(range(2016, 2022))  # Adjusted to include the 2015-16 to 2022-23 seasons
DATA_DIR = "data"
STANDINGS_DIR = os.path.join(DATA_DIR, "standings")
SCORES_DIR = os.path.join(DATA_DIR, "scores")

os.makedirs(STANDINGS_DIR, exist_ok=True)
os.makedirs(SCORES_DIR, exist_ok=True)

def get_html(url, selector, sleep=5, retries=3, timeout=60000):
    import time
    html = None
    for i in range(1, retries + 1):
        time.sleep(sleep * i)
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page()
                page.goto(url, timeout=timeout)
                print(page.title())
                html = page.inner_html(selector)
                browser.close()
        except Exception as e:
            print(f"Error on {url}: {e}")
            continue
        else:
            break
    return html

def scrape_season_game(season):
    url = f"https://www.basketball-reference.com/leagues/NBA_{season}_games.html"
    html = get_html(url, "#content .filter")
    
    if html is None:
        print(f"Failed to load main page for season {season}")
        return
    
    soup = BeautifulSoup(html, "html.parser")
    links = soup.find_all("a")
    standings_pages = [f"https://www.basketball-reference.com{l['href']}" for l in links]
    
    for url in standings_pages:
        save_path = os.path.join(STANDINGS_DIR, url.split("/")[-1])
        if os.path.exists(save_path):
            continue
        
        html = get_html(url, "#all_schedule")
        if html is None:
            print(f"Failed to load page: {url}")
            continue
        
        with open(save_path, "w+", encoding='utf-8') as f:
            f.write(html)

def run_scraping():
    for season in SEASONS:
        scrape_season(season)

def scrape_game(standings_file):
    with open(standings_file, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")
    links = soup.find_all("a")
    hrefs = [l.get('href') for l in links]
    box_scores = [f"https://www.basketball-reference.com{l}" for l in hrefs if l and "boxscore" in l and '.html' in l]

    for url in box_scores:
        save_path = os.path.join(SCORES_DIR, url.split("/")[-1])
        if os.path.exists(save_path):
            continue

        html = get_html(url, "#content")
        if html is None:
            print(f"Failed to load box score: {url}")
            continue
        
        with open(save_path, "w+", encoding='utf-8') as f:
            f.write(html)

def run_game_scraping():
    standings_files = os.listdir(STANDINGS_DIR)
    for season in SEASONS:
        files = [s for s in standings_files if str(season) in s]
        
        for f in files:
            filepath = os.path.join(STANDINGS_DIR, f)
            scrape_game(nba_games.csv)

if __name__ == "__main__":
    run_scraping()
    run_game_scraping()
