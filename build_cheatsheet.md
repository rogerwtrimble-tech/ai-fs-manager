### VS Code Extension Build and Development Cheatsheet (`ai-fs-manager`)

This cheatsheet provides a quick reference for common commands used in setting up, developing, testing, and publishing the `ai-fs-manager` VS Code extension.

#### 1. Initial Setup

*   **Clone the Repository:**
    ```bash
    git clone https://github.com/rogerwtrimble-tech/ai-fs-manager.git
    cd ai-fs-manager
    ```

*   **Install Dependencies:**
    ```bash
    npm install
    # or if you prefer yarn
    # yarn install
    ```
    *This command installs all necessary project dependencies defined in `package.json`.*

#### 2. Development Workflow

*   **Open Project in VS Code:**
    ```bash
    code .
    ```
    *Opens the current directory as a VS Code workspace.*

*   **Run Extension in Development Host:**
    *   From within VS Code, press `F5`. This will open a new VS Code window with your extension loaded and ready for debugging.
    *   Alternatively, use the `Run Extension` launch configuration from the Run and Debug view (`Ctrl+Shift+D` or `Cmd+Shift+D`).

*   **Compile TypeScript/JavaScript:**
    ```bash
    npm run compile
    ```
    *This command runs type checking, linting, and then uses `esbuild` to compile your source code into `dist/extension.js`.*

*   **Watch for Changes and Recompile (Development Mode):**
    ```bash
    npm run watch
    ```
    *This command runs `esbuild` in watch mode and `tsc` in watch mode (`--noEmit`) concurrently, automatically recompiling your extension and checking types as you make changes. This is ideal for active development.*
    *   Individual watch commands:*
        ```bash
        npm run watch:esbuild   # Watches and recompiles with esbuild
        npm run watch:tsc       # Watches for type errors without emitting JS
        ```

#### 3. Packaging and Publishing

*   **Package the Extension (create `.vsix` file):**
    ```bash
    npx vsce package
    ```
    *This command uses the VS Code Extension Manager (`vsce`) to create a `.vsix` file, which is the distributable package for your extension. It first runs `npm run package` which includes type checking, linting, and a production build with `esbuild`.*

*   **Publish the Extension to the Marketplace:**
    ```bash
    npx vsce publish
    ```
    *This command publishes your extension to the Visual Studio Code Marketplace. You will need to be logged in to `vsce` with your Azure DevOps personal access token. If you haven't logged in, `vsce` will prompt you to do so.*

#### 4. Testing

*   **Run All Tests:**
    ```bash
    npm test
    ```
    *This command executes the tests defined in your extension project. It first runs `pretest` which includes compiling tests, compiling the extension, and linting.*

*   **Compile Tests Separately:**
    ```bash
    npm run compile-tests
    ```
    *Compiles the test files.*

*   **Watch Tests for Changes:**
    ```bash
    npm run watch-tests
    ```
    *Watches test files for changes and recompiles them.*

#### 5. Code Quality

*   **Check Types:**
    ```bash
    npm run check-types
    ```
    *Performs a TypeScript type check without emitting JavaScript files.*

*   **Run Linter:**
    ```bash
    npm run lint
    ```
    *Runs ESLint on your source code to identify and report on patterns found in ECMAScript/JavaScript code.*

#### 6. Cleaning

*   **Clean Node Modules and Build Artifacts:**
    ```bash
    rm -rf node_modules dist out *.vsix
    # Then reinstall dependencies for a fresh start
    npm install
    ```
    *This is a general command to clean up your project by removing `node_modules`, compiled output (`dist`, `out`), and any generated `.vsix` files. Useful for a fresh start or troubleshooting dependency issues.*