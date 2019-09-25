const express = require('express');
const multer = require('multer');


const app = express();

const upload = multer({
  dest: './uploads'
})

// 'file' comes from front/src/SimpleUpload.vue 
// 33 line formData.append('file', this.file);
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({file: req.file});
})


app.listen(5000, () => {
  console.log('Server is running on port 5000');
})