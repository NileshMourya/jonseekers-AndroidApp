import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

// ✅ Proper async database opening
export const getDBConnection = async () => {
  try {
    const db = await SQLite.openDatabase({
      name: 'bookmark.db',
      location: 'default',
    });
    console.log('✅ Database opened');
    return db;
  } catch (error) {
    console.log('❌ Error opening database:', error);
    throw error;
  }
};
