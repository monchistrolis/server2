const mongoose = require("mongoose");
const personaSchema = new mongoose.Schema({
  rut:String,
  nombre:String,
  apellido:String,
  contrasena:String,
});

module.exports = mongoose.model("personas", personaSchema);
