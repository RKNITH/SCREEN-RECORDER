let recorder;
let recordedChunks = [];

document.getElementById('startBtn').addEventListener('click', function () {
    navigator.mediaDevices.getDisplayMedia({
        video: {
            mediaSource: 'screen'
        }
    }).then(function (stream) {
        recorder = new RecordRTC(stream, {
            type: 'video'
        });

        recorder.startRecording();

        // Enable stop button and disable start button
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('downloadBtn').disabled = true; // Disable download button
        document.getElementById('downloadBtn').addEventListener('click', downloadVideo); // Add click event listener for download button

        // Stream to video element
        document.getElementById('recordedVideo').srcObject = stream;
    }).catch(function (error) {
        console.error('Error accessing media devices:', error);
    });
});

document.getElementById('stopBtn').addEventListener('click', function () {
    recorder.stopRecording(function () {
        // Retrieve recorded video as Blob
        recordedChunks = recorder.getBlob();

        // Convert Blob to data URL
        let recordedVideoURL = URL.createObjectURL(recordedChunks);

        // Display recorded video
        document.getElementById('recordedVideo').src = recordedVideoURL;

        // Enable start button and download button; disable stop button
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('downloadBtn').disabled = false; // Enable download button
    });
});

function downloadVideo() {
    // Create a temporary link element to download the video
    let link = document.createElement('a');
    link.href = URL.createObjectURL(recordedChunks);
    link.download = 'recorded-video.webm'; // Set the filename for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
