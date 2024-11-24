import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';

export const fileSystem = {
    async checkFileExists(path: string): Promise<boolean> {
        try {
            return await exists(path, { baseDir: BaseDirectory.Desktop });
        } catch (error) {
            console.error('Error checking file existence:', error);
            return false;
        }
    }


};

