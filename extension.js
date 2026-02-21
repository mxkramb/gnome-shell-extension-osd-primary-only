import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class OSDPrimaryOnly extends Extension {
    enable() {
        if (!Main.osdWindowManager || typeof Main.osdWindowManager._showOsdWindow !== 'function') {
            console.error(`[${this.metadata.uuid}] Extension failed to load: _showOsdWindow API not found.`);
            return;
        }

        this._originalShow = Main.osdWindowManager._showOsdWindow;

        Main.osdWindowManager._showOsdWindow = (monitorIndex, ...args) => {
            try {
                const primaryIndex = Main.layoutManager.primaryIndex;
                return this._originalShow.call(Main.osdWindowManager, primaryIndex, ...args);
            } catch (error) {
                console.error(`[${this.metadata.uuid}] Error displaying OSD:`, error);
                return this._originalShow.call(Main.osdWindowManager, monitorIndex, ...args);
            }
        };
    }

    disable() {
        if (this._originalShow && Main.osdWindowManager) {
            Main.osdWindowManager._showOsdWindow = this._originalShow;
            this._originalShow = null;
        }
    }
}