/**
 * Original source: https://www.w3schools.com/howto/howto_css_modals.asp
 *
 * @requires modal.css
 *
 * Converted to a class by
 * @author   Ikaros Kappler
 * @date     2020-09-14
 * @modified 2023-08-09 Ported to typescript.
 * @version  1.1.0
 **/
export interface IModalAction {
    label: string;
    action: string | (() => void);
}
export declare class Modal {
    static ACTION_CLOSE: IModalAction;
    static ACTION_CANCEL: IModalAction;
    static ACTION_OK: IModalAction;
    private static MODAL_COUNTER;
    private modalElements;
    constructor();
    setTitle(title: string): void;
    setBody(bodyContent: HTMLElement | string): void;
    setFooter(title: string): void;
    setActions(actions: Array<IModalAction>): void;
    close(): void;
    open(): void;
    private buildDOMNode;
    static isDOMNode(obj: any): boolean;
    static removeChildNodes: (node: any) => void;
}
