import sys
import json
import os
import re

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 add_domain.py <domain>")
        sys.exit(1)
    
    new_domain = sys.argv[1]
    repo_dir = os.path.join(os.path.expanduser('~'), 'clawd', 'projects', 'openclaw-browser-relay-rewrite')
    
    # 1. Update manifest.json
    manifest_path = os.path.join(repo_dir, 'src', 'manifest.json')
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    
    new_url_pattern = f"https://{new_domain}/*"
    if new_url_pattern not in manifest.get('host_permissions', []):
        manifest.setdefault('host_permissions', []).append(new_url_pattern)
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)
            # Add newline at end of file
            f.write('\n')
        print(f"Added {new_url_pattern} to manifest.json")
    
    # 2. Update domains.js or modify background.js directly
    # To keep it simple, we modify background.js directly to update the array
    bg_path = os.path.join(repo_dir, 'src', 'background.js')
    with open(bg_path, 'r') as f:
        bg_content = f.read()
    
    # If domains are hardcoded in a variable like const AUTO_ATTACH_DOMAINS = ['play.sonos.com']
    # Let's check if we've already refactored background.js
    if 'const AUTO_ATTACH_DOMAINS =' in bg_content:
        # Regex to find the array
        pattern = r"const AUTO_ATTACH_DOMAINS = \[([^\]]*)\]"
        match = re.search(pattern, bg_content)
        if match:
            domains_str = match.group(1)
            domains = [d.strip().strip("'\"") for d in domains_str.split(',') if d.strip()]
            if new_domain not in domains:
                domains.append(new_domain)
                new_domains_str = ", ".join([f"'{d}'" for d in domains])
                new_array = f"const AUTO_ATTACH_DOMAINS = [{new_domains_str}]"
                bg_content = re.sub(pattern, new_array, bg_content)
                with open(bg_path, 'w') as f:
                    f.write(bg_content)
                print(f"Added {new_domain} to AUTO_ATTACH_DOMAINS in background.js")
    else:
        print("Refactoring background.js first...")
        # Refactor isSonosPlayUrl to isAutoAttachUrl
        bg_content = "const AUTO_ATTACH_DOMAINS = ['play.sonos.com', '" + new_domain + "'];\n\n" + bg_content
        bg_content = bg_content.replace(
            "function isSonosPlayUrl(url) {\n  return typeof url === 'string' && url.includes('play.sonos.com')\n}",
            "function isAutoAttachUrl(url) {\n  if (typeof url !== 'string') return false;\n  return AUTO_ATTACH_DOMAINS.some(domain => url.includes(domain));\n}"
        )
        bg_content = bg_content.replace("isSonosPlayUrl(", "isAutoAttachUrl(")
        with open(bg_path, 'w') as f:
            f.write(bg_content)
        print(f"Refactored background.js and added {new_domain}")

if __name__ == '__main__':
    main()
