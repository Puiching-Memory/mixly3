import * as Blockly from 'blockly/core';
import * as Mixly from 'mixly';

const IOT_HUE = '#526FC3';
//'#2FAD7A';

export const iot_wifi_connect = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_ESP32_IOT_CONNECT_WIFI);
        this.appendValueInput('WIFINAME')
            .setCheck(String)
            .appendField(Blockly.Msg.HTML_NAME);
        this.appendValueInput('PASSWORD')
            .setCheck(String)
            .appendField(Blockly.Msg.HTML_PASSWORD);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_WIFI_CONNECT_TOOLTIP);
    }
};

export const iot_onenet_connect = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendValueInput('VAR')
            .setCheck("var")
            .appendField("OneNET" + Blockly.Msg.TUPLE_JOIN);
        this.appendValueInput('CLIENT')
            .setCheck(String)
            .appendField(Blockly.Msg.MIXLY_ESP32_ONENET_CLIENT);
        this.appendValueInput('SERVER')
            .setCheck(String)
            .appendField(Blockly.Msg.MIXLY_ESP32_ONENET_SERVER);
        this.appendValueInput('USERNAME')
            .setCheck(String)
            .appendField(Blockly.Msg.MIXLY_ESP32_ONENET_USERNAME);
        this.appendValueInput('PASSWORD')
            .setCheck(String)
            .appendField(Blockly.Msg.MIXLY_ESP32_ONENET_PASSWORD);
        this.appendValueInput('TOPIC')
            .setCheck(String)
            .appendField(Blockly.Msg.MIXLY_ESP32_ONENET_TOPIC);
        this.appendValueInput('SUB')
            .appendField(Blockly.Msg.MIXLY_ESP32_ONENET_SUB);
        //this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_ONENET_CONNECT_TOOLTIP);
    }
};

export const iot_onenet_disconnect = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendValueInput('VAR')
            .setCheck("var")
            .appendField("OneNET")
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_ESP32_DISCONNECT_ONENET);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_ONENET_DISCONNECT_TOOLTIP);
    }
};

export const iot_onenet_check = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendValueInput('VAR')
            .setCheck("var")
            .appendField("OneNET")
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_ESP32_CHECK_ONENET);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_ONENET_CHECK_TOOLTIP);
    }
};

export const iot_onenet_publish_dict = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendValueInput('VAR')
            .setCheck("var")
            .appendField("OneNET")
        this.appendValueInput('DICT')
            .appendField(Blockly.Msg.MIXLY_ESP32_PUBLISH_ONENET);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_ESP32_IOT_ONENET_PRINT_DATA)
            .appendField(new Blockly.FieldCheckbox('TRUE'), 'is_print');
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_ONENET_PUBLISH_DICT_TOOLTIP);
    }
};

