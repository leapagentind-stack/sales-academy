const getdb = () => global.db;

class Ads {
  static async getAll() {
    const query = "SELECT * FROM ads";
    const [rows] = await getdb().execute(query);
    return rows;
  }
}

module.exports = Ads;
