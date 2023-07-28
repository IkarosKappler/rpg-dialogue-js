/**
 * Refactored 3daddict's js-stl-parser.
 *
 * Found at
 *   https://github.com/3daddict/js-stl-parser/blob/master/index.js
 *
 * Refactored by Ikaros Kappler
 *
 * @date 2021-04-16
 * @version 0.0.1
 */
class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
// Vertex Holder
class VertexHolder {
    constructor(vertex1, vertex2, vertex3) {
        this.vert1 = vertex1;
        this.vert2 = vertex2;
        this.vert3 = vertex3;
    }
}
// transforming a Node.js Buffer into a V8 array buffer
const _toArrayBuffer = (buffer) => {
    const ab = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer.charCodeAt(i);
    }
    return ab;
};
/**
 * @classdesc STLParser
 */
export class STLParser {
    /**
     * Create a new STLParser with the given callback fuction for facets.
     *
     * @param {function} handleFacet function(x,y,z)
     * @constructor
     * */
    constructor(handleFacet) {
        this.handleFacet = handleFacet;
    }
    /**
     * Parse an stl string (ASCII).
     * @name _parseSTLString
     * @method _parseSTLString
     * @memberof STLParser
     * @param {string} stl
     * @private
     */
    _parseSTLString(stl) {
        // yes, this is the regular expression, matching the vertexes
        // it was kind of tricky but it is fast and does the job
        const vertexes = stl.match(/facet\s+normal\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+outer\s+loop\s+vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+endloop\s+endfacet/g);
        const _handleFacet = this.handleFacet;
        vertexes.forEach(function (vert) {
            const preVertexHolder = new VertexHolder();
            vert
                .match(/vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s/g)
                .forEach(function (vertex, i) {
                var tempVertex = vertex.replace("vertex", "").match(/[-+]?[0-9]*\.?[0-9]+/g);
                var preVertex = new Vertex(Number(tempVertex[0]), Number(tempVertex[1]), Number(tempVertex[2]));
                preVertexHolder["vert" + (i + 1)] = preVertex;
            });
            _handleFacet(preVertexHolder.vert1, preVertexHolder.vert2, preVertexHolder.vert3);
        });
    }
    /**
     * Parse binary STL data.
     * @param {ArrayBuffer} buf
     */
    _parseSTLBinary(buf) {
        // parsing an STL Binary File
        // (borrowed some code from here: https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/STLLoader.js)
        const headerLength = 80;
        const dataOffset = 84;
        const faceLength = 12 * 4 + 2;
        const le = true; // is little-endian
        const dvTriangleCount = new DataView(buf, headerLength, 4);
        const numTriangles = dvTriangleCount.getUint32(0, le);
        for (var i = 0; i < numTriangles; i++) {
            const dv = new DataView(buf, dataOffset + i * faceLength, faceLength);
            const normal = new Vertex(dv.getFloat32(0, le), dv.getFloat32(4, le), dv.getFloat32(8, le));
            const vertHolder = new VertexHolder();
            for (var v = 3; v < 12; v += 3) {
                var vert = new Vertex(dv.getFloat32(v * 4, le), dv.getFloat32((v + 1) * 4, le), dv.getFloat32((v + 2) * 4, le));
                vertHolder["vert" + v / 3] = vert;
            }
            this.handleFacet(vertHolder.vert1, vertHolder.vert2, vertHolder.vert3, normal);
        }
    }
    /**
     * Parse any, binary or ascii, STL data.
     *
     * @name parse
     * @method parse
     * @member
     * @memberof STLParser
     * @param {ArrayBstringuffer} binaryOrAsciiString
     * @returns
     */
    parse(binaryOrAsciiString) {
        var isAscii = true;
        for (var i = 0, len = binaryOrAsciiString.length; i < len && isAscii; i++) {
            if (binaryOrAsciiString.charCodeAt(i) > 127) {
                isAscii = false;
                break;
            }
        }
        if (isAscii) {
            this._parseSTLString(binaryOrAsciiString.toString());
        }
        else {
            const buffer = _toArrayBuffer(binaryOrAsciiString);
            this._parseSTLBinary(buffer);
        }
    }
}
//# sourceMappingURL=STLParser.js.map