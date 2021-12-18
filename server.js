const express = require('express');

const app = express();
const path = require('path');
const { cloudinary } = require('./utils/cloudinary');
var cors = require('cors');
// const { application } = require('express');
// const { default: axios } = require('axios');

if (process.env.NODE_ENV === "production") {
    app.use(express.static('build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    })
}

//app.use(express.static('public'));
app.use(express.json({ limit: '200mb'}));
app.use(express.urlencoded({ limit: '200mb', extended: true}));
app.use(cors());

app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const name = req.body.name;
        const uploadedResponse = await cloudinary.uploader.
        upload(fileStr, {
            upload_preset: name,
        })
        console.log(uploadedResponse);
        res.json({msg: "YAAY"})
    } catch (error) {
        console.error(error)
        res.status(500).json({err: 'Something went wrong'})
    }
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
