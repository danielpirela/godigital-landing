---
name: hyperframes-workflow
description: "Trigger: hyperframes video organization, render mp4, create mp4, video folder. Organize HyperFrames compositions into date-named directories."
license: Apache-2.0
metadata:
  author: gentle-ai
  version: "1.1"
---

# Skill: hyperframes-workflow

## Activation Contract

Use this skill when the user wants to organize, save, or render a HyperFrames video composition into an organized directory structure.

## Hard Rules

- NEVER render directly in the root directory unless explicitly requested.
- ALWAYS place finalized video projects in a subfolder inside `videos/`.
- ALWAYS use the naming convention: `videos/YYYY-MM-DD-<name>/index.html` (e.g., `videos/2026-05-11-godigital/index.html`).
- Moving the `index.html` two levels deep means relative asset paths MUST be updated (e.g., changing `assets/` to `../../assets/` for images, logos, etc).
- To render, run the command pointing to the directory: `npx hyperframes render videos/YYYY-MM-DD-<name>`
- Rendering MP4 requires `ffmpeg` installed on the OS.

## Execution Steps

1. Get the current date: `DATE=$(date +%Y-%m-%d)`
2. Create the target directory: `mkdir -p videos/${DATE}-<name>`
3. Move the working `index.html` to `videos/${DATE}-<name>/index.html`.
4. Update the asset paths inside the HTML file to reflect the new depth (e.g. `sed -i 's|"assets/|"../../assets/|g' <file>`).
5. Run the render command targeting the new directory: `npx hyperframes render videos/${DATE}-<name>`.
6. If `ffmpeg` is missing and the render fails, inform the user they must run `sudo apt install ffmpeg`.

## Output Contract

Return to the user:
- The path of the new project directory.
- An explicit instruction to install `ffmpeg` if the system lacks it.
