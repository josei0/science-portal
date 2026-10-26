<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Learning module requests (user preference)

Whenever the user asks for a new learning module, deliver a complete, ready-to-use module:
- Age-appropriate Indonesian theory with clear objectives, concrete examples, and a small observation/activity.
- Relevant instructional illustrations and, when a suitable verified video is available, a supporting YouTube video. Provide source links; never invent video IDs.
- A quiz with valid answer indices and enough reading time for the target grade.
- An interactive game using the actual supported data format. Vary game mechanics across modules and include reasoning/application challenges, rather than only easy recall or speed pressure.
- Check the live database before authoring: query the global maximum material ID and review existing topics, including unpublished modules, to avoid duplicates and ID collisions. Follow `.agents/rules/module_creation.md`.
- Insert the finished module into the connected database and verify it is published and readable. New-module requests authorize this publishing step. Never overwrite existing modules; omit IDs to use the database sequence. Report blockers honestly instead of claiming a prepared file is already published.
- Match the requested grade/category. Preserve the physics-only restriction for SMP and SMA.

These defaults were explicitly requested by the user on 2026-10-26 and apply to future module requests unless the user specifies otherwise.
