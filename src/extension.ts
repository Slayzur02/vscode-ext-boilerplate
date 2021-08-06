// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SideBarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	// insert codicon name inside the () brackets
	item.text = " $(beaker) Add Todo"
	item.command = "vstodo.addTodo"
	item.show();


  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("vstodo-sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.helloWorld", () => {
      // vscode.window.showInformationMessage('Hello World from vstodo!');
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.askAQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "Me Or You?",
        "Me",
        "You"
      );

      if (answer === "You") {
        vscode.window.showInformationMessage("Fine, let's rumble");
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.addTodo", () => {
      const { activeTextEditor } = vscode.window;

      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active text editor");
        return;
      }

      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );
      sidebarProvider._view?.webview.postMessage({
        type: "new-todo",
        value: text,
      });
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
