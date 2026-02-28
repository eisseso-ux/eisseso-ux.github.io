import argparse
import os
import sys


def process_dir(root: str, recursive: bool = False):
    """
    Walk *root* and rename every file that:
      - contains '%20' (replace with '_')
      - has a .jpg/.jpeg extension in any case (normalize to lowercase)
    """
    if recursive:
        walker = os.walk(root, topdown=False)
    else:
        walker = [(root, [], os.listdir(root))]

    for current_root, dirs, files in walker:
        changed = False
        for name in files:
            old_path = os.path.join(current_root, name)
            new_name = name

            # Replace %20
            if "%20" in new_name:
                new_name = new_name.replace("%20", "_")
                changed = True

            # Normalize JPG/JPEG extension (case-insensitive)
            base, ext = os.path.splitext(new_name)
            #print(ext)
            if ext in [".JPG", ".JPEG", ".PNG"]:
                new_name = base + ext.lower()
                changed = True

            # Only rename if something changed
            if changed:
                new_path = os.path.join(current_root, new_name)

                #if os.path.exists(new_path):
                    #print(f"Skipping {old_path!r} → {new_path!r} (target exists)", file=sys.stderr)
                    #continue

                print(f"Renaming: {old_path!r} → {new_path!r}")
                os.rename(old_path, new_path)


def main():
    parser = argparse.ArgumentParser(
        description="Replace '%20' with '_' and normalize JPG/JPEG extensions."
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
        help="Walk sub-directories recursively.",
    )
    args = parser.parse_args()

    root = os.path.abspath(args.directory)
    if not os.path.isdir(root):
        print(f"Error: '{root}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    process_dir(root, recursive=args.recursive)


if __name__ == "__main__":
    main()