export const iot_onenet_publish = {
    /**
     * Block for creating a list with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(IOT_HUE);
        this.appendValueInput('VAR')
            .setCheck("var")
            .appendField("OneNET")
            .setAlign(Blockly.inputs.Align.RIGHT)
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel(Blockly.Msg.MIXLY_ESP32_PUBLISH_ONENET), 'TIP')
            .setAlign(Blockly.inputs.Align.RIGHT)
        this.itemCount_ = 2;
        this.updateShape_();
        this.setInputsInline(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setMutator(new Blockly.icons.MutatorIcon(['iot_publish_item'], this));
        this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_ONENET_PUBLISH_TOOLTIP);
    },
    /**
     * Create XML to represent list inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var containerBlock =
            workspace.newBlock('iot_publish_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('iot_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        // Count number of inputs.
        var connections = [];
        let i = 0;
        while (itemBlock) {
            connections[i] = itemBlock.valueConnection_;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
            i++;
        }
        this.itemCount_ = i;
        this.updateShape_();
        // Reconnect any child blocks.
        for (let i = 0; i < this.itemCount_; i++) {
            if (connections[i]) {
                this.getInput('ADD' + i).connection.connect(connections[i]);
            }
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var i = 0;
        while (itemBlock) {
            var input = this.getInput('ADD' + i);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            i++;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
        // Delete everything.
        if (this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        }
        var keyNames = [];
        for (let i = 0; this.getInput('ADD' + i); i++) {
            //this.getInput('VALUE' + i).removeField("KEY"+i);
            keyNames.push(this.getFieldValue("KEY" + i))
            this.removeInput('ADD' + i);
        }
        // Rebuild block.
        if (this.itemCount_ == 0) {
            //this.getField('TIP')
            //.setText(Blockly.Msg.MIXLY_ESP32_PUBLISH_ONENET_EMPTY);
            this.setFieldValue(Blockly.Msg.MIXLY_ESP32_PUBLISH_ONENET_EMPTY, 'TIP');
        } else {
            //this.getField('TIP')
            //.setText(Blockly.Msg.MIXLY_ESP32_PUBLISH_ONENET);
            this.setFieldValue(Blockly.Msg.MIXLY_ESP32_PUBLISH_ONENET, 'TIP');
            for (let i = 0; i < this.itemCount_; i++) {
                this.appendValueInput('ADD' + i)
                    .setCheck(null)
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField(
                        new Blockly.FieldTextInput(
                            keyNames.length > i
                                ? keyNames[i]
                                : '"key' + (i + 1) + '"'),
                        'KEY' + i)
                    .appendField(":")
            }
        }
    }, getVars: function () {
        return [this.getFieldValue('VAR')];
    },
    renameVar: function (oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
            this.setTitleValue(newName, 'VAR');
        }
    }
};

export const iot_publish_container = {
    /**
     * Mutator block for list container.
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_MICROBIT_TYPE_DICT);
        this.appendStatementInput('STACK');
        this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TOOLTIP);
        this.contextMenu = false;
    }
};

export const iot_publish_item = {
    /**
     * Mutator bolck for adding items.
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TITLE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TOOLTIP);
        this.contextMenu = false;
    }
};

export const iot_create_with_item = {
    /**
     * Mutator bolck for adding items.
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TITLE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TOOLTIP);
        this.contextMenu = false;
    }
};

export const iot_mixio_connect = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_CREATE_MQTT_CLIENT_AND_CONNECT);
        this.appendValueInput('SERVER')
            .setCheck(String)
            .appendField(Blockly.Msg.MIXLY_EMQX_SERVER)
            .setAlign(Blockly.inputs.Align.RIGHT)
        this.appendValueInput('USERNAME')
            .setCheck(String)
            .appendField(Blockly.Msg.MIXLY_WIFI_USERNAME)
            .setAlign(Blockly.inputs.Align.RIGHT)
        this.appendValueInput('PASSWORD')
            .setCheck(String)
            .appendField(Blockly.Msg.MIXLY_IOT_PASSWORD)
            .setAlign(Blockly.inputs.Align.RIGHT)
        this.appendValueInput('PROJECT')
            .setCheck(String)
            .appendField(Blockly.Msg.MIXLY_EMQX_PROJECT)
            .setAlign(Blockly.inputs.Align.RIGHT)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

export const IOT_MIXIO_PUBLISH = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField("MixIO")
        this.appendValueInput('TOPIC')
            .appendField(Blockly.Msg.MIXLY_EMQX_PUBLISH_NEW)
            .appendField(Blockly.Msg.MIXLY_EMQX_PUBLISH_TOPIC);
        this.appendValueInput('MSG')
            .appendField(Blockly.Msg.HTML_BODY);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_EMQX_PUBLISH_TOOLTIP);
    }
};

export const IOT_MIXIO_SUBSCRIBE = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField("MixIO")
        this.appendValueInput('TOPIC')
            .appendField(Blockly.Msg.MIXLY_EMQX_SUBSCRIBE + Blockly.Msg.MIXLY_MICROBIT_MSG)
            .appendField(Blockly.Msg.MIXLY_EMQX_PUBLISH_TOPIC);
        this.appendValueInput('METHOD')
            .appendField(Blockly.Msg.MIXLY_EMQX_SET_METHOD);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_EMQX_SUBSCRIBE_TOOLTIP);
    }
};

export const iot_mixio_disconnect = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField("MixIO")
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_ESP32_DISCONNECT_ONENET);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        // this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_ONENET_DISCONNECT_TOOLTIP);
    }
};

export const iot_mixio_connect_only = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField("MixIO")
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_EMQX_CONNECT);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        // this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_ONENET_DISCONNECT_TOOLTIP);
    }
};

export const iot_mixio_check = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField("MixIO")
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_ESP32_CHECK_ONENET);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        // this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_ONENET_CHECK_TOOLTIP);
    }
};

export const iot_mixio_format_topic = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_MICROPYTHON_FORMAT)
            .appendField(Blockly.Msg.MQTT_Topic);
        this.setInputsInline(true);
        this.setOutput(true);
    }
};

export const iot_mixio_format_msg = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_MICROPYTHON_FORMAT)
            .appendField(Blockly.Msg.MIXLY_EMQX_PUBLISH_MSG);
        this.setInputsInline(true);
        this.setOutput(true);
    }
};

export const IOT_FORMATTING = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendValueInput('VAR')
            .appendField(Blockly.Msg.MIXLY_ESP32_IOT_MAP_FORMATING);
        this.setOutput(true);
        // this.setTooltip();
    }
};

export const IOT_FORMAT_STRING = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendValueInput('VAR')
            .appendField(Blockly.Msg.MIXLY_MICROPYTHON_FORMAT + '(Json)');
        this.setOutput(true);
        // this.setTooltip();
    }
};

export const IOT_EMQX_PING = {
    init: function () {
        this.setColour(IOT_HUE);
        // this.appendValueInput('VAR')
        //     .setCheck("var")
        this.appendDummyInput()
            .appendField("MixIO")
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_EMQX_PING);
        this.setInputsInline(true);
        this.setOutput(true);
        this.setTooltip(Blockly.Msg.MIXLY_ESP32_IOT_EMQX_PING_TOOLTIP);
    }
};

export const IOT_MIXIO_NTP = {
    init: function () {
        this.setColour(IOT_HUE);
        // this.appendValueInput('VAR')
        //     .setCheck("var")
        this.appendDummyInput()
            .appendField("MixIO")
            .appendField(Blockly.Msg.MIXLY_GET_NTP)
        this.appendValueInput('addr')
            .appendField(Blockly.Msg.blynk_SERVER_ADD);
        this.setInputsInline(true);
        this.setOutput(true);
    }
};

export const IOT_EMQX_INIT_AND_CONNECT_BY_SHARE_CODE = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_CREATE_MQTT_CLIENT_AND_CONNECT);
        this.appendValueInput('SERVER')
            .appendField(Blockly.Msg.MIXLY_EMQX_SERVER)
            .setAlign(Blockly.inputs.Align.RIGHT);
        this.appendValueInput('KEY')
            .appendField(Blockly.Msg.CONTROLS_FOR_INPUT_WITH + Blockly.Msg.MIXLY_MIXIO_SHARE_KEY)
            .setAlign(Blockly.inputs.Align.RIGHT);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

export const IOT_EMQX_INIT_AND_CONNECT_BY_MIXLY_CODE = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_CREATE_MQTT_CLIENT_AND_CONNECT);
        this.appendValueInput('SERVER')
            .appendField(Blockly.Msg.MIXLY_EMQX_SERVER)
            .setAlign(Blockly.inputs.Align.RIGHT);
        this.appendValueInput('KEY')
            .appendField(Blockly.Msg.CONTROLS_FOR_INPUT_WITH + "Mixly Key")
            .setAlign(Blockly.inputs.Align.RIGHT);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

export const iot_mixly_key = {
    init: function () {
        this.VISITOR_ID = Mixly.Config.BOARD.visitorId.str32.substring(0, 8).toUpperCase();
        this.setColour(IOT_HUE);
        this.appendDummyInput("")
            .appendField(new Blockly.FieldTextInput(this.visitorId), 'VISITOR_ID');
        this.setOutput(true, null);
    },
    onchange: function () {
        const nowVisitorId = this.getFieldValue('VISITOR_ID');
        if (this.VISITOR_ID !== nowVisitorId)
            this.setFieldValue(this.VISITOR_ID, 'VISITOR_ID');
    }
};

export const iot_client_onboard = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField('MixIO')
            .appendField(Blockly.Msg.MSG.catEthernet_clinet);
        this.setOutput(true);
        this.setInputsInline(true);
    }
};

export const iot_http_client = {
    init: function () {
        this.setColour(IOT_HUE);
        // this.appendValueInput('VAR')
        //     .setCheck("var")
        this.appendDummyInput()
            .appendField("HTTP" + Blockly.Msg.MIXLY_Client)
        this.appendValueInput('addr')
            .appendField(Blockly.Msg.DISPLAY_IMAGE_LET2);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_REQUESTS_GET)
            .appendField(Blockly.Msg.MIXLY_GET_CURRENT_TIME)
            .appendField(Blockly.Msg.MIXLY_OPEN_DEBUG)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_TURTLE_WRITE_MOVE_TRUE, "True"],
                [Blockly.Msg.MIXLY_TURTLE_WRITE_MOVE_FALSE, "False"]
            ]), "key");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

export const iot_http_data = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField("HTTP" + Blockly.Msg.MIXLY_Client)
            .appendField(Blockly.Msg.MIXLY_GET)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_REQUESTS_LEN, "client_len"],
                [Blockly.Msg.MIXLY_REQUESTS_GET_LEN, "server_len"],
                [Blockly.Msg.MIXLY_REQUESTS_MESSAGE, "text"]
            ]), "key");
        this.setOutput(true);
        this.setInputsInline(true);

    }
};

export const iot_mqtt_client = {
    init: function () {
        this.setColour(IOT_HUE);
        // this.appendValueInput('VAR')
        //     .setCheck("var")
        this.appendDummyInput()
            .appendField("MQTT" + Blockly.Msg.MIXLY_Client)
        this.appendValueInput('addr')
            .appendField(Blockly.Msg.MIXLY_CONNECTTO);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_INIT_SUBSCRIBE)
            .appendField(Blockly.Msg.MQTT_Topic)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_GET_CURRENT_TIME, ""],
            ]), "key")
            .appendField(Blockly.Msg.MIXLY_OPEN_DEBUG)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_TURTLE_WRITE_MOVE_TRUE, "True"],
                [Blockly.Msg.MIXLY_TURTLE_WRITE_MOVE_FALSE, "False"]
            ]), "key2");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

export const iot_mqtt_data = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField("MQTT" + Blockly.Msg.MIXLY_Client)
            .appendField(Blockly.Msg.MIXLY_GET)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_REQUESTS_LEN, "client_len"],
                [Blockly.Msg.MIXLY_REQUESTS_GET_LEN, "server_len"],
                [Blockly.Msg.MIXLY_REQUESTS_MESSAGE, "time_msg()"]
            ]), "key");
        this.setOutput(true);
        this.setInputsInline(true);

    }
};

export const iot_wificonnect = iot_wifi_connect;
export const iot_onenetconnect = iot_onenet_connect;
export const iot_onenetdisconnect = iot_onenet_disconnect;
export const iot_checkonenet = iot_onenet_check;
export const iot_publish = iot_onenet_publish;

export const iot_connect_ollama = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_CONNECT_OLLAMA);
        this.appendValueInput('SERVER')
            .appendField(Blockly.Msg.MIXLY_EMQX_SERVER)
            .setAlign(Blockly.inputs.Align.RIGHT);
        this.appendValueInput('NAME')
            .appendField(Blockly.Msg.MODEL_NAME)
            .setAlign(Blockly.inputs.Align.RIGHT);
        this.appendValueInput('NUMBER')
            .appendField(Blockly.Msg.MIXLY_SET_MAXIMUM_HISTORICAL_SESSIONS_NUM);
        this.setInputsInline(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

export const IOT_CONNECT_OLLAMA = iot_connect_ollama;

export const iot_connect_openai = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_CONNECT_OPENAI);
        this.appendValueInput('SERVER')
            .appendField(Blockly.Msg.MIXLY_EMQX_SERVER)
            .setAlign(Blockly.inputs.Align.RIGHT);
        this.appendValueInput('KEY')
            .appendField(Blockly.Msg.MIXLY_API_PRIVATE_KEY)
            .setAlign(Blockly.inputs.Align.RIGHT);
        this.appendValueInput('NAME')
            .appendField(Blockly.Msg.MODEL_NAME)
            .setAlign(Blockly.inputs.Align.RIGHT);
        this.appendValueInput('NUMBER')
            .appendField(Blockly.Msg.MIXLY_SET_MAXIMUM_HISTORICAL_SESSIONS_NUM);
        this.setInputsInline(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

export const use_ollama_llm_to_chat = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_LLM_CHAT);
        this.appendValueInput('TOPIC')
            .appendField(Blockly.Msg.MIXLY_MIXGO_ESPNOW_SEND);
        this.appendValueInput('METHOD')
            .appendField(Blockly.Msg.MIXLY_LLM_CONTENT_CALLBACK);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

export const use_ollama_llm_to_chat_return = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_LLM_CHAT);
        this.appendValueInput('TOPIC')
            .appendField(Blockly.Msg.MIXLY_MIXGO_ESPNOW_SEND);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXPY_REQUESTS_GET_RESULT)
        this.setInputsInline(true);
        this.setOutput(true);
    }
};

// export const ollama_set_timeout = {
//     init: function () {
//         this.setColour(IOT_HUE);
//         this.appendValueInput("VAR")
//             .appendField('Ollama ' + Blockly.Msg.MIXLY_OLLAMA_SET_TIMEOUT);
//         this.setInputsInline(true);
//         this.setPreviousStatement(true);
//         this.setNextStatement(true);
//     }
// }

// export const ollama_set_max_retries = {
//     init: function () {
//         this.setColour(IOT_HUE);
//         this.appendValueInput("VAR")
//             .appendField('Ollama ' + Blockly.Msg.MIXLY_OLLAMA_SET_MAX_RETRIES);
//         this.setInputsInline(true);
//         this.setPreviousStatement(true);
//         this.setNextStatement(true);
//     }
// }

// export const ollama_set_custom_url = {
//     init: function () {
//         this.setColour(IOT_HUE);
//         this.appendValueInput("TEXT")
//             .appendField('Ollama ' + Blockly.Msg.MIXLY_OLLAMA_SET_CUSTOM_URL);
//         this.setInputsInline(true);
//         this.setPreviousStatement(true);
//         this.setNextStatement(true);
//     }
// }

// export const ollama_select_model = {
//     init: function () {
//         this.setColour(IOT_HUE);
//         this.appendValueInput("TEXT")
//             .appendField('Ollama ' + Blockly.Msg.MIXLY_SELECT_MODEL);
//         this.setInputsInline(true);
//         this.setPreviousStatement(true);
//         this.setNextStatement(true);
//     }
// }

// export const ollama_clear_user_history = {
//     init: function () {
//         this.setColour(IOT_HUE);
//         this.appendDummyInput()
//             .appendField('Ollama ' + Blockly.Msg.MIXLY_CLEAR_USER_HISTORY);
//         this.setInputsInline(true);
//         this.setPreviousStatement(true);
//         this.setNextStatement(true);
//     }
// }

export const ollama_empty_history = {
    init: function () {
        this.setColour(IOT_HUE);
        this.appendDummyInput()
            .appendField('Ollama ' + Blockly.Msg.MIXLY_EMPTY_HISTORY);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};