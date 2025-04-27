/**
 * Debugger support for skulpt module
 */
import './skulpt.min.js';

function hasOwnProperty(obj, prop) {
    var proto = obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

class Breakpoint {
    constructor(filename, lineno, colno) {
        this.filename = filename;
        this.lineno = lineno;
        this.colno = colno;
        this.enabled = true;
        this.ignore_count = 0;
    }
}

export default class Debugger {
    constructor(filename, output_callback) {
        this.dbg_breakpoints = {};
        this.tmp_breakpoints = {};
        this.suspension_stack = [];
        this.current_suspension = -1;
        this.eval_callback = null;
        this.suspension = null;
        this.output_callback = output_callback;
        this.step_mode = false;
        this.filename = filename;
    }

    print(txt) {
        if (this.output_callback != null) {
            this.output_callback.print(txt);
        }
    }

    get_source_line(lineno) {
        if (this.output_callback != null) {
            return this.output_callback.get_source_line(lineno);
        }

        return "";
    }

    move_up_the_stack() {
        this.current_suspension = Math.min(this.current_suspension + 1, this.suspension_stack.length - 1);
    }

    move_down_the_stack() {
        this.current_suspension = Math.max(this.current_suspension - 1, 0);
    }

    enable_step_mode() {
        this.step_mode = true;
    }

    disable_step_mode() {
        this.step_mode = false;
    }

    get_suspension_stack() {
        return this.suspension_stack;
    }

    get_active_suspension() {
        if (this.suspension_stack.length === 0) {
            return null;
        }

        return this.suspension_stack[this.current_suspension];
    }

    generate_breakpoint_key(filename, lineno) {
        var key = filename + "-" + lineno;
        return key;
    }

    check_breakpoints(filename, lineno, colno) {
        // If Step mode is enabled then ignore breakpoints since we will just break
        // at every line.
        if (this.step_mode === true) {
            return true;
        }

        var key = this.generate_breakpoint_key(filename, lineno, colno);
        if (hasOwnProperty(this.dbg_breakpoints, key) &&
            this.dbg_breakpoints[key].enabled === true) {
            var bp = null;
            if (hasOwnProperty(this.tmp_breakpoints, key)) {
                delete this.dbg_breakpoints[key];
                delete this.tmp_breakpoints[key];
                return true;
            }

            this.dbg_breakpoints[key].ignore_count -= 1;
            this.dbg_breakpoints[key].ignore_count = Math.max(0, this.dbg_breakpoints[key].ignore_count);

            bp = this.dbg_breakpoints[key];
            if (bp.ignore_count === 0) {
                return true;
            }
            return false;
        }
        return false;
    }

    get_breakpoints_list() {
        return this.dbg_breakpoints;
    }

    disable_breakpoint(filename, lineno, colno) {
        var key = this.generate_breakpoint_key(filename, lineno, colno);

        if (hasOwnProperty(this.dbg_breakpoints, key)) {
            this.dbg_breakpoints[key].enabled = false;
        }
    }

    enable_breakpoint(filename, lineno, colno) {
        var key = this.generate_breakpoint_key(filename, lineno, colno);

        if (hasOwnProperty(this.dbg_breakpoints, key)) {
            this.dbg_breakpoints[key].enabled = true;
        }
    }

    clear_breakpoint(filename, lineno, colno) {
        var key = this.generate_breakpoint_key(filename, lineno, colno);
        if (hasOwnProperty(this.dbg_breakpoints, key)) {
            delete this.dbg_breakpoints[key];
            return null;
        }
        return "Invalid breakpoint specified: " + filename + " line: " + lineno;
    }

    clear_all_breakpoints() {
        this.dbg_breakpoints = {};
        this.tmp_breakpoints = {};
    }

    set_ignore_count(filename, lineno, colno, count) {
        var key = this.generate_breakpoint_key(filename, lineno, colno);
        if (hasOwnProperty(this.dbg_breakpoints, key)) {
            var bp = this.dbg_breakpoints[key];
            bp.ignore_count = count;
        }
    }

    set_condition(filename, lineno, colno, lhs, cond, rhs) {
        var key = this.generate_breakpoint_key(filename, lineno, colno);
        var bp;
        if (hasOwnProperty(this.dbg_breakpoints, key)) {
            // Set a new condition
            bp = this.dbg_breakpoints[key];
        } else {
            bp = new Breakpoint(filename, lineno, colno);
        }

        bp.condition = new window.Sk.Condition(lhs, cond, rhs);
        this.dbg_breakpoints[key] = bp;
    }

    print_suspension_info(suspension) {
        var filename = suspension.filename;
        var lineno = suspension.lineno;
        var colno = suspension.colno;
        this.print("Hit Breakpoint at <" + filename + "> at line: " + lineno + " column: " + colno + "\n");
        this.print("----------------------------------------------------------------------------------\n");
        this.print(" ==> " + this.get_source_line(lineno - 1) + "\n");
        this.print("----------------------------------------------------------------------------------\n");
    }

    set_suspension(suspension) {
        var parent = null;
        if (!hasOwnProperty(suspension, "filename") && suspension.child instanceof window.Sk.misceval.Suspension) {
            suspension = suspension.child;
        }

        // Pop the last suspension of the stack if there is more than 0
        if (this.suspension_stack.length > 0) {
            this.suspension_stack.pop();
            this.current_suspension -= 1;
        }

        // Unroll the stack to get each suspension.
        while (suspension instanceof window.Sk.misceval.Suspension) {
            parent = suspension;
            this.suspension_stack.push(parent);
            this.current_suspension += 1;
            suspension = suspension.child;
        }

        suspension = parent;

        this.print_suspension_info(suspension);
    }

    add_breakpoint(filename, lineno, colno, temporary) {
        var key = this.generate_breakpoint_key(filename, lineno, colno);
        this.dbg_breakpoints[key] = new Breakpoint(filename, lineno, colno);
        if (temporary) {
            this.tmp_breakpoints[key] = true;
        }
    }

    suspension_handler(susp) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(susp.resume());
            } catch (e) {
                reject(e);
            }
        });
    }

    resume() {
        // Reset the suspension stack to the topmost
        this.current_suspension = this.suspension_stack.length - 1;

        if (this.suspension_stack.length === 0) {
            this.print("No running program");
        } else {
            var promise = this.suspension_handler(this.get_active_suspension());
            promise.then(this.success.bind(this), this.error.bind(this));
        }
    }

    pop_suspension_stack() {
        this.suspension_stack.pop();
        this.current_suspension -= 1;
    }

    success(r) {
        if (r instanceof window.Sk.misceval.Suspension) {
            this.set_suspension(r);
        } else {
            if (this.suspension_stack.length > 0) {
                // Current suspension needs to be popped of the stack
                this.pop_suspension_stack();

                if (this.suspension_stack.length === 0) {
                    this.print("Program execution complete");
                    return;
                }

                var parent_suspension = this.get_active_suspension();
                // The child has completed the execution. So override the child's resume
                // so we can continue the execution.
                parent_suspension.child.resume = function () {
                    return r;
                };
                this.resume();
            } else {
                this.print("Program execution complete");
            }
        }
    }

    error(e) {
        this.print("Traceback (most recent call last):");
        for (var idx = 0; idx < e.traceback.length; ++idx) {
            this.print("  File \"" + e.traceback[idx].filename + "\", line " + e.traceback[idx].lineno + ", in <module>");
            var code = this.get_source_line(e.traceback[idx].lineno - 1);
            code = code.trim();
            code = "    " + code;
            this.print(code);
        }

        var err_ty = e.constructor.tp$name;
        for (idx = 0; idx < e.args.v.length; ++idx) {
            this.print(err_ty + ": " + e.args.v[idx].v);
        }
    }

    asyncToPromise(suspendablefn, suspHandlers, debugger_obj) {
        return new Promise(function (resolve, reject) {
            try {
                var r = suspendablefn();

                (function handleResponse(r) {
                    try {
                        while (r instanceof window.Sk.misceval.Suspension) {
                            debugger_obj.set_suspension(r);
                            return;
                        }

                        resolve(r);
                    } catch (e) {
                        reject(e);
                    }
                })(r);

            } catch (e) {
                reject(e);
            }
        });
    }

    execute(suspendablefn) {
        var r = suspendablefn();

        if (r instanceof window.Sk.misceval.Suspension) {
            this.suspensions.concat(r);
            this.eval_callback(r);
        }
    }
}