const app = require('./src/app');
const config = require('./src/config/config');
const connectDB = require('./src/config/database');

const PORT = config.port || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`SceneStream API server running on port ${PORT}`);
});