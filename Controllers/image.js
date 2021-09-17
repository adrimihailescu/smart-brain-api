const Clarifai = require('clarifai');

/* hide API key to backend */
const app = new Clarifai.App({
    apiKey: 'd208bbc5f14244d0bc73556038b4f152'
});

const handleApiCall = (request, response) => {
    app.models
        .initModel({
            id: Clarifai.FACE_DETECT_MODEL,
        })
        .then((faceDetectModel) => {
            // console.log(faceDetectModel)
            return faceDetectModel.predict(request.body.input)
        })
        .then(data => {
            response.json(data);
        })
        .catch(error => response.status(400).json('unable to work with API'))
}



const handleImage = (request, response, db) => {
    const { id } = request.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            response.json(entries[0]);
        })
        .catch(error => response.status(400).json('Unable to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}