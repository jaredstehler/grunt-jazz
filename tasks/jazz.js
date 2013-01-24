module.exports = function(grunt) {

    grunt.registerTask('jazz', 'command line config for jasmine', function() {
        jazz('jasmine', Array.prototype.slice.call(arguments, 0));
    });
    grunt.registerTask('jazz-server', 'command line config for jasmine-server', function() {
        jazz('jasmine-server', Array.prototype.slice.call(arguments, 0));
    });
    
    function getConfig(jazzConfigObj, option) {
        if (typeof jazzConfigObj === "string") {
            jasmineConfigName = "jasmine." + jazzConfigObj;
            configVal = grunt.option(option) || grunt.config(jasmineConfigName);
        } else if (!jazzConfigObj.length) { //if object{
            jasmineConfigName = "jasmine." + jazzConfigObj.name;
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

    function setJasmineConfig(jazzConfigOption, option) {
        if (typeof jazzConfigOption === "string" || jazzConfigOption.length === undefined) {
            convertedConfigNameVal = getConfig(jazzConfigOption, option);
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
            convertedConfigNameVal;

        if (jazzConfig["defaults"]) {
            setJasmineConfig(jazzConfig["defaults"], "defaults");
        }

        for (var option in jazzConfig) {
            setJasmineConfig(jazzConfig[option], option);
        }

        if (specs.length) {
            grunt.config("jasmine.specs", specs);
        }

        grunt.task.run(task);
    }
};