import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import saveSettings from 'flarum/utils/saveSettings';
import Alert from 'flarum/components/Alert';
import Select from 'flarum/components/Select';
import Switch from 'flarum/components/Switch';

export default class BestAnswerPage extends Component {

  init() {
    // whether we are saving the settings or not right now
    this.loading = false;

    // the fields we need to watch and to save
    this.fields = [
        showBestAnswerOnHomepage
    ];

    // the checkboxes we need to watch and to save.
    this.checkboxes = [
        showBestAnswerOnHomepage
    ];

    // get the saved settings from the database
    const settings = app.data.settings;

    // our package prefix (to be added to every field and checkbox in the setting table)
    this.settingsPrefix = 'flarum-ext-best-answer';

     
    // Contains current values.
    this.values = {};
    // bind the values of the fields and checkboxes to the getter/setter functions
    this.fields.forEach(key =>
      this.values[key] = m.prop(settings[this.addPrefix(key)])
    );
    this.checkboxes.forEach(key =>
      this.values[key] = m.prop(settings[this.addPrefix(key)] === '1')
    );
   
  }

  /**
   * Show the actual ImageUploadPage.
   *
   * @returns {*}
   */
  view() {
    return [
      m('div', { className: 'BestAnswerPage' }, [
        m('div', { className: 'container' }, [
          m('form', { onsubmit: this.onsubmit.bind(this) }, [
            m('fieldset', { className: 'BestAnswerPage-preferences' }, [
              m('legend', {}, app.translator.trans('flarum-best-answer.admin.labels.preferences.title')),
              m('label', {}, app.translator.trans('flarum-best-answer.admin.labels.preferences.show_best_answer_on_home')),
              Switch.component({
                state: this.values.showBestAnswerOnHomepage() || false,
                children: app.translator.trans('flarum-best-answer.admin.labels.preferences.toggle'),
                onchange: this.values.showBestAnswerOnHomepage
              })
              
            ]),
             
            Button.component({
              type: 'submit',
              className: 'Button Button--primary',
              children: app.translator.trans('flarum-best-answer.admin.buttons.save'),
              loading: this.loading,
              disabled: !this.changed()
            }),
          ])
        ])
      ])
    ];
  }



 
  /**
   * Checks if the values of the fields and checkboxes are different from
   * the ones stored in the database
   *
   * @returns boolean
   */
  changed() {
    var fieldsCheck = this.fields.some(
      key => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
    var checkboxesCheck = this.checkboxes.some(
      key => this.values[key]() !== (app.data.settings[this.addPrefix(key)] == '1'));
    
    return fieldsCheck || checkboxesCheck ;
  }

  /**
   * Saves the settings to the database and redraw the page
   *
   * @param e
   */
  onsubmit(e) {
    // prevent the usual form submit behaviour
    e.preventDefault();

    // if the page is already saving, do nothing
    if (this.loading) return;

    // prevents multiple savings
    this.loading = true;

    // remove previous success popup
    app.alerts.dismiss(this.successAlert);

    const settings = {};

    // gets all the values from the form
    this.fields.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
    this.checkboxes.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
   

    // actually saves everything in the database
    saveSettings(settings)
      .then(() => {
        // on success, show popup
        app.alerts.show(this.successAlert = new Alert({
          type: 'success',
          children: app.translator.trans('core.admin.basics.saved_message')
        }));
      })
      .catch(() => {
      })
      .then(() => {
        // return to the initial state and redraw the page
        this.loading = false;
        m.redraw();
      });
  }

  /**
   * Adds the prefix `this.settingsPrefix` at the beginning of `key`
   *
   * @returns string
   */
  addPrefix(key) {
    return this.settingsPrefix + '.' + key;
  }
}
