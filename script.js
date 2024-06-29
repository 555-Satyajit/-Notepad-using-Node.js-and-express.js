const path = require('path'); //must be use
const express = require('express')
const app = express()
const fs = require('fs');

app.use(express.json());    //parser  
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));//public static file
app.set('view engine','ejs'); //setting ejs

app.get('/', function (req, res) {
  const directoryPath = path.join(__dirname, 'files'); // Path to your files directory
  fs.readdir(directoryPath, function (err, files) {
      res.render('index', { files: files }); // Render 'index.ejs' and pass 'files' array as data
  });
});

app.post('/save-note', function (req, res) {
  const directoryPath = path.join(__dirname, 'files'); // Path to your files directory
  const fileName = req.body.fileName;
  const content = req.body.content;

  const filePath = path.join(directoryPath, fileName + '.txt'); // Constructing file path

  fs.writeFile(filePath, content, function (err) {
     
      res.redirect('/'); // Redirect to the main page after saving
  });
});

app.get('/filename/:files', function (req, res) {  //filename in here is read mores route
  const directoryPath = path.join(__dirname, 'files',req.params.files); // Path to your files directory

  fs.readFile(directoryPath,'utf-8',function(err,filedata){
  res.render('show',{file:req.params.files,filedata: filedata})
  })
 
});


app.get('/edit/:files', function (req, res) {

  res.render('edit',{file:req.params.files})
});


app.post('/edit', function (req, res) {
  const oldFileName = req.body.Name;
  const newFileName = req.body.content1;

  const directoryPath = path.join(__dirname, 'files');
  const oldFilePath = path.join(directoryPath, oldFileName);
  const newFilePath = path.join(directoryPath, newFileName);

  fs.rename(oldFilePath, newFilePath, function (err) {
   
    res.redirect('/');
  });
});

app.get('/del/:files', function (req, res) {
  const filepath = req.params.files;
  const directoryPath = path.join(__dirname, 'files', filepath);

  fs.unlink(directoryPath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).send('Error deleting file');
    }
    console.log('File deleted successfully!');
    res.redirect('/');
  });
});






app.listen(3000)