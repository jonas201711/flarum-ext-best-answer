import {extend} from "flarum/extend";
import AdminNav from "flarum/components/AdminNav";
import AdminLinkButton from "flarum/components/AdminLinkButton";
import BestAnswerPage from "wiwatSrt/bestAnswer/components/bestAnswerAdminPage"

export default function () {
    // create the route
    app.routes['best-answser'] = {path: '/wiwatSrt/bestAnswer', component: BestAnswerPage.component()};

    // bind the route we created to the three dots settings button
    app.extensionSettings['Best Answer'] = () => m.route(app.route('best-answser'));

    extend(AdminNav.prototype, 'items', items => {
        // add the Image Upload tab to the admin navigation menu
        items.add('best-answser', AdminLinkButton.component({
            href: app.route('best-answser'),
            icon: 'file-o',
            children: 'Best Answer',
            description: app.translator.trans('flarum-best-answer.admin.help_texts.description')
        }));
    });
}