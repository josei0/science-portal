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
- Insert the finished module into the connected database and verify it is published and readable. New-module requests authorize this publishing step. Never overwrite unrelated existing modules; omit IDs to use the database sequence for new modules. For an explicitly requested revision, back up and update only the identified modules, preserving their IDs, order, and student progress. Report blockers honestly instead of claiming a prepared file is already published.
- Subject mapping is mandatory: `sd_1_3` (grades 1–3) and `sd_4_6` (grades 4–6) are IPA (natural sciences); `smp_7_9` (grades 7–9) and `sma_10_12` (grades 10–12) are exclusively Fisika (Physics). Do not use existing non-science exceptions as templates for new SD modules.
- Before revising or adding modules, study existing relevant modules and both the student renderer and teacher editors. Use direct topic titles, short numbered subtopics, everyday examples, and concise game cards for early primary grades. Game JSON must work in the teacher editor as well as in the student game.
- Theory presentation preference (27 October 2026): use the user's live edits to modules 33 and 35 as the reference: topic title with emoji → brief everyday introduction → one learning-objective sentence → relevant illustration → short numbered core subtopics → optional related video at the end. Avoid a grade/reading-assistance banner and separate lengthy activity, game-instruction, or source-list sections in the student theory. Integrate a brief observation into a core subtopic when useful; keep research references in authoring notes. Fetch the current database content before editing and preserve user edits to other modules exactly. Treat topics the user says have already been taught as duplicates even when the database has no separate matching title.

These defaults were explicitly requested by the user on 2026-10-26 and apply to future module requests unless the user specifies otherwise.
