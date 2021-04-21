// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

async function copyRelativeFilePath(uri: vscode.Uri, repl: string | undefined): Promise<void>
{
    let fsPath = uri?.fsPath ?? vscode.window.activeTextEditor?.document.uri.fsPath;
    if (fsPath !== undefined)
    {
        let config = vscode.workspace.getConfiguration("betterpath");

        let ignoreExtension = config.get('ignoreextension');
        let isLua = false;
        if (ignoreExtension !== undefined && ignoreExtension as boolean)
        {
            let stat = await fs.promises.lstat(fsPath);
            if (stat.isFile())
            {
                isLua = path.extname(fsPath) === ".lua";
                fsPath = fsPath.replace(path.extname(fsPath), "");
            }
        }

        if (vscode.workspace.rootPath)
            fsPath = fsPath.replace(vscode.workspace.rootPath + path.sep, "")


        fsPath = fsPath.replace(/\\/g, '/'); // 路径分隔符

        let subPath = config.get("packagepath");
        if (subPath !== undefined)
        {
            let repl = subPath as string;
            fsPath = fsPath.replace(repl, "");
        }

        if (repl !== undefined)
            fsPath = fsPath.replace(/\//g, repl);
        vscode.env.clipboard.writeText(fsPath);
        vscode.window.showInformationMessage(`复制成功! ${fsPath}`);
    }
}

async function copyName(uri: vscode.Uri): Promise<void>
{
    let name: string = "";
    if (uri !== undefined)
    {
        let ext: string = "";
        let stat = fs.lstatSync(uri.fsPath);
        if (stat.isFile())
            ext = path.extname(uri.fsPath);

        name = path.basename(uri.fsPath, ext);
        vscode.window.showInformationMessage(`复制成功! ${name}`);
    }

    vscode.env.clipboard.writeText(name);
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

    let cmd = vscode.commands.registerCommand('extension.copyRelativeFilePath', (uri) => copyRelativeFilePath(uri, undefined));
    context.subscriptions.push(cmd);
    cmd = vscode.commands.registerCommand('extension.copyPackagePath', (uri) => copyRelativeFilePath(uri, "."))

    cmd = vscode.commands.registerCommand('extension.copyName', (uri) => copyName(uri));
    context.subscriptions.push(cmd);
}

// this method is called when your extension is deactivated
export function deactivate()
{

}
