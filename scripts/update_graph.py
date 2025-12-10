import os
import json
import re

# Configuration
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(REPO_ROOT, "docs")
DATA_FILE = os.path.join(DOCS_DIR, "data.json")
GITHUB_BASE_URL = "https://github.com/bahattinyunus/ideolojiler_tr/blob/main"

# Files to exclude from the graph
EXCLUDE_FILES = [
    "README.md", "README_EN.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", 
    "GLOSSARY.md", "TIMELINE.md", "LICENSE"
]

def parse_markdown(file_path):
    filename = os.path.basename(file_path)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract Title (First H1)
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else filename.replace('.md', '')
    
    # Remove emojis from title for cleaner graph labels
    clean_label = re.sub(r'[^\w\s\(\)\-öçşığüÖÇŞİĞÜ]', '', title).strip()

    # Extract Description (First non-header paragraph)
    # Skip empty lines, headers, and images
    desc = "No description available."
    for line in content.split('\n'):
        line = line.strip()
        if line and not line.startswith('#') and not line.startswith('!') and not line.startswith('['):
            desc = line
            break

    # Determine Group based on keywords
    group = 0 # Default (Gray)
    content_lower = content.lower()
    
    if any(x in content_lower for x in ['sol', 'sosyalist', 'komünist', 'devrim', 'anarş']):
        group = 2 # Left (Yellow)
    if any(x in content_lower for x in ['milliyet', 'türk', 'ulusal', 'vatan']):
        group = 3 # Right/Nationalist (Blue)
    if any(x in content_lower for x in ['islam', 'din', 'muhafazakar']):
        group = 4 # Religious (Green)
    if 'kemalizm' in content_lower or 'atatürk' in content_lower:
        group = 1 # Kemalism/State (Red)

    return {
        "id": filename.replace(".md", ""),
        "label": clean_label,
        "desc": desc[:100] + "..." if len(desc) > 100 else desc,
        "link": f"{GITHUB_BASE_URL}/{filename}",
        "group": group
    }

def main():
    nodes = []
    links = []
    node_ids = set()

    # 1. Scan for Node Files
    for filename in os.listdir(REPO_ROOT):
        if filename.endswith(".md") and filename not in EXCLUDE_FILES:
            file_path = os.path.join(REPO_ROOT, filename)
            node_data = parse_markdown(file_path)
            nodes.append(node_data)
            node_ids.add(node_data['id'])

    # Add special "Merkez" node
    nodes.append({
        "id": "Merkez",
        "label": "MERKEZ",
        "desc": "Siyasetin dengelenme noktası.",
        "link": "",
        "group": 0
    })
    node_ids.add("Merkez")

    # 2. Generate Links
    # Default links to center for everyone to keep graph connected
    for node in nodes:
        if node['id'] != "Merkez":
            links.append({"source": "Merkez", "target": node['id']})

    # 3. Output JSON
    data = {"nodes": nodes, "links": links}
    
    os.makedirs(DOCS_DIR, exist_ok=True)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print(f"Graph data generated with {len(nodes)} nodes at {DATA_FILE}")

if __name__ == "__main__":
    main()
