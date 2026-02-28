"""
replace_percent20.py

Renames every file in the given directory (recursively or not) that contains
the substring '%20' in its name, replacing each '%20' with an underscore '_'.

Usage
-----
    python3 replace_percent20.py [directory] [--recursive]

Examples
--------
    # In the current folder, rename only the current folder's files
    python3 replace_percent20.py

    # In the folder /home/user/screenshots, rename only that folder's files
    python3 replace_percent20.py /home/user/screenshots

    # Recursively rename all files in a tree
    python3 replace_percent20.py . --recursive
"""

import argparse
import os
import sys

def replace_in_path(path: str, old: str = "%20", new: str = "_") -> str:
    """
    Return a new path with all occurrences of *old* replaced by *new*.
    Only the basename (file/folder name) is altered; the directory part stays the same.
    """
    dir_part, base_name = os.path.split(path)
    new_base = base_name.replace(old, new)
    return os.path.join(dir_part, new_base)

def process_dir(root: str, recursive: bool = False):
    """
    Walk *root* and rename every file (and optionally directory) that contains '%20'.
    """
    if recursive:
        walker = os.walk(root, topdown=False)  # bottom‑up so we can rename sub‑dirs after their contents
    else:
        # Mimic os.walk for only the top level
        walker = [(root, [], os.listdir(root))]

    for current_root, dirs, files in walker:
        # ---------- rename files ----------
        for name in files:
            if "%20" in name:
                old_path = os.path.join(current_root, name)
                new_name = name.replace("%20", "_")
                new_path = os.path.join(current_root, new_name)

                # Check for a collision – if the target already exists we skip it.
                if os.path.exists(new_path):
                    print(f"Skipping {old_path!r} → {new_path!r} (target exists)", file=sys.stderr)
                    continue

                print(f"Renaming file: {old_path!r} → {new_path!r}")
                os.rename(old_path, new_path)

        # ---------- rename directories (if recursive) ----------
        if recursive:
            for name in dirs:
                if "%20" in name:
                    old_dir = os.path.join(current_root, name)
                    new_dir_name = name.replace("%20", "_")
                    new_dir = os.path.join(current_root, new_dir_name)

                    if os.path.exists(new_dir):
                        print(f"Skipping dir {old_dir!r} → {new_dir!r} (target exists)", file=sys.stderr)
                        continue

                    print(f"Renaming dir : {old_dir!r} → {new_dir!r}")
                    os.rename(old_dir, new_dir)

def main():
    parser = argparse.ArgumentParser(
        description="Replace '%20' with '_' in file names."
    )
    parser.add_argument(
        "directory",
        nargs="?",
        default=".",
        help="Root directory to process (default: current directory).",
    )
    parser.add_argument(
        "--recursive",
        "-r",
        action="store_true",
        help="Walk sub‑directories recursively.",
    )
    args = parser.parse_args()

    root = os.path.abspath(args.directory)
    if not os.path.isdir(root):
        print(f"Error: '{root}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    process_dir(root, recursive=args.recursive)

if __name__ == "__main__":
    main()