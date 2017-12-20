"use strict";

System.register("wiwatSrt/bestAnswer/addBestAnswerPage", ["flarum/extend", "flarum/components/AdminNav", "flarum/components/AdminLinkButton", "wiwatSrt/bestAnswer/components/bestAnswerAdminPage"], function (_export, _context) {
    "use strict";

    var extend, AdminNav, AdminLinkButton, BestAnswerPage;

    _export("default", function () {
        // create the route
        app.routes['best-answser'] = { path: '/wiwatSrt/bestAnswer', component: BestAnswerPage.component() };

        // bind the route we created to the three dots settings button
        app.extensionSettings['Best Answer'] = function () {
            return m.route(app.route('best-answser'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            // add the Image Upload tab to the admin navigation menu
            items.add('best-answser', AdminLinkButton.component({
                href: app.route('best-answser'),
                icon: 'file-o',
                children: 'Best Answer',
                description: app.translator.trans('flarum-best-answer.admin.help_texts.description')
            }));
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_wiwatSrtBestAnswerComponentsBestAnswerAdminPage) {
            BestAnswerPage = _wiwatSrtBestAnswerComponentsBestAnswerAdminPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('wiwatSrt/bestAnswer/components/bestAnswerAdminPage', ['flarum/Component', 'flarum/components/Button', 'flarum/utils/saveSettings', 'flarum/components/Alert', 'flarum/components/Select', 'flarum/components/Switch'], function (_export, _context) {
  "use strict";

  var Component, Button, saveSettings, Alert, Select, Switch, BestAnswerPage;
  return {
    setters: [function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumUtilsSaveSettings) {
      saveSettings = _flarumUtilsSaveSettings.default;
    }, function (_flarumComponentsAlert) {
      Alert = _flarumComponentsAlert.default;
    }, function (_flarumComponentsSelect) {
      Select = _flarumComponentsSelect.default;
    }, function (_flarumComponentsSwitch) {
      Switch = _flarumComponentsSwitch.default;
    }],
    execute: function () {
      BestAnswerPage = function (_Component) {
        babelHelpers.inherits(BestAnswerPage, _Component);

        function BestAnswerPage() {
          babelHelpers.classCallCheck(this, BestAnswerPage);
          return babelHelpers.possibleConstructorReturn(this, (BestAnswerPage.__proto__ || Object.getPrototypeOf(BestAnswerPage)).apply(this, arguments));
        }

        babelHelpers.createClass(BestAnswerPage, [{
          key: 'init',
          value: function init() {
            var _this2 = this;

            // whether we are saving the settings or not right now
            this.loading = false;

            // the fields we need to watch and to save
            this.fields = ['showBestAnswerOnHomepage'];

            // the checkboxes we need to watch and to save.
            this.checkboxes = ['showBestAnswerOnHomepage'];

            // get the saved settings from the database
            var settings = app.data.settings;

            // our package prefix (to be added to every field and checkbox in the setting table)
            this.settingsPrefix = 'flarum-ext-best-answer';

            // Contains current values.
            this.values = {};
            // bind the values of the fields and checkboxes to the getter/setter functions
            this.fields.forEach(function (key) {
              return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)]);
            });
            this.checkboxes.forEach(function (key) {
              return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)] === "1");
            });
          }
        }, {
          key: 'view',
          value: function view() {
            return [m('div', { className: 'BestAnswerPage' }, [m('div', { className: 'container' }, [m('form', { onsubmit: this.onsubmit.bind(this) }, [m('fieldset', { className: 'BestAnswerPage-preferences' }, [m('legend', {}, app.translator.trans('flarum-best-answer.admin.labels.preferences.title')), m('label', {}, app.translator.trans('flarum-best-answer.admin.labels.preferences.show_best_answer_on_home')), Switch.component({
              state: this.values.showBestAnswerOnHomepage() || false,
              children: app.translator.trans('flarum-best-answer.admin.labels.preferences.toggle'),
              onchange: this.values.showBestAnswerOnHomepage
            })]), Button.component({
              type: 'submit',
              className: 'Button Button--primary',
              children: app.translator.trans('flarum-best-answer.admin.buttons.save'),
              loading: this.loading,
              disabled: !this.changed()
            })])])])];
          }
        }, {
          key: 'changed',
          value: function changed() {
            var _this3 = this;

            var fieldsCheck = this.fields.some(function (key) {
              return _this3.values[key]() !== app.data.settings[_this3.addPrefix(key)];
            });
            var checkboxesCheck = this.checkboxes.some(function (key) {
              return _this3.values[key]() !== (app.data.settings[_this3.addPrefix(key)] == '1');
            });

            return fieldsCheck || checkboxesCheck;
          }
        }, {
          key: 'onsubmit',
          value: function onsubmit(e) {
            var _this4 = this;

            // prevent the usual form submit behaviour
            e.preventDefault();

            // if the page is already saving, do nothing
            if (this.loading) return;

            // prevents multiple savings
            this.loading = true;

            // remove previous success popup
            app.alerts.dismiss(this.successAlert);

            var settings = {};

            // gets all the values from the form
            this.fields.forEach(function (key) {
              return settings[_this4.addPrefix(key)] = _this4.values[key]();
            });
            this.checkboxes.forEach(function (key) {
              return settings[_this4.addPrefix(key)] = _this4.values[key]();
            });

            // actually saves everything in the database
            saveSettings(settings).then(function () {
              // on success, show popup
              app.alerts.show(_this4.successAlert = new Alert({
                type: 'success',
                children: app.translator.trans('core.admin.basics.saved_message')
              }));
            }).catch(function () {}).then(function () {
              // return to the initial state and redraw the page
              _this4.loading = false;
              m.redraw();
            });
          }
        }, {
          key: 'addPrefix',
          value: function addPrefix(key) {
            return this.settingsPrefix + '.' + key;
          }
        }]);
        return BestAnswerPage;
      }(Component);

      _export('default', BestAnswerPage);
    }
  };
});;
'use strict';

System.register('wiwatSrt/bestAnswer/main', ['flarum/extend', 'flarum/app', 'flarum/components/PermissionGrid', 'wiwatSrt/bestAnswer/addBestAnswerPage'], function (_export, _context) {
    "use strict";

    var extend, app, PermissionGrid, addBestAnswerPage;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }, function (_wiwatSrtBestAnswerAddBestAnswerPage) {
            addBestAnswerPage = _wiwatSrtBestAnswerAddBestAnswerPage.default;
        }],
        execute: function () {
            app.initializers.add('wiwatSrt-bestAnswer', function () {

                addBestAnswerPage();

                extend(PermissionGrid.prototype, 'replyItems', function (items) {
                    items.add('selectBestAnswer', {
                        icon: 'comment-o',
                        label: app.translator.trans('flarum-best-answer.admin.permissions.best_answer'),
                        permission: 'discussion.selectBestAnswer'
                    });
                });
            });
        }
    };
});