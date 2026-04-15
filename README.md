# AI FS Manager

An automated file system bridge for VS Code. This extension provides a standardized command interface (`run_command`) that allows AI assistants (Gemini, Copilot, etc.) to perform directory CRUD operations safely within your workspace.

## Features

This extension exposes a single, high-level command: `aiManager.run_command`. 

### Supported Actions:
* **Create**: Recursively creates directories (equivalent to `mkdir -p`).
* **Read**: Lists contents of a directory.
* **Update**: Renames or moves directories.
* **Delete**: Moves directories to the system trash (safety first!).

## AI Integration (Technical Interface)

To use this extension programmatically via an AI Agent, invoke the following VS Code command:

**Command ID:** `aiManager.run_command`

**Arguments Schema:**
```json
{
  "action": "create" | "read" | "update" | "delete",
  "path": "string",       // Relative to workspace root
  "newPath": "string"    // Required for 'update' action only
}