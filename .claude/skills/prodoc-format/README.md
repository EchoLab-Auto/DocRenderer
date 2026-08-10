# ProDoc Format Skill

Claude Code skill for defining the ProDoc document format specification.

ProDoc is a Markdown-based document organization convention that defines how a set of Markdown files are organized into a document structure that the ProDoc renderer can recognize and render.

## Capabilities

- Document graph model — every `.md` file is a box on an interactive canvas, directory only affects paths
- Frame block conventions (id / title / x / y / w / h / link + custom attrs)
- `link` relation syntax — `目标 | 标签 | 源边>目标边` entries with id/path resolution
- Layered auto-layout from link structure (depth layers, coordinate write-back)
- In-document blocks (H2 → hover panel with anchor jump)
- `prodoc-flow` flowchart syntax — interactive canvas rendering with clickable document links
- Authoring guidelines and verification checklist

## Quick Start

Invoke this skill in Claude Code when you need to:

- Create or validate ProDoc-formatted documents
- Understand the frame block and `link` relation conventions
- Author `prodoc-flow` flowchart blocks or wire document links into a navigable map
- Reference the layered layout, blocks, and canvas editing behavior

## License

MIT
