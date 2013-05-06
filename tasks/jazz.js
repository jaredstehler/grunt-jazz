module.exports = function(grunt) {

    grunt.registerTask('jazz', 'command line config for jasmine', function() {
        jazz('jasmine', Array.prototype.slice.call(arguments, 0));
    });
    grunt.registerTask('jazz-server', 'command line config for jasmine-server', function() {
        jazz('jasmine-server', Array.prototype.slice.call(arguments, 0));
    });

    grunt.registerTask('jazz-s', 'command line config for jasmine-server', function() {
        jazz('jasmine-server', Array.prototype.slice.call(arguments, 0));
    });

    function getConfig(suite, jazzConfigObj, option) {
        if (typeof jazzConfigObj === "string") {
            jasmineConfigName = ["jasmine", suite, jazzConfigObj].join('.');
            configVal = grunt.option(option) || grunt.config(jasmineConfigName);
        } else if (!jazzConfigObj.length) { //if object{
            jasmineConfigName = ["jasmine", suite, jazzConfigObj.name].join('.');
            if (grunt.option(option) || option === "defaults") {
                configVal = jazzConfigObj.value || grunt.option(option);
            } else {
                configVal = grunt.config(jasmineConfigName);
            }
        }
        return {
            name: jasmineConfigName,
            value: configVal
        };
    }

    function setJasmineConfig(suite, jazzConfigOption, option) {
        if (typeof jazzConfigOption === "string" || jazzConfigOption.length === undefined) {
            convertedConfigNameVal = getConfig(suite, jazzConfigOption, option);
            grunt.config(convertedConfigNameVal.name, convertedConfigNameVal.value);
        } else { //if array
            for (var i = 0; i < jazzConfigOption.length; i++) {
                convertedConfigNameVal = getConfig(jazzConfigOption[i], option);
                grunt.config(convertedConfigNameVal.name, convertedConfigNameVal.value);
            }
        }
    }

    function jazz(task, specs) {
        var jazzConfig = grunt.config("jazz"),
            suite = jazzConfig['suite'],
            convertedConfigNameVal;

        if (jazzConfig["defaults"]) {
            setJasmineConfig(suite, jazzConfig["defaults"], "defaults");
        }

        for (var option in jazzConfig) {
            setJasmineConfig(suite, jazzConfig[option], option);
        }

        if (specs.length) {
            grunt.config(["jasmine", suite, "options", "specs"].join('.'), specs);
        }

        grunt.task.run(task);
    }
};