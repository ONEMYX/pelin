Object.defineProperty(global, '__stack', {
	get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});
Object.defineProperty(global, '__line', {
	get: function() {
        return __stack[1].getLineNumber();
    }
});
Object.defineProperty(global, '__function', {
	get: function() {
        return __stack[1].getFunctionName();
    }
});

logConsole = function (file, line, func, msg) {
	file = file ? file : "FILE_unknow";
	line = line ? line : "LINE_unknow";
	func = func ? func : "FUNC_unknow";
	msg = msg ? msg : "MSG_unknow";
	var contentLog = [file,line,func].join('::')+" -> "+msg;
	console.log(contentLog);
}