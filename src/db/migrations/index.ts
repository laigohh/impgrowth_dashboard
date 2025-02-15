import * as createSocialProfiles from './0001_create_social_profiles'
import * as createFacebookGroups from './0002_create_facebook_groups'
import * as createProfileGroups from './0003_create_profile_groups'
import * as createTasks from './0004_create_tasks'

export const migrations = {
    0: createSocialProfiles,
    1: createFacebookGroups,
    2: createProfileGroups,
    3: createTasks,
} 