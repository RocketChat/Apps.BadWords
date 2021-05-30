import {
    ISetting,
    SettingType,
} from "@rocket.chat/apps-engine/definition/settings";

export enum AppSetting {
    LinkToExtractBadWords = "link_to_extract_bad_words",
    ApplyFilterToAllChannels = "apply_filter_to_all_channels",
    ListOfBlockedWords = "list_of_blocked_words",
    ListOfAllowededWords = "list_of_Allowed_words",
    IncludeChannels = "include_channels",
    ExcludeChannels = "exclude_channels",
}

export const Settings: Array<ISetting> = [
    {
        id: AppSetting.LinkToExtractBadWords,
        public: true,
        type: SettingType.STRING,
        packageValue:
            "https://raw.githubusercontent.com/web-mech/badwords/master/lib/lang.json",
        i18nLabel: "link_to_extract_bad_words",
        required: false,
    },
    {
        id: AppSetting.ListOfBlockedWords,
        public: true,
        type: SettingType.STRING,
        packageValue: "",
        i18nLabel: "list_of_blocked_words",
        required: false,
    },
    {
        id: AppSetting.ListOfAllowededWords,
        public: true,
        type: SettingType.STRING,
        packageValue: "",
        i18nLabel: "list_of_Allowed_words",
        required: false,
    },
    {
        id: AppSetting.ApplyFilterToAllChannels,
        public: true,
        type: SettingType.BOOLEAN,
        packageValue: true,
        i18nLabel: "apply_filter_to_all_channels",
        required: false,
    },
    {
        id: AppSetting.IncludeChannels,
        public: true,
        type: SettingType.STRING,
        packageValue: "",
        i18nLabel: "Include_the_Channels",
        required: false,
    },
    {
        id: AppSetting.ExcludeChannels,
        public: true,
        type: SettingType.STRING,
        packageValue: "",
        i18nLabel: "Exclude_the_Channels",
        required: false,
    },
];
