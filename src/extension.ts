import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    // The central "run_command" dispatcher for the AI
    let runCommand = vscode.commands.registerCommand('aiManager.run_command', async (args: { 
        action: 'create' | 'read' | 'update' | 'delete', 
        path: string, 
        newPath?: string // Used for 'update' (rename)
    }) => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return { success: false, message: "No workspace folder open." };
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const targetUri = vscode.Uri.file(path.resolve(rootPath, args.path));

        try {
            switch (args.action) {
                case 'create':
                    await vscode.workspace.fs.createDirectory(targetUri);
                    return { success: true, message: `Directory created: ${args.path}` };

                case 'read':
                    const entries = await vscode.workspace.fs.readDirectory(targetUri);
                    // Returns a list of [name, type] where 2 is a directory
                    const dirList = entries.map(([name, type]) => ({ name, type: type === 2 ? 'dir' : 'file' }));
                    return { success: true, data: dirList };

                case 'update':
                    if (!args.newPath) throw new Error("newPath is required for update.");
                    const newUri = vscode.Uri.file(path.resolve(rootPath, args.newPath));
                    await vscode.workspace.fs.rename(targetUri, newUri);
                    return { success: true, message: `Renamed ${args.path} to ${args.newPath}` };

                case 'delete':
                    await vscode.workspace.fs.delete(targetUri, { recursive: true, useTrash: true });
                    return { success: true, message: `Deleted ${args.path}` };

                default:
                    return { success: false, message: "Invalid action." };
            }
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    });

    context.subscriptions.push(runCommand);

// // AUTO-VALIDATION: Runs every time you start the debugger
//     console.log('Extension is active. Running self-test...');
    
//     vscode.commands.executeCommand('aiManager.run_command', { 
//         action: 'create', 
//         path: 'AI_FINAL_TEST' 
//     }).then(() => {
//         // Then Rename it
//         return vscode.commands.executeCommand('aiManager.run_command', { 
//             action: 'update', 
//             path: 'AI_FINAL_TEST', 
//             newPath: 'AI_CRUD_VERIFIED' 
//         });
//     }).then((res) => {
//         console.log('Final CRUD Verification:', res);
//     });
}
