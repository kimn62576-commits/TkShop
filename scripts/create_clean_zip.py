import os
import zipfile
from pathlib import Path

SOURCE_DIR = Path(r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace")
OUTPUT_ZIP = Path(r"C:\Users\H2PC\Downloads\TKSHOP-Deploy-Package.zip")

EXCLUDE_DIRS = {
    "node_modules",
    ".next",
    ".git",
    ".cache",
    ".system_generated",
    "logs",
    "__pycache__",
}

EXCLUDE_EXTS = {
    ".tsbuildinfo",
    ".log",
    ".tmp",
}

def create_clean_zip():
    if OUTPUT_ZIP.exists():
        OUTPUT_ZIP.unlink()

    print(f"Creating clean POSIX zip package for Wings / Linux: {OUTPUT_ZIP}")
    
    seen_arcnames = set()
    file_count = 0

    with zipfile.ZipFile(OUTPUT_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for root, dirs, files in os.walk(SOURCE_DIR):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            for file in sorted(files):
                file_path = Path(root) / file
                if file_path.suffix in EXCLUDE_EXTS:
                    continue
                if file.startswith(".env.local"):
                    continue

                rel_path = file_path.relative_to(SOURCE_DIR)
                # POSIX path with forward slashes ALWAYS! (Go / Wings requirement)
                arcname = rel_path.as_posix()

                if arcname in seen_arcnames:
                    print(f"Skipping duplicate: {arcname}")
                    continue

                seen_arcnames.add(arcname)
                
                # Write file directly without duplicate directory entries
                zf.write(file_path, arcname)
                file_count += 1

    file_size_mb = OUTPUT_ZIP.stat().st_size / (1024 * 1024)
    print(f"SUCCESS: Packaged {file_count} files into {OUTPUT_ZIP.name} ({file_size_mb:.2f} MB)")

if __name__ == "__main__":
    create_clean_zip()
