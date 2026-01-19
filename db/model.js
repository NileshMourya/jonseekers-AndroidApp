import { showMessage } from 'react-native-flash-message';
import { getDBConnection } from './connection';

export const createTable = async () => {
  const db = await getDBConnection();
  try {
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY,
        title TEXT,
        companyName TEXT,
        location TEXT,
        skills TEXT,
        description TEXT,
        roleResponsibility TEXT,
        postedBy TEXT,
        createdAt TEXT
      )
    `);
  } catch (error) {
    console.log('❌ Error creating table:', error);
  }
};

export const insertData = async data => {
  const db = await getDBConnection();
  try {
    const [res] = await db.executeSql('SELECT * FROM bookmarks WHERE id = ?', [
      data._id,
    ]);

    if (res.rows.length > 0) {
      console.log('⚠️ Duplicate found');
      showMessage({ message: 'Job already bookmarked', type: 'danger' });
      return;
    } else {
      console.log('✅ No duplicate');
    }

    const response = await db.executeSql(
      `INSERT INTO bookmarks (id, title, companyName, location, skills, description, roleResponsibility, postedBy, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data._id,
        data.title,
        data.companyName,
        data.location,
        data.skills,
        data.description,
        data.roleResponsibility,
        data.postedBy,
        data.createdAt,
      ],
    );

    if (response[0].rowsAffected > 0) {
      showMessage({
        message: '✅ Data inserted successfully',
        type: 'success',
      });
      return;
    }
  } catch (error) {
    console.log('❌ Error inserting data:', error);
  }
};

export const fetchBookmarks = async () => {
  try {
    const db = await getDBConnection();
    const [results] = await db.executeSql('SELECT * FROM bookmarks');
    const bookmarks = [];
    for (let i = 0; i < results.rows.length; i++) {
      const item = results.rows.item(i);
      bookmarks.push(item);
    }

    return bookmarks;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBookMarks = async id => {
  console.log(id);
  try {
    const db = await getDBConnection();
    const [res] = await db.executeSql('DELETE FROM bookmarks WHERE id=?', [id]);
    console.log(res.rowsAffected);
    if (res.rowsAffected > 0) {
      showMessage({ message: 'Job remove from bookmarked', type: 'danger' });
    }
  } catch (error) {
    console.log(error);
  }
};
export const dropTable = async () => {
  const db = await getDBConnection();
  try {
    const data = await db.executeSql('DROP TABLE IF EXISTS bookmarks');
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
