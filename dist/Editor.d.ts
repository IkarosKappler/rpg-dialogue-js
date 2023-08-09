/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2023-07-25
 * @version  1.0.0
 **/
import { MouseHandler } from "plotboilerplate";
import { TouchHandler } from "./TouchHandler";
export declare class Editor {
    currentMouseHandler: MouseHandler | null;
    currentTouchHandler: TouchHandler | null;
    constructor(dialogueConfigJSONPath: any);
}
