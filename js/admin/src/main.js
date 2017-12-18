import { extend } from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import addBestAnswerPage from 'wiwatSrt/bestAnswer/addBestAnswerPage'
app.initializers.add('wiwatSrt-bestAnswer', () => {
    
    addBestAnswerPage();
    
    
    extend(PermissionGrid.prototype, 'replyItems', function (items) {
        items.add('selectBestAnswer', {
            icon: 'comment-o',
            label: app.translator.trans('flarum-best-answer.admin.permissions.best_answer'),
            permission: 'discussion.selectBestAnswer'
        });
    });
});