/**
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2022-10-17
 */
export class GenericPath {
    constructor(startSegment) {
        this.segments = [startSegment];
    }
    /**
     * Get the number of segments in this path.
     *
     * @method getSegmentCount
     * @memberof Path
     * @return {number} The number (integer) of path segments.
     */
    getSegmentCount() {
        return this.segments.length;
    }
    /**
     * Get the path segment at the given index.
     *
     * @method getSegmentAt
     * @memberof Path
     * @return {PathSegment} The paths segment at the given index.
     */
    getSegmentAt(index) {
        return this.segments[index];
    }
    /**
     * Create a deep clone of this path.
     *
     * @method clone
     * @memberof Path
     * @return {Path} A deep clone/copy of this path.
     */
    clone() {
        const newPath = new GenericPath(this.segments[this.segments.length - 1].clone().reverse());
        for (var i = this.segments.length - 2; i >= 0; i--) {
            newPath.segments.push(this.segments[i].clone().reverse());
        }
        return newPath;
    }
    /**
     * Reverse this path (swap start and end and thus – the direction) in-place.
     *
     * @method reverse
     * @memberof Path
     * @return {PathSegment} This path instance.
     */
    reverse() {
        const newSegments = [];
        for (var i = this.segments.length - 1; i >= 0; i--) {
            newSegments.push(this.segments[i].reverse());
        }
        this.segments = newSegments;
        return this;
    }
    /**
     * Get the start point of this path segment.
     *
     * @method getStartPoint
     * @memberof PathSegment
     * @return {Vertex} The start point of this path segment.
     */
    getStartPoint() {
        return this.segments[0].getStartPoint();
    }
    /**
     * Get the end point of this path segment.
     *
     * @method getEndPoint
     * @memberof PathSegment
     * @return {Vertex} The end point of this path segment.
     */
    getEndPoint() {
        return this.segments[this.segments.length - 1].getEndPoint();
    }
    /**
     * Get the tangent's end point at the start point of this segment.
     *
     * @method getStartTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the starting point's tangent.
     */
    getStartTangent() {
        return this.segments[0].getStartTangent();
    }
    /**
     * Get the tangent's end point at the end point of this segment.
     *
     * @method getEndTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the ending point's tangent.
     */
    getEndTangent() {
        return this.segments[this.segments.length - 1].getEndTangent();
    }
}
//# sourceMappingURL=GenericPath.js.map