/**
 * @author  Ikaros Kappler
 * @date    2023-07-25
 * @version 1.0.0
 */
import { IDialogueConfig, IDialogueListener, IDialogueNodeType, IDialogueRenderer, IGlobalLibs, IMiniQuestionaire, INpcDialogueMapping, INpcPathMapping } from "./interfaces";
export declare class RPGDialogueLogic<T extends IDialogueNodeType> {
    name: string;
    structure: IDialogueConfig<T>;
    private currentQuestionaireName;
    private currentQuestionaire;
    private listeners;
    constructor(dialogueStruct: IDialogueConfig<T>, validateStructure: boolean);
    addDialogueChangeListener(listener: IDialogueListener<T>): boolean;
    removeDialogueChangeListener(listener: IDialogueListener<T>): boolean;
    private fireStateChange;
    private getCurrentNpcName;
    private createSendAnswerCallback;
    loadCurrentQuestionaire(dialogueRenderer: IDialogueRenderer): boolean;
    /**
     * Get the current mini questionaire or null if no current or next questionaire is available.
     * @returns
     */
    getCurrentQuestionaire(): IMiniQuestionaire | null;
    /**
     * Check if the end was reached or if there are more questions available
     * @returns {boolean} false if there is a current question active.
     */
    isEndReached(): boolean;
    /**
     * Give an answer to the current questionaire. Only valid answer indices will be acceped.
     * @param {number} index
     * @returns {boolean} true if the the index is valid.
     */
    sendAnswer(index: number): boolean;
    /**
     * Find the initial mini questionaire.
     */
    resetToBeginning(alternateStartNodeName?: string | null): void;
    /**
     * Check if the current dialogue is still valid or reached its end.
     */
    private validate;
    /**
     * This is a convenient function for quickly integrating the dialogue logic into
     * an existing HTML document with prepared two <div> elements for displaying
     * the question and possible answers.
     *
     * @param {IDialogueRenderer} dialogueRenderer - The dialogue renderer to use.
     * @param {string?} alternateStartNodeName - If you don't want to start at 'intro' specify your start node name here.
     * @returns
     */
    beginConversation(dialogueRenderer: IDialogueRenderer, alternateStartNodeName?: string | null): void;
    /**
     * Load the dialogue structure from the JSON document at the given path.
     *
     * @param {string} path
     * @returns {Promise<RPGDialogueLogic>}
     */
    static loadConfigFromJSON<T extends IDialogueNodeType>(path: string, globalLibs: IGlobalLibs): Promise<IDialogueConfig<T>>;
    /**
     * Load the dialogue structure from the JSON document at the given path.
     *
     * @param {string} path
     * @returns {Promise<RPGDialogueLogic>}
     */
    static loadFromJSON<T extends IDialogueNodeType>(path: string, globalLibs: IGlobalLibs): Promise<RPGDialogueLogic<T>>;
    /**
     * Pass an array of { npcName: string; path: string } objects and get an
     * array of { npcName: string; dialogue: RPGDialogueLogic<T> }.
     *
     * @param paths
     * @returns
     */
    static loadAllFromJSON<T extends IDialogueNodeType>(paths: INpcPathMapping, globalLibs: IGlobalLibs): Promise<INpcDialogueMapping<T>>;
}
