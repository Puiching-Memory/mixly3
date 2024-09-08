import * as path from 'path';
// import * as dayjs from 'dayjs';
import {
    Workspace,
    Debug,
    Env,
    Msg
} from 'mixly';
import { KernelLoader } from '@basthon/kernel-loader';
import StatusBarImage from './statusbar-image';

class PythonShell {
    static {
        this.pythonShell = null;

        this.init = async function () {
            StatusBarImage.init();
            const projectPath = path.relative(Env.indexDirPath, Env.boardDirPath);
            const loader = new KernelLoader({
                pyodideURLs: [path.join(projectPath, 'deps/0.62.21/python3/pyodide/pyodide.js')],
                rootPath: 'http://download.mixlylibs.cloud/web-python3-deps',
                language: 'python3',
            });

            const kernel = await loader.kernelAvailable();
            if (!kernel) {
                return;
            }
            await kernel.init();
            await kernel.loaded();

            this.loader = loader;
            this.kernel = kernel;
            this.pythonShell = new PythonShell();
            this.pyodide = window.pyodide;
            this.interruptBuffer = new Uint8Array(new ArrayBuffer(1));
            this.pyodide.setInterruptBuffer(this.interruptBuffer);
        }

        this.run = function () {
            const mainWorkspace = Workspace.getMain();
            const editor = mainWorkspace.getEditorsManager().getActive();
            const code = editor.getCode();
            return this.pythonShell.run(code);
        }

        this.stop = function () {
            return this.pythonShell.stop();
        }
    }

    #statusBarTerminal_ = null;
    #statusBarImage_ = null;
    #statusBarsManager_ = null;
    #cursor_ = {
        row: 0,
        column: 0
    };
    #prompt_ = '';
    #inputResolve_ = null;
    #inputReject_ = null;
    #waittingForInput_ = false;
    #running_ = false;
    #kernel_ = null;
    #onCursorChangeEvent_ = () => this.#onCursorChange_();
    #commands_ = [
        {
            name: 'REPL-Enter',
            bindKey: 'Enter',
            exec: (editor) => {
                const session = editor.getSession();
                const cursor = session.selection.getCursor();
                if (cursor.row === this.#cursor_.row) {
                    const newPos = this.#statusBarTerminal_.getEndPos();
                    let str = this.#statusBarTerminal_.getValueRange(this.#cursor_, newPos);
                    str = str.replace(this.#prompt_, '');
                    this.#inputResolve_?.(str);
                    this.#inputResolve_ = null;
                    this.#inputReject_ = null;
                    this.#statusBarTerminal_.addValue('\n');
                    this.#exitInput_();
                }
                return false;
            }
        }, {
            name: 'REPL-ChangeEditor',
            bindKey: 'Delete|Ctrl-X|Backspace',
            exec: (editor) => {
                const session = editor.getSession();
                const cursor = session.selection.getCursor();
                if (cursor.row < this.#cursor_.row || cursor.column <= this.#cursor_.column) {
                    return true;
                }
                return false;
            }
        }
    ];
    constructor() {
        const mainWorkspace = Workspace.getMain();
        this.#statusBarsManager_ = mainWorkspace.getStatusBarsManager();
        this.#statusBarTerminal_ = this.#statusBarsManager_.getStatusBarById('output');
        this.#statusBarImage_ = this.#statusBarsManager_.getStatusBarById('images');
        this.#kernel_ = PythonShell.kernel;
        this.#addEventsListener_();
    }

    #addEventsListener_() {
        this.#kernel_.addEventListener('eval.finished', () => {
            this.#running_ = false;
            this.#statusBarTerminal_.addValue(`\n==${Msg.Lang['shell.finish']}==`);
        });

        this.#kernel_.addEventListener('eval.output', (data) => {
            this.#statusBarTerminal_.addValue(data.content);
        });

        this.#kernel_.addEventListener('eval.error', () => {
            this.#running_ = false;
            this.#statusBarTerminal_.addValue(`\n==${Msg.Lang['shell.finish']}==`);
        });

        this.#kernel_.addEventListener('eval.input', (data) => {
            const prompt = String(data?.content?.prompt);
            this.#statusBarTerminal_.addValue(prompt);
            this.#prompt_ = prompt;
            this.#inputResolve_ = data.resolve;
            this.#inputReject_ = data.reject;
            this.#enterInput_();
        });

        this.#kernel_.addEventListener('eval.display', (data) => {
            this.#statusBarsManager_.changeTo('images');
            this.#statusBarImage_.display(data);
        });
    }

    #onCursorChange_() {
        const editor = this.#statusBarTerminal_.getEditor();
        const session = editor.getSession();
        const cursor = session.selection.getCursor();
        editor.setReadOnly(
            cursor.row < this.#cursor_.row || cursor.column < this.#cursor_.column
        );
    }

    #enterInput_() {
        if (!this.#running_) {
            return;
        }
        this.#waittingForInput_ = true;
        this.#cursor_ = this.#statusBarTerminal_.getEndPos();
        const editor = this.#statusBarTerminal_.getEditor();
        editor.setReadOnly(false);
        editor.focus();
        const session = editor.getSession();
        session.selection.on('changeCursor', this.#onCursorChangeEvent_);
        editor.commands.addCommands(this.#commands_);
    }

    #exitInput_() {
        this.#waittingForInput_ = false;
        const editor = this.#statusBarTerminal_.getEditor();
        const session = editor.getSession();
        session.selection.off('changeCursor', this.#onCursorChangeEvent_);
        editor.commands.removeCommands(this.#commands_);
        this.#prompt_ = '';
        this.#inputResolve_?.('');
        // this.#inputReject_?.({});
        this.cursor_ = { row: 0, column: 0 };
        editor.setReadOnly(true);
    }

    run(code) {
        this.stop()
            .then(() => {
                this.#statusBarsManager_.changeTo('output');
                this.#statusBarsManager_.show();
                this.#statusBarTerminal_.setValue(`${Msg.Lang['shell.running']}...\n`);
                this.#running_ = true;
                this.#kernel_.dispatchEvent('eval.request', {
                    code,
                    interactive: false,
                });
            })
            .catch(Debug.error);
    }

    async stop() {
        if (this.#waittingForInput_) {
            this.#exitInput_();
        }
        if (this.#running_) {
            const timeout = 5;
            PythonShell.interruptBuffer[0] = 2;
            const startTime = Number(new Date());
            while (Number(new Date()) - startTime < timeout * 1000) {
                if (this.#running_) {
                    PythonShell.interruptBuffer[0] = 2;
                    await this.sleep(100);
                } else {
                    break;
                }
            }
            this.#running_ = false;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default PythonShell;