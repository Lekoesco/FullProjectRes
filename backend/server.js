require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000; // Η "Πόρτα της βάσης//

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
