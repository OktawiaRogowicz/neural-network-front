const express = require('express');
const tf = require("@tensorflow/tfjs");

const app = express();
const path = require('path');
const { cloudinary } = require('./utils/cloudinary');

var cors = require('cors');

app.use(express.static(path.join(__dirname, 'client/build')));
if (process.env.NODE_ENV === "production") {
    app.get('*', (req,res) =>{
        res.sendFile(path.join(__dirname+'/client/build/index.html'));
    });
}

app.use(express.static(path.join(__dirname, 'client/public')));
app.use(express.json({ limit: '200mb'}));
app.use(express.urlencoded({ limit: '200mb', extended: true}));
app.use(cors());

app.post('/api/predict', async (req, res) => {
    try {
        predictSample(req.body.data);
    res.json({msg: "YAAY"})
    } catch (error) {

    }
})

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

async function predictSample(sample) {
    var url = 'https://raw.githubusercontent.com/OktawiaRogowicz/neuralNetwork/main/Data%20augmentation/tfjs_model/model.json'
    const model = await tf.loadLayersModel(url);
    
    // let result = model.predict(tf.tensor(sample, [1,sample.length])).arraySync();
    // var maxValue = 0;
    // var predictedPitch = 10;
    // for (var i = 0; i < 10; i++) {
    //   if (result[0][i] > maxValue) {
    //     predictedPitch = i;
    //     maxValue = result[0][i];
    //   }
    // }
    // return predictedPitch;
  }