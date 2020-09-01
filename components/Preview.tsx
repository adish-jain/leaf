const fetch = require("node-fetch");
const previewStyles = require('../styles/Preview.module.scss');

let selectedFile: any;

function handleFileUpload(e: any) {
    selectedFile = e.target.files[0];
    console.log(e.target.files);
    console.log(selectedFile);
}

async function handleFileSubmit(e: any) {
    console.log(selectedFile);
    var newFile  = {
        'lastModified'     : selectedFile.lastModified,
        'lastModifiedDate' : selectedFile.lastModifiedDate,
        'name'             : selectedFile.name,
        'size'             : selectedFile.size,
        'type'             : selectedFile.type
     };
    let data = {
      requestedAPI: "saveImage",
      imageFile: newFile,
    };
    console.log(JSON.stringify(data));

    // mutate(optimisticSteps, false);

    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      // let resJSON = await res.json();
      // mutate(resJSON, false);
    });
  }

export default function Preview() {
    return (
        <div className={previewStyles.preview}>
            <div className={previewStyles.previewButtons}>
                <input type="file" id="myFile" name="filename" onClick={(e) => handleFileUpload(e)}/>
                <input type="submit" onClick={(e) => handleFileSubmit(e)}/>
            </div>
        </div>
    );
}