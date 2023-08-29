/******/ (() => {
  // webpackBootstrap
  console.log("x");
  /******/ var __webpack_modules__ = {
    /***/ "./dist/cjs/Editor.js":
      /*!****************************!*\
  !*** ./dist/cjs/Editor.js ***!
  \****************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        console.log("Define editor");

        /**
         * A script for demonstrating the line-point-distance.
         *
         * @require PlotBoilerplate, MouseHandler, gup, dat.gui
         *
         * @author   Ikaros Kappler
         * @date     2023-07-25
         * @version  1.0.0
         **/
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Editor = void 0;
        var gup_1 = __webpack_require__(/*! ./gup */ "./dist/cjs/gup.js");
        var detectDarkMode_1 = __webpack_require__(/*! ./detectDarkMode */ "./dist/cjs/detectDarkMode.js");
        var plotboilerplate_1 = __webpack_require__(/*! plotboilerplate */ "./node_modules/plotboilerplate/src/esm/index.js");
        var RPGDialogueLogic_1 = __webpack_require__(/*! ./RPGDialogueLogic */ "./dist/cjs/RPGDialogueLogic.js");
        var editorHelpers_1 = __webpack_require__(/*! ./editorHelpers */ "./dist/cjs/editorHelpers.js");
        var editorRenderer_1 = __webpack_require__(/*! ./editorRenderer */ "./dist/cjs/editorRenderer.js");
        var TouchHandler_1 = __webpack_require__(/*! ./TouchHandler */ "./dist/cjs/TouchHandler.js");
        var FileDrop_1 = __webpack_require__(
          /*! plotboilerplate/src/cjs/utils/io/FileDrop */ "./node_modules/plotboilerplate/src/cjs/utils/io/FileDrop.js"
        );
        var modal_1 = __webpack_require__(/*! ./modal */ "./dist/cjs/modal.js");
        var Editor = /** @class */ (function () {
          function Editor(dialogueConfigJSONPath, isRecoveryFromLocalStorageActive) {
            this.currentMouseHandler = null;
            this.currentTouchHandler = null;
            var _self = this;
            console.log("Initialize plotboilerplate");
            // Fetch the GET params
            var GUP = (0, gup_1.gup)();
            var isDarkmode = (0, detectDarkMode_1.detectDarkMode)(GUP);
            // All config params are optional.
            this.pb = new plotboilerplate_1.PlotBoilerplate(
              plotboilerplate_1.PlotBoilerplate.utils.safeMergeByKeys(
                {
                  canvas: document.getElementById("my-canvas"),
                  fullSize: true,
                  fitToParent: true,
                  scaleX: 1.0,
                  scaleY: 1.0,
                  rasterGrid: true,
                  drawOrigin: false,
                  rasterAdjustFactor: 2.0,
                  redrawOnResize: true,
                  defaultCanvasWidth: 1024,
                  defaultCanvasHeight: 768,
                  canvasWidthFactor: 1.0,
                  canvasHeightFactor: 1.0,
                  cssScaleX: 1.0,
                  cssScaleY: 1.0,
                  cssUniformScale: true,
                  autoAdjustOffset: true,
                  offsetAdjustXPercent: 50,
                  offsetAdjustYPercent: 50,
                  backgroundColor: isDarkmode ? "#000000" : "#ffffff",
                  enableMouse: true,
                  enableKeys: true
                },
                GUP
              )
            );
            var boxSize = {
              width: 120,
              height: 20
            };
            this.editorHelpers = new editorHelpers_1.EditorHelper(this, this.pb, boxSize);
            this.editorRenderer = new editorRenderer_1.EditorRenderer(this.pb, boxSize, this.editorHelpers, isDarkmode);
            // +---------------------------------------------------------------------------------
            // | The render method.
            // +-------------------------------
            this.pb.config.postDraw = function (draw, fill) {
              if (!_self.dialogConfig) {
                return;
              }
              _self.editorRenderer.renderBoxes(_self.dialogConfig);
              _self.editorRenderer.renderConnections(_self.dialogConfig);
            };
            if (isRecoveryFromLocalStorageActive) {
              console.log("Trying to recover config from localstorage.");
              this.tryLoadFromLocalStorage()
                .then(function (dc) {
                  _self.handleDialogConfigLoaded(dc);
                })
                .catch(function () {
                  console.log("Loading from localstorage failed. Falling back loading from specified path.");
                  _self.tryLoadFromJSON(dialogueConfigJSONPath);
                });
            } else {
              _self.tryLoadFromJSON(dialogueConfigJSONPath);
            }
            // Install DnD with FileDrop
            var fileDrop = new FileDrop_1.FileDrop(this.pb.eventCatcher);
            fileDrop.onFileJSONDropped(function (jsonObject) {
              console.log("[onFileJSONDropped] jsonObject", jsonObject);
              // TODO: properly convert to dialog-config
              _self.handleDialogConfigLoaded(editorHelpers_1.EditorHelper.fromObject(jsonObject));
            });
            // Also accept uploads via button
            var importJSON = function () {
              document.getElementById("input-upload-file").click();
            };
            document.getElementById("b-import-json").addEventListener("click", importJSON);
            document.getElementById("input-upload-file").addEventListener("change", function (_evt) {
              var fileInput = document.getElementById("input-upload-file");
              if (!fileInput.files || fileInput.files.length === 0) {
                return;
              }
              console.log("inputFile", fileInput.files[0]);
              var reader = new FileReader();
              reader.onload = function () {
                var jsonText = reader.result;
                console.log(reader.result);
                _self.handleDialogConfigLoaded(editorHelpers_1.EditorHelper.fromObject(JSON.parse(jsonText)));
              };
              reader.readAsText(fileInput.files[0]);
            });
            document.getElementById("b-run-test").addEventListener("click", function () {
              _self.testCurrentDialogueConfig();
            });
            document.getElementById("b-new").addEventListener("click", _self.requestCreateNewGraph());
            document.getElementById("b-show-json").addEventListener("click", _self.showJSON());
            document.getElementById("b-goto-github").addEventListener("click", function () {
              window.open("https://github.com/IkarosKappler/rpg-dialogue", "_blank");
            });
          }
          Editor.prototype.tryStartAutosaveLoop = function () {
            if (this.autosaveTimer) {
              return;
            }
            var _self = this;
            this.autosaveTimer = globalThis.setInterval(function () {
              _self.tryAutoSave();
            }, 10000);
          };
          Editor.prototype.tryAutoSave = function () {
            if (this.editorHelpers.domHelper.isAutoSave()) {
              // console.log("Putting to localstorage.");
              this.putToLocalStorage();
            }
          };
          Editor.prototype.requestCreateNewGraph = function () {
            var _self = this;
            return function () {
              _self.editorHelpers.domHelper.modal.setTitle("Drop current graph?");
              _self.editorHelpers.domHelper.modal.setBody("Do you really want to create a new graph and lose unsaved changes?");
              _self.editorHelpers.domHelper.modal.setFooter("");
              _self.editorHelpers.domHelper.modal.setActions([
                modal_1.Modal.ACTION_CANCEL,
                {
                  label: "Yes",
                  action: function () {
                    _self.editorHelpers.domHelper.modal.close();
                    _self.performNewGraph();
                  }
                }
              ]);
              _self.editorHelpers.domHelper.modal.open();
            };
          };
          Editor.prototype.performNewGraph = function () {
            var newConfig = {
              meta: { name: "dialogue_A", npcs: [{ name: "NPC #0" }] },
              graph: {
                intro: { q: "Hello world!", o: [{ a: "Hello, NPC!", next: null }], editor: { position: { x: 0, y: 0 } } }
              }
            };
            this.handleDialogConfigLoaded(newConfig);
          };
          Editor.prototype.showJSON = function () {
            var _self = this;
            return function () {
              var removePositions = _self.editorHelpers.domHelper.isExportWithoutPositions();
              var dConfig = removePositions
                ? editorHelpers_1.EditorHelper.removePositions(_self.editorHelpers.dialogConfigWithPositions)
                : _self.editorHelpers.dialogConfigWithPositions;
              var jsonString = JSON.stringify(dConfig, null, 4);
              var jsonArea = document.createElement("textarea");
              jsonArea.setAttribute("readonly", "true");
              jsonArea.innerHTML = jsonString;
              jsonArea.classList.add("json-preview");
              _self.editorHelpers.domHelper.modal.setTitle("Current Graph as JSON");
              _self.editorHelpers.domHelper.modal.setBody(jsonArea);
              _self.editorHelpers.domHelper.modal.setFooter("");
              _self.editorHelpers.domHelper.modal.setActions([modal_1.Modal.ACTION_CLOSE]);
              _self.editorHelpers.domHelper.modal.open();
            };
          };
          /**
           * Open a modal and test the current dialogue config (runs a RPGDialogueLogic instant).
           */
          Editor.prototype.testCurrentDialogueConfig = function () {
            var _self = this;
            // Create this structure:
            // <div class="rpg-output">
            //    <div class="rpg-output-question"></div>
            //    <ul class="rpg-output-options"></ul>
            // </div>
            var outputContainer = document.createElement("div");
            var outputQuestion = document.createElement("div");
            var outputOptions = document.createElement("ul");
            outputContainer.classList.add("rpg-output");
            outputQuestion.classList.add("rpg-output-question");
            outputOptions.classList.add("rpg-output-options");
            outputContainer.appendChild(outputQuestion);
            outputContainer.appendChild(outputOptions);
            var dialogueListener = function (dialogueConfig, nextNodeName, oldNodeName, selectedOptionIndex) {
              // Highlight current node in the graph editor :)
              // console.log("nextNodeName", nextNodeName, "oldNodeName", oldNodeName, "selectedOptionIndex", selectedOptionIndex);
              _self.editorHelpers.setHighlightedNode(nextNodeName);
            };
            var rpgLogic = new RPGDialogueLogic_1.RPGDialogueLogic(this.dialogConfig, false);
            rpgLogic.addDialogueChangeListener(dialogueListener);
            var alternateStartNodeName = this.editorHelpers.selectedNodeName;
            this.editorHelpers.setSelectedNode(null, null);
            rpgLogic.beginConversation(outputQuestion, outputOptions, alternateStartNodeName);
            this.editorHelpers.domHelper.modal.setTitle("Test");
            this.editorHelpers.domHelper.modal.setBody(outputContainer);
            this.editorHelpers.domHelper.modal.setFooter("");
            this.editorHelpers.domHelper.modal.setActions([modal_1.Modal.ACTION_CLOSE]);
            this.editorHelpers.domHelper.modal.open();
          };
          Editor.prototype.handleDialogConfigLoaded = function (config) {
            // Check if all graph nodes have positions to render.
            this.dialogConfig = this.editorHelpers.enrichPositions(config);
            this.editorHelpers.enrichMetaData(this.dialogConfig);
            console.log("Enriched meta data", this.dialogConfig);
            this.editorHelpers.setDialogConfig(this.dialogConfig);
            // Ad DnD support for boxes.
            if (this.currentMouseHandler) {
              this.currentMouseHandler.destroy();
              this.currentMouseHandler = null;
            }
            this.currentMouseHandler = this.editorHelpers.boxMovehandler(); // dialogConfig);
            // Ad DnD support for boxes.
            if (this.currentTouchHandler) {
              this.currentTouchHandler.destroy();
              this.currentTouchHandler = null;
            }
            this.currentTouchHandler = new TouchHandler_1.TouchHandler(this.pb, this.dialogConfig, this.editorHelpers);
            this.pb.redraw();
            this.tryStartAutosaveLoop();
          };
          Editor.prototype.putToLocalStorage = function () {
            var jsonString = JSON.stringify(this.dialogConfig);
            globalThis.localStorage.setItem("__rpgeditor.dialogueconfig", jsonString);
          };
          Editor.prototype.tryLoadFromJSON = function (dialogueConfigJSONPath) {
            var _self = this;
            RPGDialogueLogic_1.RPGDialogueLogic.loadConfigFromJSON(dialogueConfigJSONPath).then(function (config) {
              console.log("structure", config);
              _self.handleDialogConfigLoaded(config);
            });
          };
          Editor.prototype.tryLoadFromLocalStorage = function () {
            return new Promise(function (accept, reject) {
              var jsonString = globalThis.localStorage.getItem("__rpgeditor.dialogueconfig");
              if (!jsonString || jsonString === "") {
                reject();
              }
              try {
                var jsonObject = JSON.parse(jsonString);
                if (!jsonObject) {
                  reject();
                  return;
                }
                var dialogueConfig = editorHelpers_1.EditorHelper.fromObject(jsonObject);
                accept(dialogueConfig);
              } catch (exception) {
                console.warn(exception);
                reject();
              }
            });
          };
          return Editor;
        })();
        exports.Editor = Editor;
        //# sourceMappingURL=Editor.js.map

        /***/
      },

    /***/ "./dist/cjs/RPGDialogueLogic.js":
      /*!**************************************!*\
  !*** ./dist/cjs/RPGDialogueLogic.js ***!
  \**************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";

        /**
         * @author  Ikaros Kappler
         * @date    2023-07-25
         * @version 1.0.0
         */
        var __importDefault =
          (this && this.__importDefault) ||
          function (mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.RPGDialogueLogic = void 0;
        var axios_1 = __importDefault(__webpack_require__(/*! axios */ "./node_modules/axios/dist/browser/axios.cjs"));
        var RPGDialogueLogic = /** @class */ (function () {
          function RPGDialogueLogic(dialogueStruct, validateStructure) {
            // this.name = "RPGDialogue";
            this.structure = dialogueStruct;
            this.listeners = [];
            this.resetToBeginning();
            if (validateStructure) {
              this.validate();
            }
          }
          RPGDialogueLogic.prototype.addDialogueChangeListener = function (listener) {
            for (var i = 0; i < this.listeners.length; i++) {
              if (this.listeners[i] === listener) {
                return false;
              }
            }
            this.listeners.push(listener);
            return true;
          };
          RPGDialogueLogic.prototype.removeDialogueChangeListener = function (listener) {
            for (var i = 0; i < this.listeners.length; i++) {
              if (this.listeners[i] === listener) {
                this.listeners.splice(i, 1);
                return true;
              }
            }
            return false;
          };
          RPGDialogueLogic.prototype.fireStateChange = function (nextNodeName, oldNodeName, selectedOptionIndex) {
            for (var i = 0; i < this.listeners.length; i++) {
              this.listeners[i](this.structure, nextNodeName, oldNodeName, selectedOptionIndex);
            }
          };
          RPGDialogueLogic.prototype.getCurrentNpcName = function () {
            var _a, _b, _c;
            var npcIndex = (_a = this.currentQuestionaire.npcIndex) !== null && _a !== void 0 ? _a : 0;
            var npcName =
              ((_c = (_b = this.structure.meta) === null || _b === void 0 ? void 0 : _b.npcs) === null || _c === void 0
                ? void 0
                : _c.length) > 0
                ? this.structure.meta.npcs[npcIndex].name
                : null;
            return npcName;
          };
          RPGDialogueLogic.prototype.loadCurrentQuestionaire = function (setQuestionText, addOptionNode) {
            if (this.currentQuestionaire) {
              var npcName = this.getCurrentNpcName();
              setQuestionText(this.currentQuestionaire.q, npcName);
              for (var i = 0; i < this.currentQuestionaire.o.length; i++) {
                addOptionNode(this.currentQuestionaire.o[i].a, i);
              }
              return true;
            }
            return false;
          };
          /**
           * Get the current mini questionaire or null if no current or next questionaire is available.
           * @returns
           */
          RPGDialogueLogic.prototype.getCurrentQuestionaire = function () {
            return this.currentQuestionaire;
          };
          /**
           * Check if the end was reached or if there are more questions available
           * @returns {boolean} false if there is a current question active.
           */
          RPGDialogueLogic.prototype.isEndReached = function () {
            return this.currentQuestionaire === null || this.currentQuestionaire === undefined;
          };
          /**
           * Give an answer to the current questionaire. Only valid answer indices will be acceped.
           * @param {number} index
           * @returns {boolean} true if the the index is valid.
           */
          RPGDialogueLogic.prototype.sendAnswer = function (index) {
            if (index < 0 || index >= this.currentQuestionaire.o.length) {
              return false;
            }
            var oldQuestionaireName = this.currentQuestionaireName;
            var selectedAnswer = this.currentQuestionaire.o[index];
            if (!selectedAnswer) {
              return false;
            }
            if (!selectedAnswer.next) {
              this.currentQuestionaireName = null;
              this.currentQuestionaire = null;
            } else {
              this.currentQuestionaireName = selectedAnswer.next;
              var nextQuestionaire = this.structure.graph[this.currentQuestionaireName];
              // Can be the final one!
              if (!nextQuestionaire.o || nextQuestionaire.o.length === 0) {
                this.currentQuestionaireName = null;
                this.currentQuestionaire = null;
              } else {
                this.currentQuestionaire = nextQuestionaire;
              }
            }
            this.fireStateChange(this.currentQuestionaireName, oldQuestionaireName, index);
            console.log("Next questionaire", this.currentQuestionaire);
            return true;
          };
          /**
           * Find the initial mini questionaire.
           */
          RPGDialogueLogic.prototype.resetToBeginning = function (alternateStartNodeName) {
            this.currentQuestionaireName =
              alternateStartNodeName !== null && alternateStartNodeName !== void 0 ? alternateStartNodeName : "intro";
            this.currentQuestionaire = this.structure.graph[this.currentQuestionaireName];
            if (!this.currentQuestionaire) {
              throw "Cannot initialize RPGDialogueLogic: structure does not have an 'intro' entry";
            }
          };
          /**
           * Check if the current dialogue is still valid or reached its end.
           */
          RPGDialogueLogic.prototype.validate = function () {
            // ...
          };
          RPGDialogueLogic.prototype.getHTMLElement = function (nodeId) {
            return typeof nodeId === "string" ? document.getElementById(nodeId) : nodeId;
          };
          /**
           * This is a convenient function for quickly integrating the dialogue logic into
           * an existing HTML document with prepared two <div> elements for displaying
           * the question and possible answers.
           *
           * @param {string|HTMLElement} questionNodeId - The output container (or ID) for questions.
           * @param {string|HTMLElement} optionsNodeId - The output container (or ID) for answer options.
           * @param {string} alternateStartNodeName - If you don't want to start at 'intro' specify your start node name here.
           * @returns
           */
          RPGDialogueLogic.prototype.beginConversation = function (questionNodeId, optionsNodeId, alternateStartNodeName) {
            var questionNode = this.getHTMLElement(questionNodeId);
            var optionsNode = this.getHTMLElement(optionsNodeId);
            /**
             * Set the text in the question node.
             * @param {*} questionText
             */
            var setQuestionText = function (questionText, npcName) {
              if (npcName) {
                questionNode.innerHTML = '<span class="rpg-npcname">'.concat(npcName, ":</span> ").concat(questionText);
              } else {
                questionNode.innerHTML = questionText;
              }
            };
            /**
             * Clear the options node. Just for upper level use here.
             */
            var clearOptionsNode = function () {
              optionsNode.innerHTML = "";
            };
            /**
             * Add a new option node with the given answer text and option index. Use
             * the option index to send the answer.
             *
             * @param {*} answerText
             * @param {*} optionIndex
             */
            var addOptionNode = function (answerText, optionIndex) {
              var answerNode = document.createElement("li");
              var answerLinkNode = document.createElement("a");
              answerLinkNode.innerHTML = answerText;
              answerLinkNode.setAttribute("href", "#");
              answerLinkNode.addEventListener("click", function () {
                sendAnswer(optionIndex);
              });
              answerNode.appendChild(answerLinkNode);
              optionsNode.appendChild(answerNode);
            };
            var _self = this;
            /**
             * Send the selected answer (by index).
             * @param {number} index
             */
            var sendAnswer = function (index) {
              _self.sendAnswer(index);
              if (_self.isEndReached()) {
                setQuestionText("---END OF CONVERSATION---", undefined);
                clearOptionsNode();
              }
              clearOptionsNode();
              _self.loadCurrentQuestionaire(setQuestionText, addOptionNode);
            };
            // Initialize the first question.
            _self.resetToBeginning(alternateStartNodeName);
            _self.loadCurrentQuestionaire(setQuestionText, addOptionNode);
            _self.fireStateChange(this.currentQuestionaireName, null, -1);
          };
          /**
           * Load the dialogue structure from the JSON document at the given path.
           *
           * @param {string} path
           * @returns {Promise<RPGDialogueLogic>}
           */
          RPGDialogueLogic.loadConfigFromJSON = function (path) {
            console.log("axios", axios_1.default);
            return new Promise(function (accept, reject) {
              axios_1.default
                .get(path)
                .then(function (response) {
                  // handle success
                  console.log(response);
                  // Validate response data?
                  accept(response.data);
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                  reject();
                })
                .finally(function () {
                  // always executed
                });
            });
          };
          /**
           * Load the dialogue structure from the JSON document at the given path.
           *
           * @param {string} path
           * @returns {Promise<RPGDialogueLogic>}
           */
          RPGDialogueLogic.loadFromJSON = function (path) {
            return new Promise(function (accept, reject) {
              RPGDialogueLogic.loadConfigFromJSON(path).then(function (struct) {
                accept(new RPGDialogueLogic(struct, true));
              });
            });
          };
          return RPGDialogueLogic;
        })();
        exports.RPGDialogueLogic = RPGDialogueLogic;
        //# sourceMappingURL=RPGDialogueLogic.js.map

        /***/
      },

    /***/ "./dist/cjs/TouchHandler.js":
      /*!**********************************!*\
  !*** ./dist/cjs/TouchHandler.js ***!
  \**********************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        /**
         * A wrapper class for AlloyFinger.
         *
         * @author  Ikaros Kappler
         * @date    2023-07-31
         * @version 1.0.0
         */
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.TouchEnterLeaveHandler = exports.TouchHandler = void 0;
        var plotboilerplate_1 = __webpack_require__(/*! plotboilerplate */ "./node_modules/plotboilerplate/src/esm/index.js");
        var TouchHandler = /** @class */ (function () {
          function TouchHandler(pb, dialogConfigWithPositions, editorHelper) {
            this.wasTouchUsed = false;
            var _self = this;
            // Install a touch handler on the canvas.
            var relPos = function (pos) {
              var bounds = pb.canvas.getBoundingClientRect();
              return { x: pos.x - bounds.left, y: pos.y - bounds.top };
            };
            var draggedNodeName = null;
            var draggedNode = null;
            var draggedOption;
            var wasDragged = false;
            var touchMovePos = null;
            var touchDownPos = null;
            var clearTouch = function () {
              touchMovePos = null;
              touchDownPos = null;
              draggedNodeName = null;
            };
            var afProps = {
              touchStart: function (evt) {
                console.log("Touchstart");
                _self.wasTouchUsed = true;
                if (evt.touches.length == 1) {
                  touchMovePos = new plotboilerplate_1.Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                  touchDownPos = new plotboilerplate_1.Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                  draggedNodeName = editorHelper.locateNodeBoxNameAtPos(
                    pb.transformMousePosition(touchMovePos.x, touchMovePos.y)
                  );
                  if (draggedNodeName) {
                    draggedNode = dialogConfigWithPositions.graph[draggedNodeName];
                  } else {
                    draggedOption = editorHelper.locateOptionBoxNameAtPos(
                      pb.transformMousePosition(touchMovePos.x, touchMovePos.y)
                    );
                  }
                  wasDragged = false;
                }
              },
              touchMove: function (evt) {
                console.log("touchMove");
                _self.wasTouchUsed = true;
                if (evt.touches.length == 1 && draggedNode) {
                  evt.preventDefault();
                  evt.stopPropagation();
                  if (!touchDownPos || !touchMovePos) {
                    return;
                  }
                  var rel = relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY });
                  var trans = pb.transformMousePosition(rel.x, rel.y);
                  var diff = new plotboilerplate_1.Vertex(pb.transformMousePosition(touchMovePos.x, touchMovePos.y)).difference(
                    trans
                  );
                  draggedNode.editor.position.x += diff.x;
                  draggedNode.editor.position.y += diff.y;
                  touchMovePos = new plotboilerplate_1.Vertex(relPos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                  wasDragged = true;
                  pb.redraw();
                }
              },
              touchEnd: function (evt) {
                console.log("touchEnd");
                _self.wasTouchUsed = true;
                // Note: e.touches.length is 0 here
                if (draggedNode) {
                  if (!touchDownPos) {
                    return;
                  }
                  if (!wasDragged) {
                    wasDragged = false;
                    if (draggedNode) {
                      if (editorHelper.selectedOption) {
                        // reconnect
                        editorHelper.handleOptionReconnect(draggedNodeName);
                      } else {
                        editorHelper.setSelectedOption(null, false);
                        editorHelper.setSelectedNode(draggedNodeName, draggedNode);
                      }
                    } else {
                      // Option can be null, too.
                      editorHelper.setSelectedOption(draggedOption, true);
                      editorHelper.setSelectedNode(null, null);
                    }
                  }
                }
                clearTouch();
              },
              touchCancel: function (evt) {
                console.log("touchCancel");
                _self.wasTouchUsed = true;
                clearTouch();
              }
            }; // END afProps
            /* tslint:disable-next-line */
            _self.alloyFinger = globalThis.createAlloyFinger(pb.eventCatcher ? pb.eventCatcher : pb.canvas, afProps);
          }
          TouchHandler.prototype.destroy = function () {
            this.alloyFinger.destroy();
          };
          return TouchHandler;
        })();
        exports.TouchHandler = TouchHandler;
        var TouchEnterLeaveHandler = /** @class */ (function () {
          function TouchEnterLeaveHandler() {
            this.onTouchLeaveEvents = [];
            this.onTouchEnterEvents = [];
            this._init();
          }
          TouchEnterLeaveHandler.prototype.onTouchEnter = function (selector, fn) {
            var _this = this;
            this.onTouchEnterEvents.push([selector, fn]);
            return function () {
              _this.onTouchEnterEvents.slice().map(function (e, i) {
                if (e[0] === selector && e[1] === fn) {
                  this.onTouchEnterEvents.splice(1, i);
                }
              });
            };
          };
          TouchEnterLeaveHandler.prototype.onTouchLeave = function (selector, fn) {
            this.onTouchLeaveEvents.push([selector, fn]);
            return function () {
              this.onTouchLeaveEvents.slice().map(function (e, i) {
                if (e[0] === selector && e[1] === fn) {
                  this.onTouchLeaveEvents.splice(1, i);
                }
              });
            };
          };
          TouchEnterLeaveHandler.prototype._init = function () {
            var lastTouchLeave;
            var lastTouchEnter;
            var _self = this;
            document.addEventListener("touchmove", function (e) {
              var el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
              if (!el) {
                return;
              }
              _self.onTouchLeaveEvents.map(function (event) {
                if (el != lastTouchEnter && lastTouchEnter && lastTouchEnter.matches(event[0])) {
                  if (lastTouchEnter !== lastTouchLeave) {
                    event[1](lastTouchEnter, e);
                    lastTouchLeave = lastTouchEnter;
                    lastTouchEnter = null;
                  }
                }
              });
              _self.onTouchEnterEvents.map(function (event) {
                if (el.matches(event[0]) && el !== lastTouchEnter) {
                  lastTouchEnter = el;
                  lastTouchLeave = null;
                  event[1](el, e);
                }
              });
            });
          };
          return TouchEnterLeaveHandler;
        })();
        exports.TouchEnterLeaveHandler = TouchEnterLeaveHandler;
        // Test
        // onTouchEnter('.area',function(el,e){
        //   el.classList.add('hover')
        // })
        // onTouchLeave('.area',function(el,e){
        //   el.classList.remove('hover')
        // })
        //# sourceMappingURL=TouchHandler.js.map

        /***/
      },

    /***/ "./dist/cjs/detectDarkMode.js":
      /*!************************************!*\
  !*** ./dist/cjs/detectDarkMode.js ***!
  \************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";

        /**
         * @author  Ikaros Kappler
         * @date    2021-11-07
         * @version 1.0.0
         *
         * @param {Record<string,string>} GUP
         * @returns {boolean}
         */
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.detectDarkMode = void 0;
        var detectDarkMode = function (GUP) {
          // Respect overrides
          if (typeof GUP !== "undefined" && GUP.hasOwnProperty("darkmode") && GUP["darkmode"]) {
            var overrideValue = GUP["darkmode"];
            if (overrideValue === "0" || overrideValue.toLowerCase() === "false") {
              return false;
            } else if (overrideValue === "1" || overrideValue.toLowerCase() === "true") {
              return true;
            }
          }
          var hours = new Date().getHours();
          var isDayTime = hours > 6 && hours < 18;
          return !isDayTime;
        };
        exports.detectDarkMode = detectDarkMode;
        //# sourceMappingURL=detectDarkMode.js.map

        /***/
      },

    /***/ "./dist/cjs/domHelpers.js":
      /*!********************************!*\
  !*** ./dist/cjs/domHelpers.js ***!
  \********************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        /**
         * A script for demonstrating the line-point-distance.
         *
         * @require PlotBoilerplate, MouseHandler, gup, dat.gui
         *
         * @author   Ikaros Kappler
         * @date     2023-08-01
         * @version  1.0.0
         **/
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.RPGDOMHelpers = void 0;
        var TouchHandler_1 = __webpack_require__(/*! ./TouchHandler */ "./dist/cjs/TouchHandler.js");
        var editorHelpers_1 = __webpack_require__(/*! ./editorHelpers */ "./dist/cjs/editorHelpers.js");
        var modal_1 = __webpack_require__(/*! ./modal */ "./dist/cjs/modal.js");
        var RPGDOMHelpers = /** @class */ (function () {
          function RPGDOMHelpers(editorHelpers) {
            this.currentDraggedAnswerIndex = -1;
            this.currentDropAnswerIndex = -1;
            this.editorHelpers = editorHelpers;
            this.touchEnterLeaveHandler = new TouchHandler_1.TouchEnterLeaveHandler();
            this.editorElement = document.getElementById("attribute-editor");
            this.optionsElement = document.getElementById("e-options-container");
            this.keyElement = this.editorElement.querySelector("input#e-key");
            this.npcElement = this.editorElement.querySelector("select#e-npc-index");
            this.qElement = this.editorElement.querySelector("textarea#e-q");
            this.qElement.addEventListener("change", this.handleQChanged(this));
            this.npcElement.addEventListener("change", this.handleNPCIndexChanged(this));
            this.keyElement.addEventListener("change", this.handleKeyChanged(this));
            this.modal = new modal_1.Modal();
            document.getElementById("b-export-json").addEventListener("click", this.exportJSON(this));
            document.getElementById("b-add-answer-option").addEventListener("click", this.addAnswerOption(this));
            document.getElementById("b-add-dialogue-node").addEventListener("click", this.addDialogueNode(this));
            document.getElementById("b-delete-dialogue-node").addEventListener("click", this.requestRemoveDialogueNode(this));
          }
          RPGDOMHelpers.prototype.isExportWithoutPositions = function () {
            var checkbox = document.getElementById("cb-export-without-positions");
            return checkbox.checked;
          };
          RPGDOMHelpers.prototype.isAutoSave = function () {
            var checkbox = document.getElementById("cb-use-localstorage");
            return checkbox.checked;
          };
          RPGDOMHelpers.prototype.exportJSON = function (_self) {
            return function () {
              var removePositions = _self.isExportWithoutPositions();
              var dConfig = removePositions
                ? editorHelpers_1.EditorHelper.removePositions(_self.editorHelpers.dialogConfigWithPositions)
                : _self.editorHelpers.dialogConfigWithPositions;
              var jsonString = JSON.stringify(dConfig);
              var blob = new Blob([jsonString], { type: "application/json" });
              var url = URL.createObjectURL(blob);
              var a = document.createElement("a");
              a.href = url;
              a.download = "dialog-config.json";
              a.textContent = "Download backup.json";
              a.click();
            };
          };
          RPGDOMHelpers.prototype.addAnswerOption = function (_self) {
            return function () {
              var newOption = {
                a: "",
                next: null
              };
              _self.currentGraphNode.o.push(newOption);
              _self.updateAnswerOptions();
              _self.editorHelpers.pb.redraw();
            };
          };
          RPGDOMHelpers.prototype.addDialogueNode = function (_self) {
            return function () {
              _self.editorHelpers.addNewDialogueNode();
            };
          };
          RPGDOMHelpers.prototype.requestRemoveDialogueNode = function (_self) {
            return function () {
              _self.modal.setTitle("Delete option?");
              _self.modal.setBody("Do you really want to delete the current dialoge node '".concat(_self.currentNodeName, "'?"));
              _self.modal.setFooter("");
              _self.modal.setActions([
                modal_1.Modal.ACTION_CANCEL,
                {
                  label: "Yes",
                  action: function () {
                    _self.modal.close();
                    _self.removeDialogueNode();
                  }
                }
              ]);
              _self.modal.open();
            };
          };
          RPGDOMHelpers.prototype.removeDialogueNode = function () {
            this.editorHelpers.removeNewDialogueNode(this.currentNodeName);
            this.toggleVisibility(false);
          };
          RPGDOMHelpers.prototype.toggleVisibility = function (isVisible) {
            if (isVisible) {
              this.editorElement.classList.remove("d-none");
            } else {
              this.editorElement.classList.add("d-none");
            }
          };
          RPGDOMHelpers.prototype.handleQChanged = function (_self) {
            return function (changeEvent) {
              _self.currentGraphNode.q = changeEvent.target.value;
              _self.editorHelpers.pb.redraw();
            };
          };
          RPGDOMHelpers.prototype.handleNPCIndexChanged = function (_self) {
            var _this = this;
            return function (_changeEvent) {
              var newIndex = parseInt(_this.npcElement.value);
              if (Number.isNaN(newIndex)) {
                newIndex = -1;
              }
              _self.currentGraphNode.npcIndex = newIndex;
            };
          };
          RPGDOMHelpers.prototype.handleKeyChanged = function (_self) {
            var _this = this;
            return function (_changeEvent) {
              var newName = _this.keyElement.value;
              if (!newName || (newName = newName.trim()).length === 0) {
                return;
              }
              var renameSuccessful = _self.editorHelpers.renameGraphNode(_self.currentNodeName, newName);
              if (renameSuccessful) {
                _self.currentNodeName = newName;
              }
            };
          };
          RPGDOMHelpers.prototype.handleATextChanged = function (_self, answer) {
            return function (changeEvent) {
              answer.a = changeEvent.target.value;
              _self.editorHelpers.pb.redraw();
            };
          };
          RPGDOMHelpers.prototype.handleASuccessorChanged = function (_self, answer) {
            return function (changeEvent) {
              answer.next = changeEvent.target.value;
              _self.editorHelpers.pb.redraw();
            };
          };
          RPGDOMHelpers.prototype.updateAnswerOptions = function () {
            this.showAnswerOptions(this.currentNodeName, this.currentGraphNode);
          };
          RPGDOMHelpers.prototype.getSelectedNpcIndex = function () {
            return typeof this.currentGraphNode.npcIndex === "undefined" || Number.isNaN(this.currentGraphNode.npcIndex)
              ? 0
              : this.currentGraphNode.npcIndex;
          };
          RPGDOMHelpers.prototype.updateNpcSelector = function () {
            if (!this.currentGraphNode) {
              return;
            }
            this.npcElement.innerHTML = "";
            var curNpcIndex = this.getSelectedNpcIndex();
            // console.log("this.currentGraphNode.npcIndex", this.currentGraphNode.npcIndex, "curNpcIndex", curNpcIndex);
            for (var i = 0; i < this.editorHelpers.dialogConfigWithPositions.meta.npcs.length; i++) {
              var npcOption = document.createElement("option");
              npcOption.setAttribute("value", "".concat(i));
              if (i === 0) {
                npcOption.innerHTML = "".concat(this.editorHelpers.dialogConfigWithPositions.meta.npcs[i].name, " (default)");
              } else {
                npcOption.innerHTML = this.editorHelpers.dialogConfigWithPositions.meta.npcs[i].name;
              }
              if (i === curNpcIndex) {
                npcOption.setAttribute("selected", "true");
                npcOption.selected = true;
              }
              this.npcElement.appendChild(npcOption);
            }
            this.npcElement.value = "".concat(curNpcIndex);
            this.npcElement.setAttribute("value", "".concat(curNpcIndex));
          };
          RPGDOMHelpers.prototype.toggleDragEnterStyles = function (target) {
            // console.log("toggleDragEnterStyles");
            var answerIndex = this.currentDraggedAnswerIndex;
            var dropIndex = parseInt(target.getAttribute("data-dropindex"));
            if (target.classList.contains("droppable") && answerIndex !== dropIndex && answerIndex + 1 !== dropIndex) {
              target.classList.add("dragover");
            }
          };
          RPGDOMHelpers.prototype.toggleDragLeaveStyles = function (target) {
            console.log("toggleDragLeaveStyles");
            if (target.classList.contains("droppable")) {
              target.classList.remove("dragover");
            }
          };
          RPGDOMHelpers.prototype.showAnswerOptions = function (nodeName, graphNode) {
            var _self = this;
            this.currentNodeName = nodeName;
            this.currentGraphNode = graphNode;
            this.keyElement.setAttribute("value", nodeName ? nodeName : "");
            this.keyElement.value = nodeName ? nodeName : "";
            // console.log("showAnswerOptions", this.currentGraphNode);
            this.updateNpcSelector();
            this.optionsElement.innerHTML = "";
            this.npcElement.value = !graphNode || Number.isNaN(graphNode.npcIndex) ? "0" : "".concat(graphNode.npcIndex);
            this.qElement.setAttribute("value", graphNode ? graphNode.q : "");
            this.qElement.value = graphNode ? graphNode.q : "";
            if (!graphNode) {
              return;
            }
            var onDragOver = function (ev) {
              console.log("ondragover", ev.target);
              ev.preventDefault();
              var target = ev.target;
              _self.toggleDragEnterStyles(target);
            };
            var onDragLeave = function (ev) {
              console.log("ondragleave", ev.target);
              ev.preventDefault();
              var target = ev.target;
              _self.toggleDragLeaveStyles(target);
            };
            /**
             * Native browser DnD does not support touch events.
             * So we need a workaround using our custom TouchEnterLeaverHandler here.
             */
            _self.touchEnterLeaveHandler.onTouchEnter(".a-droparea", function (element) {
              console.log("onTouchEnter", element);
              if (!element.classList.contains("a-droparea")) {
                return;
              }
              _self.currentDropAnswerIndex = parseInt(element.getAttribute("data-dropIndex"));
              _self.toggleDragEnterStyles(element);
            });
            _self.touchEnterLeaveHandler.onTouchLeave(".a-droparea", function (element) {
              console.log("onTouchLeave", element);
              _self.currentDropAnswerIndex = -1;
              _self.toggleDragLeaveStyles(element);
            });
            var drop = function (ev) {
              console.log("Drop", ev);
              ev.preventDefault();
              var target = ev.target;
              // const answerIndex = parseInt(ev.dataTransfer.getData("answerindex"));
              var answerIndex = _self.currentDraggedAnswerIndex;
              var dropIndex = parseInt(target.getAttribute("data-dropindex"));
              console.log("Move", answerIndex, "to", dropIndex);
              // target.appendChild(document.getElementById(data));
              if (!target.classList.contains("droppable") || answerIndex === dropIndex || answerIndex + 1 === dropIndex) {
                // No real change
                return;
              }
              _self.performDrop(answerIndex, dropIndex);
            };
            var isTouchDevice = this.editorHelpers.editor.currentTouchHandler.wasTouchUsed;
            var dropArea = this.makeADropArea(0, drop, onDragOver, onDragLeave);
            this.optionsElement.appendChild(dropArea);
            for (var i = 0; i < graphNode.o.length; i++) {
              var option = graphNode.o[i];
              var answerWrapperElement = document.createElement("div");
              var answerControlsElement = this.makeAnswerControlElement(i, isTouchDevice);
              var answerElement = document.createElement("div");
              var labelElement = document.createElement("div");
              var textElement = document.createElement("textarea");
              var selectElement = this.createNodeSelectElement(nodeName, option.next);
              labelElement.innerHTML = "A#".concat(i);
              labelElement.classList.add("e-label");
              textElement.innerHTML = option.a;
              answerElement.appendChild(labelElement);
              answerElement.appendChild(textElement);
              answerElement.appendChild(selectElement);
              var handleDragStart = function (ev) {
                // console.log("handleDragStart");
                _self.currentDraggedAnswerIndex = parseInt(ev.target.getAttribute("data-answerindex"));
                // console.log("handleDragStart", _self.currentDraggedAnswerIndex);
                ev.dataTransfer.setData("answerindex", "".concat(_self.currentDraggedAnswerIndex));
              };
              var handleTouchDragStart = function (ev) {
                ev.preventDefault(); // Is this required?
                var dragStartElement = ev.target;
                _self.currentDraggedAnswerIndex = parseInt(dragStartElement.getAttribute("data-answerindex"));
                if (Number.isNaN(_self.currentDraggedAnswerIndex)) {
                  // touchStart on touch devices is a bit different than dragStart on Desktop devives.
                  // Try to find enclosing draggable element
                  if (dragStartElement.classList.contains("a-dnd-element")) {
                    dragStartElement = dragStartElement.parentElement.parentElement;
                  }
                  // This should not be a node of class 'answer-wrapper-element' and draggable=true
                  if (
                    !dragStartElement.classList.contains("answer-wrapper-element") ||
                    !dragStartElement.getAttribute("draggable")
                  ) {
                    console.log("Cannot find draggable element.");
                    return;
                  }
                  _self.currentDraggedAnswerIndex = parseInt(dragStartElement.getAttribute("data-answerindex"));
                }
                // console.log("handleTouchDragStart", _self.currentDraggedAnswerIndex);
              };
              var handleTouchDragEnd = function (_ev) {
                _self.performDrop(_self.currentDraggedAnswerIndex, _self.currentDropAnswerIndex);
              };
              answerWrapperElement.classList.add("answer-wrapper-element");
              // answerWrapperElement.setAttribute("data-answerindex", `${i}`);
              if (isTouchDevice) {
                // Regular 'mouse' or Desktop device.
                // No additional listeners to install.
              } else {
                // The TouchHandler already received an only-touch event, so we are
                // probably currently running on a touch device
                if (answerControlsElement.dndHandleElement) {
                  answerControlsElement.dndHandleElement.setAttribute("draggable", "true");
                  answerControlsElement.dndHandleElement.addEventListener("dragstart", handleDragStart);
                  answerControlsElement.dndHandleElement.addEventListener("touchstart", handleTouchDragStart);
                  answerControlsElement.dndHandleElement.addEventListener("touchend", handleTouchDragEnd);
                  answerControlsElement.dndHandleElement.setAttribute("data-answerindex", "".concat(i));
                }
              }
              answerWrapperElement.appendChild(answerElement);
              answerWrapperElement.appendChild(answerControlsElement.container);
              var dropArea_1 = this.makeADropArea(i + 1, drop, onDragOver, onDragLeave);
              this.optionsElement.appendChild(answerWrapperElement);
              this.optionsElement.appendChild(dropArea_1);
              textElement.addEventListener("change", this.handleATextChanged(this, option));
              selectElement.addEventListener("change", this.handleASuccessorChanged(this, option));
            }
          };
          /**
           * Create a new answer element (consisting of labels, input fields and buttons).
           * If `isTouchDevice` is true, then a drag element will be added.
           * Otherwise two up/down-buttons will be added.
           *
           * @param {number} index - The answer option index inside the config.
           * @param {boolean} isTouchDevice - Set to `true` if drag-and-drop handles should be added instead of buttons.
           * @returns {HTMLDivElement}
           */
          RPGDOMHelpers.prototype.makeAnswerControlElement = function (index, isTouchDevice) {
            var _self = this;
            var controlElement = document.createElement("div");
            controlElement.classList.add("answer-controls-element");
            var dndElement = null;
            if (isTouchDevice) {
              var upDownElement = document.createElement("div");
              upDownElement.classList.add("answer-up-down-element");
              var upBtn = document.createElement("button");
              upBtn.innerHTML = "▴";
              if (index === 0) {
                upBtn.setAttribute("disabled", "true");
              } else {
                upBtn.addEventListener("click", function () {
                  console.log("upBtn", index, index - 1);
                  _self.performDrop(index, index - 1);
                });
              }
              var downBtn = document.createElement("button");
              downBtn.innerHTML = "▾";
              if (index + 1 === this.currentGraphNode.o.length) {
                downBtn.setAttribute("disabled", "true");
              } else {
                downBtn.addEventListener("click", function () {
                  console.log("downBtn", index, index + 2); // Think of drop zone indices here
                  _self.performDrop(index, index + 2); // Think of drop zone indices here
                });
              }
              upDownElement.appendChild(upBtn);
              upDownElement.appendChild(downBtn);
              controlElement.appendChild(upDownElement);
            } else {
              dndElement = document.createElement("div");
              dndElement.classList.add("a-dnd-element");
              dndElement.innerHTML = "&vellip;";
              controlElement.appendChild(dndElement);
            }
            var deleteButton = document.createElement("button");
            deleteButton.classList.add("a-delete-button");
            deleteButton.addEventListener("click", this.requestDeleteOption(index));
            deleteButton.innerHTML = "&#x1F5D1;";
            controlElement.appendChild(deleteButton);
            return { container: controlElement, dndHandleElement: dndElement };
          };
          RPGDOMHelpers.prototype.performDrop = function (answerIndex, dropIndex) {
            if (dropIndex > answerIndex) {
              dropIndex--;
            }
            var old = this.currentGraphNode.o[answerIndex];
            this.currentGraphNode.o[answerIndex] = this.currentGraphNode.o[dropIndex];
            this.currentGraphNode.o[dropIndex] = old;
            // Re-build the list : )
            this.updateAnswerOptions();
            this.editorHelpers.pb.redraw();
          };
          RPGDOMHelpers.prototype.requestDeleteOption = function (index) {
            var _self = this;
            return function () {
              _self.modal.setTitle("Delete option?");
              _self.modal.setBody("Do you really want to delete option #".concat(index, "?"));
              _self.modal.setFooter("");
              _self.modal.setActions([
                modal_1.Modal.ACTION_CANCEL,
                {
                  label: "Yes",
                  action: function () {
                    _self.modal.close();
                    _self.handleDeleteOption(index);
                  }
                }
              ]);
              _self.modal.open();
            };
          };
          RPGDOMHelpers.prototype.handleDeleteOption = function (index) {
            this.currentGraphNode.o.splice(index, 1);
            this.updateAnswerOptions();
            this.editorHelpers.pb.redraw();
          };
          RPGDOMHelpers.prototype.makeADropArea = function (dropIndex, drop, onDragOver, onDragLeave) {
            var dropArea = document.createElement("div");
            dropArea.setAttribute("data-dropindex", "".concat(dropIndex));
            dropArea.classList.add("a-droparea", "droppable");
            dropArea.addEventListener("drop", drop);
            dropArea.addEventListener("dragover", onDragOver);
            dropArea.addEventListener("dragleave", onDragLeave);
            return dropArea;
          };
          RPGDOMHelpers.prototype.createNodeSelectElement = function (currentKey, selectedKey) {
            var selectElement = document.createElement("select");
            if (!this.editorHelpers.dialogConfigWithPositions) {
              console.warn("Warning: cannout populate nodeSelectElement. No dialogConfig set.");
            } else {
              var optionElement = this.createNodeSelectOptionElement("", false, null, false);
              selectElement.appendChild(optionElement);
              for (var key in this.editorHelpers.dialogConfigWithPositions.graph) {
                if (!this.editorHelpers.dialogConfigWithPositions.graph.hasOwnProperty(key)) {
                  return;
                }
                var questionaire = this.editorHelpers.dialogConfigWithPositions.graph[key];
                var optionElement_1 = this.createNodeSelectOptionElement(
                  questionaire.q,
                  key === currentKey,
                  key,
                  key === selectedKey
                );
                selectElement.appendChild(optionElement_1);
              }
            }
            return selectElement;
          };
          RPGDOMHelpers.prototype.createNodeSelectOptionElement = function (questionaireText, isCurrent, key, isSelected) {
            var optionElement = document.createElement("option");
            optionElement.setAttribute("value", key);
            optionElement.innerHTML = ""
              .concat(key !== null && key !== void 0 ? key : "", ": ")
              .concat(editorHelpers_1.EditorHelper.ellipsify(questionaireText, 20));
            if (isCurrent) {
              optionElement.setAttribute("disabled", "true");
            }
            if (isSelected) {
              optionElement.setAttribute("selected", "true");
            }
            return optionElement;
          };
          return RPGDOMHelpers;
        })();
        exports.RPGDOMHelpers = RPGDOMHelpers;
        //# sourceMappingURL=domHelpers.js.map

        /***/
      },

    /***/ "./dist/cjs/editorHelpers.js":
      /*!***********************************!*\
  !*** ./dist/cjs/editorHelpers.js ***!
  \***********************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        /**
         * Helpers for the graph editor.
         *
         * @require PlotBoilerplate
         *
         * @author   Ikaros Kappler
         * @date     2023-07-28
         * @version  1.0.0
         **/
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.EditorHelper = void 0;
        var plotboilerplate_1 = __webpack_require__(/*! plotboilerplate */ "./node_modules/plotboilerplate/src/esm/index.js");
        var domHelpers_1 = __webpack_require__(/*! ./domHelpers */ "./dist/cjs/domHelpers.js");
        var editorRenderer_1 = __webpack_require__(/*! ./editorRenderer */ "./dist/cjs/editorRenderer.js");
        var metaHelpers_1 = __webpack_require__(/*! ./metaHelpers */ "./dist/cjs/metaHelpers.js");
        var EditorHelper = /** @class */ (function () {
          function EditorHelper(editor, pb, boxSize) {
            // TODO: convert into node identifyer
            /**
             * The highlighted node's name or null if none is highlighted.
             * Used to highlight nodes when the mouse is over.
             */
            this.highlightedNodeName = null;
            /**
             * The highlighted node itself or null if none is highligted.
             * Used to determine rendering colors.
             */
            this.highlightedNode = null;
            /**
             * The selected node's name or null if none is selected.
             * Used to determine the node editor's contents.
             */
            this.selectedNodeName = null;
            /**
             * The selected node itself or null if none is selected.
             * Used to determine the node editor's contents.
             */
            this.selectedNode = null;
            /**
             * The currently selected option or null if none is selected.
             * Used to re-connect an option with a new successor node.
             */
            this.selectedOption = null;
            /**
             * The currently highlighted option.
             * Used to draw on-mouse-over options with a different color.
             */
            this.hightlightedOption = null;
            /**
             * The current mouse position (or null if mouse is not on canvas).
             * In local relative coordinate system.
             */
            this.relativeMousePosition = null;
            this.editor = editor;
            this.pb = pb;
            this.boxSize = boxSize;
            this.selectedNodeName = null;
            this.domHelper = new domHelpers_1.RPGDOMHelpers(this);
            this.metaHelpers = new metaHelpers_1.DialogueMetaHelpers(this);
          }
          EditorHelper.prototype.setDialogConfig = function (dialogConfigWithPositions) {
            this.dialogConfigWithPositions = dialogConfigWithPositions;
          };
          EditorHelper.prototype.setSelectedOption = function (selectedOption, noRedraw) {
            console.log("Set selected option", selectedOption);
            this.selectedOption = selectedOption;
            if (!noRedraw) {
              this.pb.redraw();
            }
          };
          EditorHelper.prototype.setHighlightedOption = function (hightlightedOption) {
            // const isRedrawRequired = this.hightlightedOption !== hightlightedOption;
            var isRedrawRequired = !this.isEqualOptionIdentifyer(this.hightlightedOption, hightlightedOption);
            this.hightlightedOption = hightlightedOption;
            if (isRedrawRequired) {
              this.pb.redraw();
            }
          };
          EditorHelper.prototype.setHighlightedNode = function (nodeName, noRedraw) {
            this.highlightedNodeName = nodeName;
            this.highlightedNode = nodeName ? this.dialogConfigWithPositions.graph[nodeName] : null;
            if (!noRedraw) {
              this.pb.redraw();
            }
          };
          /**
           * A helper function to create random safe positions in the viewport area.
           * @param {PlotBoilerplate} pb
           * @param {XYDimension} boxSize
           * @returns
           */
          EditorHelper.prototype.getRandomPosition = function () {
            var viewport = this.pb.viewport();
            return {
              x: viewport.min.x + this.boxSize.width + (viewport.width - 2 * this.boxSize.width) * Math.random(),
              y: viewport.min.y + this.boxSize.height + (viewport.height - 2 * this.boxSize.height) * Math.random()
            };
          };
          EditorHelper.prototype.setSelectedNode = function (nodeName, node) {
            this.selectedNodeName = nodeName;
            this.selectedNode = node;
            if (nodeName && node) {
              // this.domHelper.editorElement.classList.remove("d-none");
              this.domHelper.toggleVisibility(true);
              this.domHelper.showAnswerOptions(nodeName, this.selectedNode);
            } else {
              // this.domHelper.editorElement.classList.add("d-none");
              this.domHelper.toggleVisibility(false);
              this.domHelper.showAnswerOptions(null, null);
            }
            this.pb.redraw();
          };
          /**
           * A helper function to make sure all graph nodes have valid positions. Those without
           * valid positions (eg like those being loaded from an incomplete JSON file) will be
           * assigned to a random position inside the viewport.
           *
           * @param {PlotBoilerplate} pb
           * @param {XYDimension} boxSize
           * @returns
           */
          EditorHelper.prototype.enrichPositions = function (baseConfig) {
            // Clone?
            var configWithPositions = baseConfig;
            for (var nodeName in configWithPositions.graph) {
              var graphNode = configWithPositions.graph[nodeName];
              if (!graphNode) {
                console.warn("Warning: graph node ".concat(nodeName, " is null or undefined!"));
                continue;
              }
              // Anonymous member check
              if (!graphNode.hasOwnProperty("editor")) {
                graphNode.editor = { position: this.getRandomPosition() };
              } else if (!graphNode.editor.hasOwnProperty("position")) {
                graphNode.editor.position = this.getRandomPosition();
              } else {
                if (!graphNode.editor.position.hasOwnProperty("x") || isNaN(graphNode.editor.position.x)) {
                  graphNode.editor.position.x = this.getRandomPosition().x;
                }
                if (!graphNode.editor.position.hasOwnProperty("y") || isNaN(graphNode.editor.position.y)) {
                  graphNode.editor.position.y = this.getRandomPosition().y;
                }
              }
            }
            return configWithPositions;
          };
          /**
           * Check if the meta data is valid and – if not – add missing default fields.
           * @param dialogueConfig
           */
          EditorHelper.prototype.enrichMetaData = function (dialogueConfig) {
            var result = dialogueConfig;
            if (!dialogueConfig.hasOwnProperty("meta")) {
              result.meta = { name: "noname", npcs: [] };
            }
            if (!result.meta.npcs) {
              result.meta.npcs = [];
            }
            if (result.meta.npcs.length === 0) {
              result.meta.npcs.push({ name: "NPC #0" });
            }
          };
          EditorHelper.prototype.isPosInGraphNodeBox = function (pos, graphNode) {
            return (
              graphNode.editor.position.x <= pos.x &&
              graphNode.editor.position.y <= pos.y &&
              graphNode.editor.position.x + this.boxSize.width > pos.x &&
              graphNode.editor.position.y + this.boxSize.height > pos.y
            );
          };
          EditorHelper.prototype.isPosInOptionNodeBox = function (pos, graphNode, optionIndex) {
            editorRenderer_1.EditorRenderer.OPTION_OFFSET_X;
            return (
              graphNode.editor.position.x + editorRenderer_1.EditorRenderer.OPTION_OFFSET_X <= pos.x &&
              graphNode.editor.position.y + (optionIndex + 1) * this.boxSize.height <= pos.y &&
              graphNode.editor.position.x + editorRenderer_1.EditorRenderer.OPTION_OFFSET_X + this.boxSize.width > pos.x &&
              graphNode.editor.position.y + (optionIndex + 1) * this.boxSize.height + this.boxSize.height > pos.y
            );
          };
          EditorHelper.prototype.locateNodeBoxNameAtPos = function (pos) {
            for (var nodeName in this.dialogConfigWithPositions.graph) {
              var graphNode = this.dialogConfigWithPositions.graph[nodeName];
              if (this.isPosInGraphNodeBox(pos, graphNode)) {
                return nodeName;
              }
            }
            return null;
          };
          EditorHelper.prototype.locateOptionBoxNameAtPos = function (pos) {
            for (var nodeName in this.dialogConfigWithPositions.graph) {
              var graphNode = this.dialogConfigWithPositions.graph[nodeName];
              for (var i = 0; i < graphNode.o.length; i++) {
                if (this.isPosInOptionNodeBox(pos, graphNode, i)) {
                  return { nodeName: nodeName, node: graphNode, optionIndex: i };
                }
              }
            }
            return null;
          };
          EditorHelper.prototype.isNodeHighlighted = function (nodName) {
            return this.highlightedNodeName === nodName;
          };
          EditorHelper.prototype.isOptionHighlighted = function (nodeName, optionIndex) {
            return (
              this.hightlightedOption &&
              this.hightlightedOption.nodeName === nodeName &&
              this.hightlightedOption.optionIndex === optionIndex
            );
          };
          EditorHelper.prototype.isOptionSelected = function (nodeName, optionIndex) {
            return (
              this.selectedOption && this.selectedOption.nodeName === nodeName && this.selectedOption.optionIndex === optionIndex
            );
          };
          EditorHelper.prototype.addNewDialogueNode = function () {
            // Place two box units to the right if currently there is a selected node.
            // Otherwise random position.
            var position = this.selectedNode
              ? {
                  x: this.selectedNode.editor.position.x + 2 * this.boxSize.width,
                  y: this.selectedNode.editor.position.y + this.boxSize.height
                }
              : this.getRandomPosition();
            var nodeName = this.randomNodeKey();
            var newNode = {
              q: "",
              o: [{ a: "", next: null }],
              editor: {
                position: position
              }
            };
            this.dialogConfigWithPositions.graph[nodeName] = newNode;
            this.selectedNodeName = nodeName;
            this.selectedNode = newNode;
            this.domHelper.showAnswerOptions(nodeName, newNode);
            this.pb.redraw();
          };
          EditorHelper.prototype.removeNewDialogueNode = function (nodeName) {
            delete this.dialogConfigWithPositions.graph[nodeName];
            this.selectedNodeName = null;
            this.selectedNode = null;
            this.domHelper.showAnswerOptions(null, null);
            this.pb.redraw();
          };
          EditorHelper.prototype.boxMovehandler = function () {
            var _this = this;
            var _self = this;
            // +---------------------------------------------------------------------------------
            // | Add a mouse listener to track the mouse position.
            // +-------------------------------
            var mouseDownPos = null;
            var lastMouseDownPos = null;
            var draggingNode = null;
            var draggingNodeName = null;
            var handler = new plotboilerplate_1.MouseHandler(this.pb.eventCatcher)
              .down(function (evt) {
                mouseDownPos = _this.pb.transformMousePosition(evt.params.mouseDownPos.x, evt.params.mouseDownPos.y);
                lastMouseDownPos = { x: evt.params.mouseDownPos.x, y: evt.params.mouseDownPos.y };
                draggingNodeName = _this.locateNodeBoxNameAtPos(mouseDownPos);
                if (draggingNodeName) {
                  draggingNode = _this.dialogConfigWithPositions.graph[draggingNodeName];
                }
              })
              .up(function (_evt) {
                mouseDownPos = null;
                draggingNode = null;
              })
              .drag(function (evt) {
                if (!mouseDownPos || !draggingNode) {
                  return;
                }
                // const diff = evt.params.dragAmount;
                draggingNode.editor.position.x += evt.params.dragAmount.x / _this.pb.draw.scale.x;
                draggingNode.editor.position.y += evt.params.dragAmount.y / _this.pb.draw.scale.y;
              })
              .move(function (evt) {
                // console.log("move", evt);
                // Check if mouse pointer hovers over an option -> set highlighted
                var mouseMovePos = _this.pb.transformMousePosition(evt.params.pos.x, evt.params.pos.y);
                _self.relativeMousePosition = { x: mouseMovePos.x, y: mouseMovePos.y };
                var hoveringOptionIdentifyer = _this.locateOptionBoxNameAtPos(mouseMovePos);
                // Can be null
                _self.setHighlightedOption(hoveringOptionIdentifyer);
                if (!hoveringOptionIdentifyer) {
                  // Check if hover on graph node
                  var hoveringNodeName = _this.locateNodeBoxNameAtPos(mouseMovePos);
                  _this.setHighlightedNode(hoveringNodeName);
                } else {
                  _this.setHighlightedNode(null);
                }
              })
              .click(function (evt) {
                // Stop if mouse was moved
                console.log("lastMouseDownPos", lastMouseDownPos, " evt.params.pos", evt.params.pos);
                if (lastMouseDownPos && (lastMouseDownPos.x !== evt.params.pos.x || lastMouseDownPos.y !== evt.params.pos.y)) {
                  return;
                }
                // Check if mouse pointer hovers over an option -> set selected AND select node
                var mouseClickPos = _this.pb.transformMousePosition(evt.params.pos.x, evt.params.pos.y);
                _self.handleClick(mouseClickPos);
              });
            return handler;
          };
          EditorHelper.prototype.handleClick = function (mouseClickPos) {
            var clickedOptionIdentifyer = this.locateOptionBoxNameAtPos(mouseClickPos);
            if (clickedOptionIdentifyer) {
              this.setSelectedOption(clickedOptionIdentifyer);
            } else {
              // Otherwise (no option was clicked) check if a node was clicked directly.
              var clickedNodeName = this.locateNodeBoxNameAtPos(mouseClickPos);
              console.log("Click", clickedNodeName);
              if (clickedNodeName) {
                if (this.selectedOption) {
                  this.handleOptionReconnect(clickedNodeName);
                  this.pb.redraw();
                } else {
                  this.setSelectedNode(clickedNodeName, this.dialogConfigWithPositions.graph[clickedNodeName]);
                  // this.pb.redraw();
                }
              } else {
                this.setSelectedNode(null, null);
                // this.selectedNode = null;
                // this.pb.redraw();
              }
              this.setSelectedOption(null, false);
            }
          };
          EditorHelper.prototype.handleOptionReconnect = function (clickedNodeName) {
            if (!this.selectedOption) {
              // Actually this fuction should not be called at all in that case.
              console.warn("Warn: cannot reconnect option when no option is selected.");
            }
            var graph = this.dialogConfigWithPositions.graph;
            var clickedNode = graph[clickedNodeName];
            var sourceNode = this.selectedOption.node;
            console.log("Reconnect");
            sourceNode.o[this.selectedOption.optionIndex].next = clickedNodeName;
            this.domHelper.showAnswerOptions(this.selectedNodeName, this.selectedNode);
          };
          EditorHelper.prototype.isEqualOptionIdentifyer = function (identA, identB) {
            if ((!identA && identB) || (identA && !identB)) {
              return false;
            }
            if (
              (typeof identA === "undefined" && typeof identB !== "undefined") ||
              (typeof identA !== "undefined" && typeof identB === "undefined")
            ) {
              return false;
            }
            if (identA === identB || (typeof identA === "undefined" && typeof identB === "undefined")) {
              return true;
            }
            return identA.nodeName === identB.nodeName && identA.optionIndex === identB.optionIndex;
          };
          EditorHelper.prototype.renameGraphNode = function (oldName, newName) {
            if (!this.dialogConfigWithPositions.graph.hasOwnProperty(oldName)) {
              console.warn("Warning: cannot rename node, because old name does not exist.", oldName);
              return false;
            }
            if (oldName === "intro") {
              console.warn("Warning: cannot rename node, because 'intro' must not be renamed'.");
              return false;
            }
            if (this.dialogConfigWithPositions.graph.hasOwnProperty(newName)) {
              console.warn("Warning: cannot rename node, because new name already exists.", newName);
              return false;
            }
            if (newName === oldName) {
              console.warn("Warning: cannot rename node, because old name and new name are the same.", oldName);
              return false;
            }
            var graphNode = this.dialogConfigWithPositions.graph[oldName];
            this.dialogConfigWithPositions.graph[newName] = graphNode;
            delete this.dialogConfigWithPositions.graph[oldName];
            // Update all references
            for (var nodeName in this.dialogConfigWithPositions.graph) {
              if (!this.dialogConfigWithPositions.graph.hasOwnProperty(nodeName)) {
                continue;
              }
              var tmpNode = this.dialogConfigWithPositions.graph[nodeName];
              for (var j = 0; j < tmpNode.o.length; j++) {
                if (tmpNode.o[j].next === oldName) {
                  tmpNode.o[j].next = newName;
                }
              }
            }
            // Update local selected fields
            if (oldName === this.selectedNodeName) {
              this.selectedNodeName = newName;
              this.selectedNode = this.dialogConfigWithPositions.graph[newName];
            }
            this.pb.redraw();
            return true;
          };
          EditorHelper.ellipsify = function (text, maxLength) {
            if (!text || text.length <= maxLength) {
              return text;
            }
            return "".concat(text.substring(0, maxLength), "...");
          };
          EditorHelper.fromObject = function (object) {
            // Must be of type object
            if (typeof object !== "object") {
              throw "Cannot convert non-objects to dialogue config: type is ".concat(typeof object, ".");
            }
            // Must have a 'graph' member.
            if (!object.hasOwnProperty("graph")) {
              throw "Cannot convert object to dialogue config: object missing member `graph`.";
            }
            var graph = object["graph"];
            // Check if 'intro' is present?
            // All members must be of correct type
            for (var key in object) {
              if (!object.hasOwnProperty(key)) {
                continue;
              }
              var questionaire = object[key];
              if (typeof questionaire !== "object") {
                throw "Cannot converto bject to dialogue config: all graph members must be objects.";
              }
              // Check if 'q' (string) and 'o' (array) attributes are present?
            }
            return object;
          };
          EditorHelper.removePositions = function (dialogueConfig) {
            var clone = JSON.parse(JSON.stringify(dialogueConfig));
            for (var nodeName in clone.graph) {
              var node = clone.graph[nodeName];
              if (node.hasOwnProperty("editor")) {
                delete node["editor"];
              }
            }
            return clone;
          };
          EditorHelper.prototype.randomNodeKey = function () {
            var keys = Object.keys(this.dialogConfigWithPositions.graph);
            var count = keys.length;
            var key = "New " + count;
            while (this.dialogConfigWithPositions.graph.hasOwnProperty(key)) {
              key = "New " + count;
              count++;
            }
            return key;
          };
          return EditorHelper;
        })();
        exports.EditorHelper = EditorHelper;
        //# sourceMappingURL=editorHelpers.js.map

        /***/
      },

    /***/ "./dist/cjs/editorRenderer.js":
      /*!************************************!*\
  !*** ./dist/cjs/editorRenderer.js ***!
  \************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";

        var __assign =
          (this && this.__assign) ||
          function () {
            __assign =
              Object.assign ||
              function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                  s = arguments[i];
                  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
              };
            return __assign.apply(this, arguments);
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.EditorRenderer = void 0;
        /**
         * A renderer for the graph editor.
         *
         * @require PlotBoilerplate
         *
         * @author   Ikaros Kappler
         * @date     2023-07-28
         * @version  1.0.0
         **/
        var plotboilerplate_1 = __webpack_require__(/*! plotboilerplate */ "./node_modules/plotboilerplate/src/esm/index.js");
        var editorHelpers_1 = __webpack_require__(/*! ./editorHelpers */ "./dist/cjs/editorHelpers.js");
        var getContrastColor_1 = __webpack_require__(
          /*! plotboilerplate/src/cjs/utils/algorithms/getContrastColor */ "./node_modules/plotboilerplate/src/cjs/utils/algorithms/getContrastColor.js"
        );
        var Color_1 = __webpack_require__(
          /*! plotboilerplate/src/cjs/utils/datastructures/Color */ "./node_modules/plotboilerplate/src/cjs/utils/datastructures/Color.js"
        );
        // import { FileDrop } from "plotboilerplate/src/cjs/utils/io/FileDrop";
        var EditorRenderer = /** @class */ (function () {
          function EditorRenderer(pb, boxSize, editorHelpers, isDarkmode) {
            this.TEXT_MAX_LENGTH = 20;
            this.pb = pb;
            this.boxSize = boxSize;
            this.editorHelpers = editorHelpers;
            this.fontOptions = {
              color: "black",
              fontFamily: "Arial",
              fontSize: 12,
              fontStyle: "italic",
              fontWeight: "normal",
              lineHeight: 26,
              textAlign: "left",
              rotation: 0
            };
            var backgroundColor = isDarkmode ? Color_1.Color.parse("#000000") : Color_1.Color.parse("#ffffff");
            this.fontOptions.color = (0, getContrastColor_1.getContrastColor)(backgroundColor).setAlpha(0.8).cssRGBA();
          }
          EditorRenderer.prototype.renderBoxes = function (dialogConfig) {
            var nodeNames = Object.keys(dialogConfig.graph);
            var count = nodeNames.length;
            for (var i = 0; i < count; i++) {
              var nodeName = nodeNames[i];
              var graphNode = dialogConfig.graph[nodeName];
              this.renderGraphNode(nodeName, graphNode);
              this.renderOptions(nodeName, graphNode);
            }
            // Render suggested new connection
            this.renderSuggestedConnection();
          };
          EditorRenderer.prototype.renderSuggestedConnection = function () {
            if (this.editorHelpers.selectedOption) {
              var isMousePosInsideOption = this.editorHelpers.isPosInOptionNodeBox(
                this.editorHelpers.relativeMousePosition,
                this.editorHelpers.selectedOption.node,
                this.editorHelpers.selectedOption.optionIndex
              );
              var bezierTargetPosition = this.editorHelpers.highlightedNode
                ? this.editorHelpers.highlightedNode.editor.position
                : isMousePosInsideOption
                ? null
                : this.editorHelpers.relativeMousePosition;
              if (bezierTargetPosition) {
                this.drawBezierConnection(
                  this.editorHelpers.selectedOption.node,
                  this.editorHelpers.selectedOption.optionIndex,
                  bezierTargetPosition,
                  true,
                  true
                );
              }
            }
          };
          EditorRenderer.prototype.renderGraphNode = function (nodeName, graphNode) {
            var isNodeSelected = this.editorHelpers.selectedNodeName === nodeName;
            var isNodeHighlighted = this.editorHelpers.isNodeHighlighted(nodeName);
            this.pb.fill.text(
              nodeName,
              graphNode.editor.position.x,
              graphNode.editor.position.y - this.boxSize.height,
              __assign(__assign({}, this.fontOptions), { color: "grey" })
            );
            this.pb.draw.rect(
              graphNode.editor.position,
              this.boxSize.width,
              this.boxSize.height,
              isNodeSelected ? "rgba(255,128,0,1.0)" : "rgba(0,255,0,1.0)",
              1.0
            );
            // Show initial and terminal nodes with fill color
            if (!graphNode.o || graphNode.o.length === 0 || nodeName === "intro" || isNodeHighlighted) {
              this.pb.fill.rect(
                { x: graphNode.editor.position.x, y: graphNode.editor.position.y },
                this.boxSize.width,
                this.boxSize.height,
                isNodeHighlighted ? "rgba(255,128,0,0.5)" : isNodeSelected ? "rgba(255,128,0,0.3)" : "rgba(0,255,0,0.3)",
                1.0
              );
            }
            this.pb.fill.text(
              graphNode.q
                ? isNodeSelected
                  ? graphNode.q
                  : editorHelpers_1.EditorHelper.ellipsify(graphNode.q, this.TEXT_MAX_LENGTH)
                : "-no text-",
              graphNode.editor.position.x,
              graphNode.editor.position.y,
              this.fontOptions
            );
          };
          EditorRenderer.prototype.renderOptions = function (nodeName, graphNode) {
            var isNodeSelected = this.editorHelpers.selectedNodeName === nodeName;
            var offsetY = graphNode.editor.position.y + this.boxSize.height;
            var offsetX = graphNode.editor.position.x + EditorRenderer.OPTION_OFFSET_X;
            for (var j = 0; j < graphNode.o.length; j++) {
              var option = graphNode.o[j];
              // Render highlighted option?
              var otherOptionIsSelected =
                this.editorHelpers.selectedOption !== null && !this.editorHelpers.isOptionSelected(nodeName, j);
              var isHighlighted = !otherOptionIsSelected && this.editorHelpers.isOptionHighlighted(nodeName, j);
              var isSelected = this.editorHelpers.isOptionSelected(nodeName, j);
              if (isHighlighted || isSelected) {
                this.pb.fill.rect({ x: offsetX, y: offsetY }, this.boxSize.width, this.boxSize.height, "rgba(255,192,0,0.5)", 1);
              }
              this.pb.draw.rect({ x: offsetX, y: offsetY }, this.boxSize.width, this.boxSize.height, "grey", 1);
              this.pb.fill.text(
                option.a
                  ? isNodeSelected
                    ? option.a
                    : editorHelpers_1.EditorHelper.ellipsify(option.a, this.TEXT_MAX_LENGTH)
                  : "-no text-",
                offsetX,
                offsetY,
                __assign(__assign({}, this.fontOptions), { color: isHighlighted || isSelected ? "black" : "grey" })
              );
              if (isHighlighted || isSelected) {
                // Draw connect indicator when highlighted
                var zA = new plotboilerplate_1.Vertex(graphNode.editor.position).addXY(
                  this.boxSize.width + 16,
                  this.boxSize.height / 2.0 + (j + 1) * (this.boxSize.height + 2) - 2
                );
                this.pb.fill.circle(zA, 5, "orange");
              }
              offsetY += this.boxSize.height + 2;
            }
          };
          EditorRenderer.prototype.renderConnections = function (dialogConfig) {
            var nodeNames = Object.keys(dialogConfig.graph);
            var count = nodeNames.length;
            for (var i = 0; i < count; i++) {
              var nodeName = nodeNames[i];
              var graphNode = dialogConfig.graph[nodeName];
              for (var j = 0; j < graphNode.o.length; j++) {
                var successorName = graphNode.o[j].next;
                if (!successorName) {
                  continue;
                }
                var successorNode = dialogConfig.graph[successorName];
                if (!successorNode) {
                  continue;
                }
                var isHighlighted = this.editorHelpers.isOptionHighlighted(nodeName, j);
                var otherOptionIsSelected =
                  this.editorHelpers.selectedOption !== null && !this.editorHelpers.isOptionSelected(nodeName, j);
                var isSelected = this.editorHelpers.isOptionSelected(nodeName, j);
                // this.drawLinearConnection(graphNode, successorNode, j);
                this.drawBezierConnection(
                  graphNode,
                  j,
                  successorNode.editor.position,
                  isHighlighted && !otherOptionIsSelected,
                  isSelected
                );
              }
            }
          };
          EditorRenderer.prototype.drawBezierConnection = function (
            graphNode,
            j,
            successorNodePosition,
            isHighlighted,
            isSelected
          ) {
            // Construct Bézier handles.
            var zA = new plotboilerplate_1.Vertex(graphNode.editor.position).addXY(
              this.boxSize.width + 16,
              this.boxSize.height / 2.0 + (j + 1) * (this.boxSize.height + 2) - 2
            );
            var zB = new plotboilerplate_1.Vertex(successorNodePosition);
            var cA = zA.clone().addXY(50, 0);
            var cB = zB.clone().subXY(50, 50);
            var isCanvas = this.pb.canvas instanceof HTMLCanvasElement;
            if (isCanvas) {
              // Maybe future versions of PlotBoilerplate support this for Canvas & SVG nodes
              if (isHighlighted) {
                this.pb.draw.ctx.setLineDash([10, 6]);
              } else {
                this.pb.draw.ctx.setLineDash([0]);
              }
            }
            this.cubicBezierArrow(zA, zB, cA, cB, isHighlighted || isSelected ? "rgba(0,192,255,0.5)" : "rgba(255,192,0,0.5)", 2);
            if (isCanvas) {
              this.pb.draw.ctx.setLineDash([0]);
            }
          };
          /**
           * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
           *
           * @method arrow
           * @param {Vertex} zA - The start point of the arrow-line.
           * @param {Vertex} zB - The end point of the arrow-line.
           * @param {string} color - Any valid CSS color string.
           * @param {number=} lineWidth - (optional) The line width to use; default is 1.
           * @return {void}
           * @instance
           * @memberof drawutils
           **/
          EditorRenderer.prototype.cubicBezierArrow = function (zA, zB, cA, cB, color, lineWidth) {
            var _this = this;
            var headlen = 8; // length of head in pixels
            var vertices = plotboilerplate_1.Vertex.utils
              .buildArrowHead(cB, zB, headlen, 1.0, 1.0) // this.pb.draw.scale.x, this.pb.draw.scale.y);
              .map(function (vertex) {
                return vertex.scale(1.0 / _this.pb.draw.scale.x, zB);
              });
            this.pb.draw.cubicBezier(zA, zB, cA, cB, color, lineWidth);
            this.pb.fill.polyline(vertices, false, color, lineWidth);
            // Draw bezier control lines?
            // this.pb.draw.line(zA, cA, "grey", 1);
            // this.pb.draw.line(zB, cB, "grey", 1);
          };
          EditorRenderer.OPTION_OFFSET_X = 16;
          return EditorRenderer;
        })();
        exports.EditorRenderer = EditorRenderer;
        //# sourceMappingURL=editorRenderer.js.map

        /***/
      },

    /***/ "./dist/cjs/entry.js":
      /*!***************************!*\
  !*** ./dist/cjs/entry.js ***!
  \***************************/
      /***/ (__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
        // import { detectDarkMode } from "./detectDarkMode";
        // import { RPGDOMHelpers } from "./domHelpers";
        // import { EditorHelper } from "./editorHelpers";
        // import { Editor } from "./Editor";
        // import { gup } from "./gup";
        // import { DialogueMetaHelpers } from "./metaHelpers";
        // import { Modal } from "./modal";
        // import { RPGDialogueLogic } from "./RPGDialogueLogic";
        // import { TouchHandler } from "./TouchHandler";

        // export const RPG = {
        //   detectDarkMode: detectDarkMode,
        //   RPGDOMHelpers: RPGDOMHelpers,
        //   Editor: Editor,
        //   EditorHelper: EditorHelper,
        //   gup: gup,
        //   DialogueMetaHelpers: DialogueMetaHelpers,
        //   Modal: Modal,
        //   RPGDialogueLogic: RPGDialogueLogic,
        //   TouchHandler: TouchHandler
        // };

        // globalThis.RPGDOMHelpers = RPGDOMHelpers;
        // globalThis.Editor = Editor;
        // globalThis.EditorHelper = EditorHelper;
        // globalThis.gup = gup;
        // globalThis.DialogueMetaHelpers = DialogueMetaHelpers;
        // globalThis.globalThisModal = globalThisModal;
        // globalThis.RPGDialogueLogic = RPGDialogueLogic;
        // globalThis.TouchHandler = TouchHandler;

        // import { detectDarkMode } from "./detectDarkMode";
        // import { RPGDOMHelpers } from "./domHelpers";
        // import { EditorHelper } from "./editorHelpers";
        // import { Editor } from "./Editor";
        // import { gup } from "./gup";
        // import { DialogueMetaHelpers } from "./metaHelpers";
        // import { Modal } from "./modal";
        // import { RPGDialogueLogic } from "./RPGDialogueLogic";
        // import { TouchHandler } from "./TouchHandler";

        globalThis.gup = __webpack_require__(/*! ./gup */ "./dist/cjs/gup.js").gup;
        console.log("gup", gup);
        globalThis.detectDarkMode = __webpack_require__(/*! ./detectDarkMode */ "./dist/cjs/detectDarkMode.js").detectDarkMode;
        globalThis.RPGDialogueLogic = __webpack_require__(
          /*! ./RPGDialogueLogic */ "./dist/cjs/RPGDialogueLogic.js"
        ).RPGDialogueLogic;
        globalThis.RPGDOMHelpers = __webpack_require__(/*! ./domHelpers */ "./dist/cjs/domHelpers.js").RPGDOMHelpers;
        globalThis.DialogueMetaHelpers = __webpack_require__(
          /*! ./metaHelpers */ "./dist/cjs/metaHelpers.js"
        ).DialogueMetaHelpers;
        globalThis.Modal = __webpack_require__(/*! ./modal */ "./dist/cjs/modal.js").Modal;
        globalThis.EditorHelper = __webpack_require__(/*! ./editorHelpers */ "./dist/cjs/editorHelpers.js").EditorHelper;
        globalThis.TouchHandler = __webpack_require__(/*! ./TouchHandler */ "./dist/cjs/TouchHandler.js").TouchHandler;
        globalThis.Editor = __webpack_require__(/*! ./Editor */ "./dist/cjs/Editor.js").Editor;

        console.log("Editor", Editor);

        /***/
      },

    /***/ "./dist/cjs/gup.js":
      /*!*************************!*\
  !*** ./dist/cjs/gup.js ***!
  \*************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.gup = void 0;
        // Get the URI GET params as an assoc.
        //
        // A nicer version with regex
        // Found at
        //    https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
        var gup = function () {
          var vars = {};
          var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (_m, key, value) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
              args[_i - 3] = arguments[_i];
            }
            vars[key] = value;
            return value;
          });
          return vars;
        };
        exports.gup = gup;
        //# sourceMappingURL=gup.js.map

        /***/
      },

    /***/ "./dist/cjs/metaHelpers.js":
      /*!*********************************!*\
  !*** ./dist/cjs/metaHelpers.js ***!
  \*********************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        /**
         * Helper to edit dialogue meta data.
         *
         * @author  Ikaros Kappler
         * @date    2023-08-09
         * @version 1.0.0
         */
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.DialogueMetaHelpers = void 0;
        var modal_1 = __webpack_require__(/*! ./modal */ "./dist/cjs/modal.js");
        var DialogueMetaHelpers = /** @class */ (function () {
          function DialogueMetaHelpers(editorHelpers) {
            this.editorHelpers = editorHelpers;
            document.getElementById("b-configure-meta").addEventListener("click", this.handleModalOpen());
          }
          DialogueMetaHelpers.prototype.handleModalOpen = function () {
            var _this = this;
            var _self = this;
            return function () {
              _self.metaCopy = DialogueMetaHelpers.cloneMeta(_this.editorHelpers.dialogConfigWithPositions.meta);
              _self.editorHelpers.domHelper.modal.setTitle("Dialogue Config Meta Data");
              _self.editorHelpers.domHelper.modal.setBody(_self.buildMetaBody());
              _self.editorHelpers.domHelper.modal.setFooter("");
              _self.editorHelpers.domHelper.modal.setActions([
                { label: "Save", action: _self.handleSave() },
                modal_1.Modal.ACTION_CANCEL
              ]);
              _self.editorHelpers.domHelper.modal.open();
            };
          };
          DialogueMetaHelpers.prototype.updateModalBody = function () {
            var newBody = this.buildMetaBody();
            this.editorHelpers.domHelper.modal.setBody(newBody);
          };
          DialogueMetaHelpers.prototype.buildMetaBody = function () {
            var metaBody = document.createElement("div");
            this.inputName = document.createElement("input");
            this.inputName.value = this.metaCopy.name;
            this.inputName.addEventListener("change", this.handleUpdateMetaName());
            var nameLabel = document.createElement("div");
            nameLabel.innerHTML = "Dialogue name";
            var npcContainer = document.createElement("div");
            npcContainer.classList.add("e-meta-npccontainer");
            this.inputsNpcNames = [];
            for (var i = 0; i < this.metaCopy.npcs.length; i++) {
              var container = document.createElement("div");
              var label = document.createElement("div");
              label.innerHTML = "NPC #".concat(i);
              var npcNameInput = document.createElement("input");
              npcNameInput.value = this.metaCopy.npcs[i].name;
              npcNameInput.addEventListener("change", this.handleNpcNameChange(i));
              var btnRemove = document.createElement("button");
              btnRemove.innerHTML = "&#x1F5D1;";
              btnRemove.addEventListener("click", this.handleDeleteNpc(i));
              container.appendChild(label);
              container.appendChild(npcNameInput);
              container.appendChild(btnRemove);
              npcContainer.appendChild(container);
              this.inputsNpcNames.push(npcNameInput);
            }
            var btnAddNpc = document.createElement("button");
            btnAddNpc.innerHTML = "Add NPC";
            btnAddNpc.addEventListener("click", this.handleAddNpc());
            metaBody.appendChild(nameLabel);
            metaBody.appendChild(this.inputName);
            metaBody.appendChild(npcContainer);
            metaBody.appendChild(btnAddNpc);
            return metaBody;
          };
          DialogueMetaHelpers.prototype.handleUpdateMetaName = function () {
            var _self = this;
            return function (event) {
              _self.metaCopy.name = event.target.value;
            };
          };
          DialogueMetaHelpers.prototype.handleNpcNameChange = function (index) {
            var _self = this;
            return function (event) {
              _self.metaCopy.npcs[index].name = event.target.value;
            };
          };
          DialogueMetaHelpers.prototype.handleDeleteNpc = function (index) {
            var _self = this;
            return function () {
              _self.metaCopy.npcs.splice(index, 1);
              _self.updateModalBody();
            };
          };
          DialogueMetaHelpers.prototype.handleAddNpc = function () {
            var _self = this;
            return function () {
              _self.metaCopy.npcs.push({ name: "New NPC" });
              _self.updateModalBody();
            };
          };
          DialogueMetaHelpers.prototype.handleSave = function () {
            var _self = this;
            return function () {
              _self.editorHelpers.dialogConfigWithPositions.meta = _self.metaCopy;
              _self.editorHelpers.domHelper.modal.close();
              _self.editorHelpers.domHelper.updateNpcSelector();
            };
          };
          DialogueMetaHelpers.cloneMeta = function (meta) {
            var copy = {};
            copy.name = meta.name;
            copy.npcs = [];
            for (var i = 0; i < meta.npcs.length; i++) {
              copy.npcs.push({ name: meta.npcs[i].name });
            }
            return copy;
          };
          return DialogueMetaHelpers;
        })();
        exports.DialogueMetaHelpers = DialogueMetaHelpers;
        //# sourceMappingURL=metaHelpers.js.map

        /***/
      },

    /***/ "./dist/cjs/modal.js":
      /*!***************************!*\
  !*** ./dist/cjs/modal.js ***!
  \***************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";

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
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Modal = void 0;
        var Modal = /** @class */ (function () {
          function Modal() {
            this.modalElements = this.buildDOMNode("myModal-" + Modal.MODAL_COUNTER++);
          }
          Modal.prototype.setTitle = function (title) {
            this.modalElements.modal.header.content.innerHTML = title;
          };
          Modal.prototype.setBody = function (bodyContent) {
            if (Modal.isDOMNode(bodyContent)) {
              Modal.removeChildNodes(this.modalElements.modal.body.content);
              this.modalElements.modal.body.content.append(bodyContent);
            } else {
              this.modalElements.modal.body.content.innerHTML = bodyContent;
            }
          };
          Modal.prototype.setFooter = function (title) {
            if (typeof title === "string") {
              this.modalElements.modal.footer.content.innerHTML = title.length == 0 ? "&nbsp;" : title;
            } else {
              console.log("Footer elements?");
            }
          };
          Modal.prototype.setActions = function (actions) {
            var _self = this;
            Modal.removeChildNodes(this.modalElements.modal.footer.actions);
            if (Array.isArray(actions)) {
              for (var i in actions) {
                var a = actions[i];
                var cmd = null;
                var btn = document.createElement("button");
                btn.innerHTML = a.label;
                if (typeof a.action === "function") {
                  btn.addEventListener("click", a.action);
                } else if (
                  (typeof a === "string" && (cmd = a) != null) ||
                  (typeof a.action === "string" && (cmd = a.action) != null)
                ) {
                  if (cmd === "cancel" || cmd === "ok" || cmd === "close")
                    btn.addEventListener("click", function () {
                      _self.close();
                    });
                }
                this.modalElements.modal.footer.actions.appendChild(btn);
              }
            }
          };
          Modal.prototype.close = function () {
            this.modalElements.modal.parent.classList.remove("modal-opened");
            this.modalElements.modal.parent.classList.add("modal-closed");
          };
          Modal.prototype.open = function () {
            this.modalElements.modal.parent.classList.remove("modal-closed");
            this.modalElements.modal.parent.classList.add("modal-opened");
          };
          Modal.prototype.buildDOMNode = function (id) {
            var _self = this;
            var modal = document.createElement("div");
            modal.setAttribute("id", id);
            modal.classList.add("modal");
            modal.classList.add("modal-closed");
            var content = document.createElement("div");
            content.classList.add("modal-content");
            var header = document.createElement("div");
            header.classList.add("modal-header");
            var closeBtn = document.createElement("span");
            closeBtn.classList.add("modal-close");
            closeBtn.innerHTML = "&times;";
            var h2 = document.createElement("h2");
            h2.innerHTML = "Modal Header";
            var body = document.createElement("div");
            body.classList.add("modal-body");
            // Body contents?
            var bodyContent = document.createElement("p");
            bodyContent.innerHTML = "Some text in the Modal Body";
            var footer = document.createElement("div");
            footer.classList.add("modal-footer");
            var footerContent = document.createElement("h3");
            var footerActions = document.createElement("div");
            footerContent.innerHTML = "Modal Footer";
            footerActions.classList.add("modal-actions");
            footer.appendChild(footerContent);
            footer.appendChild(footerActions);
            header.appendChild(closeBtn);
            header.appendChild(h2);
            content.appendChild(header);
            body.appendChild(bodyContent);
            content.appendChild(body);
            content.appendChild(footer);
            modal.appendChild(content);
            // When the user clicks on <span> (x), close the modal
            closeBtn.onclick = function () {
              _self.close();
            };
            // Append new modal to body
            document.getElementsByTagName("body")[0].appendChild(modal);
            return {
              modal: {
                id: id,
                parent: modal,
                header: {
                  closeBtn: closeBtn,
                  content: h2
                },
                body: { content: bodyContent },
                footer: {
                  content: footerContent,
                  actions: footerActions
                }
              }
            };
          };
          // https://stackoverflow.com/questions/384286/how-do-you-check-if-a-javascript-object-is-a-dom-object
          Modal.isDOMNode = function (obj) {
            try {
              //Using W3 DOM2 (works for FF, Opera and Chrome)
              return obj instanceof HTMLElement;
            } catch (e) {
              //Browsers not supporting W3 DOM2 don't have HTMLElement and
              //an exception is thrown and we end up here. Testing some
              //properties that all elements have (works on IE7)
              return (
                typeof obj === "object" &&
                obj.nodeType === 1 &&
                typeof obj.style === "object" &&
                typeof obj.ownerDocument === "object"
              );
            }
          };
          Modal.ACTION_CLOSE = { label: "Close", action: "close" };
          Modal.ACTION_CANCEL = { label: "Cancel", action: "close" };
          Modal.ACTION_OK = { label: "OK", action: "close" };
          Modal.MODAL_COUNTER = 0;
          Modal.removeChildNodes = function (node) {
            // Remove all current actions
            while (node.firstChild) {
              node.removeChild(node.lastChild);
            }
          };
          return Modal;
        })();
        exports.Modal = Modal;
        //# sourceMappingURL=modal.js.map

        /***/
      }

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {}
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/ __webpack_require__.m = __webpack_modules__;
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/chunk loaded */
  /******/ (() => {
    /******/ var deferred = [];
    /******/ __webpack_require__.O = (result, chunkIds, fn, priority) => {
      /******/ if (chunkIds) {
        /******/ priority = priority || 0;
        /******/ for (var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
        /******/ deferred[i] = [chunkIds, fn, priority];
        /******/ return;
        /******/
      }
      /******/ var notFulfilled = Infinity;
      /******/ for (var i = 0; i < deferred.length; i++) {
        /******/ var [chunkIds, fn, priority] = deferred[i];
        /******/ var fulfilled = true;
        /******/ for (var j = 0; j < chunkIds.length; j++) {
          /******/ if (
            (priority & (1 === 0) || notFulfilled >= priority) &&
            Object.keys(__webpack_require__.O).every(key => __webpack_require__.O[key](chunkIds[j]))
          ) {
            /******/ chunkIds.splice(j--, 1);
            /******/
          } else {
            /******/ fulfilled = false;
            /******/ if (priority < notFulfilled) notFulfilled = priority;
            /******/
          }
          /******/
        }
        /******/ if (fulfilled) {
          /******/ deferred.splice(i--, 1);
          /******/ var r = fn();
          /******/ if (r !== undefined) result = r;
          /******/
        }
        /******/
      }
      /******/ return result;
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/define property getters */
  /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          /******/ Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/global */
  /******/ (() => {
    /******/ __webpack_require__.g = (function () {
      /******/ if (typeof globalThis === "object") return globalThis;
      /******/ try {
        /******/ return this || new Function("return this")();
        /******/
      } catch (e) {
        /******/ if (typeof window === "object") return window;
        /******/
      }
      /******/
    })();
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = exports => {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/jsonp chunk loading */
  /******/ (() => {
    /******/ // no baseURI
    /******/
    /******/ // object to store loaded and loading chunks
    /******/ // undefined = chunk not loaded, null = chunk preloaded/prefetched
    /******/ // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
    /******/ var installedChunks = {
      /******/ "main": 0
      /******/
    };
    /******/
    /******/ // no chunk on demand loading
    /******/
    /******/ // no prefetching
    /******/
    /******/ // no preloaded
    /******/
    /******/ // no HMR
    /******/
    /******/ // no HMR manifest
    /******/
    /******/ __webpack_require__.O.j = chunkId => installedChunks[chunkId] === 0;
    /******/
    /******/ // install a JSONP callback for chunk loading
    /******/ var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
      /******/ var [chunkIds, moreModules, runtime] = data;
      /******/ // add "moreModules" to the modules object,
      /******/ // then flag all "chunkIds" as loaded and fire callback
      /******/ var moduleId,
        chunkId,
        i = 0;
      /******/ if (chunkIds.some(id => installedChunks[id] !== 0)) {
        /******/ for (moduleId in moreModules) {
          /******/ if (__webpack_require__.o(moreModules, moduleId)) {
            /******/ __webpack_require__.m[moduleId] = moreModules[moduleId];
            /******/
          }
          /******/
        }
        /******/ if (runtime) var result = runtime(__webpack_require__);
        /******/
      }
      /******/ if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
      /******/ for (; i < chunkIds.length; i++) {
        /******/ chunkId = chunkIds[i];
        /******/ if (__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
          /******/ installedChunks[chunkId][0]();
          /******/
        }
        /******/ installedChunks[chunkId] = 0;
        /******/
      }
      /******/ return __webpack_require__.O(result);
      /******/
    };
    /******/
    /******/ var chunkLoadingGlobal = (self["webpackChunkrpg_dialogue"] = self["webpackChunkrpg_dialogue"] || []);
    /******/ chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
    /******/ chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
    /******/
  })();
  /******/
  /************************************************************************/
  /******/
  /******/ // startup
  /******/ // Load entry module and return exports
  /******/ // This entry module depends on other loaded chunks and execution need to be delayed
  /******/ var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () =>
    __webpack_require__("./dist/cjs/entry.js")
  );
  /******/ __webpack_exports__ = __webpack_require__.O(__webpack_exports__);
  /******/
  /******/
})();
//# sourceMappingURL=rpg-dialogue-main.js.map
