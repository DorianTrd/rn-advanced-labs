import * as FileSystem from 'expo-file-system/legacy';
import uuid from 'react-native-uuid';

const PHOTO_DIR = FileSystem.documentDirectory + 'photos/';

export function usePhotoStorage() {
  const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(PHOTO_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(PHOTO_DIR, { intermediates: true });
    }
  };

  const addPhoto = async (uri: string) => {
    await ensureDirExists();
    const id = uuid.v4() as string;
    const dest = PHOTO_DIR + `photo_${id}.jpg`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  };

  const listPhotos = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(PHOTO_DIR);
    const photos = await Promise.all(
      files.map(async (f) => {
        const info = await FileSystem.getInfoAsync(PHOTO_DIR + f);
        return {
          id: f.replace('.jpg', ''),
          uri: PHOTO_DIR + f,
          createdAt: info.modificationTime
            ? new Date(info.modificationTime * 1000)
            : new Date(),
          size: info.size || 0,
        };
      })
    );
    return photos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const deletePhoto = async (uri: string) => {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  };

  return { addPhoto, listPhotos, deletePhoto }; 
}
