const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
app.use('/static',express.static(path.join(__dirname, 'static')));

const fileFilter = function(req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/png'];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Wrong file type');
    error.code = 'LIMIT_FILE_TYPES';
    return cb(error, false);
  }

  cb(null, true);
}

const MAX_SIZE = 1400000;

const upload = multer({
  dest: './uploads',
  // fileFilter,
  limits: {
    fileSize: MAX_SIZE
  }
});

// const pureupload = multer({
//   dest: './uploads',
// })

// app.post('/dropzone', pureupload.single('file'), (req, res) => {
//   res.json({file: req.file});
// })

// 'file' comes from front/src/SimpleUpload.vue 
// 33 line formData.append('file', this.file);
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({file: req.file});
})

app.post('/multiple', upload.array('files'), (req, res) => {
  res.json({files: req.files});
})

app.post('/dropzone', upload.single('file'), 
  async (req, res) => {
    try {
      await sharp(req.file.path)
        .resize(300)
        .toFile(`./static/${req.file.originalname}`);

      fs.unlink(req.file.path, () => {
        res.json({file: `/static/${req.file.originalname}`});
      })
    } catch(err) {
      res.status(422).json({err});
    }
});


app.use(function(err, req, res, next) {
  if(err.code === 'LIMIT_FILE_TYPES') {
    res.status(422).json({error: 'Only images are allowed'});
    return;
  }

  if(err.code === 'LIMIT_FILE_SIZE') {
    res.status(422).json({error: `Only ${MAX_SIZE/1000} Kb are allowed`});
    return;
  }
})


app.listen(5000, () => {
  console.log('Server is running on port 5000');
})