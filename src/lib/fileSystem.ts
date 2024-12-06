import { BaseDirectory, exists, writeFile } from '@tauri-apps/plugin-fs';
import { downloadDir } from '@tauri-apps/api/path';
import { toast } from '@/hooks/use-toast';

export const fileSystem = {
    async checkFileExists(path: string): Promise<boolean> {
        try {
            return await exists(path, { baseDir: BaseDirectory.Desktop });
        } catch (error) {
            console.error('Error checking file existence:', error);
            return false;
        }
    },

    async downloadFile(fileData: Uint8Array, fileName: string): Promise<boolean> {
        try {
            const downloadPath = await downloadDir();
            const filePath = `${downloadPath}/${fileName}`;

            await writeFile(filePath, fileData, { baseDir: BaseDirectory.Desktop });


            toast({
                title: "Download Complete",
                description: `File saved as ${fileName}`,
                duration: 3000,
            });

            return true;
        } catch (error) {
            console.error('Download failed:', error);
            toast({
                title: "Download Failed",
                description: "There was an error saving the file",
                variant: "destructive",
                duration: 5000,
            });
            return false;
        }
    }
};

