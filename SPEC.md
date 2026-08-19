# Specification: Markdown Link Extractor CLI Tool

## 1. Overview
A Node.js command-line application that recursively scans a given directory for Markdown (`.md`) files, extracts all hyperlinks with schemes `http://` or `file://`, and presents the results in a human‑readable table in the terminal. Additionally, the extracted links (along with the source file and optional line number) are written to a designated output file for further processing.

## 2. Features
- Recursive directory traversal to locate all `.md` files.
- Extraction of links with `http://` or `file://` protocols from Markdown content.
- Support for common Markdown link formats:
  - Inline `[text](url)`
  - Reference-style `[text][id]` and `[id]: url`
  - Angle‑bracket autolinks `<url>`
  - Raw URLs (appearing without brackets) – if desired (configurable).
- Display of results in a formatted CLI table with columns:
  - **File** (relative path from the input directory)
  - **Link** (the extracted URL)
  - **Line** (line number where the link appears, optional)
- Output to a file (default `links.txt`) – the format can be plain table, CSV, or JSON (configurable).
- Command‑line options for customisation (output file, output format, verbose logging, help).

## 3. Requirements
- **Node.js** version 14.x or higher.
- make test is Node.js version is correct in every app start.
- No external services or databases required – everything runs locally.

## 5. Usage
```bash
node md-link-extractor <directory> [options]
```

### Command-line Arguments
| Argument          | Description                                       |
|-------------------|---------------------------------------------------|
| `<directory>`     | Path to the root directory to scan (default is current dir . ).    |


### Options
| Option                     | Alias | Description                                                                 | Default          |
|----------------------------|-------|-----------------------------------------------------------------------------|------------------|
| `--output <file>`          | `-o`  | File to write the results to.                                               | `links.txt`      |
| `--format <type>`          | `-f`  | Output format: `table`, `csv`, `json`.                                     | `table`          |
| `--include-raw`            | `-r`  | Also extract raw URLs (not wrapped in Markdown syntax).                    | `false`          |
| `--no-line-numbers`        |       | Suppress line numbers in the output.                                        | `false` (on)     |
| `--verbose`                | `-v`  | Print extra information (e.g., file scanning progress).                     | `false`          |
| `--help`                   | `-h`  | Show help.                                                                  |                  |
| `--version`                |       | Show version number.                                                        |                  |

### Examples
```bash
# Scan the current directory, output default table to console and links.txt
md-link-extractor .

# Scan 'docs' folder, output as CSV to 'report.csv'
md-link-extractor docs -o report.csv -f csv

# Include raw URLs and do not show line numbers
md-link-extractor ./project -r --no-line-numbers
```

## 6. Output Format

### Console Table (default)
A formatted ASCII table printed to `stdout`:
```
┌──────────────────────────────┬──────────────────────────────────────┬──────┐
│ File                         │ Link                                 │ Line │
├──────────────────────────────┼──────────────────────────────────────┼──────┤
│ README.md                    │ http://example.com                   │ 12   │
│ docs/guide.md                │ file:///usr/local/share/doc/manual   │ 5    │
└──────────────────────────────┴──────────────────────────────────────┴──────┘
```

### File Output
The default file (`links.txt`) contains the same table as above.  
For `--format csv`:
```csv
File,Link,Line
README.md,http://example.com,12
docs/guide.md,file:///usr/local/share/doc/manual,5
```
For `--format json`:
```json
[
  {"file":"README.md","link":"http://example.com","line":12},
  {"file":"docs/guide.md","link":"file:///usr/local/share/doc/manual","line":5}
]
```

## Algorithm & Implementation Details

###  Directory Traversal
- Use `fs.readdir` recursively (or `fs.opendir` for large directories) to walk the directory tree.
- Ignore hidden directories (starting with `.`) by default (configurable?).
- Only process files with the `.md` extension (case‑insensitive).

### Link Extraction
- Read each `.md` file line by line (to capture line numbers) using `readline` or `fs.createReadStream`.
- Apply regular expressions to detect links:
  - **Inline** `[text](url)` – capture URL part.
  - **Reference** `[text][id]` and `[id]: url` – need to resolve reference definitions if line numbers are needed for the reference, but simpler: extract from `[id]: url` lines as separate links.
  - **Autolink** `<url>` – capture content between `<` and `>`.
  - **Raw URL** (if `--include-raw`): find strings starting with `http://` or `file://` (must be preceded by whitespace or start of line, and followed by whitespace or punctuation).
- The regex should be robust enough to handle common Markdown edge cases (e.g., URLs with parentheses).

### Storage & Reporting
- Collect all extracted items as objects: `{ file: string, link: string, line: number }`.
- After scanning all files, generate the table using a library like `cli-table3` or `console.table` (with custom formatting).
- Write to file according to the chosen format.

### Performance Considerations
- For large directories, process files concurrently (limited concurrency to avoid file descriptor exhaustion).
- Use streaming line‑by‑line reading to avoid loading entire files into memory.

## Dependencies

### Production Dependencies
- `commander` or `yargs` – CLI argument parsing.
- `cli-table3` – for pretty terminal tables.
- (Optional) `fast-glob` – to simplify recursive file matching (instead of manual walk).
- (Optional) `json2csv` – if CSV output is supported.


## Code Structure

```
src/
├── index.js              # Entry point – sets up CLI and orchestrates flow
├── cli.js                # Command‑line argument parsing using commander/yargs
├── walker.js             # Recursive directory scanner (returns list of .md files)
├── extractor.js          # Link extraction from a single file (returns array of {link, line})
├── reporter.js           # Formats results for console and file
├── outputWriter.js       # Writes to file in specified format
├── utils/                # Helper functions (regex, path handling, etc.)
└── config.js             # Default settings and constants

tests/                    # Unit and integration tests
```

## Error Handling
- If the provided directory does not exist or is not a directory → print error and exit with code 1.
- If no `.md` files are found → print a message and exit gracefully.
- File reading errors (permission, locked) → log a warning (with `--verbose`), skip the file and continue.
- Invalid output path → attempt to create parent directories; if fails, fallback to `links.txt` in the current directory.

## Sample Session

```
$ md-link-extractor ~/projects/my-docs -o report.json -f json

Scanning directory: /Users/john/projects/my-docs
Found 3 Markdown files.
Extracting links...
✔ Done.

Results:
┌───────────────────┬─────────────────────────────────────────────────┬──────┐
│ File              │ Link                                            │ Line │
├───────────────────┼─────────────────────────────────────────────────┼──────┤
│ index.md          │ http://github.com                              │ 8    │
│ index.md          │ http://example.com/foo/bar                    │ 15   │
│ chapter2/foo.md   │ file:///etc/hosts                             │ 42   │
│ chapter2/foo.md   │ http://localhost:3000/api                     │ 55   │
└───────────────────┴─────────────────────────────────────────────────┴──────┘

Results written to: report.json (JSON format)
```

## License
MIT (or specify as per project preference).

---

*This specification serves as a blueprint for implementing the Markdown Link Extractor CLI tool. All design decisions are flexible and may be refined during development.*
