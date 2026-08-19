# Markdown Link Extractor CLI Tool

A Node.js command-line application that recursively scans a given directory for Markdown (`.md`) files, extracts all hyperlinks with schemes `http://` or `file://`, and presents the results in a human-readable table in the terminal. Additionally, the extracted links (along with the source file and optional line number) are written to a designated output file for further processing.

## Features

- Recursive directory traversal to locate all `.md` files
- Extraction of links with `http://` or `file://` protocols from Markdown content
- Support for common Markdown link formats:
  - Inline `[text](url)`
  - Reference-style `[text][id]` and `[id]: url`
  - Angle-bracket autolinks `<url>`
  - Raw URLs (appearing without brackets) – if desired (configurable)
- Display of results in a formatted CLI table with columns:
  - **File** (relative path from the input directory)
  - **Link** (the extracted URL)
  - **Line** (line number where the link appears, optional)
- Output to a file (default `links.txt`) – the format can be plain table, CSV, or JSON (configurable)
- Command-line options for customization (output file, output format, verbose logging, help)

## Installation

```bash
npm install -g md-link-extractor
```

## Usage

```bash
md-link-extractor <directory> [options]
```

### Command-line Arguments
| Argument          | Description                                       |
|-------------------|---------------------------------------------------|
| `<directory>`     | Path to the root directory to scan (default is current dir . ) |

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

## Output Format

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

## License

MIT