import * as FileSystem from 'expo-file-system/legacy';
import uuid from 'react-native-uuid';

const PHOTOS_DIR = FileSystem.documentDirectory + 'photos/';

export type Photo = {
  id: string;
  uri: string;
  createdAt: string;
  size?: number;
};

// Vérifie et crée le dossier
export async function ensureDir() {
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

// Sauvegarde une photo localement
export async function savePhoto(tempUri: string): Promise<Photo> {
  await ensureDir();
  const id = uuid.v4() as string;
  const fileName = `photo_${id}.jpg`;
  const dest = PHOTOS_DIR + fileName;

  await FileSystem.copyAsync({ from: tempUri, to: dest });

  const info = await FileSystem.getInfoAsync(dest);
  return {
    id,
    uri: dest,
    createdAt: new Date().toISOString(),
    size: info.size,
  };
}

// Liste toutes les photos
export async function listPhotos(): Promise<Photo[]> {
  await ensureDir();
  const files = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
  const photos = await Promise.all(
    files
      .filter((f) => f.endsWith('.jpg'))
      .map(async (file) => {
        const uri = PHOTOS_DIR + file;
        const info = await FileSystem.getInfoAsync(uri);
        return {
          id: file.replace('.jpg', '').replace('photo_', ''),
          uri,
          createdAt: info.modificationTime
            ? new Date(info.modificationTime * 1000).toISOString()
            : new Date().toISOString(),
          size: info.size,
        };
      })
  );
  return photos.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// Récupère une photo spécifique
export async function getPhoto(id: string): Promise<Photo | null> {
  const uri = `${PHOTOS_DIR}photo_${id}.jpg`;
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) return null;
  return {
    id,
    uri,
    createdAt: new Date(info.modificationTime! * 1000).toISOString(),
    size: info.size,
  };
}

// Supprime une photo
export async function deletePhoto(id: string): Promise<void> {
  const uri = `${PHOTOS_DIR}photo_${id}.jpg`;
  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    await FileSystem.deleteAsync(uri);
  }
}
