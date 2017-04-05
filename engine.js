"format cjs";

var wrap = require('word-wrap');
var map = require('lodash.map');
var longest = require('longest');
var rightPad = require('right-pad');

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = function (options) {

  var types = options.types;

  var length = longest(Object.keys(types)).length + 1;
  var choices = map(types, function (type, key) {
    return {
      name: rightPad(key + ':', length) + ' ' + type.description,
      value: key
    };
  }); 

  var projects = [{
    name: 'Streaming Event Data',
    value: 'streaming-events'
  }, {
    name: 'No SR&ED Project',
    value: ''
  }];

  var challenges = [{
    name: 'Data Mutation',
    value: 'data-mutation'
  }, {
    name: 'Performance',
    value: 'performance'
  }, {
    name: 'Work Categorization',
    value: 'data-mutation'
  }, {
    name: 'No Problem Area',
    value: ''
  }];

  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(cz, commit) {

      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Select the type of change that you\'re committing:',
          choices: choices
        }, {
          type: 'input',
          name: 'subject',
          message: 'Write a technical description of the change:\n'
        }, {
          type: 'input',
          name: 'hours',
          message: 'Specify how much time was spent on this commit. (ex: "2 h", "2.5 hours", "5 mins", "1 day", etc):\n'
        }, {
          type: 'list',
          name: 'project',
          message: 'Select the project this commit should fall into:',
          choices: projects
        }, {
          type: 'list',
          name: 'challenge',
          message: 'Select the project this commit should fall into:',
          choices: challenges
        }
      ]).then(function(answers) {

        var wrapOptions = {
          trim: true,
          newline: '\n',
          indent:''
        };

        // Hard limit this line
        var head = (answers.type + ': ' + answers.subject.trim());

        // Add SRED.io code
        var hours = '';
        var project = '';
        var challenge = '';

        if (answers.hours.trim()) {
          hours = ' -d ' + answers.hours.trim();
        }
 
        if (answers.project.trim() && answers.project !== "") {
          project = ' -p ' + answers.project;
        }

        if (answers.challenge.trim() && answers.challenge !== "") {
          challenge = ' -c ' + answers.challenge;
        }

        var sred = ''

        if (hours) {
          sred = 'sred' + [hours].join(' ');
        }

        if (project != '') {
          sred = sred + [project].join(' ');
        }

        if (challenge != '') {
          sred = sred + [challenge].join(' ');
        }

        commit([head, sred].join('\n\n'));
      });
    }
  };
};
