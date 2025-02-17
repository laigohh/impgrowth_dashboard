ALTER TABLE tasks DROP CONSTRAINT tasks_task_type_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_task_type_check CHECK (
    task_type IN (
        'approve_post', 'comment_group', 'like_group_post', 'like_comment',
        'schedule_post', 'answer_dm', 'like_feed',
        'comment_posts', 'answer_comments', 'like_posts', 'invite_friends',
        'add_friends'
    )
); 