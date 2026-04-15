import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    /**
     * The central "run_command" dispatcher.
     * This serves as the direct interface for Gemini / AI Assistants.
     */
    let runCommand = vscode.commands.registerCommand('aiManager.run_command', async (args: { 
        action: 'create' | 'read' | 'update' | 'delete', 
        path: string, 
        newPath?: string 
    }) => {
        // 1. Validation for the AI's input
        if (!args || !args.path) {
            vscode.window.showErrorMessage('AI FS Manager: No path provided in arguments.');
            return { success: false, message: "Path argument is missing." };
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('AI FS Manager: No workspace folder open.');
            return { success: false, message: "No workspace folder open." };
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const targetUri = vscode.Uri.file(path.resolve(rootPath, args.path));

        try {
            switch (args.action) {
                case 'create':
                    // createDirectory is recursive by default
                    await vscode.workspace.fs.createDirectory(targetUri);
                    return { success: true, message: `Directory created: ${args.path}` };

                case 'read':
                    const entries = await vscode.workspace.fs.readDirectory(targetUri);
                    const dirList = entries.map(([name, type]) => ({ 
                        name, 
                        type: type === vscode.FileType.Directory ? 'dir' : 'file' 
                    }));
                    return { success: true, data: dirList };

                case 'update':
                    if (!args.newPath) {
                        throw new Error("newPath is required for update action.");
                    }
                    const newUri = vscode.Uri.file(path.resolve(rootPath, args.newPath));
                    await vscode.workspace.fs.rename(targetUri, newUri);
                    return { success: true, message: `Renamed ${args.path} to ${args.newPath}` };

                case 'delete':
                    // recursive: true deletes subfolders; useTrash: true is safer for AI tools
                    await vscode.workspace.fs.delete(targetUri, { recursive: true, useTrash: true });
                    return { success: true, message: `Deleted ${args.path}` };

                default:
                    return { success: false, message: `Action '${args.action}' is not supported.` };
            }
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    });

    context.subscriptions.push(runCommand);
}

export function deactivate() {}