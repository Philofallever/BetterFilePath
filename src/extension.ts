// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { env, version } from 'process';
import * as vscode from 'vscode';

//test.lua
async function copyRelativeFilePath(uri: vscode.Uri): Promise<void>
{
    await vscode.commands.executeCommand("copyRelativeFilePath");
    let path = await vscode.env.clipboard.readText();
    if (path !== undefined)
    {
        path = path.replace('\\', '/');
        let config = vscode.workspace.getConfiguration("betterpath");
        let subPath = config.get("packagepath");
        if (subPath !== undefined)
        {
            let repl = subPath as string;
            path = path.replace(repl, "");
        }

        let ignoreExtension = config.get('ignoreextension');
        if (ignoreExtension !== undefined)
        {
            ignoreExtension = ignoreExtension as boolean;
            if (ignoreExtension)
            {
                let reg = new RegExp("\\.\\w+");
                path = path.replace(reg, "");
            }
        }
        vscode.env.clipboard.writeText(path);
        vscode.window.showInformationMessage(`复制成功! ${path}`);
    }
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "betterfilepath" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('extension.helloWorld', () =>
    // {
    //     // The code you place here will be executed every time your command is executed

    //     // Display a message box to the user
    //     vscode.window.showInformationMessage('Hello World!');
    // });

    // context.subscriptions.push(disposable);

    let cmd = vscode.commands.registerCommand('extension.copyRelativeFilePath', (uri) => copyRelativeFilePath(uri));
    context.subscriptions.push(cmd);
}

// this method is called when your extension is deactivated
export function deactivate()
{

}
